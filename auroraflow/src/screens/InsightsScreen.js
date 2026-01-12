import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import InsightsEngine from '../services/InsightsEngine';

export default function InsightsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const generatedInsights = await InsightsEngine.generateInsights('user-1', 14);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInsights();
    setRefreshing(false);
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'alert':
        return {
          bg: '#FEF3C7',
          border: '#F59E0B',
          text: '#92400E',
          icon: '#F59E0B'
        };
      case 'success':
        return {
          bg: '#D1FAE5',
          border: '#10B981',
          text: '#065F46',
          icon: '#10B981'
        };
      case 'info':
      default:
        return {
          bg: '#DBEAFE',
          border: '#3B82F6',
          text: '#1E40AF',
          icon: '#3B82F6'
        };
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: { bg: '#FEE2E2', text: '#991B1B' },
      medium: { bg: '#FEF3C7', text: '#92400E' },
      low: { bg: '#E5E7EB', text: '#374151' }
    };
    return colors[priority] || colors.low;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { paddingTop: 10 + insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Smart Insights</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#14B8A6" />
          <Text style={styles.loadingText}>Analyzing your patterns...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: 10 + insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Insights</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#14B8A6']}
            tintColor="#14B8A6"
          />
        }
      >
        <View style={styles.introCard}>
          <Text style={styles.introIcon}>🧠</Text>
          <Text style={styles.introTitle}>AI-Powered Pattern Detection</Text>
          <Text style={styles.introText}>
            We analyze your glucose logs to find patterns and provide personalized recommendations.
            The more you log, the better your insights become!
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {insights.length === 1 && insights[0].title === 'Keep Logging'
            ? 'Getting Started'
            : `${insights.length} Insight${insights.length !== 1 ? 's' : ''} Found`}
        </Text>

        {insights.map((insight, index) => {
          const colors = getInsightColor(insight.type);
          const priorityColors = getPriorityBadge(insight.priority);

          return (
            <View
              key={index}
              style={[
                styles.insightCard,
                { backgroundColor: colors.bg, borderColor: colors.border }
              ]}
            >
              <View style={styles.insightHeader}>
                <View style={styles.insightTitleRow}>
                  <Text style={styles.insightIcon}>{insight.icon}</Text>
                  <Text style={[styles.insightTitle, { color: colors.text }]}>
                    {insight.title}
                  </Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: priorityColors.bg }]}>
                  <Text style={[styles.priorityText, { color: priorityColors.text }]}>
                    {insight.priority.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={[styles.insightMessage, { color: colors.text }]}>
                {insight.message}
              </Text>

              {insight.actionable && (
                <TouchableOpacity
                  style={[styles.actionButton, { borderColor: colors.border }]}
                  onPress={() => {
                    // Navigate to relevant screen based on insight type
                    if (insight.title.includes('Logging')) {
                      navigation.navigate('Dashboard');
                    }
                  }}
                >
                  <Text style={[styles.actionButtonText, { color: colors.text }]}>
                    Take Action
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.text} />
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={24} color="#14B8A6" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Pro Tip</Text>
            <Text style={styles.tipText}>
              Log your glucose at consistent times each day for the most accurate pattern detection.
              Include notes about meals and activities to get even better insights!
            </Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  introIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  introText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  insightMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#14B8A6',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F766E',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#115E59',
    lineHeight: 18,
  },
});
