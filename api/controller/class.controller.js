import Class from "../model/class.model.js";
import Student from "../model/student.model.js";
import Examination from "../model/examination.model.js";
import Period from "../model/period.model.js";

// Get all classes for a school
export async function getAllClass(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const allClass = await Class.find({ school: schoolId });
    res.status(200).json({ success: true, message: "Success in fetching all classes", data: allClass });
  } catch (error) {
    console.log("Error in getAllClass", error);
    res.status(500).json({ success: false, message: "Server Error in Getting All Class. Try later" });
  }
}

// Create a new class
export function createClass(req, res) {
  const schoolId = req.user.id;
  const newClass = new Class({ ...req.body, school: schoolId });
  newClass.save()
    .then(savedData => {
      res.status(200).json({ success: true, data: savedData, message: "Class is Created Successfully." });
    })
    .catch(e => {
      console.log("ERROR in Register", e);
      res.status(500).json({ success: false, message: "Failed Creation of Class." });
    });
}

// Get a single class by ID
export async function getClassWithId(req, res) {
  try {
    const id = req.params.id;
    const resp = await Class.findById(id)
      .populate("asignSubTeach.subject")
      .populate("asignSubTeach.teacher")
      .populate("attendee");

    if (resp) {
      res.status(200).json({ success: true, data: resp });
    } else {
      res.status(404).json({ success: false, message: "Class data not available" });
    }
  } catch (e) {
    console.log("Error in getClassWithId", e);
    res.status(500).json({ success: false, message: "Error in getting Class Data" });
  }
}

// Update class by ID
export async function updateClassWithId(req, res) {
  try {
    const id = req.params.id;
    await Class.findByIdAndUpdate(id, { $set: req.body });
    const ClassAfterUpdate = await Class.findById(id);
    res.status(200).json({ success: true, message: "Class Updated", data: ClassAfterUpdate });
  } catch (error) {
    console.log("Error in updateClassWithId", error);
    res.status(500).json({ success: false, message: "Server Error in Update Class. Try later" });
  }
}

// Delete a class if not linked with any students, exams or periods
export async function deleteClassWithId(req, res) {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;

    const studentCount = await Student.countDocuments({ student_class: id, school: schoolId });
    const examCount = await Examination.countDocuments({ class: id, school: schoolId });
    const periodCount = await Period.countDocuments({ class: id, school: schoolId });

    if (studentCount === 0 && examCount === 0 && periodCount === 0) {
      await Class.findOneAndDelete({ _id: id, school: schoolId });
      res.status(200).json({ success: true, message: "Class Deleted." });
    } else {
      res.status(400).json({ success: false, message: "This class is already in use." });
    }
  } catch (error) {
    console.log("Error in deleteClassWithId", error);
    res.status(500).json({ success: false, message: "Server Error in Deleting Class. Try later" });
  }
}

// Assign subject and teacher to a class
export async function createSubTeacher(req, res) {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;

    const classDetails = await Class.findOne({ _id: id, school: schoolId });
    if (!classDetails) return res.status(404).json({ success: false, message: "Class not found" });

    classDetails.asignSubTeach.push(req.body);
    await classDetails.save();

    res.status(200).json({ success: true, message: "New Subject & Teacher Assigned.", data: classDetails });
  } catch (error) {
    console.log("Error in createSubTeacher", error);
    res.status(500).json({ success: false, message: "Server Error in Assigning Subject & Teacher" });
  }
}

// Update assigned subject-teacher entry
export async function updateSubTeacher(req, res) {
  try {
    const { classId, subTeachId } = req.params;

    const classDetails = await Class.findById(classId);
    if (!classDetails) return res.status(404).json({ success: false, message: "Class not found" });

    const subTeach = classDetails.asignSubTeach.id(subTeachId);
    if (!subTeach) return res.status(404).json({ success: false, message: "Sub-teacher not found" });

    subTeach.subject = req.body.subject;
    subTeach.teacher = req.body.teacher;
    await classDetails.save();

    res.status(200).json({ success: true, message: "Subject & Teacher Assignment Updated.", data: classDetails });
  } catch (error) {
    console.log("Error in updateSubTeacher", error);
    res.status(500).json({ success: false, message: "Server Error in Updating Subject & Teacher" });
  }
}

// Delete assigned subject-teacher entry
export async function deleteSubTeacherWithId(req, res) {
  try {
    const { classId, subTeachId } = req.params;

    const classDetails = await Class.findById(classId);
    if (!classDetails) return res.status(404).json({ success: false, message: "Class not found" });

    classDetails.asignSubTeach.id(subTeachId).remove();
    await classDetails.save();

    res.status(200).json({ success: true, message: "Subject & Teacher Assignment Cancelled.", data: classDetails });
  } catch (error) {
    console.log("Error in deleteSubTeacherWithId", error);
    res.status(500).json({ success: false, message: "Server Error in Cancelling Subject & Teacher" });
  }
}

// Get all classes where the logged-in teacher is the attendee
export async function getAttendeeTeacher(req, res) {
  try {
    let attendeeClass = await Class.find({ attendee: req.user.id });
    attendeeClass = attendeeClass.map(cls => ({
      class_num: cls.class_num,
      class_text: cls.class_text,
      classId: cls._id,
    }));
    res.status(200).json(attendeeClass);
  } catch (error) {
    console.log("Error in getAttendeeTeacher", error);
    res.status(500).json({ success: false, message: "Server Error in getting Attendee classes" });
  }
}
