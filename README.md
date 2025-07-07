🏫 Multiple School Management System
A scalable multi-tenant platform designed to help multiple schools manage their operations independently, including student enrollment, teacher management, class scheduling, examinations, and attendance tracking.

🚀 Features
✅ Multi-Tenant School Architecture
Supports multiple schools with isolated datasets and permissions.

✅ Role-Based Access Control (RBAC)

Super Admin – Manage schools

School Admin – Manage teachers, students, classes, and exams

Teacher – Take attendance, record marks, and manage their assigned classes

Student – View their profile, attendance, and results

✅ Student Enrollment & Authentication
Secure student registration and login with hashed passwords.

✅ Teacher Management
Add, update, and assign teachers to classes and subjects.

✅ Class & Section Management
Create, update, and delete class records.

✅ Attendance Tracking

Take daily attendance

Prevent duplicate entries for the same day

Filter by date and class

✅ Examination Module
Schedule exams, enter marks, and view results.

✅ Profile Image Uploads (Cloudinary)
Students and teachers can upload profile pictures safely.

✅ Secure REST API

JWT token-based authentication

Middleware-protected routes

Role validation for all endpoints

✅ Modern Frontend UI
Responsive React dashboard for each user type.

🛠️ Tech Stack
Frontend:

React.js

Axios

Tailwind CSS

Backend:

Node.js

Express.js

MongoDB + Mongoose

Cloudinary SDK

JWT + Bcrypt
