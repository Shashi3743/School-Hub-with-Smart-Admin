// routes/notices.js
import { Router } from "express";
const router = Router();
import authMiddleware from '../auth/auth.js';
import { newNotice, fetchAllAudiance, fetchAudiance, deleteNotice, editNotice } from "../controller/notice.controller.js";

router.post("/add", authMiddleware(['SCHOOL']), newNotice);
router.get("/fetch/all",authMiddleware(['SCHOOL','TEACHER','STUDENT']), fetchAllAudiance)
router.get("/fetch/:audience",authMiddleware(['SCHOOL','TEACHER','STUDENT']),fetchAudiance);
router.put("/:id",authMiddleware(['SCHOOL']),editNotice)
router.delete("/:id",authMiddleware(['SCHOOL']),deleteNotice)
  
export default router;
