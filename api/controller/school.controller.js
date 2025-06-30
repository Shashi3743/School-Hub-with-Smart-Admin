import pkg from 'bcryptjs';
const { genSaltSync, hashSync, compareSync } = pkg;
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import School from "../model/school.model.js";
// import fs from "fs";

const jwtSecret = process.env.JWTSECRET;

// ========================
// GET ALL SCHOOLS
// ========================
export async function getAllSchools(req, res) {
  try {
    const schools = await School.find().select(['-password', '-email', '-owner_name', '-createdAt']);
    res.status(200).json({ success: true, message: "Schools fetched successfully", data: schools });
  } catch (error) {
    console.error("Error in getAllSchools:", error);
    res.status(500).json({ success: false, message: "Server error fetching schools" });
  }
}

// ========================
// REGISTER SCHOOL
// ========================
export async function registerSchool(req, res) {
  try {
    const { school_name, email, owner_name, password } = req.body;

    const existingSchool = await School.findOne({ email });
    if (existingSchool) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    const imageLocalPath = req.file?.path;
    if (!imageLocalPath) {
      return res.status(400).json({ success: false, message: "Image file is required." });
    }

    const imageUploadRes = await uploadOnCloudinary(imageLocalPath);
    // fs.unlinkSync(imageLocalPath); // delete temp file

    if (!imageUploadRes?.url) {
      return res.status(500).json({ success: false, message: "Image upload failed." });
    }

    const hashedPassword = hashSync(password, genSaltSync(10));

    const newSchool = new School({
      school_name,
      email,
      owner_name,
      password: hashedPassword,
      school_image: imageUploadRes.url,
    });

    const savedData = await newSchool.save();
    res.status(200).json({ success: true, message: "School registered", data: savedData });

  } catch (e) {
    console.error("Error in registerSchool:", e);
    res.status(500).json({ success: false, message: "Failed to register school." });
  }
}

// ========================
// LOGIN SCHOOL
// ========================
export async function loginSchool(req, res) {
  try {
    
    const school = await School.findOne({ email: req.body.email });

    if (!school) {
      return res.status(401).json({ success: false, message: "Email not registered." });
    }

    const isValid = compareSync(req.body.password, school.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    const token = jwt.sign({
      id: school._id,
      schoolId: school._id,
      school_name: school.school_name,
      owner_name: school.owner_name,
      image_url: school.school_image,
      role: 'SCHOOL'
    }, jwtSecret);

    res.header("Authorization", token);
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: school._id,
        school_name: school.school_name,
        owner_name: school.owner_name,
        image_url: school.school_image,
        role: 'SCHOOL'
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed." });
  }
}

// ========================
// GET LOGGED IN SCHOOL DATA
// ========================
export async function getSchoolOwnData(req, res) {
  try {
    const school = await School.findById(req.user.id);
    if (!school) {
      return res.status(404).json({ success: false, message: "School not found." });
    }
    res.status(200).json({ success: true, data: school });
  } catch (e) {
    console.error("Error fetching school data:", e);
    res.status(500).json({ success: false, message: "Error fetching school data." });
  }
}

// ========================
// UPDATE SCHOOL
// ========================
export async function updateSchoolWithId(req, res) {
  try {
    const school = await School.findById(req.user.id);
    if (!school) return res.status(404).json({ success: false, message: "School not found" });

    const { school_name, owner_name } = req.body;
    if (school_name) school.school_name = school_name;
    if (owner_name) school.owner_name = owner_name;

    if (req.file) {
      const imageUploadRes = await uploadOnCloudinary(req.file.path);
      fs.unlinkSync(req.file.path);
      if (!imageUploadRes?.url) {
        return res.status(500).json({ success: false, message: "Image upload failed." });
      }
      school.school_image = imageUploadRes.url;
    }

    await school.save();
    res.status(200).json({ success: true, message: "School updated successfully", data: school });
  } catch (e) {
    console.error("Update error:", e);
    res.status(500).json({ success: false, message: "Error updating school details." });
  }
}

// ========================
// SIGN OUT
// ========================
export function signOut(req, res) {
  try {
    res.header("Authorization", "");
    res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Error logging out." });
  }
}

// ========================
// CHECK IF LOGGED IN
// ========================
export function isSchoolLoggedIn(req, res) {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ success: false, message: "No token provided." });

    const decoded = jwt.verify(token, jwtSecret);
    if (decoded) {
      res.status(200).json({ success: true, data: decoded, message: "School is logged in." });
    } else {
      res.status(401).json({ success: false, message: "Invalid token." });
    }
  } catch (error) {
    console.error("isSchoolLoggedIn error:", error);
    res.status(500).json({ success: false, message: "Server error verifying login." });
  }
}


export async function loginAsSchoolByAdmin(req, res) {
  try {
    const { schoolId } = req.params;
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ success: false, message: "School not found." });
    }

    const token = jwt.sign({
      id: school._id,
      schoolId: school._id,
      school_name: school.school_name,
      owner_name: school.owner_name,
      image_url: school.school_image,
      role: 'SCHOOL',
      impersonatedBy: 'ADMIN'
    }, jwtSecret);

    res.header("Authorization", token);
    res.status(200).json({
      success: true,
      message: "Admin impersonation successful",
      user: {
        id: school._id,
        school_name: school.school_name,
        owner_name: school.owner_name,
        image_url: school.school_image,
        role: 'SCHOOL'
      }
    });
  } catch (error) {
    console.error("Admin login as school error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
