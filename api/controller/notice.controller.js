import Notice from "../model/notice.model.js";

// Route to add a new notice
export async function newNotice(req, res) {
  const { title, message, audience } = req.body;
  const schoolId = req.user.schoolId;

  try {
    const newNotice = new Notice({ title, message, audience, school: schoolId });
    await newNotice.save();
    res.status(201).json({ message: "Notice added successfully!" });
  } catch (error) {
    console.error("Error adding notice:", error);
    res.status(500).json({ message: "Error adding notice." });
  }
}

// Route to fetch notices for a specific audience (e.g., 'student' or 'teacher')
export async function fetchAudiance(req, res) {
  const { audience } = req.params;
  const schoolId = req.user.schoolId;

  try {
    const notices = await Notice.find({ audience, school: schoolId });
    res.json(notices);
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ message: "Error fetching notices." });
  }
}

// Route to fetch all notices for the logged-in school
export async function fetchAllAudiance(req, res) {
  const schoolId = req.user.schoolId;

  try {
    const notices = await Notice.find({ school: schoolId });
    res.json(notices);
  } catch (error) {
    console.error("Error fetching all notices:", error);
    res.status(500).json({ message: "Error fetching all notices." });
  }
}

// Edit Notice
export async function editNotice(req, res) {
  const { id } = req.params;
  const { title, message, audience } = req.body;

  try {
    const updated = await Notice.findByIdAndUpdate(id, { title, message, audience }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Notice not found." });
    }

    res.json({ message: "Notice updated successfully!" });
  } catch (error) {
    console.error("Error updating notice:", error);
    res.status(500).json({ message: "Error updating notice." });
  }
}

// Delete Notice
export async function deleteNotice(req, res) {
  const { id } = req.params;

  try {
    const deleted = await Notice.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Notice not found." });
    }

    res.json({ message: "Notice deleted successfully!" });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ message: "Error deleting notice." });
  }
}
