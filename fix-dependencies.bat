@echo off
echo 🔧 Fixing IIIT Kota Resource Bank Dependencies...
echo.

echo 📁 Cleaning Backend...
cd backend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo ✅ Backend cleaned

echo 📦 Installing Backend Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ⚠️  Backend install failed, trying with legacy peer deps...
    call npm install --legacy-peer-deps
)
echo ✅ Backend dependencies installed

echo.
echo 📁 Cleaning Frontend...
cd ..\frontend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo ✅ Frontend cleaned

echo 📦 Installing Frontend Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ⚠️  Frontend install failed, trying with legacy peer deps...
    call npm install --legacy-peer-deps
)
echo ✅ Frontend dependencies installed

echo.
echo 🎉 All dependencies fixed!
echo.
echo 🚀 To start the project:
echo   1. Backend: cd backend ^& npm run dev
echo   2. Frontend: cd frontend ^& npm run dev
echo.
pause


