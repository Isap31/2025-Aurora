/**
 * Data Models and Type Definitions for AuroraFlow
 *
 * Using JSDoc comments for type safety without TypeScript
 */

/**
 * @typedef {Object} User
 * @property {string} id - User ID from Firebase Auth
 * @property {string} email - User email
 * @property {string} name - User display name
 * @property {string} createdAt - ISO timestamp
 * @property {UserPreferences} preferences - User preferences
 */

/**
 * @typedef {Object} UserPreferences
 * @property {TargetRange} targetRange - Target glucose range
 * @property {string} units - "mg/dL" or "mmol/L"
 * @property {boolean} largeText - Enable large text mode
 * @property {boolean} highContrast - Enable high contrast mode
 * @property {boolean} voiceEnabled - Enable voice assistant
 * @property {string} voicePersonality - "friendly", "clinical", or "motivational"
 * @property {boolean} notificationsEnabled - Enable notifications
 */

/**
 * @typedef {Object} TargetRange
 * @property {number} min - Minimum target glucose (default: 70 mg/dL)
 * @property {number} max - Maximum target glucose (default: 180 mg/dL)
 */

/**
 * @typedef {Object} GlucoseReading
 * @property {string} id - Unique reading ID
 * @property {string} userId - User ID
 * @property {number} glucoseValue - Glucose level in mg/dL
 * @property {string} timestamp - ISO timestamp of reading
 * @property {string} [notes] - Optional notes about the reading
 * @property {string} createdAt - ISO timestamp when logged
 */

/**
 * @typedef {Object} Prediction
 * @property {string} id - Unique prediction ID
 * @property {string} userId - User ID
 * @property {number} predictedValue - Predicted glucose level
 * @property {number} confidence - Confidence score (0-1)
 * @property {string} predictionType - "normal", "hypoglycemia", or "hyperglycemia"
 * @property {string} riskLevel - "low", "moderate", or "high"
 * @property {string} forDatetime - ISO timestamp for predicted time
 * @property {string} createdAt - ISO timestamp when prediction made
 * @property {string} message - User-friendly message
 */

// Default user preferences
export const DEFAULT_PREFERENCES = {
  targetRange: {
    min: 70,
    max: 180
  },
  units: "mg/dL",
  largeText: false,
  highContrast: false,
  voiceEnabled: true,
  voicePersonality: "friendly",
  notificationsEnabled: true
};

// Glucose value validation
export const GLUCOSE_LIMITS = {
  MIN: 20,
  MAX: 600
};

// Risk level thresholds
export const GLUCOSE_THRESHOLDS = {
  SEVERE_LOW: 54,
  LOW: 70,
  TARGET_MIN: 70,
  TARGET_MAX: 180,
  HIGH: 180,
  SEVERE_HIGH: 250
};
