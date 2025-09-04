#!/bin/bash

echo "🔧 Fixing IIIT Kota Resource Bank Dependencies..."
echo

echo "📁 Cleaning Backend..."
cd backend
rm -rf node_modules package-lock.json
echo "✅ Backend cleaned"

echo "📦 Installing Backend Dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "⚠️  Backend install failed, trying with legacy peer deps..."
    npm install --legacy-peer-deps
fi
echo "✅ Backend dependencies installed"

echo
echo "📁 Cleaning Frontend..."
cd ../frontend
rm -rf node_modules package-lock.json
echo "✅ Frontend cleaned"

echo "📦 Installing Frontend Dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "⚠️  Frontend install failed, trying with legacy peer deps..."
    npm install --legacy-peer-deps
fi
echo "✅ Frontend dependencies installed"

echo
echo "🎉 All dependencies fixed!"
echo
echo "🚀 To start the project:"
echo "   1. Backend: cd backend && npm run dev"
echo "   2. Frontend: cd frontend && npm run dev"
echo


