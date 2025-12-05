import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const DAILY_AFFIRMATIONS = [
  "Great job staying in range today! 🎉",
  "Your morning readings are very consistent! ⭐",
  "Keep up the good work with meal logging! 💪",
  "You're taking great care of yourself today! ❤️",
  "Small steps lead to big changes! 🌟",
  "You're doing better than you think! 💫",
  "Every reading logged is a step toward better health! 📊",
  "Your dedication is inspiring! ✨",
  "Managing diabetes is hard, but you're doing amazing! 🌈",
  "Consistency is key, and you're nailing it! 🔑",
  "Your future self thanks you for today's effort! 🙏",
  "Progress, not perfection! 💜",
  "You're stronger than your highest number! 💪",
  "Taking control one reading at a time! 🎯",
  "Your health journey matters! 🌸",
  "Celebrating your commitment to wellness! 🎊",
  "Every meal logged helps you understand your body better! 🍽️",
  "Exercise is medicine, and you're taking your dose! 🏃",
  "Sleep well tonight - you earned it! 😴",
  "Your glucose doesn't define you, but your effort does! 💖"
];

const getRandomAffirmation = () => {
  const randomIndex = Math.floor(Math.random() * DAILY_AFFIRMATIONS.length);
  return DAILY_AFFIRMATIONS[randomIndex];
};

export default function DashboardScreen({ navigation }) {
  const [userName] = useState('Bridget'); // Mock user name
  const [latestGlucose] = useState(142); // Mock glucose reading
  const [glucoseTimestamp] = useState('2:15 PM today');

  // Modal visibility states
  const [logGlucoseModalVisible, setLogGlucoseModalVisible] = useState(false);
  const [logMealModalVisible, setLogMealModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [insightsModalVisible, setInsightsModalVisible] = useState(false);

  // Daily affirmation state
  const [dailyAffirmation, setDailyAffirmation] = useState('');

  // Set random affirmation on mount
  useEffect(() => {
    setDailyAffirmation(getRandomAffirmation());
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '☀️' };
    if (hour < 18) return { text: 'Good afternoon', emoji: '🌤️' };
    return { text: 'Good evening', emoji: '🌙' };
  };

  const getGlucoseColor = (value) => {
    if (value >= 70 && value <= 180) {
      return {
        bg: '#D1FAE5',
        text: '#059669',
        status: 'In range ✓',
        statusColor: '#10B981'
      };
    } else if ((value >= 55 && value < 70) || (value > 180 && value <= 250)) {
      return {
        bg: '#FEF3C7',
        text: '#D97706',
        status: 'Moderate',
        statusColor: '#F59E0B'
      };
    } else {
      return {
        bg: '#FEE2E2',
        text: '#DC2626',
        status: 'Out of range',
        statusColor: '#EF4444'
      };
    }
  };

  const greeting = getGreeting();
  const glucoseColor = getGlucoseColor(latestGlucose);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* 1. HEADER */}
        <LinearGradient
          colors={['#8B5CF6', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Ionicons name="water" size={24} color="#FFF" />
              <Text style={styles.logoText}>AuroraFlow</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={styles.profileButton}
            >
              <Ionicons name="person-circle" size={36} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.glucoseBadge}>
            <Text style={styles.glucoseHeaderValue}>{latestGlucose}</Text>
            <Text style={styles.glucoseHeaderUnit}>mg/dL</Text>
          </View>
        </LinearGradient>

        {/* 2. PERSONALIZED GREETING CARD */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingText}>
            {greeting.text}, {userName}! {greeting.emoji}
          </Text>
        </View>

        {/* 3. RECENT GLUCOSE CARD */}
        <View style={[styles.glucoseCard, { backgroundColor: glucoseColor.bg }]}>
          <Text style={styles.glucoseCardTitle}>Latest Reading</Text>
          <Text style={[styles.glucoseCardValue, { color: glucoseColor.text }]}>
            {latestGlucose} <Text style={styles.glucoseCardUnit}>mg/dL</Text>
          </Text>
          <Text style={styles.glucoseTimestamp}>{glucoseTimestamp}</Text>
          <Text style={[styles.glucoseStatus, { color: glucoseColor.statusColor }]}>
            {glucoseColor.status}
          </Text>
        </View>

        {/* 4. WEEKLY STATS ROW */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="analytics" size={32} color="#8B5CF6" />
            <Text style={styles.statValue}>135</Text>
            <Text style={styles.statLabel}>mg/dL</Text>
            <Text style={styles.statSubLabel}>Average</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color="#10B981" />
            <Text style={styles.statValue}>78%</Text>
            <Text style={styles.statLabel}>Time in</Text>
            <Text style={styles.statSubLabel}>Range</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="clipboard" size={32} color="#3B82F6" />
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statSubLabel}>Logs</Text>
          </View>
        </View>

        {/* 5. QUICK ACTIONS GRID */}
        <View style={styles.quickActionsContainer}>
          {/* Log Glucose */}
          <Pressable
            onPress={() => setLogGlucoseModalVisible(true)}
            style={({ pressed }) => [
              styles.quickActionButton,
              pressed && styles.quickActionPressed
            ]}
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>🩸</Text>
              <Text style={styles.quickActionLabel}>Log Glucose</Text>
            </LinearGradient>
          </Pressable>

          {/* Log Meal */}
          <Pressable
            onPress={() => setLogMealModalVisible(true)}
            style={({ pressed }) => [
              styles.quickActionButton,
              pressed && styles.quickActionPressed
            ]}
          >
            <LinearGradient
              colors={['#F97316', '#EA580C']}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>🍽️</Text>
              <Text style={styles.quickActionLabel}>Log Meal</Text>
            </LinearGradient>
          </Pressable>

          {/* Exercise */}
          <Pressable
            onPress={() => setExerciseModalVisible(true)}
            style={({ pressed }) => [
              styles.quickActionButton,
              pressed && styles.quickActionPressed
            ]}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>💪</Text>
              <Text style={styles.quickActionLabel}>Exercise</Text>
            </LinearGradient>
          </Pressable>

          {/* FlowSense AI */}
          <Pressable
            onPress={() => setInsightsModalVisible(true)}
            style={({ pressed }) => [
              styles.quickActionButton,
              pressed && styles.quickActionPressed
            ]}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>💡</Text>
              <Text style={styles.quickActionLabel}>FlowSense AI</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* 6. TODAY'S INSIGHT CARD */}
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>💡</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Today's Insight</Text>
            <Text style={styles.insightText}>
              {dailyAffirmation}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setDailyAffirmation(getRandomAffirmation())}
            style={styles.refreshButton}
          >
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* 7. AURORA ASSISTANT TEASER */}
        <View style={styles.auroraCard}>
          <View style={styles.auroraHeader}>
            <Text style={styles.auroraIcon}>🤖</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>
          <Text style={styles.auroraTitle}>Aurora - your daily assistant</Text>
          <Text style={styles.auroraSubtitle}>
            Ask me anything about managing diabetes
          </Text>
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* LOG GLUCOSE MODAL */}
      <Modal
        isVisible={logGlucoseModalVisible}
        onBackdropPress={() => setLogGlucoseModalVisible(false)}
        onSwipeComplete={() => setLogGlucoseModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Log Glucose</Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Enter glucose reading (mg/dL)"
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.modalLabel}>Time</Text>
          <Text style={styles.modalTimeValue}>Now (1:38 PM)</Text>

          <TextInput
            style={[styles.modalInput, styles.notesInput]}
            placeholder="Add any notes about this reading..."
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setLogGlucoseModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>💾 Save Reading</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* LOG MEAL MODAL */}
      <Modal
        isVisible={logMealModalVisible}
        onBackdropPress={() => setLogMealModalVisible(false)}
        onSwipeComplete={() => setLogMealModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Log Meal</Text>

          <Text style={styles.modalLabel}>Meal Name</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g., Grilled Chicken Salad"
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.modalRow}>
            <View style={styles.modalHalfInput}>
              <Text style={styles.modalLabel}>Carbohydrates (g) *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="35"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.modalHint}>Critical for glucose prediction</Text>
            </View>

            <View style={styles.modalHalfInput}>
              <Text style={styles.modalLabel}>Calories</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="450"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <Text style={styles.modalLabel}>Time of Meal</Text>
          <Text style={styles.modalTimeValue}>01:38 PM</Text>

          <Text style={styles.modalLabel}>Notes (Optional)</Text>
          <TextInput
            style={[styles.modalInput, styles.notesInput]}
            placeholder="Add any notes about this meal..."
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.aiNote}>
            <Text style={styles.aiNoteText}>
              🤖 AI Integration: Carb content and meal timing are key factors for glucose predictions.
            </Text>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setLogMealModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>💾 Save Meal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* EXERCISE MODAL */}
      <Modal
        isVisible={exerciseModalVisible}
        onBackdropPress={() => setExerciseModalVisible(false)}
        onSwipeComplete={() => setExerciseModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Log Exercise</Text>

          <Text style={styles.modalLabel}>Activity Type</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g., Walking, Running, Yoga"
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.modalRow}>
            <View style={styles.modalHalfInput}>
              <Text style={styles.modalLabel}>Duration (minutes)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="30"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.modalHalfInput}>
              <Text style={styles.modalLabel}>Intensity</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Low/Medium/High"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <Text style={styles.modalLabel}>Notes (Optional)</Text>
          <TextInput
            style={[styles.modalInput, styles.notesInput]}
            placeholder="How did you feel during exercise?"
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setExerciseModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>💾 Save Exercise</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FLOWSENSE AI MODAL */}
      <Modal
        isVisible={insightsModalVisible}
        onBackdropPress={() => setInsightsModalVisible(false)}
        onSwipeComplete={() => setInsightsModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>🤖 FlowSense AI</Text>

          <Text style={styles.comingSoonText}>
            Your AI assistant is coming soon!
          </Text>

          <Text style={styles.comingSoonDescription}>
            Aurora will help you understand your glucose patterns, predict future readings,
            and give personalized insights based on your unique data.
          </Text>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setInsightsModalVisible(false)}
          >
            <Text style={styles.saveButtonText}>Can't Wait!</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // 1. HEADER STYLES
  header: {
    height: 100,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  profileButton: {
    padding: 4,
  },
  glucoseBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  glucoseHeaderValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  glucoseHeaderUnit: {
    fontSize: 14,
    color: '#FFF',
    marginLeft: 4,
    opacity: 0.9,
  },

  // 2. GREETING CARD STYLES
  greetingCard: {
    backgroundColor: '#F3E8FF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7C3AED',
    textAlign: 'center',
  },

  // 3. RECENT GLUCOSE CARD STYLES
  glucoseCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  glucoseCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  glucoseCardValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  glucoseCardUnit: {
    fontSize: 24,
    fontWeight: '600',
  },
  glucoseTimestamp: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  glucoseStatus: {
    fontSize: 18,
    fontWeight: '600',
  },

  // 4. WEEKLY STATS ROW STYLES
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  // 5. QUICK ACTIONS STYLES
  quickActionsContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionPressed: {
    transform: [{ scale: 0.95 }],
  },
  quickActionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  quickActionIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },

  // 6. TODAY'S INSIGHT STYLES
  insightCard: {
    backgroundColor: '#DBEAFE',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },

  // 7. AURORA ASSISTANT STYLES
  auroraCard: {
    backgroundColor: '#F3E8FF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  auroraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  auroraIcon: {
    fontSize: 32,
  },
  comingSoonBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  auroraTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  auroraSubtitle: {
    fontSize: 14,
    color: '#8B5CF6',
    lineHeight: 20,
  },

  // BOTTOM PADDING
  bottomPadding: {
    height: 20,
  },

  // MODAL STYLES
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  modalTimeValue: {
    fontSize: 16,
    color: '#1F2937',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalHalfInput: {
    width: '48%',
  },
  modalHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: -8,
    marginBottom: 12,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  aiNote: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  aiNoteText: {
    fontSize: 14,
    color: '#1E40AF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  comingSoonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
});
