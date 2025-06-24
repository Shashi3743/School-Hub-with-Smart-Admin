import Attendance from '../model/attendance.model.js';
import moment from 'moment';

/**
 * Mark attendance for a student
 */
export async function markAttendance(req, res) {
  const { studentId, date, status, classId } = req.body;
  const schoolId = req.user.schoolId;

  try {
    const attendance = new Attendance({
      student: studentId,
      date,
      status,
      class: classId,
      school: schoolId,
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    console.error('Error marking attendance:', err);
    res.status(500).json({ message: 'Error marking attendance', err });
  }
}

/**
 * Get all attendance for a specific student
 */
export async function getAttendance(req, res) {
  const { studentId } = req.params;

  try {
    const attendance = await Attendance.find({ student: studentId }).populate('student');
    res.status(200).json(attendance);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Error fetching attendance', err });
  }
}

/**
 * Check if attendance has already been marked today for a class
 */
export async function checkAttendance(req, res) {
  const classId = req.params.classId;

  try {
    const today = moment().startOf('day');
    const endOfDay = moment(today).endOf('day');

    const attendanceForToday = await Attendance.findOne({
      class: classId,
      date: {
        $gte: today.toDate(),
        $lt: endOfDay.toDate(),
      },
    });

    if (attendanceForToday) {
      return res.status(200).json({
        attendanceTaken: true,
        message: 'Attendance already taken for today',
      });
    } else {
      return res.status(200).json({
        attendanceTaken: false,
        message: 'No attendance taken yet for today',
      });
    }
  } catch (error) {
    console.error('Error checking attendance:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}
