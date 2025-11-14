/**
 * Glucose Data Service
 *
 * Handles all glucose reading operations with Firestore
 */

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { GLUCOSE_LIMITS } from '../models/types';

/**
 * Validate glucose reading value
 */
export const validateGlucoseValue = (value) => {
  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return { valid: false, error: 'Please enter a valid number' };
  }

  if (numValue < GLUCOSE_LIMITS.MIN || numValue > GLUCOSE_LIMITS.MAX) {
    return {
      valid: false,
      error: `Glucose must be between ${GLUCOSE_LIMITS.MIN} and ${GLUCOSE_LIMITS.MAX} mg/dL`
    };
  }

  return { valid: true, value: numValue };
};

/**
 * Add a new glucose reading
 */
export const addGlucoseReading = async (userId, glucoseValue, notes = '') => {
  try {
    const validation = validateGlucoseValue(glucoseValue);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const reading = {
      userId,
      glucoseValue: validation.value,
      timestamp: new Date().toISOString(),
      notes,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'glucoseReadings'), reading);

    return {
      success: true,
      reading: { id: docRef.id, ...reading }
    };
  } catch (error) {
    console.error('Error adding glucose reading:', error);
    return { success: false, error: 'Failed to save reading' };
  }
};

/**
 * Get recent glucose readings for a user
 */
export const getRecentReadings = async (userId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'glucoseReadings'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const readings = [];

    querySnapshot.forEach((doc) => {
      readings.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, readings };
  } catch (error) {
    console.error('Error fetching readings:', error);
    return { success: false, error: 'Failed to load readings', readings: [] };
  }
};

/**
 * Get readings for a specific date range
 */
export const getReadingsByDateRange = async (userId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, 'glucoseReadings'),
      where('userId', '==', userId),
      where('timestamp', '>=', startDate.toISOString()),
      where('timestamp', '<=', endDate.toISOString()),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const readings = [];

    querySnapshot.forEach((doc) => {
      readings.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, readings };
  } catch (error) {
    console.error('Error fetching readings by date:', error);
    return { success: false, error: 'Failed to load readings', readings: [] };
  }
};

/**
 * Delete a glucose reading
 */
export const deleteGlucoseReading = async (readingId) => {
  try {
    await deleteDoc(doc(db, 'glucoseReadings', readingId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting reading:', error);
    return { success: false, error: 'Failed to delete reading' };
  }
};

/**
 * Get glucose statistics for a user
 */
export const getGlucoseStats = (readings) => {
  if (!readings || readings.length === 0) {
    return null;
  }

  const values = readings.map((r) => r.glucoseValue);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;

  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  // Calculate standard deviation
  const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Time in range (70-180 mg/dL)
  const inRange = values.filter((v) => v >= 70 && v <= 180).length;
  const timeInRange = (inRange / values.length) * 100;

  return {
    average: Math.round(avg),
    min,
    max,
    standardDeviation: Math.round(stdDev),
    timeInRange: Math.round(timeInRange),
    totalReadings: readings.length
  };
};
