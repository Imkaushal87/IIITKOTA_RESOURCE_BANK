const express = require("express");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const QuestionPaper = require("../models/QuestionPaper");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Get all resources (approved and pending)
router.get("/resources", async (req, res) => {
  try {
    const resources = await QuestionPaper.find({})
      .populate('uploadedBy', 'email')
      .sort({ uploadDate: -1 });
    
    res.json(resources);
  } catch (err) {
    console.error("List resources error:", err);
    res.status(500).json({ message: "Failed to list resources" });
  }
});

// Get approved resources only (for public view)
router.get("/", async (req, res) => {
  try {
    if (!gfs) return res.json([]);
    
    const files = await gfs.files
      .find({ "metadata.approved": true }, { 
        projection: { 
          filename: 1, 
          length: 1, 
          uploadDate: 1, 
          metadata: 1, 
          contentType: 1 
        } 
      })
      .toArray();
    
    res.json(files);
  } catch (err) {
    console.error("List files error:", err);
    res.status(500).json({ message: "Failed to list files" });
  }
});

// Download by filename
router.get("/download/:filename", async (req, res) => {
  try {
    if (!gfs) {
      return res.status(503).json({ message: "File service not ready" });
    }
    
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    
    // Check if file is approved
    if (!file.metadata?.approved) {
      return res.status(403).json({ message: "File not approved for download" });
    }
    
    res.set("Content-Type", file.contentType || "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename="${file.filename}"`);
    
    const readstream = gfs.createReadStream({ 
      filename: file.filename, 
      root: "uploads" 
    });
    
    readstream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).end();
    });
    
    readstream.pipe(res);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Failed to download file" });
  }
});

// Approve a resource (admin only)
router.patch("/approve/:id", authMiddleware, async (req, res) => {
  try {
    const resource = await QuestionPaper.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    
    // Update both the QuestionPaper document and GridFS metadata
    resource.status = 'approved';
    resource.metadata.approved = true;
    await resource.save();
    
    // Update GridFS metadata
    if (gfs) {
      await gfs.files.updateOne(
        { filename: resource.filename },
        { $set: { "metadata.approved": true } }
      );
    }
    
    res.json({ 
      message: "Resource approved successfully",
      resource: {
        id: resource._id,
        filename: resource.filename,
        status: resource.status
      }
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ 
      message: "Failed to approve resource",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Delete a resource (admin only)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const resource = await QuestionPaper.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    
    // Delete from GridFS
    if (gfs) {
      await gfs.files.deleteOne({ filename: resource.filename });
    }
    
    // Delete from QuestionPaper collection
    await QuestionPaper.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ 
      message: "Failed to delete resource",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

module.exports = router;
