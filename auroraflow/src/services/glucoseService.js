import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL
const API_URL = 'http://localhost:3000/api/glucose';

// Create axios instance for glucose API
const glucoseAPI = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
glucoseAPI.interceptors.request.use(
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
glucoseAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

class GlucoseService {
  /**
   * Create a new glucose reading
   * @param {number} value - Glucose value in mg/dL (20-600)
   * @param {string} timestamp - ISO timestamp of reading
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Created reading
   */
  async createReading(value, timestamp, notes = '') {
    try {
      // Validate value
      if (!value || value < 20 || value > 600) {
        throw new Error('Glucose value must be between 20 and 600 mg/dL');
      }

      if (!timestamp) {
        throw new Error('Timestamp is required');
      }

      const response = await glucoseAPI.post('/', {
        value,
        timestamp,
        notes,
      });

      return {
        success: true,
        reading: response.data.reading,
      };
    } catch (error) {
      console.error('Create reading error:', error);
      throw {
        success: false,
        message: error.response?.data?.error || error.message || 'Failed to save glucose reading',
      };
    }
  }

  /**
   * Get all glucose readings for the authenticated user
   * @returns {Promise<Object>} Array of readings
   */
  async getReadings() {
    try {
      const response = await glucoseAPI.get('/');

      return {
        success: true,
        readings: response.data.readings || [],
        count: response.data.count || 0,
      };
    } catch (error) {
      console.error('Get readings error:', error);
      throw {
        success: false,
        message: error.response?.data?.error || error.message || 'Failed to fetch glucose readings',
        readings: [],
      };
    }
  }

  /**
   * Delete a glucose reading
   * @param {number} id - Reading ID to delete
   * @returns {Promise<Object>} Success status
   */
  async deleteReading(id) {
    try {
      if (!id) {
        throw new Error('Reading ID is required');
      }

      const response = await glucoseAPI.delete(`/${id}`);

      return {
        success: true,
        message: 'Reading deleted successfully',
        id: response.data.id,
      };
    } catch (error) {
      console.error('Delete reading error:', error);
      throw {
        success: false,
        message: error.response?.data?.error || error.message || 'Failed to delete reading',
      };
    }
  }

  /**
   * Get glucose level category and color
   * @param {number} value - Glucose value in mg/dL
   * @returns {Object} Category, color, and background color
   */
  getGlucoseCategory(value) {
    if (value < 55) {
      return {
        category: 'Very Low',
        color: '#DC2626', // red
        backgroundColor: '#FEE2E2',
        textColor: '#DC2626',
      };
    } else if (value >= 55 && value < 70) {
      return {
        category: 'Low',
        color: '#F59E0B', // yellow/orange
        backgroundColor: '#FEF3C7',
        textColor: '#D97706',
      };
    } else if (value >= 70 && value <= 180) {
      return {
        category: 'Normal',
        color: '#10B981', // green
        backgroundColor: '#D1FAE5',
        textColor: '#059669',
      };
    } else if (value > 180 && value <= 250) {
      return {
        category: 'High',
        color: '#F59E0B', // yellow/orange
        backgroundColor: '#FEF3C7',
        textColor: '#D97706',
      };
    } else {
      return {
        category: 'Very High',
        color: '#DC2626', // red
        backgroundColor: '#FEE2E2',
        textColor: '#DC2626',
      };
    }
  }
}

// Export singleton instance
export default new GlucoseService();
