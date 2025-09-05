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

Backend setup
```bash
cd backend
npm install
```
Create .env in backend/ with the following (example):
```bash
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/iiitk-resources
JWT_SECRET=some_long_secret
PORT=5001
```
Start backend server:
```bash
npm run dev
# or
npm start
```
Frontend setup
```bash
cd ../frontend
npm install
```
Start frontend:
```bash
npm start
```
## 🖼 Screenshots

🏠 Home Page
![Home Page](frontend/public/screenshots/home.png)

📤 Upload Form
![Upload Form](frontend/public/screenshots/upload-form.png)

✅ Upload Success
![Upload Success](frontend/public/screenshots/upload-success.png)
 🔑 Signup Page
![Signup Page](frontend/public/screenshots/signup.png)

🔐 Login Page
![Login Page](frontend/public/screenshots/login.png)

📂 Empty State (No resources)
![No Resources](frontend/public/screenshots/no-resources.png)

