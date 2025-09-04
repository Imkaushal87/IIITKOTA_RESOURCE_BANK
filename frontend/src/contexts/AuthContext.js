import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken, getAuthToken, isAuthenticated } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const token = getAuthToken();
    if (token) {
      // You could decode the JWT here to get user info
      // For now, we'll just set a basic user object
      setUser({ id: 'user', email: 'user@example.com' });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // In a real app, you'd make an API call to authenticate
      // For now, we'll simulate a successful login
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjE2MjM5MDIyfQ.example';
      
      setAuthToken(mockToken);
      setUser({ id: 'user', email });
      
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


