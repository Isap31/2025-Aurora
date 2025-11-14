/**
 * Voice Assistant Service
 *
 * Handles text-to-speech and speech-to-text functionality
 */

import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';
import { GLUCOSE_THRESHOLDS } from '../models/types';

/**
 * Text-to-Speech Service
 */
export const speak = async (text, options = {}) => {
  try {
    const { rate = 0.9, pitch = 1.0 } = options;

    await Speech.speak(text, {
      language: 'en-US',
      pitch,
      rate,
      onDone: options.onDone,
      onError: options.onError
    });

    return { success: true };
  } catch (error) {
    console.error('Speech error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Stop any ongoing speech
 */
export const stopSpeaking = async () => {
  try {
    await Speech.stop();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Check if speech is available
 */
export const isSpeechAvailable = async () => {
  try {
    const available = await Speech.isSpeakingAsync();
    return available !== null;
  } catch (error) {
    return false;
  }
};

/**
 * Generate friendly glucose reading message
 */
export const generateGlucoseMessage = (glucoseValue, personality = 'friendly') => {
  let message = `Your glucose is ${glucoseValue}.`;
  let assessment = '';

  if (glucoseValue < GLUCOSE_THRESHOLDS.SEVERE_LOW) {
    assessment = 'This is very low. Please treat immediately with fast-acting carbs.';
  } else if (glucoseValue < GLUCOSE_THRESHOLDS.LOW) {
    assessment = 'This is a bit low. Consider having a snack.';
  } else if (glucoseValue <= GLUCOSE_THRESHOLDS.TARGET_MAX) {
    assessment = "That's in a healthy range. Keep it up!";
  } else if (glucoseValue <= GLUCOSE_THRESHOLDS.HIGH) {
    assessment = 'This is slightly elevated. Monitor closely.';
  } else {
    assessment = 'This is high. Follow your care plan.';
  }

  // Adjust tone based on personality
  if (personality === 'clinical') {
    message = `Blood glucose level: ${glucoseValue} milligrams per deciliter. ${assessment}`;
  } else if (personality === 'motivational') {
    const encouragement = glucoseValue >= 70 && glucoseValue <= 180
      ? " You're doing great! Keep up the good work managing your diabetes."
      : " Remember, you've got this. Small adjustments make a big difference.";
    message = `${message} ${assessment}${encouragement}`;
  } else {
    message = `${message} ${assessment}`;
  }

  return message;
};

/**
 * Generate prediction message
 */
export const generatePredictionMessage = (prediction, personality = 'friendly') => {
  const { predictedValue, confidence, riskLevel, forDatetime } = prediction;
  const time = new Date(forDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const confidencePercent = Math.round(confidence * 100);

  let message = `I predict your glucose might be around ${predictedValue} at ${time}.`;
  let advice = '';

  if (riskLevel === 'high_hypo') {
    advice = 'There is a risk of low blood sugar. Consider having a snack soon.';
  } else if (riskLevel === 'moderate_hypo') {
    advice = 'Your glucose may trend lower. Keep an eye on it.';
  } else if (riskLevel === 'high_hyper') {
    advice = 'Your glucose may run high. Stay hydrated and follow your care plan.';
  } else if (riskLevel === 'moderate_hyper') {
    advice = 'Your glucose may trend higher. Monitor it closely.';
  } else {
    advice = 'Your glucose looks stable.';
  }

  if (personality === 'clinical') {
    message = `Predicted glucose: ${predictedValue} at ${time}. Confidence: ${confidencePercent} percent. ${advice}`;
  } else if (personality === 'motivational') {
    message = `${message} I'm about ${confidencePercent} percent confident. ${advice} Remember, you're in control!`;
  } else {
    message = `${message} ${advice}`;
  }

  return message;
};

/**
 * Speech-to-Text Service
 */
class VoiceRecognitionService {
  constructor() {
    this.isListening = false;
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
  }

  onSpeechResults(event) {
    if (this.onResultsCallback) {
      this.onResultsCallback(event.value);
    }
  }

  onSpeechError(event) {
    if (this.onErrorCallback) {
      this.onErrorCallback(event.error);
    }
  }

  async startListening(onResults, onError) {
    try {
      this.onResultsCallback = onResults;
      this.onErrorCallback = onError;

      await Voice.start('en-US');
      this.isListening = true;
      return { success: true };
    } catch (error) {
      console.error('Voice recognition error:', error);
      return { success: false, error: error.message };
    }
  }

  async stopListening() {
    try {
      await Voice.stop();
      this.isListening = false;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async destroy() {
    try {
      await Voice.destroy();
      this.isListening = false;
      this.onResultsCallback = null;
      this.onErrorCallback = null;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export const voiceRecognition = new VoiceRecognitionService();

/**
 * Parse voice command for glucose logging
 * Examples: "My glucose is 142", "142", "Blood sugar 95"
 */
export const parseGlucoseFromSpeech = (speechText) => {
  if (!speechText || speechText.length === 0) {
    return null;
  }

  const text = speechText[0].toLowerCase();

  // Extract numbers from speech
  const numberMatch = text.match(/\d+/);

  if (numberMatch) {
    const value = parseInt(numberMatch[0], 10);
    // Validate it's a reasonable glucose value
    if (value >= 20 && value <= 600) {
      return value;
    }
  }

  return null;
};
