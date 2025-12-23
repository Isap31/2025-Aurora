import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, accessibility } from '../constants/theme';
import { Colors } from '../constants/Colors';

export default function HealthQuestScreen() {
  const insets = useSafeAreaInsets();
  // Sample data - will connect to backend later
  const userLevel = 12;
  const currentXP = 2450;
  const xpToNextLevel = 4000;
  const xpNeeded = xpToNextLevel - currentXP;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: 20 + insets.top }]}>
        <Text style={styles.headerTitle}>HealthQuest</Text>
        <Text style={styles.headerSubtitle}>Your diabetes management journey</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Level Progress */}
        <View style={styles.card}>
          <View style={styles.levelHeader}>
            <Text style={styles.cardTitle}>HealthQuest Progress</Text>
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>{xpNeeded} XP to next level</Text>
            </View>
          </View>
          <Text style={styles.levelText}>Level {userLevel} • {currentXP.toLocaleString()} XP</Text>

          {/* Progress Bars */}
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>🔥 7-Day Streak</Text>
              <Text style={styles.progressPercent}>85%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '85%', backgroundColor: '#F97316' }]} />
            </View>
          </View>

          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>🎯 Glucose Goals</Text>
              <Text style={styles.progressPercent}>72%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '72%', backgroundColor: '#8B5CF6' }]} />
            </View>
          </View>

          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>⭐ Weekly Challenges</Text>
              <Text style={styles.progressPercent}>90%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '90%', backgroundColor: '#FBBF24' }]} />
            </View>
          </View>

          {/* Recent Badges */}
          <Text style={styles.subsectionTitle}>Recent Badges</Text>
          <View style={styles.badgesRow}>
            <View style={[styles.smallBadge, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.badgeIcon}>🏆</Text>
              <Text style={styles.badgeLabel}>Champion</Text>
            </View>
            <View style={[styles.smallBadge, { backgroundColor: '#E9D5FF' }]}>
              <Text style={styles.badgeIcon}>💜</Text>
              <Text style={styles.badgeLabel}>Consistent</Text>
            </View>
            <View style={[styles.smallBadge, { backgroundColor: '#F3F4F6' }]}>
              <Text style={styles.badgeIcon}>⚡</Text>
              <Text style={styles.badgeLabel}>Power User</Text>
            </View>
          </View>
        </View>

        {/* Weekly Quests */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Quests</Text>

          <View style={styles.questItem}>
            <View style={styles.questHeader}>
              <Text style={styles.questIcon}>🍽️</Text>
              <View style={styles.questInfo}>
                <Text style={styles.questTitle}>Log 21 meals</Text>
                <Text style={styles.questProgress}>18/21</Text>
              </View>
              <Text style={styles.questXP}>⭐ 500</Text>
            </View>
            <View style={styles.questBarContainer}>
              <LinearGradient
                colors={['#8B5CF6', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.questBar, { width: '86%' }]}
              />
            </View>
            <Text style={styles.questPercent}>86%</Text>
          </View>

          <View style={styles.questItem}>
            <View style={styles.questHeader}>
              <Text style={styles.questIcon}>⚡</Text>
              <View style={styles.questInfo}>
                <Text style={styles.questTitle}>Exercise 5 times</Text>
                <Text style={styles.questProgress}>3/5</Text>
              </View>
              <Text style={styles.questXP}>⭐ 300</Text>
            </View>
            <View style={styles.questBarContainer}>
              <LinearGradient
                colors={['#8B5CF6', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.questBar, { width: '60%' }]}
              />
            </View>
            <Text style={styles.questPercent}>60%</Text>
          </View>

          <View style={styles.questItem}>
            <View style={styles.questHeader}>
              <Text style={styles.questIcon}>⭐</Text>
              <View style={styles.questInfo}>
                <Text style={styles.questTitle}>Help 3 community members</Text>
                <Text style={styles.questProgress}>1/3</Text>
              </View>
              <Text style={styles.questXP}>⭐ 200</Text>
            </View>
            <View style={styles.questBarContainer}>
              <LinearGradient
                colors={['#8B5CF6', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.questBar, { width: '33%' }]}
              />
            </View>
            <Text style={styles.questPercent}>33%</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Achievements</Text>

          <View style={styles.achievementsGrid}>
            {/* Streak Master */}
            <View style={styles.achievementCard}>
              <View style={[styles.achievementCardInner, { borderColor: '#F97316' }]}>
                <View style={[styles.achievementIcon, { backgroundColor: '#FED7AA' }]}>
                  <Text style={styles.achievementEmoji}>🔥</Text>
                </View>
                <Text style={styles.achievementTitle}>Streak Master</Text>
                <Text style={styles.achievementDesc}>30-day logging streak</Text>
                <Text style={styles.achievementProgress}>40/30</Text>
                <View style={styles.achievementBarContainer}>
                  <View style={[styles.achievementBar, { width: '100%', backgroundColor: '#F97316' }]} />
                </View>
                <Text style={styles.achievementPercent}>133%</Text>
              </View>
            </View>

            {/* Glucose Guardian */}
            <View style={styles.achievementCard}>
              <View style={[styles.achievementCardInner, { borderColor: '#8B5CF6' }]}>
                <View style={[styles.achievementIcon, { backgroundColor: '#E9D5FF' }]}>
                  <Text style={styles.achievementEmoji}>🎯</Text>
                </View>
                <Text style={styles.achievementTitle}>Glucose Guardian</Text>
                <Text style={styles.achievementDesc}>90% time in range for a week</Text>
                <Text style={styles.achievementProgress}>85/90</Text>
                <View style={styles.achievementBarContainer}>
                  <View style={[styles.achievementBar, { width: '94%', backgroundColor: '#8B5CF6' }]} />
                </View>
                <Text style={styles.achievementPercent}>94%</Text>
              </View>
            </View>

            {/* Pet Parent - EARNED */}
            <View style={styles.achievementCard}>
              <View style={[styles.achievementCardInner, { borderColor: '#FBBF24', backgroundColor: '#FFFBEB' }]}>
                <View style={[styles.achievementIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={styles.achievementEmoji}>⭐</Text>
                </View>
                <Text style={styles.achievementTitle}>Pet Parent</Text>
                <Text style={styles.achievementDesc}>Keep pet happy for 14 days</Text>
                <Text style={styles.earnedBadge}>⭐ Earned!</Text>
              </View>
            </View>

            {/* Health Champion */}
            <View style={styles.achievementCard}>
              <View style={[styles.achievementCardInner, { borderColor: '#F97316' }]}>
                <View style={[styles.achievementIcon, { backgroundColor: '#FED7AA' }]}>
                  <Text style={styles.achievementEmoji}>👑</Text>
                </View>
                <Text style={styles.achievementTitle}>Health Champion</Text>
                <Text style={styles.achievementDesc}>Reach level 15</Text>
                <Text style={styles.achievementProgress}>80/15</Text>
                <View style={styles.achievementBarContainer}>
                  <View style={[styles.achievementBar, { width: '100%', backgroundColor: '#F97316' }]} />
                </View>
                <Text style={styles.achievementPercent}>533%</Text>
              </View>
            </View>

            {/* Consistency King */}
            <View style={styles.achievementCard}>
              <View style={[styles.achievementCardInner, { borderColor: '#3B82F6' }]}>
                <View style={[styles.achievementIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={styles.achievementEmoji}>🛡️</Text>
                </View>
                <Text style={styles.achievementTitle}>Consistency King</Text>
                <Text style={styles.achievementDesc}>Log meals for 21 days straight</Text>
                <Text style={styles.achievementProgress}>57/21</Text>
                <View style={styles.achievementBarContainer}>
                  <View style={[styles.achievementBar, { width: '100%', backgroundColor: '#3B82F6' }]} />
                </View>
                <Text style={styles.achievementPercent}>271%</Text>
              </View>
            </View>

            {/* Power User - EARNED */}
            <View style={styles.achievementCard}>
              <View style={[styles.achievementCardInner, { borderColor: '#FBBF24', backgroundColor: '#FFFBEB' }]}>
                <View style={[styles.achievementIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={styles.achievementEmoji}>⚡</Text>
                </View>
                <Text style={styles.achievementTitle}>Power User</Text>
                <Text style={styles.achievementDesc}>Use all features in one day</Text>
                <Text style={styles.earnedBadge}>⭐ Earned!</Text>
              </View>
            </View>
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
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  xpBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
  },
  levelText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  smallBadge: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
  },
  questItem: {
    marginBottom: 20,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  questIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  questProgress: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  questXP: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FBBF24',
  },
  questBarContainer: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  questBar: {
    height: '100%',
    borderRadius: 4,
  },
  questPercent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    textAlign: 'right',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  achievementCard: {
    flexBasis: '50%',
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  achievementCardInner: {
    backgroundColor: 'white',
    minHeight: accessibility.minimumTouchSize,
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  achievementProgress: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  achievementBarContainer: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  achievementBar: {
    height: '100%',
    borderRadius: 3,
  },
  achievementPercent: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
    textAlign: 'right',
  },
  earnedBadge: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FBBF24',
    marginTop: 4,
  },
});
