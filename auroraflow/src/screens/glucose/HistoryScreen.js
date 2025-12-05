import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import glucoseService from '../../services/glucoseService';

export default function HistoryScreen({ navigation }) {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayReadings, setTodayReadings] = useState([]);
  const [yesterdayReadings, setYesterdayReadings] = useState([]);

  useEffect(() => {
    loadReadings();
  }, []);

  // Reload when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadReadings();
    });
    return unsubscribe;
  }, [navigation]);

  const loadReadings = async () => {
    try {
      const result = await glucoseService.getReadings();
      const allReadings = result.readings || [];
      setReadings(allReadings);

      // Group readings by today and yesterday
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const todayItems = allReadings.filter(reading => {
        const readingDate = new Date(reading.reading_time);
        return readingDate >= today;
      });

      const yesterdayItems = allReadings.filter(reading => {
        const readingDate = new Date(reading.reading_time);
        return readingDate >= yesterday && readingDate < today;
      });

      setTodayReadings(todayItems);
      setYesterdayReadings(yesterdayItems);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load readings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadReadings();
  }, []);

  const handleDelete = async (id, value, date) => {
    try {
      await glucoseService.deleteReading(id);
      // Remove from local state
      setReadings(readings.filter((r) => r.id !== id));
      setTodayReadings(todayReadings.filter((r) => r.id !== id));
      setYesterdayReadings(yesterdayReadings.filter((r) => r.id !== id));
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to delete reading');
    }
  };

  const renderRightActions = (progress, dragX, item) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => {
          Alert.alert(
            'Delete Reading',
            `Delete reading of ${item.glucose_level} mg/dL?`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => handleDelete(item.id, item.glucose_level, item.reading_time),
              },
            ]
          );
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash-outline" size={28} color="#FFF" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderReading = (item) => {
    const { backgroundColor, textColor, category } = glucoseService.getGlucoseCategory(
      parseFloat(item.glucose_level)
    );
    const readingDate = new Date(item.reading_time);

    return (
      <Swipeable
        key={item.id.toString()}
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
        overshootRight={false}
        rightThreshold={40}
      >
        <View style={[styles.readingCard, { backgroundColor }]}>
          <View style={styles.readingMain}>
            <View style={styles.readingLeft}>
              <Text style={[styles.glucoseValue, { color: textColor }]}>
                {item.glucose_level}
              </Text>
              <Text style={[styles.unitText, { color: textColor }]}>mg/dL</Text>
              <Text style={[styles.categoryText, { color: textColor }]}>
                {category}
              </Text>
            </View>

            <View style={styles.readingRight}>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={16} color="#4B5563" />
                <Text style={styles.timeText}>
                  {readingDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              {item.notes ? (
                <View style={styles.notesContainer}>
                  <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                  <Text style={styles.notesText} numberOfLines={2}>
                    {item.notes}
                  </Text>
                </View>
              ) : null}
            </View>

            <Ionicons name="chevron-back-outline" size={20} color="#9CA3AF" />
          </View>
        </View>
      </Swipeable>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="water-outline" size={80} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No Readings Yet</Text>
      <Text style={styles.emptyText}>
        Start tracking your glucose levels by adding your first reading
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Log')}
      >
        <Text style={styles.addButtonText}>+ Add Reading</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading your readings...</Text>
      </View>
    );
  }

  if (readings.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#8B5CF6', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.title}>Glucose History</Text>
          <Text style={styles.subtitle}>Track your glucose journey</Text>
        </LinearGradient>
        {renderEmpty()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Glucose History</Text>
        <Text style={styles.subtitle}>
          {readings.length} {readings.length === 1 ? 'reading' : 'readings'} total
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8B5CF6"
            colors={['#8B5CF6']}
          />
        }
      >
        {/* Today's Readings */}
        {todayReadings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="sunny" size={24} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Today</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{todayReadings.length}</Text>
              </View>
            </View>
            {todayReadings.map(reading => renderReading(reading))}
          </View>
        )}

        {/* Yesterday's Readings */}
        {yesterdayReadings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="moon" size={24} color="#6B7280" />
              <Text style={styles.sectionTitle}>Yesterday</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{yesterdayReadings.length}</Text>
              </View>
            </View>
            {yesterdayReadings.map(reading => renderReading(reading))}
          </View>
        )}

        {/* Swipe hint */}
        <View style={styles.hintContainer}>
          <Ionicons name="arrow-back" size={16} color="#9CA3AF" />
          <Text style={styles.hintText}>Swipe left to delete</Text>
        </View>
      </ScrollView>
    </View>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  badge: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 32,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  readingCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  readingMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingLeft: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 90,
  },
  glucoseValue: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  unitText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: -2,
    opacity: 0.8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  readingRight: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 6,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
    lineHeight: 20,
  },
  deleteAction: {
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 16,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 17,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 12,
  },
  hintText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 8,
    fontStyle: 'italic',
  },
});
