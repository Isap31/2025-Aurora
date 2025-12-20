import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'user';
const GUEST_MODE_KEY = 'guestMode';

class AuthService {
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

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} True if authenticated
   */
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const isGuest = await this.isGuestMode();
      return !!token || isGuest;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the current user from storage
   * @returns {Promise<Object|null>} User data or null
   */
  async getCurrentUser() {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      if (!userJson) {
        return null;
      }
      return JSON.parse(userJson);
    } catch (error) {
      console.error('GetCurrentUser error:', error);
      return null;
    }
  }

  /**
   * Sign out the current user
   * @returns {Promise<Object>} Success status
   */
  async signOut() {
    try {
      // Clear local storage
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(GUEST_MODE_KEY);

      return {
        success: true,
      };
    } catch (error) {
      console.error('SignOut error:', error);
      // Even if error occurs, clear local storage
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(GUEST_MODE_KEY);

      return {
        success: true,
      };
    }
  }
}

// Export singleton instance
export default new AuthService();
