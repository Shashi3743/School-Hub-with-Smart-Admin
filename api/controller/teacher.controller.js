import { fileURLToPath } from "url";
import { dirname } from "path";
import pkg from "bcryptjs";
const { genSaltSync, hashSync, compareSync } = pkg;
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Teacher from "../model/teacher.model.js";

const jwtSecret = process.env.JWTSECRET;
// Fetch all teachers with optional query
export async function getTeacherWithQuery(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const filterQuery = { school: schoolId };

    if (req.query.search) {
      filterQuery.name = { $regex: req.query.search, $options: "i" };
    }

    const filteredTeachers = await Teacher.find(filterQuery);
    res.status(200).json({ success: true, data: filteredTeachers });
  } catch (error) {
    console.error("Error in fetching Teacher with query", error);
    res.status(500).json({ success: false, message: "Error in fetching teacher data." });
  }
}

// Register teacher
export async function registerTeacher(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const {
      name,
      email,
      password,
      qualification,
      gender,
      age
    } = req.body;

    const existing = await Teacher.findOne({ email, school: schoolId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      if (!result || !result.secure_url) {
        return res.status(500).json({ success: false, message: "Image upload failed." });
      }
      imageUrl = result.secure_url;
    }

    const hashPassword = hashSync(password, genSaltSync(10));

    const newTeacher = new Teacher({
      email,
      name,
      qualification,
      age,
      gender,
      teacher_image: imageUrl,
      password: hashPassword,
      school: schoolId,
    });

    const saved = await newTeacher.save();
    res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error saving teacher:", error);
    res.status(500).json({ success: false, message: "Failed to register teacher." });
  }
}

// Login
export async function loginTeacher(req, res) {
  try {
    const teacher = await Teacher.findOne({ email: req.body.email });
    if (!teacher) {
      return res.status(401).json({ success: false, message: "Email not registered." });
    }

    const isAuth = compareSync(req.body.password, teacher.password);
    if (!isAuth) {
      return res.status(401).json({ success: false, message: "Password doesn't match." });
    }

    const token = jwt.sign({
      id: teacher._id,
      schoolId: teacher.school,
      name: teacher.name,
      image_url: teacher.teacher_image,
      role: "TEACHER"
    }, jwtSecret);

    res.header("Authorization", token).status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: teacher._id,
        name: teacher.name,
        image_url: teacher.teacher_image,
        role: "TEACHER"
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error during login." });
  }
}

// Get own profile
export async function getTeacherOwnDetails(req, res) {
  try {
    const teacher = await Teacher.findOne({
      _id: req.user.id,
      school: req.user.schoolId,
    });
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });
    res.status(200).json({ success: true, data: teacher });
  } catch (e) {
    console.error("Error in getTeacherOwnDetails:", e);
    res.status(500).json({ success: false, message: "Error fetching teacher data." });
  }
}

// Get teacher by ID
export async function getTeacherWithId(req, res) {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });
    res.status(200).json({ success: true, data: teacher });
  } catch (e) {
    console.error("Error in getTeacherWithId:", e);
    res.status(500).json({ success: false, message: "Error fetching teacher." });
  }
}

// Update teacher
export async function updateTeacherWithId(req, res) {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found." });

    const {
      name,
      email,
      qualification,
      age,
      gender,
    } = req.body;

    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (qualification) teacher.qualification = qualification;
    if (age) teacher.age = age;
    if (gender) teacher.gender = gender;

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      if (!result || !result.secure_url) {
        return res.status(500).json({ message: "Image upload failed." });
      }
      teacher.teacher_image = result.secure_url;
    }

    await teacher.save();
    res.status(200).json({
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating teacher." });
  }
}

// Delete teacher
export async function deleteTeacherWithId(req, res) {
  try {
    const teacher = await Teacher.findOneAndDelete({ _id: req.params.id });
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found." });

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Error deleting teacher." });
  }
}

// Sign out
export async function signOut(req, res) {
  try {
    res.header("Authorization", "");
    res.status(200).json({ success: true, message: "Signed out successfully." });
  } catch (error) {
    console.error("Signout error:", error);
    res.status(500).json({ success: false, message: "Error during sign out." });
  }
}

// Check login
export async function isTeacherLoggedIn(req, res) {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ success: false, message: "Not authorized." });

    const decoded = jwt.verify(token, jwtSecret);
    res.status(200).json({
      success: true,
      data: decoded,
      message: "Teacher is logged in.",
    });
  } catch (error) {
    console.error("JWT verify error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}
