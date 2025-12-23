import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  AccessibilityInfo,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  Divider,
} from 'react-native-paper';
import { colors, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const { continueAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle login
  const handleLogin = async () => {
    // Clear previous errors
    setErrors({});

    // Validate inputs
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Announce error to screen readers
      AccessibilityInfo.announceForAccessibility(
        'Login failed. Please check your email and password.'
      );
      return;
    }

    // TODO: Implement Firebase authentication
    setLoading(true);
    try {
      // Placeholder for Firebase auth
      console.log('Login attempt:', email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Navigate to main app after successful login
      AccessibilityInfo.announceForAccessibility('Login successful');
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
      AccessibilityInfo.announceForAccessibility(
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle guest mode
  const handleGuestMode = async () => {
    console.log('🔵 Guest button tapped!');
    setLoading(true);
    setErrors({});
    try {
      console.log('🔵 Calling continueAsGuest()...');
      await continueAsGuest();
      console.log('✅ continueAsGuest() completed successfully!');
      AccessibilityInfo.announceForAccessibility('Continuing as guest');
      // Navigation will be handled automatically by auth state change
    } catch (error) {
      console.error('❌ Guest mode error:', error);
      setErrors({ general: 'Failed to enter guest mode. Please try again.' });
      AccessibilityInfo.announceForAccessibility(
        'Failed to enter guest mode. Please try again.'
      );
    } finally {
      setLoading(false);
      console.log('🔵 Loading state cleared');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* App Header */}
        <View style={styles.header}>
          <Text
            variant="displaySmall"
            style={styles.title}
            accessibilityRole="header"
          >
            AuroraFlow
          </Text>
          <Text
            variant="bodyLarge"
            style={styles.subtitle}
          >
            Accessible Diabetes Management
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            error={!!errors.email}
            accessibilityLabel="Email address"
            accessibilityHint="Enter your email address"
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.email}>
            {errors.email}
          </HelperText>

          {/* Password Input */}
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            error={!!errors.password}
            accessibilityLabel="Password"
            accessibilityHint="Enter your password"
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={
                  showPassword ? 'Hide password' : 'Show password'
                }
              />
            }
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.password}>
            {errors.password}
          </HelperText>

          {/* General Error Message */}
          {errors.general && (
            <HelperText type="error" visible={true} style={styles.generalError}>
              {errors.general}
            </HelperText>
          )}

          {/* Login Button */}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}
            accessibilityLabel="Login button"
            accessibilityHint="Double tap to login to your account"
          >
            Login
          </Button>

          {/* Forgot Password Link */}
          <Button
            mode="text"
            onPress={() => {
              // TODO: Navigate to forgot password screen
              console.log('Forgot password');
            }}
            style={styles.forgotPassword}
            accessibilityLabel="Forgot password"
            accessibilityHint="Double tap to reset your password"
          >
            Forgot Password?
          </Button>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <Divider style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <Divider style={styles.divider} />
        </View>

        {/* Signup Link */}
        <View style={styles.signupContainer}>
          <Text variant="bodyMedium" style={styles.signupText}>
            Don't have an account?
          </Text>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Signup')}
            style={styles.signupButton}
            contentStyle={styles.buttonContent}
            accessibilityLabel="Create account button"
            accessibilityHint="Double tap to create a new account"
          >
            Create Account
          </Button>
        </View>

        {/* Guest Mode Button */}
        <View style={styles.guestContainer}>
          <Button
            mode="text"
            onPress={handleGuestMode}
            loading={loading}
            disabled={loading}
            style={styles.guestButton}
            contentStyle={styles.buttonContent}
            accessibilityLabel="Continue as guest button"
            accessibilityHint="Double tap to try the app without creating an account"
          >
            Continue as Guest
          </Button>
          <Text variant="bodySmall" style={styles.guestHint}>
            Your data won't be saved to cloud
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  generalError: {
    marginTop: spacing.sm,
  },
  loginButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  forgotPassword: {
    marginTop: spacing.xs,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textSecondary,
  },
  signupContainer: {
    alignItems: 'center',
  },
  signupText: {
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  signupButton: {
    width: '100%',
  },
  guestContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  guestButton: {
    marginBottom: spacing.xs,
  },
  guestHint: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
