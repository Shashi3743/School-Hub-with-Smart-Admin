import { IncomingForm } from "formidable";
import { readFileSync, writeFileSync, existsSync, unlink } from "fs";
import { join, basename } from "path";
import pkg from 'bcryptjs';
const { genSaltSync, hashSync, compareSync } = pkg;
import jwt from 'jsonwebtoken';
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
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      const existing = await Student.findOne({ email: fields.email[0] });
      if (existing) {
        return res.status(400).json({ success: false, message: "Email already exists." });
      }

      const photo = files.image[0];
      const filename = photo.originalFilename.replace(" ", "_");
      const filepath = join(__dirname, '../../frontend/public/images/uploaded/student', filename);
      const photoData = readFileSync(photo.filepath);
      writeFileSync(filepath, photoData);

      const salt = genSaltSync(10);
      const hashedPassword = hashSync(fields.password[0], salt);

      const newStudent = new Student({
        email: fields.email[0],
        name: fields.name[0],
        student_class: fields.student_class[0],
        guardian: fields.guardian[0],
        guardian_phone: fields.guardian_phone[0],
        age: fields.age[0],
        gender: fields.gender[0],
        student_image: filename,
        password: hashedPassword,
        school: req.user.id
      });

      const saved = await newStudent.save();
      res.status(200).json({ success: true, message: "Student registered", data: saved });

    } catch (e) {
      console.error("Error registering student:", e);
      res.status(500).json({ success: false, message: "Registration failed." });
    }
  });
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
  const form = new IncomingForm({ multiples: false, keepExtensions: true });
  form.uploadDir = join(__dirname, '../../frontend/public/images/uploaded/student');

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: "Error parsing form." });
    }

    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found." });
      }

      Object.keys(fields).forEach(field => {
        student[field] = fields[field][0];
      });

      if (files.image) {
        const oldPath = join(form.uploadDir, student.student_image);
        if (student.student_image && existsSync(oldPath)) {
          unlink(oldPath, (err) => {
            if (err) console.error("Old image deletion error:", err);
          });
        }

        const filename = basename(files.image[0].originalFilename.replace(" ", "_"));
        const filePath = join(form.uploadDir, filename);
        const fileData = readFileSync(files.image[0].filepath);
        writeFileSync(filePath, fileData);
        student.student_image = filename;
      }

      await student.save();
      res.status(200).json({ message: "Student updated", data: student });

    } catch (e) {
      console.error("Update error:", e);
      res.status(500).json({ message: "Update failed." });
    }
  });
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
