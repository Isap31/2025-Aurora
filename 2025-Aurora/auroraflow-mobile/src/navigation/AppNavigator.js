import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens (will be created next)
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

const Stack = createNativeStackNavigator();

// Auth Navigator - handles login and signup flows
function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login to AuroraFlow' }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ title: 'Create Account' }}
      />
    </Stack.Navigator>
  );
}

// Main App Navigator
// TODO: Add main app screens (Dashboard, Glucose Logging, etc.) after auth is complete
function MainNavigator() {
  return (
    <Stack.Navigator>
      {/* Placeholder - will add Dashboard, Glucose, Settings screens later */}
    </Stack.Navigator>
  );
}

// Root Navigator - decides whether to show auth or main app
export default function AppNavigator() {
  // TODO: Add authentication state management
  // For now, always show auth screens (will add auth context later)
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
