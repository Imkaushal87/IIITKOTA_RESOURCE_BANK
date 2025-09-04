import React, { useState } from "react";
import { uploadFile } from "../api";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    year: "",
    branch: "",
    subject: "",
    examType: "",
    course: "",
    description: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (20MB)
      if (selectedFile.size > 20 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size must be less than 20MB" });
        e.target.value = "";
        return;
      }
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage({ type: "error", text: "Only PDF, DOC, DOCX, and images are allowed" });
        e.target.value = "";
        return;
      }
      
      setFile(selectedFile);
      setMessage({ type: "success", text: `File selected: ${selectedFile.name}` });
    }
  };

  const handleChange = (e) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
    // Clear message when user starts typing
    if (message.text) setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select a file" });
      return false;
    }
    
    const requiredFields = ['year', 'branch', 'subject', 'examType', 'course'];
    for (const field of requiredFields) {
      if (!metadata[field] || metadata[field].trim() === '') {
        setMessage({ type: "error", text: `Please fill in ${field}` });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setMessage({ type: "", text: "" });
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("year", metadata.year.trim());
    formData.append("branch", metadata.branch.trim());
    formData.append("subject", metadata.subject.trim());
    formData.append("examType", metadata.examType.trim());
    formData.append("course", metadata.course.trim());
    formData.append("description", metadata.description.trim());

    try {
      const result = await uploadFile(formData);
      setMessage({ 
        type: "success", 
        text: `File uploaded successfully! Status: ${result.file?.status || 'pending approval'}` 
      });
      
      // Reset form on success
      setFile(null);
      setMetadata({
        year: "",
        branch: "",
        subject: "",
        examType: "",
        course: "",
        description: "",
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.message || "Upload failed. Please try again." 
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFile(null);
    setMetadata({
      year: "",
      branch: "",
      subject: "",
      examType: "",
      course: "",
      description: "",
    });
    setMessage({ type: "", text: "" });
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 shadow-xl rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Upload Resource</h2>
        
        {/* Message Display */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "error" 
              ? "bg-red-100 text-red-700 border border-red-300" 
              : "bg-green-100 text-green-700 border border-green-300"
          }`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File *
            </label>
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              disabled={isUploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Max size: 20MB. Allowed: PDF, DOC, DOCX, Images
            </p>
          </div>

          {/* Year Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <select 
              name="year" 
              value={metadata.year}
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUploading}
              required
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* Branch Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch *
            </label>
            <select 
              name="branch" 
              value={metadata.branch}
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUploading}
              required
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="AI">AI</option>
              <option value="ME">ME</option>
        </select>
          </div>

          {/* Subject Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input 
              type="text" 
              name="subject" 
              value={metadata.subject}
              placeholder="e.g., Data Structures, Digital Electronics" 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUploading}
              required
            />
          </div>

          {/* Exam Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Type *
            </label>
            <select 
              name="examType" 
              value={metadata.examType}
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUploading}
              required
            >
              <option value="">Select Exam Type</option>
              <option value="Midterm">Midterm</option>
              <option value="Endsem">Endsem</option>
              <option value="Quiz">Quiz</option>
              <option value="Assignment">Assignment</option>
              <option value="Lab">Lab</option>
        </select>
          </div>

          {/* Course Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Name *
            </label>
            <input 
              type="text" 
              name="course" 
              value={metadata.course}
              placeholder="e.g., CS101, EC201" 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUploading}
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea 
              name="description" 
              value={metadata.description}
              placeholder="Additional details about the resource..." 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              disabled={isUploading}
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button 
              type="submit" 
              disabled={isUploading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? "Uploading..." : "Upload Resource"}
            </button>
            
            <button 
              type="button"
              onClick={resetForm}
              disabled={isUploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Reset
            </button>
          </div>
      </form>
      </div>
    </div>
  );
};

export default Upload;
