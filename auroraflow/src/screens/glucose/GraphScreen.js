import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import glucoseService from '../../services/glucoseService';

const screenWidth = Dimensions.get('window').width;

export default function GraphScreen({ navigation }) {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(7);

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
    }
  };

  // Filter readings for selected time period
  const getFilteredReadings = () => {
    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - selectedDays);

    return readings
      .filter((r) => new Date(r.reading_time) >= cutoffDate)
      .sort((a, b) => new Date(a.reading_time) - new Date(b.reading_time));
  };

  const filteredReadings = getFilteredReadings();

  // Prepare chart data
  const getChartData = () => {
    if (filteredReadings.length === 0) {
      return null;
    }

    const values = filteredReadings.map((r) => parseFloat(r.glucose_level));
    const labels = filteredReadings.map((r) => {
      const date = new Date(r.reading_time);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    // Show fewer labels if too many data points
    const labelInterval = Math.ceil(filteredReadings.length / 6);
    const displayLabels = labels.map((label, index) =>
      index % labelInterval === 0 ? label : ''
    );

    return {
      labels: displayLabels,
      datasets: [
        {
          data: values,
          color: (opacity = 1) => `rgba(123, 44, 191, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  const chartData = getChartData();

  // Calculate statistics
  const getStatistics = () => {
    if (filteredReadings.length === 0) {
      return null;
    }

    const values = filteredReadings.map((r) => parseFloat(r.glucose_level));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    const inRange = values.filter((v) => v >= 70 && v <= 180).length;
    const percentInRange = ((inRange / values.length) * 100).toFixed(0);

    return {
      average: avg.toFixed(1),
      min,
      max,
      percentInRange,
      totalReadings: values.length,
    };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B2CBF" />
      </View>
    );
  }

  if (!chartData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Glucose Graph</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="bar-chart-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Data Available</Text>
          <Text style={styles.emptyText}>
            Add glucose readings to see your trends over time
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Log')}
          >
            <Text style={styles.addButtonText}>Add Reading</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Glucose Graph</Text>
        <Text style={styles.subtitle}>
          {selectedDays} day{selectedDays > 1 ? 's' : ''} • {stats.totalReadings} readings
        </Text>
      </View>

      {/* Time Period Selector */}
      <View style={styles.periodSelector}>
        {[7, 14, 30].map((days) => (
          <TouchableOpacity
            key={days}
            style={[
              styles.periodButton,
              selectedDays === days && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedDays(days)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedDays === days && styles.periodButtonTextActive,
              ]}
            >
              {days}D
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>{stats.average}</Text>
          <Text style={styles.statUnit}>mg/dL</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>In Range</Text>
          <Text style={styles.statValue}>{stats.percentInRange}%</Text>
          <Text style={styles.statUnit}>70-180</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Low/High</Text>
          <Text style={styles.statValueSmall}>
            {stats.min} / {stats.max}
          </Text>
          <Text style={styles.statUnit}>mg/dL</Text>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Glucose Levels Over Time</Text>

        {/* Target Range Indicators */}
        <View style={styles.rangeIndicators}>
          <View style={styles.rangeIndicator}>
            <View style={[styles.rangeColor, { backgroundColor: '#FEE2E2' }]} />
            <Text style={styles.rangeLabel}>High (&gt;180)</Text>
          </View>
          <View style={styles.rangeIndicator}>
            <View style={[styles.rangeColor, { backgroundColor: '#D1FAE5' }]} />
            <Text style={styles.rangeLabel}>Target (70-180)</Text>
          </View>
          <View style={styles.rangeIndicator}>
            <View style={[styles.rangeColor, { backgroundColor: '#FEF3C7' }]} />
            <Text style={styles.rangeLabel}>Low (&lt;70)</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <LineChart
            data={chartData}
            width={Math.max(screenWidth - 40, filteredReadings.length * 50)}
            height={280}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(123, 44, 191, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#7B2CBF',
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: '#E5E7EB',
              },
            }}
            bezier
            style={styles.chart}
            segments={5}
            yAxisSuffix=""
            yAxisInterval={1}
            fromZero={false}
          />
        </ScrollView>

        {/* Target Range Line Legend */}
        <View style={styles.targetRangeInfo}>
          <Text style={styles.targetRangeText}>
            Target Range: 70-180 mg/dL
          </Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Understanding Your Graph</Text>
        <Text style={styles.infoText}>
          • Green zone (70-180 mg/dL) is your target range
        </Text>
        <Text style={styles.infoText}>
          • Yellow zone indicates readings that need attention
        </Text>
        <Text style={styles.infoText}>
          • Red zone indicates readings requiring immediate action
        </Text>
        <Text style={styles.infoText}>
          • Aim for at least 70% of readings in target range
        </Text>
      </View>
    </ScrollView>
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
  periodSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#7B2CBF',
    borderColor: '#7B2CBF',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7B2CBF',
  },
  statValueSmall: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7B2CBF',
  },
  statUnit: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  rangeIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  rangeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
  },
  rangeLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  targetRangeInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  targetRangeText: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 20,
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
