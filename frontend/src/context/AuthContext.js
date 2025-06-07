import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const navigate = useNavigate();

  // Configure axios
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;

  // Set token in axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/auth/me');
          setUser(res.data.data.user);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('/auth/register', formData);

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.data.user);
      setIsAuthenticated(true);

      toast.success('Registration successful!');
      navigate('/');

      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post('/auth/login', formData);

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.data.user);
      setIsAuthenticated(true);

      toast.success('Login successful!');
      navigate('/');

      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    toast.info('You have been logged out');
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const res = await axios.patch('/auth/update-me', formData);

      setUser(res.data.data.user);

      toast.success('Profile updated successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to update profile' 
      };
    }
  };

  // Update password
  const updatePassword = async (formData) => {
    try {
      await axios.patch('/auth/update-password', formData);

      toast.success('Password updated successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to update password' 
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout,
        updateProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
