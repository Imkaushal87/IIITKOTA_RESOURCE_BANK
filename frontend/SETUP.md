# Frontend Setup Guide

## Environment Configuration

Create a `.env` file in the frontend directory with the following content:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000

# Environment
NODE_ENV=development

# Optional: Custom API timeout (in milliseconds)
REACT_APP_API_TIMEOUT=30000
```

## Installation & Running

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Features

- ✅ **Authentication**: JWT-based login/logout system
- ✅ **File Upload**: Drag & drop with validation (20MB max, PDF/DOC/Images)
- ✅ **Resource Browser**: Filter by year, branch, subject, exam type
- ✅ **Download**: Direct file download with progress tracking
- ✅ **Responsive Design**: Mobile-friendly Tailwind CSS UI
- ✅ **Error Handling**: Comprehensive error messages and loading states

## API Integration

The frontend automatically connects to the backend at the URL specified in `REACT_APP_API_URL`.

- **Health Check**: Monitors server status
- **File Operations**: Upload, download, and list resources
- **Authentication**: JWT token management
- **Error Handling**: Automatic token cleanup on auth failures

## Development Notes

- Uses React Router for navigation
- Context API for authentication state
- Axios for API requests with interceptors
- Tailwind CSS for styling
- Responsive grid layout for resource display


