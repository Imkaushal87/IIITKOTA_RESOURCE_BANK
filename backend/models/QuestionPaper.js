const mongoose = require("mongoose");

const QuestionPaperSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  metadata: {
    subject: { type: String, required: true },
    year: { type: String, required: true },
    branch: { type: String, required: true },
    course: { type: String, required: true },
    examType: { type: String, required: true },
    description: String,
    approved: { type: Boolean, default: false },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mimeType: String,
    fileSize: Number
  },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model("QuestionPaper", QuestionPaperSchema);
