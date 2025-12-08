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
  RefreshControl,
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

  // Real data from API
  const [latestGlucose, setLatestGlucose] = useState(null);
  const [weeklyAverage, setWeeklyAverage] = useState(135);
  const [timeInRange, setTimeInRange] = useState(78);
  const [totalLogs, setTotalLogs] = useState(42);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modal visibility states
  const [logGlucoseModalVisible, setLogGlucoseModalVisible] = useState(false);
  const [logMealModalVisible, setLogMealModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [insightsModalVisible, setInsightsModalVisible] = useState(false);
  const [communityModalVisible, setCommunityModalVisible] = useState(false);

  // Modal input states
  const [glucoseValue, setGlucoseValue] = useState('');
  const [glucoseNotes, setGlucoseNotes] = useState('');

  // Daily affirmation state
  const [dailyAffirmation, setDailyAffirmation] = useState('');

  // Set random affirmation on mount
  useEffect(() => {
    setDailyAffirmation(getRandomAffirmation());
    loadDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '☀️' };
    if (hour < 18) return { text: 'Good afternoon', emoji: '🌤️' };
    return { text: 'Good evening', emoji: '🌙' };
  };

  // API Fetch Functions
  const fetchLatestGlucose = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/glucose/recent');
      const data = await response.json();
      if (data && data.length > 0) {
        setLatestGlucose(data[0]);
      }
    } catch (error) {
      console.error('Error fetching glucose:', error);
    }
  };

  const fetchWeeklyStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/glucose/stats?days=7');
      const data = await response.json();
      setWeeklyAverage(Math.round(data.average));
      setTimeInRange(Math.round(data.timeInRange));
      setTotalLogs(data.count);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const loadDashboard = async () => {
    setLoading(true);
    await Promise.all([fetchLatestGlucose(), fetchWeeklyStats()]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  // Helper Functions
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'No recent reading';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });

    return isToday ? `${timeString} today` : `${timeString} on ${date.toLocaleDateString()}`;
  };

  const getGlucoseColorValue = (value) => {
    if (!value) return '#10B981';
    if (value >= 70 && value <= 180) return '#10B981';
    if (value >= 55 && value < 70) return '#F59E0B';
    if (value > 180 && value <= 250) return '#F59E0B';
    return '#EF4444';
  };

  const getGlucoseStatus = (value) => {
    if (!value) return 'No data';
    if (value >= 70 && value <= 180) return 'In range ✓';
    if (value >= 55 && value < 70) return 'Getting low ⚠️';
    if (value > 180 && value <= 250) return 'A bit high ⚠️';
    if (value < 55) return 'Very low! 🚨';
    return 'Very high! 🚨';
  };

  const saveGlucoseReading = async () => {
    if (!glucoseValue) {
      Alert.alert('Error', 'Please enter a glucose reading');
      return;
    }

    const parsedValue = parseInt(glucoseValue);
    if (parsedValue < 20 || parsedValue > 600) {
      Alert.alert('Error', 'Please enter a valid value (20-600 mg/dL)');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/glucose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: parsedValue,
          notes: glucoseNotes,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        Alert.alert('Success! ✅', 'Glucose reading saved');
        setGlucoseValue('');
        setGlucoseNotes('');
        setLogGlucoseModalVisible(false);
        await loadDashboard();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to save reading');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save reading');
    }
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
  const glucoseColor = getGlucoseColor(latestGlucose?.glucose_level);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8B5CF6']}
            tintColor="#8B5CF6"
          />
        }
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

          <View style={[styles.glucoseBadge, { backgroundColor: getGlucoseColorValue(latestGlucose?.glucose_level) }]}>
            <Text style={styles.glucoseHeaderValue}>{latestGlucose?.glucose_level || '--'}</Text>
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
            {latestGlucose?.glucose_level || '--'} <Text style={styles.glucoseCardUnit}>mg/dL</Text>
          </Text>
          <Text style={styles.glucoseTimestamp}>{formatTimestamp(latestGlucose?.reading_time)}</Text>
          <Text style={[styles.glucoseStatus, { color: glucoseColor.statusColor }]}>
            {getGlucoseStatus(latestGlucose?.glucose_level)}
          </Text>
        </View>

        {/* 4. WEEKLY STATS ROW */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="analytics" size={32} color="#8B5CF6" />
            <Text style={styles.statValue}>{weeklyAverage}</Text>
            <Text style={styles.statLabel}>mg/dL</Text>
            <Text style={styles.statSubLabel}>Average</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color="#10B981" />
            <Text style={styles.statValue}>{timeInRange}%</Text>
            <Text style={styles.statLabel}>Time in</Text>
            <Text style={styles.statSubLabel}>Range</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="clipboard" size={32} color="#3B82F6" />
            <Text style={styles.statValue}>{totalLogs}</Text>
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
            onPress={() => navigation.navigate('LogMeal')}
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
            onPress={() => navigation.navigate('LogExercise')}
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

          {/* Care Circle */}
          <Pressable
            onPress={() => setCommunityModalVisible(true)}
            style={({ pressed }) => [
              styles.quickActionButton,
              pressed && styles.quickActionPressed
            ]}
          >
            <LinearGradient
              colors={['#EC4899', '#DB2777']}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>🫂</Text>
              <Text style={styles.quickActionLabel}>Care Circle</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* 6. TODAY'S INSIGHT CARD - HIDDEN FOR COMPACT VIEW */}
        {/* <View style={styles.insightCard}>
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
        </View> */}

        {/* 7. AURORA ASSISTANT TEASER - HIDDEN FOR COMPACT VIEW */}
        {/* <View style={styles.auroraCard}>
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
        </View> */}

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
            value={glucoseValue}
            onChangeText={setGlucoseValue}
          />

          <Text style={styles.modalLabel}>Time</Text>
          <Text style={styles.modalTimeValue}>
            {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </Text>

          <TextInput
            style={[styles.modalInput, styles.notesInput]}
            placeholder="Add any notes about this reading..."
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
            value={glucoseNotes}
            onChangeText={setGlucoseNotes}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setLogGlucoseModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveGlucoseReading}
            >
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

      {/* CARE CIRCLE COMMUNITY MODAL */}
      <Modal
        isVisible={communityModalVisible}
        onBackdropPress={() => setCommunityModalVisible(false)}
        onSwipeComplete={() => setCommunityModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>🫂 Care Circle Community</Text>

            <View style={styles.communityIntro}>
              <Text style={styles.communityIntroText}>
                Welcome to your supportive diabetes community! This is a safe space where
                people with diabetes share experiences, celebrate milestones, ask questions,
                and support each other.
              </Text>
            </View>

            <View style={styles.communityStats}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>12.5K</Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>1.2K</Text>
                <Text style={styles.statLabel}>Online</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>8.9K</Text>
                <Text style={styles.statLabel}>Support given</Text>
              </View>
            </View>

            <Text style={styles.sectionHeader}>Community Topics</Text>

            <View style={styles.topicsGrid}>
              <TouchableOpacity style={[styles.topicButton, { backgroundColor: '#FEF3C7' }]}>
                <Text style={styles.topicIcon}>🏆</Text>
                <Text style={styles.topicText}>Milestones</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.topicButton, { backgroundColor: '#D1FAE5' }]}>
                <Text style={styles.topicIcon}>💪</Text>
                <Text style={styles.topicText}>Exercise</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.topicButton, { backgroundColor: '#DBEAFE' }]}>
                <Text style={styles.topicIcon}>🍽️</Text>
                <Text style={styles.topicText}>Nutrition</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.topicButton, { backgroundColor: '#FCE7F3' }]}>
                <Text style={styles.topicIcon}>💗</Text>
                <Text style={styles.topicText}>Support</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.topicButton, { backgroundColor: '#E0E7FF' }]}>
                <Text style={styles.topicIcon}>💡</Text>
                <Text style={styles.topicText}>Tips & Tricks</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.topicButton, { backgroundColor: '#FED7AA' }]}>
                <Text style={styles.topicIcon}>❓</Text>
                <Text style={styles.topicText}>Q&A</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>Recent Posts</Text>

            <View style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.postAvatar}>
                  <Text style={styles.postAvatarText}>SM</Text>
                </View>
                <View style={styles.postInfo}>
                  <Text style={styles.postAuthor}>Sarah M.</Text>
                  <Text style={styles.postTime}>2h ago</Text>
                </View>
                <View style={styles.postBadge}>
                  <Text style={styles.postBadgeText}>⭐ 30-Day Streak</Text>
                </View>
              </View>
              <Text style={styles.postContent}>
                Just hit my 30-day streak! My pet is so happy and I feel amazing.
                This app has changed my life! 🎉
              </Text>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>❤️ 12</Text>
                <Text style={styles.postStat}>💬 3</Text>
              </View>
            </View>

            <View style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.postAvatar}>
                  <Text style={styles.postAvatarText}>AR</Text>
                </View>
                <View style={styles.postInfo}>
                  <Text style={styles.postAuthor}>Alex R.</Text>
                  <Text style={styles.postTime}>4h ago</Text>
                </View>
                <View style={styles.postBadge}>
                  <Text style={styles.postBadgeText}>⚡ Level 15</Text>
                </View>
              </View>
              <Text style={styles.postContent}>
                Reached Level 15 today! The gamification really keeps me motivated
                to log everything consistently.
              </Text>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>❤️ 8</Text>
                <Text style={styles.postStat}>💬 5</Text>
              </View>
            </View>

            <View style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.postAvatar}>
                  <Text style={styles.postAvatarText}>MG</Text>
                </View>
                <View style={styles.postInfo}>
                  <Text style={styles.postAuthor}>Maria G.</Text>
                  <Text style={styles.postTime}>1d ago</Text>
                </View>
                <View style={styles.postBadge}>
                  <Text style={styles.postBadgeText}>🎯 Time in Range Master</Text>
                </View>
              </View>
              <Text style={styles.postContent}>
                First week with 90%+ time in range! FlowSense AI predictions helped
                me adjust my meal timing perfectly.
              </Text>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>❤️ 15</Text>
                <Text style={styles.postStat}>💬 7</Text>
              </View>
            </View>

            <View style={styles.comingSoonBox}>
              <Text style={styles.comingSoonTitle}>🚀 Coming Soon</Text>
              <Text style={styles.comingSoonText}>
                • Post your own updates{'\n'}
                • Comment on posts{'\n'}
                • Join topic-specific discussions{'\n'}
                • Connect with mentors{'\n'}
                • Private messaging
              </Text>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setCommunityModalVisible(false)}
          >
            <Text style={styles.saveButtonText}>Close</Text>
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
    height: 85,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
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
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7C3AED',
    textAlign: 'center',
  },

  // 3. RECENT GLUCOSE CARD STYLES
  glucoseCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  glucoseCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  glucoseCardValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  glucoseCardUnit: {
    fontSize: 14,
    fontWeight: '600',
  },
  glucoseTimestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 4,
  },
  glucoseStatus: {
    fontSize: 13,
    fontWeight: '600',
  },

  // 4. WEEKLY STATS ROW STYLES
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 8,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
  },

  // 5. QUICK ACTIONS STYLES
  quickActionsContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickActionButton: {
    width: '48%',
    aspectRatio: 1.3,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  quickActionPressed: {
    transform: [{ scale: 0.95 }],
  },
  quickActionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },

  // 6. TODAY'S INSIGHT STYLES
  insightCard: {
    backgroundColor: '#DBEAFE',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  refreshButton: {
    padding: 8,
  },
  refreshIcon: {
    fontSize: 20,
  },

  // 7. AURORA ASSISTANT STYLES
  auroraCard: {
    backgroundColor: '#F3E8FF',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
  },
  auroraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  auroraIcon: {
    fontSize: 28,
  },
  comingSoonBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
  auroraTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  auroraSubtitle: {
    fontSize: 13,
    color: '#8B5CF6',
    lineHeight: 18,
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

  // COMMUNITY MODAL STYLES
  communityIntro: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  communityIntroText: {
    fontSize: 14,
    color: '#4338CA',
    lineHeight: 20,
  },
  communityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 12,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  topicButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topicIcon: {
    fontSize: 24,
  },
  topicText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  postCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  postInfo: {
    flex: 1,
    marginLeft: 12,
  },
  postAuthor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  postTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  postBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  postBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  postContent: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  postStat: {
    fontSize: 13,
    color: '#6B7280',
  },
  comingSoonBox: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
});
