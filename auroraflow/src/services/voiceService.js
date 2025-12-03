import Voice from '@react-native-voice/voice';
import { Platform, PermissionsAndroid } from 'react-native';

class VoiceService {
  constructor() {
    this.isListening = false;
    this.onResultCallback = null;
    this.onErrorCallback = null;

    // Bind event handlers
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
  }

  // Event handlers
  onSpeechStart(e) {
    console.log('Speech started:', e);
    this.isListening = true;
  }

  onSpeechEnd(e) {
    console.log('Speech ended:', e);
    this.isListening = false;
  }

  onSpeechResults(e) {
    console.log('Speech results:', e);
    if (e.value && e.value.length > 0) {
      const spokenText = e.value[0];
      console.log('Recognized text:', spokenText);

      // Parse glucose value from the spoken text
      const glucoseValue = this.parseGlucoseValue(spokenText);

      if (this.onResultCallback) {
        this.onResultCallback(glucoseValue, spokenText);
      }
    }
  }

  onSpeechError(e) {
    console.error('Speech error:', e);
    this.isListening = false;

    if (this.onErrorCallback) {
      this.onErrorCallback(e.error);
    }
  }

  /**
   * Request microphone permission on Android
   */
  async requestPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'AuroraFlow needs access to your microphone to log glucose via voice.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }

    // iOS permissions are handled via Info.plist
    return true;
  }

  /**
   * Start listening for voice input
   * @param {Function} onResult - Callback when speech is recognized (glucoseValue, spokenText)
   * @param {Function} onError - Callback when error occurs
   */
  async startListening(onResult, onError) {
    try {
      // Request permission first
      const hasPermission = await this.requestPermission();

      if (!hasPermission) {
        if (onError) {
          onError('permission_denied');
        }
        return false;
      }

      // Set callbacks
      this.onResultCallback = onResult;
      this.onErrorCallback = onError;

      // Stop any existing session
      if (this.isListening) {
        await Voice.stop();
      }

      // Start listening
      await Voice.start('en-US');
      this.isListening = true;
      console.log('Started listening...');

      return true;
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      this.isListening = false;

      if (onError) {
        onError('start_failed');
      }

      return false;
    }
  }

  /**
   * Stop listening for voice input
   */
  async stopListening() {
    try {
      await Voice.stop();
      this.isListening = false;
      console.log('Stopped listening');
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  }

  /**
   * Cancel voice recognition
   */
  async cancel() {
    try {
      await Voice.cancel();
      this.isListening = false;
    } catch (error) {
      console.error('Error canceling voice recognition:', error);
    }
  }

  /**
   * Parse glucose value from spoken text
   * Handles phrases like:
   * - "log 142"
   * - "my glucose is 156"
   * - "blood sugar 98"
   * - "156"
   * - "log glucose 142"
   *
   * @param {string} text - The spoken text
   * @returns {number|null} - The glucose value or null if not found/invalid
   */
  parseGlucoseValue(text) {
    if (!text) return null;

    // Convert to lowercase for easier matching
    const lowerText = text.toLowerCase();

    // Remove common words that aren't numbers
    const cleanedText = lowerText
      .replace(/log/gi, '')
      .replace(/my/gi, '')
      .replace(/glucose/gi, '')
      .replace(/blood sugar/gi, '')
      .replace(/is/gi, '')
      .replace(/sugar/gi, '')
      .replace(/reading/gi, '')
      .replace(/level/gi, '')
      .replace(/at/gi, '')
      .trim();

    // Extract numbers using regex
    // Look for 2-3 digit numbers (glucose values are typically in range 20-600)
    const numberMatch = cleanedText.match(/\b(\d{2,3})\b/);

    if (numberMatch) {
      const value = parseInt(numberMatch[1], 10);

      // Validate range (20-600 mg/dL is reasonable for glucose)
      if (value >= 20 && value <= 600) {
        return value;
      }

      console.log(`Glucose value ${value} out of valid range (20-600)`);
      return null;
    }

    console.log('No valid glucose value found in text:', text);
    return null;
  }

  /**
   * Check if voice recognition is available
   */
  async isAvailable() {
    try {
      const available = await Voice.isAvailable();
      return available === 1 || available === true;
    } catch (error) {
      console.error('Error checking voice availability:', error);
      return false;
    }
  }

  /**
   * Destroy voice service and cleanup
   */
  async destroy() {
    try {
      await Voice.destroy();
      this.isListening = false;
      this.onResultCallback = null;
      this.onErrorCallback = null;
    } catch (error) {
      console.error('Error destroying voice service:', error);
    }
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(errorCode) {
    const errorMessages = {
      'permission_denied': 'Microphone permission denied. Please enable it in settings.',
      'start_failed': 'Could not start voice recognition. Please try again.',
      '1/client': 'Network error. Please check your connection.',
      '2/network': 'Network error. Please check your connection.',
      '3/audio': 'Audio recording error. Please check your microphone.',
      '5/client': 'Voice recognition is not available on this device.',
      '6/speech_timeout': 'No speech detected. Please try again.',
      '7/no_match': "Didn't catch that. Please try saying 'Log' followed by a number.",
      '8/recognizer_busy': 'Voice recognition is busy. Please try again.',
      '9/insufficient_permissions': 'Microphone permission is required.',
    };

    return errorMessages[errorCode] || "Couldn't understand. Please try again.";
  }
}

// Export singleton instance
export default new VoiceService();
