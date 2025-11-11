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
  Checkbox,
} from 'react-native-paper';
import { colors, spacing, typography } from '../../constants/theme';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle signup
  const handleSignup = async () => {
    // Clear previous errors
    setErrors({});

    // Validate inputs
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        'Password must contain uppercase, lowercase, and a number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the Terms and Privacy Policy';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      AccessibilityInfo.announceForAccessibility(
        'Signup failed. Please check the form for errors.'
      );
      return;
    }

    // TODO: Implement Firebase authentication
    setLoading(true);
    try {
      // Placeholder for Firebase auth
      console.log('Signup attempt:', { name, email });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Navigate to main app after successful signup
      AccessibilityInfo.announceForAccessibility('Account created successfully');
    } catch (error) {
      setErrors({ general: 'Signup failed. Please try again.' });
      AccessibilityInfo.announceForAccessibility(
        'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
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
        {/* Header */}
        <View style={styles.header}>
          <Text
            variant="displaySmall"
            style={styles.title}
            accessibilityRole="header"
          >
            Create Account
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Join AuroraFlow today
          </Text>
        </View>

        {/* Signup Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            error={!!errors.name}
            accessibilityLabel="Full name"
            accessibilityHint="Enter your full name"
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.name}>
            {errors.name}
          </HelperText>

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
            autoComplete="password-new"
            textContentType="newPassword"
            error={!!errors.password}
            accessibilityLabel="Password"
            accessibilityHint="Enter a secure password"
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
          <HelperText type="info" visible={!errors.password}>
            Must be 6+ characters with uppercase, lowercase, and number
          </HelperText>
          <HelperText type="error" visible={!!errors.password}>
            {errors.password}
          </HelperText>

          {/* Confirm Password Input */}
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoComplete="password-new"
            textContentType="newPassword"
            error={!!errors.confirmPassword}
            accessibilityLabel="Confirm password"
            accessibilityHint="Re-enter your password"
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                accessibilityLabel={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
              />
            }
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.confirmPassword}>
            {errors.confirmPassword}
          </HelperText>

          {/* Terms and Conditions Checkbox */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={agreeToTerms ? 'checked' : 'unchecked'}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              accessibilityLabel="Agree to terms and privacy policy"
              accessibilityHint="Check this box to agree to the terms and privacy policy"
            />
            <Text
              variant="bodyMedium"
              style={styles.checkboxLabel}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              I agree to the{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
          <HelperText type="error" visible={!!errors.terms}>
            {errors.terms}
          </HelperText>

          {/* General Error Message */}
          {errors.general && (
            <HelperText type="error" visible={true} style={styles.generalError}>
              {errors.general}
            </HelperText>
          )}

          {/* Signup Button */}
          <Button
            mode="contained"
            onPress={handleSignup}
            loading={loading}
            disabled={loading}
            style={styles.signupButton}
            contentStyle={styles.buttonContent}
            accessibilityLabel="Create account button"
            accessibilityHint="Double tap to create your account"
          >
            Create Account
          </Button>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text variant="bodyMedium" style={styles.loginText}>
            Already have an account?
          </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
            accessibilityLabel="Back to login"
            accessibilityHint="Double tap to go back to login screen"
          >
            Login
          </Button>
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
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.text,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  generalError: {
    marginTop: spacing.sm,
  },
  signupButton: {
    marginTop: spacing.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    marginBottom: spacing.sm,
    color: colors.textSecondary,
  },
  loginButton: {
    marginTop: spacing.xs,
  },
});
