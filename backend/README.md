# IIIT Kota Resource Bank - Backend

A Node.js + Express.js backend for managing educational resources with MongoDB + GridFS storage.

## Features

- 🔐 **Authentication**: JWT with Auth0 support + local fallback
- 📁 **File Storage**: MongoDB GridFS for large file storage
- ✅ **File Validation**: 20MB max, PDF/DOC/DOCX/Images only
- 🚀 **Admin Controls**: Approve/reject/delete resources
- 🛡️ **Security**: CORS, input validation, error handling

## Prerequisites

- Node.js 16+ 
- MongoDB 4.4+
- npm or yarn

## Installation

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/iiitk-resource-bank
   
   # JWT (for local development)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Auth0 (optional - for production)
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_AUDIENCE=your-api-identifier
   
   # Server
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string
   ```

4. **Run the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Health Check
- `GET /health` - Server status

### Authentication
- `GET /api/auth` - Auth status check

### File Upload
- `POST /api/upload` - Upload new resource (optional auth)
  - **Body**: `multipart/form-data`
  - **Required fields**: `file`, `year`, `branch`, `subject`, `examType`, `course`
  - **Optional fields**: `description`
  - **File types**: PDF, DOC, DOCX, JPEG, PNG, GIF
  - **Max size**: 20MB

### File Management
- `GET /api/files` - List approved resources (public)
- `GET /api/files/resources` - List all resources (admin)
- `GET /api/files/download/:filename` - Download approved file
- `PATCH /api/files/approve/:id` - Approve resource (admin)
- `DELETE /api/files/delete/:id` - Delete resource (admin)

## File Validation

- **Size limit**: 20MB maximum
- **Allowed types**: 
  - PDF: `application/pdf`
  - DOC: `application/msword`
  - DOCX: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - Images: `image/jpeg`, `image/png`, `image/gif`

## Authentication

### Local JWT
- Uses `JWT_SECRET` from environment
- Token format: `Bearer <token>`

### Auth0 Integration
- Set `AUTH0_DOMAIN` and `AUTH0_AUDIENCE`
- Automatically falls back to local JWT if Auth0 fails
- Supports RS256 algorithm

## Error Handling

- **400**: Bad Request (validation errors, invalid file types)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (file not approved)
- **404**: Not Found (resource/file not found)
- **500**: Internal Server Error

## Database Schema

### QuestionPaper Collection
```javascript
{
  filename: String,           // GridFS filename
  metadata: {
    year: String,            // Academic year
    branch: String,          // CSE, ECE, etc.
    subject: String,         // Subject name
    examType: String,        // Midterm, Endsem, Quiz, Assignment
    course: String,          // Course name
    description: String,     // Optional description
    approved: Boolean,       // Approval status
    uploadedBy: ObjectId,   // User reference
    mimeType: String,       // File MIME type
    fileSize: Number        // File size in bytes
  },
  uploadedBy: ObjectId,      // User reference
  uploadDate: Date,          // Upload timestamp
  status: String             // pending, approved, rejected
}
```

## Development

### Scripts
- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server

### Logging
- Console logging for development
- Error details only shown in development mode
- Production errors are sanitized

### CORS
- Configured for frontend origin
- Credentials enabled
- Default: `http://localhost:3000`

## Production Considerations

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure `FRONTEND_URL`

2. **Security**
   - Enable Auth0 for production
   - Use HTTPS
   - Set appropriate CORS origins

3. **Monitoring**
   - Health check endpoint
   - Graceful shutdown handling
   - Error logging

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check `MONGO_URI` in `.env`
   - Ensure MongoDB is running
   - Check network/firewall settings

2. **File Upload Fails**
   - Verify file size < 20MB
   - Check file type is allowed
   - Ensure all required fields are provided

3. **Authentication Errors**
   - Check JWT token format
   - Verify `JWT_SECRET` is set
   - For Auth0: check domain and audience

4. **GridFS Issues**
   - Ensure MongoDB connection is established
   - Check bucket permissions
   - Verify file metadata structure

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages and stack traces.


