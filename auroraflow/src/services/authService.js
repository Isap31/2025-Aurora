import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from './api';

// Storage keys
const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'user';
const GUEST_MODE_KEY = 'guestMode';

class AuthService {
  /**
   * Sign up a new user
   * @param {string} name - User's name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} User data and token
   */
  async signUp(name, email, password) {
    try {
      // Validate inputs
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Call API
      const response = await authAPI.signup(name, email, password);

      // Store token and user data
      if (response.token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
      }
      if (response.user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }

      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      console.error('SignUp error:', error);
      throw {
        success: false,
        message: error.message || error.error || 'Failed to sign up. Please try again.',
      };
    }
  }

  /**
   * Sign in an existing user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} User data and token
   */
  async signIn(email, password) {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Call API
      const response = await authAPI.login(email, password);

      // Store token and user data
      if (response.token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
      }
      if (response.user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }

      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      console.error('SignIn error:', error);
      throw {
        success: false,
        message: error.message || error.error || 'Invalid email or password',
      };
    }
  }

  /**
   * Sign out the current user
   * @returns {Promise<Object>} Success status
   */
  async signOut() {
    try {
      // Call API logout (if needed)
      await authAPI.logout();

      // Clear local storage
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(GUEST_MODE_KEY);

      return {
        success: true,
      };
    } catch (error) {
      console.error('SignOut error:', error);
      // Even if API call fails, clear local storage
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(GUEST_MODE_KEY);

      return {
        success: true,
      };
    }
  }

  /**
   * Get the current user from storage
   * @returns {Promise<Object|null>} User data or null
   */
  async getCurrentUser() {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

      if (!userJson || !token) {
        return null;
      }

      return JSON.parse(userJson);
    } catch (error) {
      console.error('GetCurrentUser error:', error);
      return null;
    }
  }

  /**
   * Get the current auth token
   * @returns {Promise<string|null>} Token or null
   */
  async getToken() {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('GetToken error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} True if authenticated
   */
  async isAuthenticated() {
    try {
      const token = await this.getToken();
      const isGuest = await this.isGuestMode();
      return !!token || isGuest;
    } catch (error) {
      return false;
    }
  }

  /**
   * Enable guest mode
   * @returns {Promise<Object>} Success status
   */
  async setGuestMode() {
    try {
      await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
      // Set a guest user object
      const guestUser = {
        id: 'guest',
        name: 'Guest User',
        email: 'guest@auroraflow.app',
        isGuest: true,
      };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(guestUser));

      return {
        success: true,
        user: guestUser,
      };
    } catch (error) {
      console.error('SetGuestMode error:', error);
      throw {
        success: false,
        message: 'Failed to enable guest mode',
      };
    }
  }

  /**
   * Check if currently in guest mode
   * @returns {Promise<boolean>} True if in guest mode
   */
  async isGuestMode() {
    try {
      const guestMode = await AsyncStorage.getItem(GUEST_MODE_KEY);
      return guestMode === 'true';
    } catch (error) {
      return false;
    }
  }

  /**
   * Exit guest mode (clear guest flag)
   * @returns {Promise<void>}
   */
  async exitGuestMode() {
    try {
      await AsyncStorage.removeItem(GUEST_MODE_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('ExitGuestMode error:', error);
    }
  }
}

// Export singleton instance
export default new AuthService();
