const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const QuestionPaper = require("../models/QuestionPaper");
const { optionalAuthMiddleware } = require("../middleware/authMiddleware");
const path = require('path');
const fs = require('fs'); // Import fs module

const router = express.Router();

// Ensure the uploads directory exists on server startup
const uploadDirPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDirPath)) {
  fs.mkdirSync(uploadDirPath, { recursive: true });
}

// Initialize gfs
let gfs, gridfsBucket;
mongoose.connection.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection("uploads");
});

// File validation middleware
const validateFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("Multer saved file to:", req.file.path); // Log the path

  // Check file size (20MB max)
  const maxSize = 20 * 1024 * 1024; // 20MB
  if (req.file.size > maxSize) {
    // Clean up temp file immediately if too large
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) console.error("Error deleting oversized temp file:", unlinkErr);
    });
    return res.status(400).json({ message: "File size exceeds 20MB limit" });
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];
  
  if (!allowedTypes.includes(req.file.mimetype)) {
    // Clean up temp file immediately if invalid type
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) console.error("Error deleting invalid type temp file:", unlinkErr);
    });
    return res.status(400).json({ 
      message: "Invalid file type. Only PDF, DOC, DOCX, and images are allowed" 
    });
  }

  next();
};

// Custom storage engine for Multer using diskStorage to save temporarily
const customStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
  }
});

const upload = multer({ storage: customStorage });

// File Upload Route
router.post("/", optionalAuthMiddleware, upload.single("file"), validateFile, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided after multer processing" });
  }

  console.log("Attempting to read file from:", req.file.path); // Log before creating read stream

  try {
    // Validate required fields
    const requiredFields = ['year', 'branch', 'subject', 'examType', 'course'];
    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field].trim() === '') {
        // Clean up temp file if validation fails
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting temp file on validation fail:", unlinkErr);
        });
        return res.status(400).json({ 
          message: `Missing required field: ${field}` 
        });
      }
    }

    const readableStream = fs.createReadStream(req.file.path);

    const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
      chunkSizeBytes: 1048576,
      metadata: {
        year: req.body.year.trim(),
        branch: req.body.branch.trim(),
        subject: req.body.subject.trim(),
        examType: req.body.examType.trim(),
        course: req.body.course.trim(),
        description: req.body.description?.trim() || '',
        approved: false,
        uploadedBy: (req.user && req.user.userId) || null,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
      },
    });

    readableStream.pipe(uploadStream);

    uploadStream.on('error', (err) => {
      console.error("GridFS upload stream error:", err);
      // Clean up the temporary local file on error
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file on stream error:", unlinkErr);
      });
      res.status(500).json({ message: "Failed to upload file to GridFS" });
    });

    uploadStream.on('finish', async () => {
      // Clean up the temporary local file after successful GridFS upload
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file after GridFS upload:", unlinkErr);
      });

      const newFile = new QuestionPaper({
        filename: req.file.originalname,
        metadata: {
          year: req.body.year.trim(),
          branch: req.body.branch.trim(),
          subject: req.body.subject.trim(),
          examType: req.body.examType.trim(),
          course: req.body.course.trim(),
          description: req.body.description?.trim() || '',
          approved: false,
          uploadedBy: (req.user && req.user.userId) || null,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
          gridfsId: uploadStream.id, // Store the GridFS file ID
        },
        uploadedBy: (req.user && req.user.userId) || null,
        status: 'pending'
      });

      try {
        await newFile.save();
        
        res.status(201).json({ 
          message: "File uploaded successfully and pending approval",
          file: {
            id: newFile._id,
            filename: newFile.filename,
            status: 'pending',
            gridfsId: uploadStream.id
          }
        });
      } catch (saveError) {
        console.error("Error saving QuestionPaper to DB:", saveError);
        // If QuestionPaper save fails, try to delete the file from GridFS as well
        gridfsBucket.delete(uploadStream.id, (deleteErr) => {
          if (deleteErr) console.error("Error deleting GridFS file after DB save failed:", deleteErr);
        });
        res.status(500).json({ 
          message: "Upload failed: Could not save file metadata",
          error: process.env.NODE_ENV === 'development' ? saveError.message : 'Internal server error'
        });
      }
    });

  } catch (err) {
    console.error("Upload error (outer catch):", err);
    // Clean up temporary local file in case of early error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file in outer catch:", unlinkErr);
      });
    }
    res.status(500).json({ 
      message: "Upload failed",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

module.exports = router;
