/**
 * Glucose Prediction Service
 *
 * Simple ML-based prediction using time series analysis
 * This is a basic implementation for MVP - can be enhanced with more sophisticated models
 */

import { GLUCOSE_THRESHOLDS } from '../models/types';

/**
 * Calculate moving average
 */
const calculateMovingAverage = (values, window = 3) => {
  if (values.length < window) return values[values.length - 1];

  const recentValues = values.slice(-window);
  return recentValues.reduce((sum, val) => sum + val, 0) / window;
};

/**
 * Calculate trend (positive = rising, negative = falling)
 */
const calculateTrend = (readings) => {
  if (readings.length < 2) return 0;

  const recent = readings.slice(-5); // Last 5 readings
  const values = recent.map((r) => r.glucoseValue);

  // Simple linear regression slope
  const n = values.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  const sumX = indices.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
  const sumXX = indices.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

  return slope;
};

/**
 * Predict glucose level for hours ahead
 */
export const predictGlucose = (readings, hoursAhead = 4) => {
  try {
    // Need at least 3 readings for meaningful prediction
    if (!readings || readings.length < 3) {
      return {
        success: false,
        error: 'Need at least 3 glucose readings to make predictions'
      };
    }

    // Sort readings by timestamp (newest first)
    const sortedReadings = [...readings].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Use last 10 readings for prediction
    const recentReadings = sortedReadings.slice(0, 10);
    const glucoseValues = recentReadings.map((r) => r.glucoseValue);

    // Calculate current metrics
    const currentValue = glucoseValues[0];
    const movingAvg = calculateMovingAverage(glucoseValues, 3);
    const trend = calculateTrend(recentReadings);

    // Calculate volatility (standard deviation)
    const mean = glucoseValues.reduce((a, b) => a + b, 0) / glucoseValues.length;
    const variance = glucoseValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / glucoseValues.length;
    const stdDev = Math.sqrt(variance);

    // Simple prediction: current + trend * hours + some noise consideration
    // This is a basic model - can be replaced with ARIMA/LSTM later
    const trendEffect = trend * hoursAhead * 10; // Scale factor for hourly change
    const predictedValue = movingAvg + trendEffect;

    // Clamp prediction to reasonable range
    const clampedPrediction = Math.max(40, Math.min(400, predictedValue));

    // Calculate confidence based on volatility and data quantity
    let confidence = 0.7; // Base confidence

    // Reduce confidence if volatile
    if (stdDev > 30) {
      confidence -= 0.2;
    }

    // Reduce confidence if not enough data
    if (readings.length < 7) {
      confidence -= 0.1;
    }

    // Increase confidence if stable
    if (stdDev < 15) {
      confidence += 0.15;
    }

    confidence = Math.max(0.4, Math.min(0.95, confidence));

    // Determine risk level
    let riskLevel = 'normal';
    let predictionType = 'normal';

    if (clampedPrediction < GLUCOSE_THRESHOLDS.SEVERE_LOW) {
      riskLevel = 'high';
      predictionType = 'hypoglycemia';
    } else if (clampedPrediction < GLUCOSE_THRESHOLDS.LOW) {
      riskLevel = 'moderate';
      predictionType = 'hypoglycemia';
    } else if (clampedPrediction > GLUCOSE_THRESHOLDS.SEVERE_HIGH) {
      riskLevel = 'high';
      predictionType = 'hyperglycemia';
    } else if (clampedPrediction > GLUCOSE_THRESHOLDS.HIGH) {
      riskLevel = 'moderate';
      predictionType = 'hyperglycemia';
    } else if (clampedPrediction >= GLUCOSE_THRESHOLDS.TARGET_MIN &&
               clampedPrediction <= GLUCOSE_THRESHOLDS.TARGET_MAX) {
      riskLevel = 'low';
      predictionType = 'normal';
    }

    // Generate user-friendly message
    const message = generatePredictionMessage(clampedPrediction, riskLevel, predictionType, confidence);

    // Calculate prediction time
    const now = new Date();
    const forDatetime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000).toISOString();

    const prediction = {
      predictedValue: Math.round(clampedPrediction),
      confidence: Math.round(confidence * 100) / 100,
      predictionType,
      riskLevel,
      forDatetime,
      createdAt: now.toISOString(),
      message,
      metadata: {
        currentValue,
        trend: trend > 0 ? 'rising' : trend < 0 ? 'falling' : 'stable',
        volatility: stdDev,
        dataPoints: readings.length
      }
    };

    return { success: true, prediction };
  } catch (error) {
    console.error('Prediction error:', error);
    return { success: false, error: 'Failed to generate prediction' };
  }
};

/**
 * Generate user-friendly prediction message
 */
const generatePredictionMessage = (predictedValue, riskLevel, type, confidence) => {
  const confidencePercent = Math.round(confidence * 100);
  let message = `Based on your recent readings, `;

  if (type === 'hypoglycemia') {
    if (riskLevel === 'high') {
      message += `there's a ${confidencePercent}% chance your glucose will drop to around ${Math.round(predictedValue)} mg/dL. Consider having a snack to prevent low blood sugar.`;
    } else {
      message += `your glucose may trend lower to around ${Math.round(predictedValue)} mg/dL. Keep an eye on it.`;
    }
  } else if (type === 'hyperglycemia') {
    if (riskLevel === 'high') {
      message += `there's a ${confidencePercent}% chance your glucose will rise to around ${Math.round(predictedValue)} mg/dL. Stay hydrated and follow your care plan.`;
    } else {
      message += `your glucose may trend higher to around ${Math.round(predictedValue)} mg/dL. Monitor it closely.`;
    }
  } else {
    message += `your glucose should remain stable around ${Math.round(predictedValue)} mg/dL. Keep up the good work!`;
  }

  return message;
};

/**
 * Get trend indicator for UI
 */
export const getTrendIndicator = (readings) => {
  if (!readings || readings.length < 2) {
    return { symbol: '→', text: 'stable', color: '#888' };
  }

  const trend = calculateTrend(readings);

  if (trend > 3) {
    return { symbol: '↑↑', text: 'rising fast', color: '#FF6B6B' };
  } else if (trend > 1) {
    return { symbol: '↑', text: 'rising', color: '#FF8C42' };
  } else if (trend < -3) {
    return { symbol: '↓↓', text: 'falling fast', color: '#4ECDC4' };
  } else if (trend < -1) {
    return { symbol: '↓', text: 'falling', color: '#45B7D1' };
  } else {
    return { symbol: '→', text: 'stable', color: '#95E1D3' };
  }
};

/**
 * Assess current glucose level
 */
export const assessGlucoseLevel = (glucoseValue) => {
  if (glucoseValue < GLUCOSE_THRESHOLDS.SEVERE_LOW) {
    return {
      status: 'critical_low',
      message: 'Critically Low - Treat Immediately',
      color: '#D32F2F',
      advice: 'Take 15g of fast-acting carbs now and recheck in 15 minutes.'
    };
  } else if (glucoseValue < GLUCOSE_THRESHOLDS.LOW) {
    return {
      status: 'low',
      message: 'Below Target',
      color: '#FF9800',
      advice: 'Consider having a snack if symptoms present.'
    };
  } else if (glucoseValue <= GLUCOSE_THRESHOLDS.TARGET_MAX) {
    return {
      status: 'in_range',
      message: 'In Target Range',
      color: '#4CAF50',
      advice: 'Great! Keep up the good work.'
    };
  } else if (glucoseValue <= GLUCOSE_THRESHOLDS.HIGH) {
    return {
      status: 'slightly_high',
      message: 'Slightly Elevated',
      color: '#FF9800',
      advice: 'Monitor closely. Stay hydrated.'
    };
  } else if (glucoseValue <= GLUCOSE_THRESHOLDS.SEVERE_HIGH) {
    return {
      status: 'high',
      message: 'Above Target',
      color: '#F44336',
      advice: 'Follow your care plan. Monitor for ketones if Type 1.'
    };
  } else {
    return {
      status: 'critical_high',
      message: 'Critically High',
      color: '#D32F2F',
      advice: 'Contact your healthcare provider. Check for ketones.'
    };
  }
};
