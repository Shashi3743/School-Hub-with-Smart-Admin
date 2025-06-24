import Subject from "../model/subject.model.js";
import Examination from "../model/examination.model.js";
import Period from "../model/period.model.js";

// Fetch all subjects for a school
export async function getAllSubjects(req, res) {
    try {
        const schoolId = req.user.schoolId;
        const allSubjects = await Subject.find({ school: schoolId });
        res.status(200).json({ success: true, message: "Subjects fetched successfully", data: allSubjects });
    } catch (error) {
        console.error("Error in getAllSubjects:", error);
        res.status(500).json({ success: false, message: "Server error while fetching subjects." });
    }
}

// Create a new subject
export async function createSubject(req, res) {
    try {
        const schoolId = req.user.schoolId;
        const newSubject = new Subject({ ...req.body, school: schoolId });

        const savedSubject = await newSubject.save();
        res.status(200).json({ success: true, data: savedSubject, message: "Subject created successfully." });
    } catch (error) {
        console.error("Error in createSubject:", error);
        res.status(500).json({ success: false, message: "Failed to create subject." });
    }
}

// Get subject by ID
export async function getSubjectWithId(req, res) {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId;

        const subject = await Subject.findOne({ _id: id, school: schoolId }).populate("student_class");
        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found." });
        }

        res.status(200).json({ success: true, data: subject });
    } catch (error) {
        console.error("Error in getSubjectWithId:", error);
        res.status(500).json({ success: false, message: "Error fetching subject." });
    }
}

// Update subject by ID
export async function updateSubjectWithId(req, res) {
    try {
        const { id } = req.params;

        await Subject.findOneAndUpdate({ _id: id }, { $set: req.body });

        const updatedSubject = await Subject.findOne({ _id: id });
        res.status(200).json({ success: true, message: "Subject updated", data: updatedSubject });
    } catch (error) {
        console.error("Error in updateSubjectWithId:", error);
        res.status(500).json({ success: false, message: "Error updating subject." });
    }
}

// Delete subject if not in use
export async function deleteSubjectWithId(req, res) {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId;

        const subExamCount = await Examination.countDocuments({ subject: id, school: schoolId });
        const subPeriodCount = await Period.countDocuments({ subject: id, school: schoolId });

        if (subExamCount === 0 && subPeriodCount === 0) {
            const deletedSubject = await Subject.findOneAndDelete({ _id: id, school: schoolId });
            res.status(200).json({ success: true, message: "Subject deleted successfully.", data: deletedSubject });
        } else {
            res.status(400).json({ success: false, message: "Subject is already in use and cannot be deleted." });
        }

    } catch (error) {
        console.error("Error in deleteSubjectWithId:", error);
        res.status(500).json({ success: false, message: "Error deleting subject." });
    }
}
