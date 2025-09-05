# 📚 IIIT Kota Resource Bank

A **full-stack web application** for IIIT Kota students to **upload, access, and manage previous year question papers**.  
This project helps students prepare effectively by making study resources available in one place.  

---

## ✨ Features

- 🔑 **Authentication** – Secure login/signup using JWT (Auth0).  
- 📤 **File Uploading** – Students can upload question papers with metadata (course, branch, semester, year, subject, etc.).  
- 🗂 **Filtering & Search** – Easily search and filter resources.  
- ✅ **Approval System** – Admin approval before making resources public.  
- 💾 **File Storage** – Uses **MongoDB GridFS** to store PDFs safely.  
- 🎨 **Modern UI/UX** – Built with React.js and Tailwind CSS.  

---

## 🛠 Tech Stack

### Frontend
- ⚛️ React.js  
- 🎨 Tailwind CSS  

### Backend
- 🟢 Node.js + Express.js  
- 🔑 JWT Authentication (Auth0)  
- 📂 Multer & Multer-GridFS-Storage  

### Database
- 🍃 MongoDB (GridFS for file storage)  

---

## 🚀 Quick start (development)

### Backend setup
```bash
cd backend
npm install
