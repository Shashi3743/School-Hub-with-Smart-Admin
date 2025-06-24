import { Router } from "express";
import { getStudentWithQuery, loginStudent, updateStudentWithId, getStudentWithId, signOut, isStudentLoggedIn, getOwnDetails, registerStudent, deleteStudentWithId } from "../controller/student.controller.js";
import authMiddleware from "../auth/auth.js";
const router = Router();

router.post('/register',authMiddleware(['SCHOOL']), registerStudent);
router.get("/fetch-with-query",authMiddleware(['SCHOOL','TEACHER']),getStudentWithQuery);
router.post("/login", loginStudent);
router.patch("/update/:id",authMiddleware(['SCHOOL']), updateStudentWithId);
router.get("/fetch-own", authMiddleware(['STUDENT']), getOwnDetails);
router.get("/fetch-single/:id", authMiddleware(['STUDENT','SCHOOL']), getStudentWithId);
router.delete("/delete/:id",authMiddleware(['SCHOOL']),  deleteStudentWithId)
router.get("/sign-out", signOut);
router.get("/is-login",  isStudentLoggedIn)

export default router;