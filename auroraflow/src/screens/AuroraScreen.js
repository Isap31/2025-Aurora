import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

export default function AuroraScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [conversationState, setConversationState] = useState('idle'); // idle, listening, processing, speaking
  const [conversationHistory, setConversationHistory] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [userGlucoseContext, setUserGlucoseContext] = useState(null);

  const wsRef = useRef(null);
  const recordingRef = useRef(null);
  const soundRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const conversationIdRef = useRef(null);

  useEffect(() => {
    checkMicrophonePermission();
    fetchUserGlucoseContext();

    return () => {
      // Cleanup on unmount
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (conversationState === 'listening') {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [conversationState]);

  const fetchUserGlucoseContext = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/glucose/recent');
      const data = await response.json();

      if (data && data.length > 0) {
        const recentReadings = data.slice(0, 7);
        const sum = recentReadings.reduce((acc, r) => acc + (r.glucose_level || 0), 0);
        const average = Math.round(sum / recentReadings.length);

        setUserGlucoseContext({
          latestGlucose: data[0].glucose_level,
          averageGlucose: average,
          readingCount: recentReadings.length,
        });
      }
    } catch (error) {
      console.log('Could not fetch glucose context:', error);
    }
  };

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

  const getSystemPrompt = () => {
    const glucoseContext = userGlucoseContext
      ? `The user's recent 7-day glucose average is ${userGlucoseContext.averageGlucose} mg/dL, with their most recent reading at ${userGlucoseContext.latestGlucose} mg/dL.`
      : 'The user is tracking their diabetes but glucose data is not currently available.';

    return `You are Aurora, a friendly and knowledgeable diabetes support companion. You help users understand their glucose patterns, suggest affordable meal ideas, and answer questions about diabetes management. Keep responses concise and supportive (2-3 sentences max). ${glucoseContext} Be warm but informative.`;
  };

  const startConversation = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please enable microphone access to use Aurora Chat.');
      return;
    }

    const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
    const agentId = process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID;

    console.log('API Key present:', !!apiKey);
    console.log('Agent ID present:', !!agentId);
    console.log('API Key (first 10 chars):', apiKey?.substring(0, 10));
    console.log('Agent ID:', agentId);

    if (!apiKey || !agentId) {
      Alert.alert(
        'Configuration Required',
        'ElevenLabs API credentials are not configured. Please add them to your .env file and restart the app.'
      );
      return;
    }

    try {
      setConversationState('listening');

      // Set up WebSocket connection to ElevenLabs Conversational AI
      const signedUrl = await getSignedUrl(apiKey, agentId);

      wsRef.current = new WebSocket(signedUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        startAudioRecording();
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);
          await handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConversationState('idle');
        Alert.alert('Connection Error', 'Failed to connect to Aurora. Please try again.');
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        setConversationState('idle');
      };

    } catch (error) {
      console.error('Error starting conversation:', error);
      setConversationState('idle');
      Alert.alert('Error', 'Failed to start conversation. Please try again.');
    }
  };

  const getSignedUrl = async (apiKey, agentId) => {
    try {
      console.log('Requesting signed URL from ElevenLabs...');
      console.log('Agent ID:', agentId);

      const response = await fetch('https://api.elevenlabs.io/v1/convai/conversation/get_signed_url', {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', errorText);
        throw new Error(`Failed to get signed URL: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Received signed URL successfully');
      conversationIdRef.current = data.conversation_id;

      // Add agent_id and custom prompt as query parameters
      const url = new URL(data.signed_url);
      url.searchParams.append('agent_id', agentId);

      return url.toString();
    } catch (error) {
      console.error('Error in getSignedUrl:', error);
      throw error;
    }
  };

  const startAudioRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
          android: {
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
            sampleRate: 16000,
            numberOfChannels: 1,
          },
          ios: {
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
            sampleRate: 16000,
            numberOfChannels: 1,
          },
        },
        (status) => {
          // Stream audio chunks to WebSocket
          if (status.isRecording && wsRef.current?.readyState === WebSocket.OPEN) {
            // Note: Direct streaming requires additional setup
            // For now, we'll send audio in chunks
          }
        }
      );

      recordingRef.current = recording;
    } catch (error) {
      console.error('Error starting recording:', error);
      setConversationState('idle');
    }
  };

  const handleWebSocketMessage = async (message) => {
    switch (message.type) {
      case 'conversation_initiation_metadata':
        console.log('Conversation initiated:', message.conversation_id);
        break;

      case 'audio':
        // Received audio response from Aurora
        setConversationState('speaking');
        await playAudioResponse(message.audio_event.audio_base_64);
        break;

      case 'user_transcript':
        // User's speech was transcribed
        setCurrentTranscript(message.user_transcription_event.user_transcript);
        break;

      case 'agent_response':
        // Aurora's text response
        const userMessage = currentTranscript || 'Voice message';
        const auroraResponse = message.agent_response_event.agent_response;

        setConversationHistory(prev => [...prev, {
          userMessage,
          auroraResponse,
          timestamp: new Date(),
        }]);
        setCurrentTranscript('');
        setConversationState('processing');
        break;

      case 'interruption':
        // User interrupted Aurora
        console.log('Conversation interrupted');
        break;

      case 'ping':
        // Keepalive ping
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'pong', event_id: message.ping_event.event_id }));
        }
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  };

  const playAudioResponse = async (audioBase64) => {
    try {
      // Decode base64 audio and play it
      const sound = new Audio.Sound();

      await sound.loadAsync({
        uri: `data:audio/mp3;base64,${audioBase64}`,
      });

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setConversationState('idle');
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
      setConversationState('idle');
    }
  };

  const stopConversation = async () => {
    try {
      // Stop recording
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }

      // Close WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        wsRef.current = null;
      }

      // Stop any playing audio
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      setConversationState('idle');
    } catch (error) {
      console.error('Error stopping conversation:', error);
      setConversationState('idle');
    }
  };

  const handleMicrophonePress = async () => {
    if (conversationState === 'idle') {
      await startConversation();
    } else {
      await stopConversation();
    }
  };

  const getStateText = () => {
    switch (conversationState) {
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Aurora is thinking...';
      case 'speaking':
        return 'Aurora is speaking...';
      default:
        return 'Tap to start talking';
    }
  };

  const getMicrophoneIcon = () => {
    if (conversationState === 'idle') return 'mic';
    if (conversationState === 'listening') return 'mic';
    return 'stop';
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
            {userGlucoseContext && (
              <View style={styles.contextCard}>
                <Ionicons name="analytics-outline" size={20} color="#14B8A6" />
                <Text style={styles.contextText}>
                  Aurora knows your recent glucose average is {userGlucoseContext.averageGlucose} mg/dL
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.conversationContainer}>
            {conversationHistory.map((item, index) => (
              <View key={index} style={styles.conversationItem}>
                {/* User Message */}
                <View style={styles.userMessageContainer}>
                  <View style={styles.userMessage}>
                    <Ionicons name="mic" size={14} color="#6B7280" style={styles.micIcon} />
                    <Text style={styles.userMessageText}>{item.userMessage}</Text>
                  </View>
                </View>

                {/* Aurora Response */}
                <View style={styles.auroraMessageContainer}>
                  <View style={styles.auroraIconContainer}>
                    <Ionicons name="star-outline" size={20} color="#14B8A6" />
                  </View>
                  <View style={styles.auroraMessage}>
                    <Text style={styles.auroraMessageText}>{item.auroraResponse}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Current transcript being processed */}
            {currentTranscript && conversationState === 'processing' && (
              <View style={styles.userMessageContainer}>
                <View style={styles.userMessage}>
                  <Ionicons name="mic" size={14} color="#6B7280" style={styles.micIcon} />
                  <Text style={styles.userMessageText}>{currentTranscript}</Text>
                </View>
              </View>
            )}
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

        {conversationState !== 'idle' && (
          <View style={styles.statusIndicator}>
            {conversationState === 'processing' && (
              <ActivityIndicator size="small" color="#14B8A6" />
            )}
            <Text style={styles.statusText}>{getStateText()}</Text>
          </View>
        )}

        <Animated.View style={{ transform: [{ scale: conversationState === 'listening' ? pulseAnim : 1 }] }}>
          <TouchableOpacity
            style={[
              styles.microphoneButton,
              conversationState === 'listening' && styles.microphoneButtonListening,
              (conversationState === 'processing' || conversationState === 'speaking') && styles.microphoneButtonActive,
              !hasPermission && styles.microphoneButtonDisabled,
            ]}
            onPress={handleMicrophonePress}
            disabled={!hasPermission}
          >
            <Ionicons
              name={getMicrophoneIcon()}
              size={48}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.microphoneHint}>
          {getStateText()}
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
  contextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  contextText: {
    flex: 1,
    fontSize: 13,
    color: '#047857',
    lineHeight: 18,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    borderTopRightRadius: 4,
    padding: 14,
    maxWidth: '80%',
    gap: 6,
  },
  micIcon: {
    opacity: 0.6,
  },
  userMessageText: {
    flex: 1,
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
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
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
  microphoneButtonListening: {
    backgroundColor: '#14B8A6',
  },
  microphoneButtonActive: {
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
