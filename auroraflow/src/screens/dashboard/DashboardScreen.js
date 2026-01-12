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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, accessibility } from '../../constants/theme';
import authService from '../../services/authService';
import { Colors } from '../../constants/Colors';

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
  const insets = useSafeAreaInsets();
  const [userName] = useState('Caitlin'); // Mock user name

  // Real data from API
  const [latestGlucose, setLatestGlucose] = useState(null);
  const [weeklyAverage, setWeeklyAverage] = useState(135);
  const [timeInRange, setTimeInRange] = useState(78);
  const [totalLogs, setTotalLogs] = useState(42);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestBannerDismissed, setGuestBannerDismissed] = useState(false);

  // Today's Insights data
  const [todayGlucoseCount, setTodayGlucoseCount] = useState(0);
  const [todayGlucoseLatest, setTodayGlucoseLatest] = useState(null);
  const [todayMealsCount, setTodayMealsCount] = useState(0);
  const [todayTotalCarbs, setTodayTotalCarbs] = useState(0);
  const [todayExerciseCount, setTodayExerciseCount] = useState(0);
  const [todayExerciseDuration, setTodayExerciseDuration] = useState(0);

  // Modal visibility states
  const [logGlucoseModalVisible, setLogGlucoseModalVisible] = useState(false);
  const [logMealModalVisible, setLogMealModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [insightsModalVisible, setInsightsModalVisible] = useState(false);
  const [communityModalVisible, setCommunityModalVisible] = useState(false);
  const [budgetMealsModalVisible, setBudgetMealsModalVisible] = useState(false);

  // Modal input states
  const [glucoseValue, setGlucoseValue] = useState('');
  const [glucoseNotes, setGlucoseNotes] = useState('');
  const [weeklyBudget, setWeeklyBudget] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [householdSize, setHouseholdSize] = useState('1');
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);
  const [mealRecommendations, setMealRecommendations] = useState(null);
  const [mealError, setMealError] = useState(null);

  // Daily affirmation state
  const [dailyAffirmation, setDailyAffirmation] = useState('');

  // Set random affirmation on mount and check guest mode
  useEffect(() => {
    setDailyAffirmation(getRandomAffirmation());
    loadDashboard();
    checkGuestMode();
  }, []);

  const checkGuestMode = async () => {
    const guestMode = await authService.isGuestMode();
    setIsGuest(guestMode);
  };

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

  const fetchTodayInsights = async () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    try {
      // Fetch today's glucose readings
      const glucoseResponse = await fetch('http://localhost:3000/api/glucose');
      const glucoseData = await glucoseResponse.json();
      if (Array.isArray(glucoseData)) {
        const todayGlucose = glucoseData.filter(reading => {
          const readingDate = new Date(reading.reading_time);
          return readingDate >= startOfDay && readingDate <= endOfDay;
        });
        setTodayGlucoseCount(todayGlucose.length);
        if (todayGlucose.length > 0) {
          setTodayGlucoseLatest(todayGlucose[0].glucose_level);
        }
      }

      // Fetch today's meals
      const mealsResponse = await fetch('http://localhost:3000/api/meals');
      const mealsData = await mealsResponse.json();
      if (Array.isArray(mealsData)) {
        const todayMeals = mealsData.filter(meal => {
          const mealDate = new Date(meal.timestamp);
          return mealDate >= startOfDay && mealDate <= endOfDay;
        });
        setTodayMealsCount(todayMeals.length);
        const totalCarbs = todayMeals.reduce((sum, meal) => sum + (meal.carbohydrates || 0), 0);
        setTodayTotalCarbs(totalCarbs);
      }

      // Fetch today's exercise
      const exerciseResponse = await fetch('http://localhost:3000/api/exercises');
      const exerciseData = await exerciseResponse.json();
      if (Array.isArray(exerciseData)) {
        const todayExercise = exerciseData.filter(exercise => {
          const exerciseDate = new Date(exercise.timestamp);
          return exerciseDate >= startOfDay && exerciseDate <= endOfDay;
        });
        setTodayExerciseCount(todayExercise.length);
        const totalDuration = todayExercise.reduce((sum, exercise) => sum + (exercise.duration || 0), 0);
        setTodayExerciseDuration(totalDuration);
      }
    } catch (error) {
      console.error('Error fetching today\'s insights:', error);
    }
  };

  const loadDashboard = async () => {
    setLoading(true);
    await Promise.all([fetchLatestGlucose(), fetchWeeklyStats(), fetchTodayInsights()]);
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

  // Real-time glucose status functions
  const getGlucoseStatusColor = (value) => {
    if (isNaN(value)) return { bg: '#F3F4F6', border: '#E5E7EB', text: '#6B7280' };
    if (value < 70) return { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' };
    if (value > 180) return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' };
    return { bg: '#D1FAE5', border: '#10B981', text: '#065F46' };
  };

  const getGlucoseStatusIcon = (value) => {
    if (isNaN(value)) return 'help-circle';
    if (value < 70) return 'alert-circle';
    if (value > 180) return 'warning';
    return 'checkmark-circle';
  };

  const getGlucoseStatusText = (value) => {
    if (isNaN(value)) return 'Enter glucose value';
    if (value < 70) return '⚠️ Low Blood Sugar';
    if (value > 180) return '⚠️ High Blood Sugar';
    return '✅ In Target Range';
  };

  const getGlucoseStatusAdvice = (value) => {
    if (isNaN(value)) return 'Target: 70-180 mg/dL';
    if (value < 54) return 'Very low - treat immediately with fast-acting carbs!';
    if (value < 70) return 'Treat with 15g fast-acting carbs and recheck in 15 min';
    if (value > 250) return 'Very high - check ketones and contact your doctor';
    if (value > 180) return 'High - review recent meals and activity';
    return 'Great! Your glucose is in the healthy range';
  };

  const saveGlucoseReading = async () => {
    if (!glucoseValue) {
      Alert.alert('Required', 'Please enter a glucose value');
      return;
    }

    const parsedValue = parseInt(glucoseValue);
    if (isNaN(parsedValue) || parsedValue < 20 || parsedValue > 600) {
      Alert.alert('Invalid Value', 'Please enter a valid glucose reading (20-600 mg/dL)');
      return;
    }

    // Create reading object
    const newReading = {
      glucose_value: parsedValue,
      timestamp: new Date().toISOString(),
      notes: glucoseNotes || null,
    };

    // Update latest glucose immediately (optimistic update)
    setLatestGlucose(newReading);

    // Clear form and close modal
    setGlucoseValue('');
    setGlucoseNotes('');
    setLogGlucoseModalVisible(false);

    // Save to database
    try {
      const response = await fetch('http://localhost:3000/api/glucose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: parsedValue,
          timestamp: newReading.timestamp,
          notes: glucoseNotes || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save reading');
      }

      const savedReading = await response.json();
      console.log('Glucose reading saved to database:', savedReading);

      // Refresh dashboard data to get updated stats
      await loadDashboard();

      // Show success message
      Alert.alert('Success! 🎉', `Glucose reading saved: ${parsedValue} mg/dL\n+10 XP earned!`);
    } catch (error) {
      console.error('Error saving glucose reading:', error);
      Alert.alert(
        'Save Failed',
        'Could not save to database. Your reading was saved locally and will sync when connection is restored.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleFindMeals = async () => {
    if (!weeklyBudget) {
      Alert.alert('Required', 'Please enter your weekly food budget');
      return;
    }

    setIsLoadingMeals(true);
    setMealRecommendations(null);
    setMealError(null);

    try {
      // Fetch user's recent glucose average
      let glucoseAverage = null;
      try {
        const glucoseResponse = await fetch('http://localhost:3000/api/glucose');
        const glucoseData = await glucoseResponse.json();
        const readingsArray = glucoseData.readings || glucoseData;

        if (readingsArray.length > 0) {
          const recentReadings = readingsArray.slice(0, 7); // Last 7 readings
          const sum = recentReadings.reduce((acc, r) => acc + (r.glucose_level || 0), 0);
          glucoseAverage = Math.round(sum / recentReadings.length);
        }
      } catch (error) {
        console.log('Could not fetch glucose data, continuing without it');
      }

      // Build the prompt for Claude
      const prompt = `You are a diabetes nutrition advisor. The user has a weekly food budget of $${weeklyBudget}${zipCode ? ` and lives in zip code ${zipCode}` : ''}. Their household size is ${householdSize} ${householdSize === '1' ? 'person' : 'people'}.${glucoseAverage ? ` Their recent glucose average is ${glucoseAverage} mg/dL.` : ''}

Based on this information, suggest 5 affordable, diabetes-friendly meals. For each meal, provide:
1. Meal name
2. Estimated cost per serving
3. Why it's good for glucose control (brief, 1 sentence)
4. Best store to buy ingredients (Walmart, Aldi, Lidl, or ethnic grocery stores)

Format your response EXACTLY like this example:

MEAL 1: [Name]
Cost: $[X.XX] per serving
Good for glucose: [One sentence explanation]
Where to shop: [Store name]

MEAL 2: [Name]
Cost: $[X.XX] per serving
Good for glucose: [One sentence explanation]
Where to shop: [Store name]

Keep the total weekly cost under $${weeklyBudget}. Be specific and practical.`;

      // Call Claude API
      const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;

      if (!apiKey) {
        throw new Error('API key not configured. Please add EXPO_PUBLIC_ANTHROPIC_API_KEY to your .env file');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get meal recommendations');
      }

      const data = await response.json();
      const claudeResponse = data.content[0].text;

      // Parse the response into structured data
      const meals = parseMealRecommendations(claudeResponse);

      setMealRecommendations(meals);
    } catch (error) {
      console.error('Error getting meal recommendations:', error);
      setMealError(error.message || 'Failed to get meal recommendations. Please try again.');
    } finally {
      setIsLoadingMeals(false);
    }
  };

  const parseMealRecommendations = (text) => {
    const meals = [];
    const mealBlocks = text.split(/MEAL \d+:/i).filter(block => block.trim());

    mealBlocks.forEach((block, index) => {
      const lines = block.trim().split('\n');
      const meal = {
        id: index + 1,
        name: '',
        cost: '',
        reason: '',
        store: '',
      };

      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('Cost:')) {
          meal.cost = trimmedLine.replace('Cost:', '').trim();
        } else if (trimmedLine.startsWith('Good for glucose:')) {
          meal.reason = trimmedLine.replace('Good for glucose:', '').trim();
        } else if (trimmedLine.startsWith('Where to shop:')) {
          meal.store = trimmedLine.replace('Where to shop:', '').trim();
        } else if (!trimmedLine.startsWith('Cost:') && !trimmedLine.startsWith('Good for glucose:') && !trimmedLine.startsWith('Where to shop:') && trimmedLine.length > 0) {
          if (!meal.name) {
            meal.name = trimmedLine;
          }
        }
      });

      if (meal.name) {
        meals.push(meal);
      }
    });

    return meals;
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
            colors={['#374151']}
            tintColor="#374151"
          />
        }
      >
        {/* 1. HEADER */}
        <View style={[styles.header, { paddingTop: 10 + insets.top }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Ionicons name="water" size={24} color={Colors.text.header} />
              <Text style={styles.logoText}>AuroraFlow</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate('AuroraCall')}
                style={styles.callButton}
              >
                <Ionicons name="call" size={22} color={Colors.text.header} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={styles.profileButton}
              >
                <Ionicons name="person-circle" size={36} color={Colors.text.header} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.glucoseBadge}>
            <Text style={styles.glucoseHeaderValue}>{latestGlucose?.glucose_level || '--'}</Text>
            <Text style={styles.glucoseHeaderUnit}>mg/dL</Text>
          </View>
        </View>

        {/* 2. PERSONALIZED GREETING CARD */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingText}>
            {greeting.text}, {userName}!
          </Text>
        </View>

        {/* 2.5 GUEST MODE BANNER */}
        {isGuest && !guestBannerDismissed && (
          <View style={styles.guestBanner}>
            <View style={styles.guestBannerContent}>
              <Ionicons name="information-circle" size={24} color="#374151" style={styles.guestBannerIcon} />
              <View style={styles.guestBannerText}>
                <Text style={styles.guestBannerTitle}>You're in Guest Mode</Text>
                <Text style={styles.guestBannerSubtitle}>
                  Your data is stored locally only. Create an account to save your progress to the cloud!
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setGuestBannerDismissed(true)}
                style={styles.guestBannerClose}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.guestBannerButton}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.guestBannerButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 3. RECENT GLUCOSE CARD */}
        <View style={styles.glucoseCard}>
          <Text style={styles.glucoseCardTitle}>Latest Reading</Text>
          <Text style={styles.glucoseCardValue}>
            {latestGlucose?.glucose_level || '--'} <Text style={styles.glucoseCardUnit}>mg/dL</Text>
          </Text>
          <Text style={styles.glucoseTimestamp}>{formatTimestamp(latestGlucose?.reading_time)}</Text>
          <Text style={[
            styles.glucoseStatus,
            latestGlucose?.glucose_level >= 70 && latestGlucose?.glucose_level <= 180 && styles.glucoseStatusInRange
          ]}>
            {getGlucoseStatus(latestGlucose?.glucose_level)}
          </Text>
        </View>

        {/* 4. WEEKLY STATS ROW */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="analytics" size={32} color="#374151" />
            <Text style={styles.statValue}>{weeklyAverage}</Text>
            <Text style={styles.statLabel}>mg/dL</Text>
            <Text style={styles.statSubLabel}>Average</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color="#14B8A6" />
            <Text style={styles.statValue}>{timeInRange}%</Text>
            <Text style={styles.statLabel}>Time in</Text>
            <Text style={styles.statSubLabel}>Range</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="clipboard" size={32} color="#374151" />
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
            <View style={styles.quickActionContent}>
              <Ionicons name="water-outline" size={32} color={Colors.text.header} />
              <Text style={styles.quickActionLabel}>Log Glucose</Text>
            </View>
          </Pressable>

          {/* Log Meal */}
          <Pressable
            onPress={() => navigation.navigate('LogMeal')}
            style={({ pressed }) => [
              styles.quickActionButton,
              pressed && styles.quickActionPressed
            ]}
          >
            <View style={styles.quickActionContent}>
              <Ionicons name="restaurant-outline" size={32} color={Colors.text.header} />
              <Text style={styles.quickActionLabel}>Log Meal</Text>
            </View>
          </Pressable>

          {/* Exercise */}
          <Pressable
            onPress={() => navigation.navigate('LogExercise')}
            style={({ pressed }) => [
              styles.quickActionButton,
              pressed && styles.quickActionPressed
            ]}
          >
            <View style={styles.quickActionContent}>
              <Ionicons name="fitness-outline" size={32} color={Colors.text.header} />
              <Text style={styles.quickActionLabel}>Exercise</Text>
            </View>
          </Pressable>

          {/* Aurora Chat */}
          <Pressable
            onPress={() => navigation.navigate('AuroraChat')}
            style={({ pressed }) => [
              styles.quickActionButton,
              styles.auroraButton,
              pressed && styles.quickActionPressed
            ]}
          >
            <View style={styles.quickActionContent}>
              <Ionicons name="chatbubble-outline" size={32} color="#FFFFFF" />
              <Text style={[styles.quickActionLabel, styles.auroraButtonText]}>Aurora Chat</Text>
            </View>
          </Pressable>
        </View>

        {/* TODAY'S INSIGHTS SECTION */}
        <View style={styles.insightsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Today's Insights</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Insights')}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>Smart Insights</Text>
              <Ionicons name="bulb" size={16} color="#14B8A6" />
            </TouchableOpacity>
          </View>
          <View style={styles.insightsGrid}>
            {/* Glucose Today */}
            <View style={styles.insightCard}>
              <Ionicons name="water-outline" size={28} color="#14B8A6" />
              <Text style={styles.insightNumber}>{todayGlucoseCount}</Text>
              <Text style={styles.insightLabel}>readings</Text>
              {todayGlucoseLatest && (
                <Text style={styles.insightDetail}>Last: {todayGlucoseLatest} mg/dL</Text>
              )}
            </View>

            {/* Meals Today */}
            <View style={styles.insightCard}>
              <Ionicons name="restaurant-outline" size={28} color="#14B8A6" />
              <Text style={styles.insightNumber}>{todayMealsCount}</Text>
              <Text style={styles.insightLabel}>meals</Text>
              {todayTotalCarbs > 0 && (
                <Text style={styles.insightDetail}>~{todayTotalCarbs}g carbs</Text>
              )}
            </View>

            {/* Exercise Today */}
            <View style={styles.insightCard}>
              <Ionicons name="fitness-outline" size={28} color="#14B8A6" />
              <Text style={styles.insightNumber}>{todayExerciseCount}</Text>
              <Text style={styles.insightLabel}>workouts</Text>
              {todayExerciseDuration > 0 && (
                <Text style={styles.insightDetail}>{todayExerciseDuration} min total</Text>
              )}
            </View>
          </View>
        </View>

        {/* BUDGET-FRIENDLY MEALS SECTION */}
        <View style={styles.budgetMealsSection}>
          <Text style={styles.sectionHeader}>Budget-Friendly Meals</Text>
          <TouchableOpacity
            style={styles.budgetMealsCard}
            onPress={() => setBudgetMealsModalVisible(true)}
          >
            <Ionicons name="cart-outline" size={32} color="#374151" style={styles.budgetMealsIcon} />
            <View style={styles.budgetMealsContent}>
              <Text style={styles.budgetMealsTitle}>Meal Ideas For Your Budget</Text>
              <Text style={styles.budgetMealsSubtitle}>Get affordable, diabetes-friendly meal suggestions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
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

          {/* Glucose Input with inline unit */}
          <View style={styles.glucoseInputContainer}>
            <TextInput
              style={styles.glucoseInput}
              placeholder="Enter reading"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
              value={glucoseValue}
              onChangeText={setGlucoseValue}
            />
            <Text style={styles.unitLabel}>mg/dL</Text>
          </View>

          {/* Time Display */}
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={24} color="#6B7280" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.modalLabel}>Time</Text>
              <Text style={styles.modalTimeValue}>
                {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </Text>
            </View>
          </View>

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
              style={[styles.saveButtonPrimary, !glucoseValue && styles.saveButtonDisabled]}
              onPress={saveGlucoseReading}
              disabled={!glucoseValue}
            >
              <Text style={styles.saveButtonText}>Save Reading</Text>
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

      {/* BUDGET MEALS MODAL */}
      <Modal
        isVisible={budgetMealsModalVisible}
        onBackdropPress={() => setBudgetMealsModalVisible(false)}
        onSwipeComplete={() => setBudgetMealsModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Budget Meal Planner</Text>

          {!mealRecommendations && !mealError ? (
            <>
              <Text style={styles.modalLabel}>Weekly Food Budget</Text>
              <View style={styles.budgetInputContainer}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.budgetInput}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                  value={weeklyBudget}
                  onChangeText={setWeeklyBudget}
                />
              </View>

              <Text style={styles.modalLabel}>Zip Code (Optional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter zip code"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
                value={zipCode}
                onChangeText={setZipCode}
                maxLength={5}
              />

              <Text style={styles.modalLabel}>Household Size</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={[styles.dropdownButton, householdSize === '1' && styles.dropdownButtonActive]}
                  onPress={() => setHouseholdSize('1')}
                >
                  <Text style={[styles.dropdownText, householdSize === '1' && styles.dropdownTextActive]}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dropdownButton, householdSize === '2' && styles.dropdownButtonActive]}
                  onPress={() => setHouseholdSize('2')}
                >
                  <Text style={[styles.dropdownText, householdSize === '2' && styles.dropdownTextActive]}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dropdownButton, householdSize === '3-4' && styles.dropdownButtonActive]}
                  onPress={() => setHouseholdSize('3-4')}
                >
                  <Text style={[styles.dropdownText, householdSize === '3-4' && styles.dropdownTextActive]}>3-4</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dropdownButton, householdSize === '5+' && styles.dropdownButtonActive]}
                  onPress={() => setHouseholdSize('5+')}
                >
                  <Text style={[styles.dropdownText, householdSize === '5+' && styles.dropdownTextActive]}>5+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.saveButtonPrimary, isLoadingMeals && styles.saveButtonDisabled]}
                onPress={handleFindMeals}
                disabled={isLoadingMeals}
              >
                {isLoadingMeals ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Find Meals</Text>
                )}
              </TouchableOpacity>
            </>
          ) : mealError ? (
            <View style={styles.placeholderContainer}>
              <Ionicons name="alert-circle-outline" size={64} color="#374151" style={styles.placeholderIcon} />
              <Text style={styles.placeholderTitle}>Oops!</Text>
              <Text style={styles.placeholderText}>{mealError}</Text>
              <TouchableOpacity
                style={styles.saveButtonPrimary}
                onPress={() => {
                  setMealError(null);
                }}
              >
                <Text style={styles.saveButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView style={styles.mealsScrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.mealsHeader}>Your Personalized Meal Plan</Text>
              <Text style={styles.mealsSubheader}>
                Budget-friendly meals tailored for glucose control
              </Text>

              {mealRecommendations && mealRecommendations.map((meal) => (
                <View key={meal.id} style={styles.mealCard}>
                  <View style={styles.mealHeader}>
                    <Text style={styles.mealNumber}>MEAL {meal.id}</Text>
                    <Text style={styles.mealCost}>{meal.cost}</Text>
                  </View>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <View style={styles.mealDetail}>
                    <Ionicons name="nutrition-outline" size={16} color="#6B7280" />
                    <Text style={styles.mealDetailText}>{meal.reason}</Text>
                  </View>
                  <View style={styles.mealDetail}>
                    <Ionicons name="storefront-outline" size={16} color="#6B7280" />
                    <Text style={styles.mealDetailText}>{meal.store}</Text>
                  </View>
                </View>
              ))}

              <View style={{ height: 20 }} />

              <TouchableOpacity
                style={styles.saveButtonPrimary}
                onPress={() => {
                  setMealRecommendations(null);
                  setBudgetMealsModalVisible(false);
                  setWeeklyBudget('');
                  setZipCode('');
                  setHouseholdSize('1');
                }}
              >
                <Text style={styles.saveButtonText}>Close</Text>
              </TouchableOpacity>

              <View style={{ height: 20 }} />
            </ScrollView>
          )}
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
    paddingBottom: spacing.lg,
  },

  // 1. HEADER STYLES
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: 10,
    backgroundColor: '#F9FAFB',
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 8,
  },
  callButton: {
    padding: 4,
  },
  profileButton: {
    padding: 4,
  },
  glucoseBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#374151',
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
    backgroundColor: '#F5F5F5',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },

  // 3. RECENT GLUCOSE CARD STYLES
  glucoseCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
    color: '#1F2937',
    marginBottom: 4,
  },
  glucoseCardUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
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
    color: '#6B7280',
  },
  glucoseStatusInRange: {
    color: '#14B8A6',
  },

  // 4. WEEKLY STATS ROW STYLES
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
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
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.7,
  },
  quickActionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 8,
  },
  auroraButton: {
    backgroundColor: '#14B8A6',
  },
  auroraButtonText: {
    color: '#FFFFFF',
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
    backgroundColor: '#14B8A6',
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
    color: '#14B8A6',
    marginBottom: 4,
  },
  auroraSubtitle: {
    fontSize: 13,
    color: '#14B8A6',
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
  saveButtonWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonPrimary: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#14B8A6',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  // Glucose Modal - New Styles
  glucoseInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  glucoseInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    paddingVertical: 16,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
  },
  statusIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusAdvice: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  timeIcon: {
    fontSize: 24,
    marginRight: 12,
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
    backgroundColor: '#14B8A6',
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

  // GUEST MODE BANNER STYLES
  guestBanner: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  guestBannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  guestBannerIcon: {
    marginRight: 10,
  },
  guestBannerText: {
    flex: 1,
  },
  guestBannerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  guestBannerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  guestBannerClose: {
    padding: 4,
    marginLeft: 8,
  },
  guestBannerButton: {
    backgroundColor: '#14B8A6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  guestBannerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },

  // BUDGET MEALS STYLES
  budgetMealsSection: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  budgetMealsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetMealsIcon: {
    marginRight: 16,
  },
  budgetMealsContent: {
    flex: 1,
  },
  budgetMealsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  budgetMealsSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dollarSign: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 4,
  },
  budgetInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    paddingVertical: 16,
  },
  dropdownContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dropdownButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  dropdownButtonActive: {
    backgroundColor: '#374151',
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  dropdownTextActive: {
    color: '#FFFFFF',
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  placeholderIcon: {
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },

  // MEAL RECOMMENDATIONS STYLES
  mealsScrollView: {
    flex: 1,
  },
  mealsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  mealsSubheader: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  mealCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  mealCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  mealDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mealDetailText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },

  // TODAY'S INSIGHTS STYLES
  insightsSection: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0FDFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#14B8A6',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#14B8A6',
  },
  insightsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  insightCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 115,
    justifyContent: 'center',
  },
  insightNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 2,
  },
  insightLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  insightDetail: {
    fontSize: 11,
    color: '#14B8A6',
    fontWeight: '600',
    textAlign: 'center',
  },
});
