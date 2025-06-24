import { IncomingForm } from "formidable";
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";
import pkg from 'bcryptjs';
const { genSaltSync, hashSync, compareSync } = pkg;
import jwt from 'jsonwebtoken';

import Teacher from "../model/teacher.model.js";

const jwtSecret = process.env.JWTSECRET;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fetch all teachers with optional query
export async function getTeacherWithQuery(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const filterQuery = { school: schoolId };

    if (req.query.search) {
      filterQuery.name = { $regex: req.query.search, $options: 'i' };
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
  const form = new IncomingForm();
  const schoolId = req.user.schoolId;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ success: false, message: "Form parsing error." });

    const existing = await Teacher.findOne({ email: fields.email[0], school: schoolId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    const photo = files.image?.[0];
    const oldPath = photo.filepath;
    const originalFileName = photo.originalFilename.replace(" ", "_");
    const newPath = join(__dirname, '../../frontend/public/images/uploaded/teacher', originalFileName);

    const photoData = readFileSync(oldPath);
    writeFileSync(newPath, photoData);

    const hashPassword = hashSync(fields.password[0], genSaltSync(10));

    const newTeacher = new Teacher({
      email: fields.email[0],
      name: fields.name[0],
      qualification: fields.qualification[0],
      age: fields.age[0],
      gender: fields.gender[0],
      teacher_image: originalFileName,
      password: hashPassword,
      school: schoolId,
    });

    try {
      const saved = await newTeacher.save();
      res.status(201).json({ success: true, message: "Teacher registered successfully", data: saved });
    } catch (error) {
      console.error("Error saving teacher:", error);
      res.status(500).json({ success: false, message: "Failed to register teacher." });
    }
  });
}

// Teacher login
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
      role: 'TEACHER'
    }, jwtSecret);

    res.header("Authorization", token).status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: teacher._id,
        name: teacher.name,
        image_url: teacher.teacher_image,
        role: 'TEACHER'
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error during login." });
  }
}

// Get own teacher profile
export async function getTeacherOwnDetails(req, res) {
  try {
    const teacher = await Teacher.findOne({ _id: req.user.id, school: req.user.schoolId });
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

// Update teacher by ID
export async function updateTeacherWithId(req, res) {
  const form = new IncomingForm({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ message: "Form parsing failed." });

    try {
      const teacher = await Teacher.findById(req.params.id);
      if (!teacher) return res.status(404).json({ message: "Teacher not found." });

      Object.keys(fields).forEach(field => {
        teacher[field] = fields[field][0];
      });

      if (files.image) {
        const oldPath = join(__dirname, '../../frontend/public/images/uploaded/teacher', teacher.teacher_image);
        if (existsSync(oldPath)) unlinkSync(oldPath);

        const filepath = files.image[0].filepath;
        const originalFileName = basename(files.image[0].originalFilename.replace(" ", "_"));
        const newPath = join(__dirname, '../../frontend/public/images/uploaded/teacher', originalFileName);
        const photoData = readFileSync(filepath);

        writeFileSync(newPath, photoData);
        teacher.teacher_image = originalFileName;
      }

      await teacher.save();
      res.status(200).json({ message: "Teacher updated successfully", data: teacher });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Error updating teacher." });
    }
  });
}

// Delete teacher
export async function deleteTeacherWithId(req, res) {
  try {
    const teacher = await Teacher.findOneAndDelete({ _id: req.params.id });
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found." });

    res.status(200).json({ success: true, message: "Teacher deleted successfully", data: teacher });
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
    res.status(200).json({ success: true, data: decoded, message: "Teacher is logged in." });
  } catch (error) {
    console.error("JWT verify error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}
