import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

export default function AuroraChatScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status !== 'granted') {
        Alert.alert(
          'Microphone Permission Required',
          'Aurora needs microphone access to chat with you. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error checking microphone permission:', error);
    }
  };

  const startRecording = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please enable microphone access to use Aurora Chat.');
      return;
    }

    try {
      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      // Process the recording
      await processAudioWithElevenLabs(uri);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    }
  };

  const processAudioWithElevenLabs = async (audioUri) => {
    setIsProcessing(true);

    try {
      // PLACEHOLDER: This is where ElevenLabs API integration will go
      // For now, we'll simulate a response

      const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
      const agentId = process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID;

      if (!apiKey || !agentId) {
        // Simulate a demo conversation for testing
        await new Promise(resolve => setTimeout(resolve, 1500));

        const demoResponse = {
          userMessage: 'Demo message (ElevenLabs API not configured)',
          auroraResponse: 'Hi! I\'m Aurora, your diabetes support companion. Once configured, I can help you understand your glucose patterns, suggest meal ideas, and answer questions about diabetes management.',
        };

        setConversationHistory(prev => [...prev, demoResponse]);
      } else {
        // TODO: Implement actual ElevenLabs API call here
        // Example structure:
        // 1. Upload audio to ElevenLabs
        // 2. Get transcription and agent response
        // 3. Convert response to speech
        // 4. Play audio response

        Alert.alert(
          'Not Implemented',
          'ElevenLabs integration is ready but not yet implemented. Check the code for integration points.'
        );
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      Alert.alert('Error', 'Failed to process your message. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMicrophonePress = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: 20 + insets.top }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Aurora Chat</Text>
          <Text style={styles.headerSubtitle}>Your diabetes support companion</Text>
        </View>
      </View>

      {/* Conversation History */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {conversationHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Start a conversation</Text>
            <Text style={styles.emptyText}>
              Tap the microphone button below to chat with Aurora about your diabetes management
            </Text>
          </View>
        ) : (
          <View style={styles.conversationContainer}>
            {conversationHistory.map((item, index) => (
              <View key={index} style={styles.conversationItem}>
                {/* User Message */}
                <View style={styles.userMessageContainer}>
                  <View style={styles.userMessage}>
                    <Text style={styles.userMessageText}>{item.userMessage}</Text>
                  </View>
                </View>

                {/* Aurora Response */}
                <View style={styles.auroraMessageContainer}>
                  <View style={styles.auroraIconContainer}>
                    <Ionicons name="sparkles" size={20} color="#14B8A6" />
                  </View>
                  <View style={styles.auroraMessage}>
                    <Text style={styles.auroraMessageText}>{item.auroraResponse}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="small" color="#14B8A6" />
            <Text style={styles.processingText}>Aurora is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Microphone Button */}
      <View style={[styles.microphoneContainer, { paddingBottom: insets.bottom + 20 }]}>
        {!hasPermission && (
          <View style={styles.permissionWarning}>
            <Ionicons name="warning-outline" size={16} color="#F59E0B" />
            <Text style={styles.permissionWarningText}>
              Microphone permission required
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.microphoneButton,
            isRecording && styles.microphoneButtonRecording,
            !hasPermission && styles.microphoneButtonDisabled,
          ]}
          onPress={handleMicrophonePress}
          disabled={isProcessing || !hasPermission}
        >
          {isProcessing ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <Ionicons
              name={isRecording ? 'stop' : 'mic'}
              size={48}
              color="#FFFFFF"
            />
          )}
        </TouchableOpacity>

        <Text style={styles.microphoneHint}>
          {isRecording ? 'Tap to stop recording' : 'Tap to start talking'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#F9FAFB',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  conversationContainer: {
    padding: 16,
  },
  conversationItem: {
    marginBottom: 24,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    borderTopRightRadius: 4,
    padding: 14,
    maxWidth: '80%',
  },
  userMessageText: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 20,
  },
  auroraMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  auroraIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  auroraMessage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 14,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  auroraMessageText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  processingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  microphoneContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  permissionWarningText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '500',
  },
  microphoneButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#14B8A6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  microphoneButtonRecording: {
    backgroundColor: '#EF4444',
  },
  microphoneButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.5,
  },
  microphoneHint: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
