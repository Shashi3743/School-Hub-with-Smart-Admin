import { Router } from 'express';
const router = Router();
import { markAttendance, getAttendance, checkAttendance } from '../controller/attendance.controller.js';
import authMiddleware from '../auth/auth.js';
// Mark attendance
router.post('/mark',authMiddleware(['TEACHER']) , markAttendance);
router.get('/:studentId',authMiddleware(['TEACHER', 'STUDENT','SCHOOL']),  getAttendance);
router.get('/check/:classId', authMiddleware(['TEACHER']), checkAttendance)
export default router;
