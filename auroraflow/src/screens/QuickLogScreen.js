import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, accessibility } from '../constants/theme';

export default function QuickLogScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#14B8A6', '#0D9488']} style={[styles.header, { paddingTop: 20 + insets.top }]}>
        <Text style={styles.headerTitle}>Quick Log</Text>
        <Text style={styles.headerSubtitle}>What would you like to track?</Text>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.logCard, { backgroundColor: '#14B8A6' }]}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.logIcon}>💉</Text>
          <Text style={styles.logTitle}>Log Glucose</Text>
          <Text style={styles.logDescription}>Record your blood sugar reading</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logCard, { backgroundColor: '#14B8A6' }]}
          onPress={() => navigation.navigate('LogMeal')}
        >
          <Text style={styles.logIcon}>🍽️</Text>
          <Text style={styles.logTitle}>Log Meal</Text>
          <Text style={styles.logDescription}>Track what you ate with carb counts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logCard, { backgroundColor: '#14B8A6' }]}
          onPress={() => navigation.navigate('LogExercise')}
        >
          <Text style={styles.logIcon}>💪</Text>
          <Text style={styles.logTitle}>Log Exercise</Text>
          <Text style={styles.logDescription}>Record your physical activity</Text>
        </TouchableOpacity>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            Consistent logging helps FlowSense AI make better predictions and keeps your virtual pet happy!
          </Text>
        </View>
      </View>
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
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  logCard: {
    padding: spacing.lg,
    borderRadius: spacing.md,
    marginBottom: spacing.md,
    minHeight: accessibility.minimumTouchSize,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  logTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  logDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: '#D1FAE5',
    padding: spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  tipIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    lineHeight: 18,
  },
});
