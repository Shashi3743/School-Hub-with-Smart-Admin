import Examination from '../model/examination.model.js';

// Create a new examination
export async function newExamination(req, res) {
  try {
    const newExamination = new Examination({
      examDate: req.body.exam_date,
      subject: req.body.subject,
      examType: req.body.exam_type,
      class: req.body.class_id,
      school: req.user.id,
    });

    await newExamination.save();
    res.status(200).send({ success: true, message: "Exam assigned successfully." });
  } catch (e) {
    console.log("Error in newExamination:", e);
    res.status(500).send({ success: false, message: "Failure in creating exam, try later." });
  }
}

// Get all examinations for a class
export async function getExaminationByClass(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const examination = await Examination.find({ class: req.params.classId, school: schoolId }).populate("subject");
    res.status(200).json({ success: true, message: "Success in fetching examinations.", data: examination });
  } catch (error) {
    console.error("Error in getExaminationByClass:", error);
    res.status(500).send({ success: false, message: "Failed to fetch examinations, try later." });
  }
}

// Get all examinations (admin use-case)
export async function getAllExaminations(req, res) {
  try {
    const examinations = await Examination.find().populate("subject").populate("class");
    res.status(200).json({ success: true, message: "Success in fetching all examinations.", data: examinations });
  } catch (error) {
    console.error("Error in getAllExaminations:", error);
    res.status(500).send({ success: false, message: "Failed to fetch all examinations, try later." });
  }
}

// Get a single examination by ID
export async function getExaminationById(req, res) {
  try {
    const examination = await Examination.findById(req.params.id);
    if (!examination) {
      return res.status(404).json({ success: false, message: "Examination not found." });
    }
    res.status(200).json({ success: true, message: "Success in fetching examination.", data: examination });
  } catch (error) {
    console.error("Error in getExaminationById:", error);
    res.status(500).send({ success: false, message: "Failed to fetch examination, try later." });
  }
}

// Delete an examination by ID
export async function deleteExaminationById(req, res) {
  try {
    const deleted = await Examination.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Examination not found." });
    }
    res.status(200).json({ success: true, message: "Examination deleted successfully." });
  } catch (error) {
    console.error("Error in deleteExaminationById:", error);
    res.status(500).send({ success: false, message: "Failed to delete examination, try later." });
  }
}

// Update an examination by ID
export async function updateExaminaitonWithId(req, res) {
  try {
    const id = req.params.id;

    const updated = await Examination.findByIdAndUpdate(
      id,
      {
        $set: {
          examDate: req.body.exam_date,
          subject: req.body.subject,
          examType: req.body.exam_type,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Examination not found." });
    }

    res.status(200).json({ success: true, message: "Examination updated successfully." });
  } catch (error) {
    console.error("Error in updateExaminaitonWithId:", error);
    res.status(500).json({ success: false, message: "Server error in updating examination. Try later." });
  }
}
