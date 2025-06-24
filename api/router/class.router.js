import { Router } from "express";
const router = Router();
import authMiddleware from '../auth/auth.js';
import { createClass, getAllClass, getClassWithId, updateClassWithId, deleteClassWithId, createSubTeacher, updateSubTeacher, deleteSubTeacherWithId, getAttendeeTeacher } from "../controller/class.controller.js";


router.post("/create",authMiddleware(['SCHOOL']), createClass);
router.get("/fetch-all",authMiddleware(['SCHOOL','TEACHER']),getAllClass);
router.get("/fetch-single/:id",  getClassWithId);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateClassWithId);
router.delete("/delete/:id",authMiddleware(['SCHOOL']), deleteClassWithId);
// router.post("/sub-teach/new/:id",createSubTeacher );
// router.post("/sub-teach/update/:classId/:subTeachId",updateSubTeacher );
// router.delete("/sub-teach/delete/:classId/:subTeachId",deleteSubTeacherWithId );
router.get("/attendee",authMiddleware(['TEACHER']), getAttendeeTeacher);

export default router;