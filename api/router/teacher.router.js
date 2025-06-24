import { Router } from "express";
import { getTeacherWithQuery, loginTeacher, updateTeacherWithId, getTeacherWithId, signOut, isTeacherLoggedIn, registerTeacher, deleteTeacherWithId, getTeacherOwnDetails } from "../controller/teacher.controller.js";
const router = Router();
import authMiddleware from "../auth/auth.js";

router.post('/register',authMiddleware(['SCHOOL']), registerTeacher);
router.get("/fetch-with-query",authMiddleware(['SCHOOL']),getTeacherWithQuery);
router.post("/login", loginTeacher);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateTeacherWithId);
router.get("/fetch-own", authMiddleware(['TEACHER']), getTeacherOwnDetails);
router.get("/fetch-single/:id", authMiddleware(['TEACHER','SCHOOL']), getTeacherWithId);
router.delete("/delete/:id",authMiddleware(['SCHOOL']),  deleteTeacherWithId)
// router.get("/sign-out", signOut);
// router.get("/is-login",  isTeacherLoggedIn)

export default router;