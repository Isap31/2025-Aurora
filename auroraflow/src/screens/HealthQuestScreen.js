import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, accessibility } from '../constants/theme';
import { Colors } from '../constants/Colors';

export default function HealthQuestScreen() {
  const insets = useSafeAreaInsets();
  // Sample data - will connect to backend later
  const currentStreak = 7;
  const dailyLogs = 3;
  const dailyGoal = 4;
  const weeklyCheckins = 5;
  const weeklyGoal = 7;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: 20 + insets.top }]}>
        <Text style={styles.headerTitle}>Goals</Text>
        <Text style={styles.headerSubtitle}>Track your progress</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Logging Streak */}
        <View style={styles.card}>
          <View style={styles.goalHeader}>
            <Ionicons name="flame-outline" size={24} color="#374151" />
            <Text style={styles.cardTitle}>Logging Streak</Text>
          </View>
          <Text style={styles.streakText}>{currentStreak} days</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '100%', backgroundColor: '#374151' }]} />
          </View>
        </View>

        {/* Daily Goal */}
        <View style={styles.card}>
          <View style={styles.goalHeader}>
            <Ionicons name="today-outline" size={24} color="#374151" />
            <Text style={styles.cardTitle}>Today's Logs</Text>
          </View>
          <Text style={styles.goalProgress}>{dailyLogs}/{dailyGoal}</Text>
          <Text style={styles.goalLabel}>Daily glucose logs</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${(dailyLogs / dailyGoal) * 100}%`, backgroundColor: '#374151' }]} />
          </View>
        </View>

        {/* Weekly Goal */}
        <View style={styles.card}>
          <View style={styles.goalHeader}>
            <Ionicons name="calendar-outline" size={24} color="#374151" />
            <Text style={styles.cardTitle}>This Week</Text>
          </View>
          <Text style={styles.goalProgress}>{weeklyCheckins}/{weeklyGoal}</Text>
          <Text style={styles.goalLabel}>Weekly check-ins</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${(weeklyCheckins / weeklyGoal) * 100}%`, backgroundColor: '#374151' }]} />
          </View>
        </View>


        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  streakText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  goalProgress: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});
