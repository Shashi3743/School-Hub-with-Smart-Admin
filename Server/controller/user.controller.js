import { IncomingForm } from "formidable";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { sign, verify } from 'jsonwebtoken';
import User from "../model/user.model.js";

const jwtSecret = process.env.JWTSECRET;

// ES Modules: Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🟢 Get all users
export async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, message: "Fetched all users successfully", data: users });
    } catch (error) {
        console.error("Error in getAllUsers", error);
        res.status(500).json({ success: false, message: "Server error while fetching users." });
    }
}

// 🟢 Register new user
export async function register(req, res) {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
        try {
            if (err) return res.status(400).json({ success: false, message: "Form parsing error" });

            const existingUser = await User.findOne({ email: fields.email?.[0] });
            if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });

            const photo = files.image?.[0];
            const originalFileName = photo.originalFilename.replace(" ", "_");
            const photoPath = join(__dirname, '../../movie casting/public/images/uploaded/user', originalFileName);
            const photoData = readFileSync(photo.filepath);
            writeFileSync(photoPath, photoData);

            const hashedPassword = hashSync(fields.password[0], genSaltSync(10));

            const newUser = new User({
                email: fields.email[0],
                name: fields.username[0], // Assuming username field maps to "name"
                password: hashedPassword,
                country: fields.country[0],
                image_url: originalFileName,
                eye_color: fields.eye_color[0],
                hair_color: fields.hair_color[0],
                height: fields.height[0],
                weight: fields.weight[0], // ✅ FIXED typo
                age: fields.age[0],
                gender: fields.gender[0],
            });

            const savedUser = await newUser.save();
            res.status(201).json({ success: true, message: "User registered successfully", data: savedUser });
        } catch (e) {
            console.error("Error in register:", e);
            res.status(500).json({ success: false, message: "Failed to register user." });
        }
    });
}

// 🟢 User login
export async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).json({ success: false, message: "Email not registered." });

        const isMatch = compareSync(req.body.password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password." });

        const token = sign({
            id: user._id,
            username: user.name, // Assuming "username" maps to "name"
            image_url: user.image_url,
            role: user.role
        }, jwtSecret);

        res.header("Authorization", token);
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                username: user.name,
                image_url: user.image_url,
                role: user.role
            }
        });
    } catch (e) {
        console.error("Login error:", e);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
}

// 🟢 Get logged-in user's details
export async function getUserWithId(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        res.status(200).json({ success: true, data: user });
    } catch (e) {
        console.error("Error in getUserWithId", e);
        res.status(500).json({ success: false, message: "Error fetching user data." });
    }
}

// 🟢 Update logged-in user
export async function updateUserWithId(req, res) {
    try {
        const id = req.user.id;
        await User.findOneAndUpdate({ _id: id }, { $set: req.body.values });
        const updatedUser = await User.findById(id);
        res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
    } catch (e) {
        console.error("Error in updateUserWithId", e);
        res.status(500).json({ success: false, message: "Server error while updating user." });
    }
}

// 🟢 User sign out
export function signOut(req, res) {
    try {
        res.header("Authorization", "");
        res.status(200).json({ success: true, message: "User signed out successfully." });
    } catch (error) {
        console.error("Error in signOut", error);
        res.status(500).json({ success: false, message: "Server error during sign out." });
    }
}

// 🟢 Check if user is logged in
export function isUserLoggedIn(req, res) {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ success: false, message: "No token provided." });

        const decoded = verify(token, jwtSecret);
        res.status(200).json({ success: true, data: decoded, message: "User is logged in." });
    } catch (e) {
        console.error("Error in isUserLoggedIn", e);
        res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
}

// 🟢 Check if user is an admin
export function isUserAdmin(req, res) {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ success: false, message: "No token provided." });

        const decoded = verify(token, jwtSecret);
        if (decoded?.role === "ADMIN") {
            res.status(200).json({ success: true, message: "User is an admin." });
        } else {
            res.status(403).json({ success: false, message: "User is not authorized as admin." });
        }
    } catch (e) {
        console.error("Error in isUserAdmin", e);
        res.status(401).json({ success: false, message: "Invalid token." });
    }
}
