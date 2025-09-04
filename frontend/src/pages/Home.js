import React, { useEffect, useState } from "react";
import { listFiles, downloadFile, checkServerHealth } from "../api";

const FileCard = ({ file, onDownload }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload(file.filename);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('word') || mimeType?.includes('document')) return '📝';
    if (mimeType?.includes('image')) return '🖼️';
    return '📁';
  };

  return (
    <div className="border rounded-lg p-4 shadow-md w-72 bg-white hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-2">{getFileIcon(file.metadata?.mimeType)}</span>
        <h2 className="font-semibold text-gray-800 truncate">{file.filename}</h2>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p><span className="font-medium">Subject:</span> {file.metadata?.subject || "N/A"}</p>
        <p><span className="font-medium">Year:</span> {file.metadata?.year || "N/A"}</p>
        <p><span className="font-medium">Branch:</span> {file.metadata?.branch || "N/A"}</p>
        <p><span className="font-medium">Course:</span> {file.metadata?.course || "N/A"}</p>
        <p><span className="font-medium">Exam Type:</span> {file.metadata?.examType || "N/A"}</p>
        {file.metadata?.description && (
          <p><span className="font-medium">Description:</span> {file.metadata.description}</p>
        )}
        <p><span className="font-medium">Uploaded:</span> {new Date(file.uploadDate).toLocaleDateString()}</p>
        <p><span className="font-medium">Size:</span> {formatFileSize(file.length || 0)}</p>
      </div>
      
      <div className="flex justify-between mt-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isDownloading ? "⏳" : "🔽"} Download
        </button>
        
        <a 
          href={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/files/download/${encodeURIComponent(file.filename)}`}
          target="_blank" 
          rel="noreferrer" 
          className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center"
        >
          👁️ View
        </a>
      </div>
    </div>
  );
};

const FileDisplay = () => {
  const [yearFilter, setYearFilter] = useState("All Years");
  const [branchFilter, setBranchFilter] = useState("All Branches");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [serverStatus, setServerStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    
    const checkHealth = async () => {
      try {
        await checkServerHealth();
        setServerStatus("online");
      } catch (error) {
        setServerStatus("offline");
        setError("Server is offline. Please check your connection.");
      }
    };

    const loadFiles = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await listFiles();
        if (!cancelled) {
          setFiles(data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load files");
          setFiles([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkHealth();
    loadFiles();

    return () => { cancelled = true; };
  }, []);

  const handleDownload = async (filename) => {
    try {
      await downloadFile(filename);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to direct link
      window.open(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/files/download/${encodeURIComponent(filename)}`, '_blank');
    }
  };

  const filteredFiles = files.filter((file) => {
    const yearMatch = yearFilter === "All Years" || 
      (file.metadata?.year || "").toLowerCase() === yearFilter.toLowerCase();
    
    const branchMatch = branchFilter === "All Branches" || 
      (file.metadata?.branch || "").toLowerCase() === branchFilter.toLowerCase();
    
    const subjectMatch = !subjectFilter || 
      (file.metadata?.subject || "").toLowerCase().includes(subjectFilter.toLowerCase());
    
    const examTypeMatch = !examTypeFilter || 
      (file.metadata?.examType || "") === examTypeFilter;
    
    return yearMatch && branchMatch && subjectMatch && examTypeMatch;
  });

  const clearFilters = () => {
    setYearFilter("All Years");
    setBranchFilter("All Branches");
    setSubjectFilter("");
    setExamTypeFilter("");
  };

  if (serverStatus === "offline") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🔴</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Server Offline</h1>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">IIITK Resource Bank</h1>
        
        {/* Server Status */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Server Online</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select 
                className="border p-2 rounded text-sm" 
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option>All Years</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select 
                className="border p-2 rounded text-sm" 
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
              >
                <option>All Branches</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>AI</option>
                <option>ME</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input 
                className="border p-2 rounded text-sm" 
                placeholder="Search subject..." 
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <select 
                className="border p-2 rounded text-sm" 
                value={examTypeFilter}
                onChange={(e) => setExamTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Midterm">Midterm</option>
                <option value="Endsem">Endsem</option>
                <option value="Quiz">Quiz</option>
                <option value="Assignment">Assignment</option>
                <option value="Lab">Lab</option>
              </select>
            </div>
            
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredFiles.length} of {files.length} approved resources
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading resources...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No resources found</h3>
            <p className="text-gray-500">
              {files.length === 0 
                ? "No approved resources available yet." 
                : "Try adjusting your filters or check back later."
              }
            </p>
          </div>
        )}

        {/* Files Grid */}
        {!loading && filteredFiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.map((file) => (
              <FileCard 
                key={file._id || file.filename} 
                file={file} 
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDisplay;
