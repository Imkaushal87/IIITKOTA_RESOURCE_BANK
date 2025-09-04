# 🔧 Dependency Fix Guide - IIIT Kota Resource Bank

## 🚨 **Issues Identified & Fixed:**

### **Backend Issues:**
- ❌ `gridfs-stream` v1.1.1 incompatible with newer MongoDB/Mongoose
- ❌ `express` v4.21.2 (version doesn't exist)
- ❌ `mongoose` v8.10.0 (too new, compatibility issues)
- ❌ Missing Node.js version requirements

### **Frontend Issues:**
- ❌ `react-router-dom` v7.1.5 (breaking changes, doesn't exist)
- ❌ Missing Tailwind CSS plugins and PostCSS config
- ❌ React versions too new (18.3.1 doesn't exist)

## ✅ **Fixed Versions:**

### **Backend (backend/package.json):**
```json
{
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "multer": "^1.4.5-lts.1",
    "gridfs-stream": "^1.1.1"
  }
}
```

### **Frontend (frontend/package.json):**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.6",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.10",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

## 🚀 **Fix Commands:**

### **Step 1: Clean Backend**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### **Step 2: Clean Frontend**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### **Step 3: Verify Installation**
```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

## 🔍 **Troubleshooting:**

### **If you get "peer dependency" warnings:**
```bash
npm install --legacy-peer-deps
```

### **If you get "unable to resolve dependency" errors:**
```bash
npm cache clean --force
npm install
```

### **If Tailwind CSS doesn't work:**
```bash
cd frontend
npx tailwindcss init -p
```

### **If React Router gives errors:**
The code has been updated to work with v6. Make sure you're using the updated App.js.

## 📋 **Pre-Installation Checklist:**

- ✅ Node.js version 16+ installed
- ✅ npm version 8+ installed
- ✅ MongoDB running locally or Atlas connection ready
- ✅ Backend .env file configured
- ✅ Frontend .env file configured

## 🎯 **Expected Results:**

After running the fix commands:
- ✅ `npm install` completes without errors
- ✅ Backend starts on `http://localhost:5000`
- ✅ Frontend starts on `http://localhost:3000`
- ✅ No dependency conflicts
- ✅ All imports resolve correctly
- ✅ Tailwind CSS styles apply properly

## 🆘 **Still Having Issues?**

1. **Check Node.js version:** `node --version` (should be 16+)
2. **Check npm version:** `npm --version` (should be 8+)
3. **Clear npm cache:** `npm cache clean --force`
4. **Use legacy peer deps:** `npm install --legacy-peer-deps`
5. **Check for conflicting global packages:** `npm list -g --depth=0`

## 📞 **Common Error Solutions:**

### **"Cannot find module 'gridfs-stream'"**
```bash
cd backend
npm install gridfs-stream@1.1.1 --save
```

### **"Module not found: Can't resolve 'react-router-dom'"**
```bash
cd frontend
npm install react-router-dom@6.20.1 --save
```

### **"Tailwind CSS not working"**
```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### **"Port already in use"**
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```


