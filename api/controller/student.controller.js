import { readFileSync, existsSync, unlinkSync } from "fs";
import { join } from "path";
import pkg from 'bcryptjs';
const { genSaltSync, hashSync, compareSync } = pkg;
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Student from "../model/student.model.js";

const jwtSecret = process.env.JWTSECRET;

// Get students with query filters
export async function getStudentWithQuery(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const filterQuery = { school: schoolId };

    if (req.query.search) {
      filterQuery.name = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.student_class) {
      filterQuery.student_class = req.query.student_class;
    }

    const students = await Student.find(filterQuery).populate("student_class");
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ success: false, message: "Error fetching students." });
  }
}

// Register new student
export async function registerStudent(req, res) {
  try {
    const { name, email, password, age, gender, guardian, guardian_phone, student_class } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    const imageLocalPath = req.file?.path;
    if (!imageLocalPath) {
      return res.status(400).json({ success: false, message: "Image file is required." });
    }

    const imageUploadRes = await uploadOnCloudinary(imageLocalPath);
    if (!imageUploadRes?.url) {
      return res.status(500).json({ success: false, message: "Image upload failed." });
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      guardian,
      guardian_phone,
      student_class,
      student_image: imageUploadRes.url,
      school: req.user.id
    });

    const saved = await newStudent.save();
    res.status(200).json({ success: true, message: "Student registered", data: saved });

  } catch (e) {
    console.error("Error registering student:", e);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
}

// Student login
export async function loginStudent(req, res) {
  try {
    const student = await Student.findOne({ email: req.body.email });
    if (!student) {
      return res.status(401).json({ success: false, message: "Email not registered." });
    }

    const isAuth = compareSync(req.body.password, student.password);
    if (!isAuth) {
      return res.status(401).json({ success: false, message: "Invalid password." });
    }

    const token = jwt.sign({
      id: student._id,
      schoolId: student.school,
      email: student.email,
      image_url: student.student_image,
      name: student.name,
      role: 'STUDENT'
    }, jwtSecret);

    res.header("Authorization", token);
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: student._id,
        email: student.email,
        image_url: student.student_image,
        name: student.name,
        role: "STUDENT"
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed." });
  }
}

// Get student by ID (Admin access)
export async function getStudentWithId(req, res) {
  try {
    const student = await Student.findOne({ _id: req.params.id, school: req.user.schoolId }).populate("student_class");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }
    res.status(200).json({ success: true, data: student });
  } catch (e) {
    console.error("Error fetching student:", e);
    res.status(500).json({ success: false, message: "Error fetching student." });
  }
}

// Get logged-in student's own details
export async function getOwnDetails(req, res) {
  try {
    const student = await Student.findOne({ _id: req.user.id, school: req.user.schoolId }).populate("student_class");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }
    res.status(200).json({ success: true, data: student });
  } catch (e) {
    console.error("Error fetching own student data:", e);
    res.status(500).json({ success: false, message: "Error fetching own data." });
  }
}

// Update student by ID
export async function updateStudentWithId(req, res) {
  console.log("tried")
  try {
    console.log(req.params)
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const { name, guardian, guardian_phone, age, gender, student_class } = req.body;

    if (name) student.name = name;
    if (guardian) student.guardian = guardian;
    if (guardian_phone) student.guardian_phone = guardian_phone;
    if (age) student.age = age;
    if (gender) student.gender = gender;
    if (student_class) student.student_class = student_class;

    if (req.file) {
      const imageUploadRes = await uploadOnCloudinary(req.file.path);
      if (!imageUploadRes?.url) {
        return res.status(500).json({ message: "Image upload failed." });
      }
      student.student_image = imageUploadRes.url;
    }

    await student.save();
    res.status(200).json({ message: "Student updated", data: student });

  } catch (e) {
    console.error("Update error:", e);
    res.status(500).json({ message: "Update failed." });
  }
}

// Delete student
export async function deleteStudentWithId(req, res) {
  try {
    const student = await Student.findOneAndDelete({ _id: req.params.id, school: req.user.schoolId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    res.status(200).json({ success: true, message: "Student deleted", data: student });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Deletion failed." });
  }
}

// Sign out student
export function signOut(req, res) {
  try {
    res.header("Authorization", "");
    res.status(200).json({ success: true, message: "Signed out successfully." });
  } catch (e) {
    console.error("Sign out error:", e);
    res.status(500).json({ success: false, message: "Sign out failed." });
  }
}

// Check if student is logged in
export function isStudentLoggedIn(req, res) {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    res.status(200).json({ success: true, data: decoded, message: "Student is logged in." });

  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ success: false, message: "Error verifying token." });
  }
}
