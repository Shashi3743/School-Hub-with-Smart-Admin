import 'dotenv/config';

import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connect } from "mongoose";

// ROUTERS
import schoolRouter from "./router/school.router.js";
import studentRouter from "./router/student.router.js";
import classRouter from "./router/class.router.js";
import subjectRouter from "./router/subject.router.js";
import teacherRouter from './router/teacher.router.js';
import examRouter from './router/examination.router.js';
import attendanceRoutes from './router/attendance.router.js';
import periodRoutes from "./router/period.router.js";
import noticeRoutes from "./router/notice.router.js";
import authMiddleware from "./auth/auth.js";
import { authCheck } from "./controller/auth.controller.js";

const app = express();

// middleware 
app.use(json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {exposedHeaders:"Authorization"}
app.use(cors(corsOptions));

const DB_NAME = "SchoolManagementSystem"

// MONGODB CONNECTION
connect(`${process.env.MONGODB_URI}/${DB_NAME}`).then(db=>{
    console.log("MongoDb is Connected Successfully.")
}).catch(e=>{
    console.log("MongoDb Error",e)
})



app.use("/api/school", schoolRouter)
app.use("/api/student", studentRouter)
app.use("/api/teacher", teacherRouter)
app.use("/api/class", classRouter)
app.use("/api/subject", subjectRouter)
app.use('/api/examination', examRouter)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/period',  periodRoutes)
app.use('/api/notices', noticeRoutes)

app.get('/api/auth/check',authCheck)


const PORT = process.env.PORT || 5001;
app.listen(PORT, ()=>{
    console.log("Server is running at port =>",PORT)
})