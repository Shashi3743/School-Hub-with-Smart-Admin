<div align="center">

# Multiple School Management System

*A scalable multi-tenant SaaS platform designed to help multiple schools manage operations independently — including student enrollment, teacher management, class scheduling, examinations, and attendance tracking.*

![last-commit](https://img.shields.io/github/last-commit/Shashi3743/Multiple-School-Management-System?style=flat&logo=git&logoColor=white&color=0080ff)
![repo-top-language](https://img.shields.io/github/languages/top/Shashi3743/Multiple-School-Management-System?style=flat&color=0080ff)
![repo-language-count](https://img.shields.io/github/languages/count/Shashi3743/Multiple-School-Management-System?style=flat&color=0080ff)

### 🛠️ Built with:




![npm](https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-F04D35.svg?style=flat&logo=Mongoose&logoColor=white)
![.ENV](https://img.shields.io/badge/.ENV-ECD53F.svg?style=flat&logo=dotenv&logoColor=black)
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B.svg?style=flat&logo=Nodemon&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white)
![JSON](https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B.svg?style=flat&logo=MongoDB&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5.svg?style=flat&logo=Cloudinary&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black)

</div>

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#-prerequisites)
  - [Installation](#-installation)
  - [Usage](#-usage)
  - [Environment Variables](#-environment-variables)
- [Contributors](#-contributors)

---

## 📝 Overview

**Multiple School Management System** is a SaaS-based full-stack application built using the MERN stack. It enables centralized management for multiple schools with separate data silos, offering dashboards and controls for Admins, School Owners, Teachers, and Students.

---

## 🚀 Features

✅ **Multi-Tenant Architecture**  
Supports multiple schools with isolated datasets and permissions.

✅ **Role-Based Authorization**  
- **Super Admin** – Manage schools  
- **School Admin** – Manage teachers, students, classes, and exams  
- **Teacher** – Manage attendance, marks, and schedules  
- **Student** – View profile, results, schedule, and attendance  

✅ **Student Enrollment & Authentication**  
Secure registration and login with hashed passwords using JWT and Bcrypt.

✅ **Teacher Management**  
CRUD operations for teacher profiles, subject assignments, and class mapping.

✅ **Class & Subject Management**  
Create and manage classes, assign subjects, and manage section-wise data.

✅ **Attendance Tracking**  
Mark daily attendance with filters by date/class and prevent duplicate entries.

✅ **Examination Module**  
Schedule exams, record marks, and allow students to view results.

✅ **Cloudinary Integration**  
Students and teachers can upload profile images securely via Cloudinary.

✅ **Protected REST API**  
JWT-based authentication with middleware for route protection and role validation.

✅ **Modern Frontend UI**  
Responsive React dashboard with Material UI + Tailwind CSS, supporting dark/light themes.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Vite
- Axios
- Tailwind CSS
- Material UI

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- Cloudinary SDK
- JWT + Bcrypt

---

## 🧑‍💻 Getting Started

### 📦 Prerequisites
Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm (Node Package Manager)
- MongoDB (local or cloud-based)

### ⚙️ Installation

 1. Clone the repository
```bash
git clone https://github.com/Shashi3743/Multiple-School-Management-System
```
 2. Navigate to the project directory
```bash
cd Multiple-School-Management-System
```

 3. Install backend dependencies
```bash
cd Server
npm install
```

 4. Install frontend dependencies
```bash
cd ../Client
npm install
```


### ▶️ Usage

Navigate to the respective directory,then

- To run the project(server):

```bash
npm run start
```
- To run the project(client/admin):

```bash
npm run dev
```


### 🔐 Environment Variables
Before running the project, create .env files in both the server and client directories with the following variables:

✅ For Server/.env
```bash
PORT = (any_available_port)
JWTSECRET = (your_jwt_secret_key)

MONGODB_URI = (your_MONGODB_URI)

CLOUDINARY_CLOUD_NAME = (your_cloudiary_cloud_name)
CLOUDINARY_API_KEY = (your_cloudiary_api_key)
CLOUDINARY_API_SECRET = (your_cloudiary_api_secret)

ADMIN_EMAIL = (whatever_credentials_you_want_for_admin_login)
ADMIN_PASSWORD = (whatever_credentials_you_want_for_admin_login)
```

✅ For Client/.env or Admin/.env
```bash
VITE_BACKEND_URL = (your_backend_url)
```

### 👥 Contributors

- [Shashi Kumar](https://github.com/Shashi3743)

- [Pawan Singh](https://github.com/PawanSingh037)

