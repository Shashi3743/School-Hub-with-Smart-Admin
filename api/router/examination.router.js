import { Router } from "express";
const router = Router();
import authMiddleware from '../auth/auth.js';
import { newExamination, getExaminationByClass, updateExaminaitonWithId, deleteExaminationById, getExaminationById, getAllExaminations } from "../controller/examination.controller.js";


router.post("/new", authMiddleware(['SCHOOL']),newExamination);
router.get("/all", authMiddleware(['SCHOOL','TEACHER']), getAllExaminations);
router.get("/fetch-class/:classId",authMiddleware(['SCHOOL','STUDENT','TEACHER']),  getExaminationByClass);
router.get('/single/:id',authMiddleware(['SCHOOL']), getExaminationById );
router.patch("/update/:id",authMiddleware(['SCHOOL']), updateExaminaitonWithId);
router.delete("/delete/:id",authMiddleware(['SCHOOL']),  deleteExaminationById);

export default router;