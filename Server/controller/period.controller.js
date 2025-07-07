import Period from '../model/period.model.js';

// Controller to create a period
export async function createPeriod(req, res) {
  try {
    const { teacher, subject, classId, startTime, endTime } = req.body;
    const schoolId = req.user.schoolId;
    
    const newPeriod = new Period({
      teacher,
      subject,
      class: classId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      school: schoolId,
    });

    await newPeriod.save();
    res.status(201).json({ message: 'Period assigned successfully', period: newPeriod });
  } catch (error) {
    console.error("Error creating period:", error);
    res.status(500).json({ message: 'Error creating period', error });
  }
}

// Get periods for a specific teacher
export async function getTeacherPeriods(req, res) {
  try {
    const schoolId = req.user.schoolId;
    const { teacherId } = req.params;

    const periods = await Period.find({ teacher: teacherId, school: schoolId })
      .populate('class')
      .populate('subject');

    res.status(200).json({ periods });
  } catch (error) {
    console.error("Error fetching teacher periods:", error);
    res.status(500).json({ message: 'Error fetching periods', error });
  }
}

// Get period by ID
export async function getPeriodsWithId(req, res) {
  try {
    const { id } = req.params;

    const period = await Period.findById(id)
      .populate('class')
      .populate('subject')
      .populate('teacher');

    res.status(200).json({ period });
  } catch (error) {
    console.error("Error fetching period by ID:", error);
    res.status(500).json({ message: 'Error fetching period by ID', error });
  }
}

// Get periods for a specific class
export async function getClassPeriods(req, res) {
  try {
    const { classId } = req.params;
    const schoolId = req.user.schoolId;

    const periods = await Period.find({ class: classId, school: schoolId })
      .populate('subject')
      .populate('teacher');

    res.status(200).json({ periods });
  } catch (error) {
    console.error("Error fetching class periods:", error);
    res.status(500).json({ message: 'Error fetching class periods', error });
  }
}

// Get all periods
export async function getPeriods(req, res) {
  try {
    const schoolId = req.user.schoolId;

    const periods = await Period.find({ school: schoolId })
      .populate('class')
      .populate('subject')
      .populate('teacher');

    res.status(200).json({ periods });
  } catch (error) {
    console.error("Error fetching all periods:", error);
    res.status(500).json({ message: 'Error fetching periods', error });
  }
}

// Update period
export async function updatePeriod(req, res) {
  try {
    const { teacher, subject } = req.body;
    const periodId = req.params.id;

    const updatedPeriod = await Period.findOneAndUpdate(
      { _id: periodId, school: req.user.schoolId },
      { subject, teacher },
      { new: true }
    );

    res.status(200).json({ message: 'Period updated successfully', period: updatedPeriod });
  } catch (error) {
    console.error("Error updating period:", error);
    res.status(500).json({ message: 'Error updating period', error });
  }
}

// Delete period
export async function deletePeriod(req, res) {
  try {
    const periodId = req.params.id;

    await Period.findByIdAndDelete(periodId);
    res.status(200).json({ message: 'Period deleted successfully' });
  } catch (error) {
    console.error("Error deleting period:", error);
    res.status(500).json({ message: 'Error deleting period', error });
  }
}
