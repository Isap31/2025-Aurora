// AuroraFlow Theme Configuration
// Accessibility-first design with high contrast and large text support

export const colors = {
  primary: '#2196F3',      // Blue - calming, trustworthy
  secondary: '#4CAF50',    // Green - positive, healthy
  accent: '#FF9800',       // Orange - warnings, attention
  error: '#F44336',        // Red - errors, high glucose
  warning: '#FFC107',      // Amber - caution, medium risk
  success: '#4CAF50',      // Green - success, normal glucose

  // Background colors
  background: '#FFFFFF',
  surface: '#F5F5F5',

  // Text colors
  text: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',

  // High contrast mode colors
  highContrast: {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#00E5FF',
    error: '#FF1744',
  },

  // Glucose level colors
  glucose: {
    low: '#F44336',       // Red - hypoglycemia (<70)
    normal: '#4CAF50',    // Green - target range (70-180)
    high: '#FF9800',      // Orange - hyperglycemia (>180)
    veryHigh: '#D32F2F',  // Dark red - very high (>250)
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  // Regular text sizes
  regular: {
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
  large: {
    fontSize: 18,
    lineHeight: 28,
  },

  // Large text mode (150% size for accessibility)
  largeText: {
    small: {
      fontSize: 21,
      lineHeight: 30,
    },
    regular: {
      fontSize: 24,
      lineHeight: 36,
    },
    large: {
      fontSize: 27,
      lineHeight: 42,
    },
  },

  // Headings
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Accessibility settings
export const accessibility = {
  minimumTouchSize: 44, // iOS minimum, Android is 48
  minimumTextSize: 16,
  largeTextMultiplier: 1.5,
};

export default {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  accessibility,
};
