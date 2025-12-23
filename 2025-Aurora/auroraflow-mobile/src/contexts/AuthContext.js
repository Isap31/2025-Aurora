import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      const guestMode = await authService.isGuestMode();
      const currentUser = await authService.getCurrentUser();

      setIsAuthenticated(authenticated);
      setIsGuest(guestMode);
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    // TODO: Implement actual sign in logic
    setIsAuthenticated(true);
    setIsGuest(false);
  };

  const signUp = async (name, email, password) => {
    // TODO: Implement actual sign up logic
    setIsAuthenticated(true);
    setIsGuest(false);
  };

  const signOut = async () => {
    await authService.signOut();
    setIsAuthenticated(false);
    setIsGuest(false);
    setUser(null);
  };

  const continueAsGuest = async () => {
    try {
      console.log('🟢 AuthContext: Setting guest mode...');
      await authService.setGuestMode();
      const guestUser = await authService.getCurrentUser();
      console.log('🟢 AuthContext: Guest user retrieved:', guestUser);
      setIsAuthenticated(true);
      setIsGuest(true);
      setUser(guestUser);
      console.log('✅ AuthContext: Guest mode activated! isAuthenticated=true');
    } catch (error) {
      console.error('❌ AuthContext: Error setting guest mode:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isGuest,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
