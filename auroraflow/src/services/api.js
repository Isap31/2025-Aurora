import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_AUTH_URL } from '../../config/api';

// Base API URL - update this in config/api.js
const API_URL = API_AUTH_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to headers
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        // You can add navigation to login screen here if needed
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Sign up new user
  signup: async (name, email, password) => {
    try {
      const response = await api.post('/signup', {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout user (optional - can be handled client-side)
  logout: async () => {
    try {
      // If you have a logout endpoint on the backend, call it here
      // const response = await api.post('/logout');
      // For now, just return success as logout is handled client-side
      return { success: true };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get current user (if you have this endpoint)
  getCurrentUser: async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default api;
