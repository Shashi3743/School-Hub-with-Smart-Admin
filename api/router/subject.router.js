import { Router } from "express";
const router = Router();
import authMiddleware from '../auth/auth.js';
import { createSubject, getAllSubjects, getSubjectWithId, updateSubjectWithId, deleteSubjectWithId } from "../controller/subject.controller.js";

router.post("/create",authMiddleware(['SCHOOL']), createSubject);
router.get("/fetch-all",authMiddleware(['SCHOOL']),getAllSubjects);
router.get("/fetch-single/:id",authMiddleware(['SCHOOL']),  getSubjectWithId);
router.patch("/update/:id",authMiddleware(['SCHOOL']), updateSubjectWithId);
router.delete("/delete/:id",authMiddleware(['SCHOOL']), deleteSubjectWithId);

export default router;