import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AuroraChatScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi! I\'m Aurora, your diabetes care assistant. How can I help you today?',
      sender: 'aurora',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response (replace with Claude API call)
    setTimeout(() => {
      const aiResponse = generateResponse(inputText);
      const auroraMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'aurora',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, auroraMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (userInput) => {
    const input = userInput.toLowerCase();

    // Simple response logic (replace with Claude API)
    if (input.includes('glucose') || input.includes('blood sugar')) {
      return 'Based on your recent readings, your glucose levels have been trending well. Keep logging your meals and monitoring regularly!';
    } else if (input.includes('meal') || input.includes('food')) {
      return 'Remember to count your carbs and log your meals. This helps me understand your patterns better. Would you like some meal suggestions?';
    } else if (input.includes('exercise') || input.includes('workout')) {
      return 'Exercise is great for glucose management! Make sure to check your levels before and after. Stay hydrated and carry fast-acting carbs.';
    } else if (input.includes('help')) {
      return 'I can help you with:\n• Understanding your glucose patterns\n• Meal and exercise recommendations\n• Answering diabetes management questions\n\nWhat would you like to know?';
    } else {
      return 'I\'m here to help with your diabetes management. Feel free to ask about your glucose readings, meals, exercise, or any diabetes-related questions!';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#14B8A6', '#0D9488']}
        style={[styles.header, { paddingTop: 20 + insets.top }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Aurora Chat</Text>
            <Text style={styles.headerSubtitle}>Your AI Care Assistant</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('AuroraCall')}>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userBubble : styles.auroraBubble,
              ]}
            >
              {message.sender === 'aurora' && (
                <View style={styles.auroraAvatar}>
                  <Ionicons name="star-outline" size={16} color="#14B8A6" />
                </View>
              )}
              <View
                style={[
                  styles.bubbleContent,
                  message.sender === 'user' ? styles.userBubbleContent : styles.auroraBubbleContent,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === 'user' ? styles.userMessageText : styles.auroraMessageText,
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    message.sender === 'user' ? styles.userMessageTime : styles.auroraMessageTime,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageBubble, styles.auroraBubble]}>
              <View style={styles.auroraAvatar}>
                <Ionicons name="star-outline" size={16} color="#14B8A6" />
              </View>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? '#FFFFFF' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  auroraBubble: {
    alignSelf: 'flex-start',
  },
  auroraAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  bubbleContent: {
    borderRadius: 16,
    padding: 12,
  },
  userBubbleContent: {
    backgroundColor: '#14B8A6',
    borderBottomRightRadius: 4,
  },
  auroraBubbleContent: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  auroraMessageText: {
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255,255,255,0.8)',
  },
  auroraMessageTime: {
    color: '#9CA3AF',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#14B8A6',
    opacity: 0.6,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});
