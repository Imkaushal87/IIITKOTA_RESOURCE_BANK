import axios from "axios";

const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000") + "/api";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  withCredentials: true
});

// Request interceptor for authentication
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem("token");
      console.log("Token expired or invalid, cleared from storage");
    }
    
    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url
      });
    }
    
    return Promise.reject(error);
  }
);

// Authentication functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// File operations
export const uploadFile = async (formData) => {
  try {
    const response = await apiClient.post("/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network Error: No response received. Server might be offline or unreachable.');
    } else {
      throw new Error(`Request Setup Error: ${error.message}`);
    }
  }
};

export const listFiles = async () => {
  try {
    const response = await apiClient.get("/files");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network Error: No response received. Server might be offline or unreachable.');
    } else {
      throw new Error(`Request Setup Error: ${error.message}`);
    }
  }
};

export const listAllResources = async () => {
  try {
    const response = await apiClient.get("/files/resources");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network Error: No response received. Server might be offline or unreachable.');
    } else {
      throw new Error(`Request Setup Error: ${error.message}`);
    }
  }
};

export const approveResource = async (resourceId) => {
  try {
    const response = await apiClient.patch(`/files/approve/${resourceId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network Error: No response received. Server might be offline or unreachable.');
    } else {
      throw new Error(`Request Setup Error: ${error.message}`);
    }
  }
};

export const deleteResource = async (resourceId) => {
  try {
    const response = await apiClient.delete(`/files/delete/${resourceId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network Error: No response received. Server might be offline or unreachable.');
    } else {
      throw new Error(`Request Setup Error: ${error.message}`);
    }
  }
};

// File download utilities
export const fileDownloadUrl = (filename) => `${API_URL}/files/download/${encodeURIComponent(filename)}`;

export const downloadFile = async (filename) => {
  try {
    const response = await apiClient.get(`/files/download/${encodeURIComponent(filename)}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network Error: No response received. Server might be offline or unreachable.');
    } else {
      throw new Error(`Request Setup Error: ${error.message}`);
    }
  }
};

// Health check
export const checkServerHealth = async () => {
  try {
    const response = await axios.get(process.env.REACT_APP_API_URL || "http://localhost:5000/health");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network Error: No response received. Server might be offline or unreachable.');
    } else {
      throw new Error(`Request Setup Error: ${error.message}`);
    }
  }
};