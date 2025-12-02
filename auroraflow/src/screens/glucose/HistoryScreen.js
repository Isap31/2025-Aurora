import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import glucoseService from '../../services/glucoseService';

export default function HistoryScreen({ navigation }) {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      setReadings(result.readings || []);
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

  const handleDelete = (id, value, date) => {
    Alert.alert(
      'Delete Reading',
      `Delete reading of ${value} mg/dL from ${new Date(date).toLocaleDateString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await glucoseService.deleteReading(id);
              // Remove from local state
              setReadings(readings.filter((r) => r.id !== id));
              Alert.alert('Success', 'Reading deleted');
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete reading');
            }
          },
        },
      ]
    );
  };

  const renderReading = ({ item }) => {
    const { backgroundColor, textColor } = glucoseService.getGlucoseCategory(
      parseFloat(item.glucose_level)
    );
    const readingDate = new Date(item.reading_time);

    return (
      <View style={[styles.readingCard, { backgroundColor }]}>
        <View style={styles.readingMain}>
          <View style={styles.readingLeft}>
            <Text style={[styles.glucoseValue, { color: textColor }]}>
              {item.glucose_level}
            </Text>
            <Text style={[styles.unitText, { color: textColor }]}>mg/dL</Text>
          </View>

          <View style={styles.readingRight}>
            <Text style={styles.dateText}>
              {readingDate.toLocaleDateString()}
            </Text>
            <Text style={styles.timeText}>
              {readingDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {item.notes ? (
              <Text style={styles.notesText} numberOfLines={2}>
                {item.notes}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id, item.glucose_level, item.reading_time)}
          >
            <Ionicons name="trash-outline" size={24} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="water-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No Readings Yet</Text>
      <Text style={styles.emptyText}>
        Start tracking your glucose levels by adding your first reading
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Log')}
      >
        <Text style={styles.addButtonText}>Add Reading</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B2CBF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Glucose History</Text>
        <Text style={styles.subtitle}>
          {readings.length} {readings.length === 1 ? 'reading' : 'readings'}
        </Text>
      </View>

      <FlatList
        data={readings}
        renderItem={renderReading}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          readings.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7B2CBF"
            colors={['#7B2CBF']}
          />
        }
      />
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
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  readingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  readingMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingLeft: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 80,
  },
  glucoseValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: -4,
  },
  readingRight: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#7B2CBF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
