import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import authService from '../../services/authService';
import glucoseService from '../../services/glucoseService';

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentGlucose, setRecentGlucose] = useState(null);
  const [todayStats, setTodayStats] = useState({
    meals: 0,
    exercise: 0,
    readings: 0,
    sleep: 'Good',
  });
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadDashboardData();
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadDashboardData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      // Load recent glucose reading
      const readings = await glucoseService.getAllReadings();
      if (readings && readings.length > 0) {
        setRecentGlucose(readings[0]);

        // Count today's readings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayReadings = readings.filter(r => {
          const readingDate = new Date(r.timestamp);
          readingDate.setHours(0, 0, 0, 0);
          return readingDate.getTime() === today.getTime();
        });
        setTodayStats(prev => ({ ...prev, readings: todayReadings.length }));
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRefreshInsights = () => {
    // Placeholder for daily information generation
    console.log('Refreshing daily insights...');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const glucoseCategory = recentGlucose
    ? glucoseService.getGlucoseCategory(recentGlucose.value)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header with Logo and Glucose */}
          <LinearGradient
            colors={['#8B5CF6', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerTop}>
              <Text style={styles.logo}>AuroraFlow</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="person-circle" size={36} color="#FFF" />
              </TouchableOpacity>
            </View>

            {recentGlucose && (
              <View style={styles.headerGlucose}>
                <Text style={styles.headerGlucoseLabel}>Latest Reading</Text>
                <Text style={styles.headerGlucoseValue}>
                  {recentGlucose.value} <Text style={styles.headerGlucoseUnit}>mg/dL</Text>
                </Text>
              </View>
            )}
          </LinearGradient>

          <View style={styles.content}>
            {/* Personalized Greeting Bubble */}
            <View style={styles.greetingBubble}>
              <LinearGradient
                colors={['#F0ABFC', '#C084FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.greetingGradient}
              >
                <Ionicons name="sunny" size={32} color="#FFF" />
                <Text style={styles.greetingText}>
                  {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}!
                </Text>
              </LinearGradient>
            </View>

            {/* User Profile Summary */}
            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <Ionicons name="person" size={24} color="#8B5CF6" />
                <Text style={styles.profileTitle}>Your Profile</Text>
              </View>
              <View style={styles.profileGrid}>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Age</Text>
                  <Text style={styles.profileValue}>28</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Gender</Text>
                  <Text style={styles.profileValue}>Female</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Diabetes Type</Text>
                  <Text style={styles.profileValue}>Type 1</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Height</Text>
                  <Text style={styles.profileValue}>5'6"</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Weight</Text>
                  <Text style={styles.profileValue}>135 lbs</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Sleep Quality</Text>
                  <Text style={styles.profileValue}>Good 😊</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Stress Level</Text>
                  <Text style={styles.profileValue}>Low ✨</Text>
                </View>
              </View>
            </View>

            {/* Daily Information Generation */}
            <View style={styles.dailyInfoCard}>
              <View style={styles.dailyInfoHeader}>
                <View style={styles.dailyInfoTitleRow}>
                  <Ionicons name="sparkles" size={24} color="#F59E0B" />
                  <Text style={styles.dailyInfoTitle}>Daily Information Generation</Text>
                </View>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={handleRefreshInsights}
                >
                  <Ionicons name="refresh" size={20} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
              <Text style={styles.dailyInfoText}>
                Based on your recent activity, your glucose levels are stable. Keep maintaining your current routine! 💙
              </Text>
            </View>

            {/* Quick Actions Grid */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => navigation.navigate('LogGlucose')}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="water" size={40} color="#FFF" />
                  <Text style={styles.quickActionText}>Log Glucose</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => console.log('Log Meal')}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="restaurant" size={40} color="#FFF" />
                  <Text style={styles.quickActionText}>Log Meal</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => console.log('Exercise')}
              >
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="fitness" size={40} color="#FFF" />
                  <Text style={styles.quickActionText}>Exercise</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => navigation.navigate('Insights')}
              >
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="bulb" size={40} color="#FFF" />
                  <Text style={styles.quickActionText}>Insights</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Aurora Assistant Section */}
            <View style={styles.auroraCard}>
              <LinearGradient
                colors={['#EC4899', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.auroraGradient}
              >
                <View style={styles.auroraHeader}>
                  <Ionicons name="sparkles" size={28} color="#FFF" />
                  <Text style={styles.auroraTitle}>Aurora - your daily assistant</Text>
                </View>
                <Text style={styles.auroraSubtitle}>
                  Ask me anything about your diabetes management!
                </Text>
                <TouchableOpacity
                  style={styles.auroraButton}
                  onPress={() => console.log('Chat with Aurora')}
                >
                  <Text style={styles.auroraButtonText}>Chat with Aurora</Text>
                  <Ionicons name="arrow-forward" size={20} color="#8B5CF6" />
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Today's Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Ionicons name="calendar" size={24} color="#3B82F6" />
                <Text style={styles.summaryTitle}>Today's Summary</Text>
              </View>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <View style={styles.summaryIconBg}>
                    <Ionicons name="restaurant" size={24} color="#10B981" />
                  </View>
                  <Text style={styles.summaryValue}>{todayStats.meals}</Text>
                  <Text style={styles.summaryLabel}>Meals</Text>
                </View>
                <View style={styles.summaryItem}>
                  <View style={styles.summaryIconBg}>
                    <Ionicons name="fitness" size={24} color="#F59E0B" />
                  </View>
                  <Text style={styles.summaryValue}>{todayStats.exercise}</Text>
                  <Text style={styles.summaryLabel}>Exercise</Text>
                </View>
                <View style={styles.summaryItem}>
                  <View style={styles.summaryIconBg}>
                    <Ionicons name="water" size={24} color="#8B5CF6" />
                  </View>
                  <Text style={styles.summaryValue}>{todayStats.readings}</Text>
                  <Text style={styles.summaryLabel}>Readings</Text>
                </View>
                <View style={styles.summaryItem}>
                  <View style={styles.summaryIconBg}>
                    <Ionicons name="moon" size={24} color="#6366F1" />
                  </View>
                  <Text style={styles.summaryValue}>{todayStats.sleep}</Text>
                  <Text style={styles.summaryLabel}>Sleep</Text>
                </View>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerGlucose: {
    alignItems: 'center',
  },
  headerGlucoseLabel: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 4,
  },
  headerGlucoseValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerGlucoseUnit: {
    fontSize: 20,
    fontWeight: 'normal',
  },
  content: {
    padding: 20,
  },
  greetingBubble: {
    marginTop: -20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  greetingGradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  greetingText: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  profileItem: {
    width: '30%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  profileLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  dailyInfoCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  dailyInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyInfoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dailyInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    flex: 1,
  },
  refreshButton: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 8,
  },
  dailyInfoText: {
    fontSize: 16,
    color: '#78350F',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  quickActionButton: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionGradient: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    gap: 12,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  auroraCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  auroraGradient: {
    padding: 24,
  },
  auroraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  auroraTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  auroraSubtitle: {
    fontSize: 16,
    color: '#F3E8FF',
    marginBottom: 16,
  },
  auroraButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  auroraButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryIconBg: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
