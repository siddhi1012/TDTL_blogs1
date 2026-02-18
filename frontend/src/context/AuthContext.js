import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token validity - using a simple approach since we don't have a user endpoint
      // We'll assume token is valid if it exists, and handle errors on API calls
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/accounts/login/', { username, password });
      const { access } = response.data;
      localStorage.setItem('token', access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Set user with basic info
      setUser({ 
        username: username,
        email: '', // Will be populated if needed
        id: null // Will be set when needed
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post('/api/accounts/register/', { username, email, password });
      return { success: true };
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (error.response?.data) {
        // Handle different error response formats
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.username) {
          errorMessage = error.response.data.username[0];
        } else if (error.response.data.email) {
          errorMessage = error.response.data.email[0];
        } else if (error.response.data.password) {
          errorMessage = error.response.data.password[0];
        }
      }
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
