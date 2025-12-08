import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LogExerciseScreen({ navigation }) {
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');
  const [notes, setNotes] = useState('');

  const activityTypes = [
    { id: 'walking', name: 'Walking', icon: '🚶', color: '#D1FAE5', caloriesPerMin: 4 },
    { id: 'running', name: 'Running', icon: '🏃', color: '#FEE2E2', caloriesPerMin: 10 },
    { id: 'cycling', name: 'Cycling', icon: '🚴', color: '#DBEAFE', caloriesPerMin: 8 },
    { id: 'swimming', name: 'Swimming', icon: '🏊', color: '#E0E7FF', caloriesPerMin: 9 },
    { id: 'yoga', name: 'Yoga', icon: '🧘', color: '#FCE7F3', caloriesPerMin: 3 },
    { id: 'strength', name: 'Strength', icon: '💪', color: '#FED7AA', caloriesPerMin: 6 },
    { id: 'sports', name: 'Sports', icon: '⚽', color: '#FEF3C7', caloriesPerMin: 7 },
    { id: 'dance', name: 'Dance', icon: '💃', color: '#E9D5FF', caloriesPerMin: 6 },
  ];

  const intensityLevels = [
    { id: 'light', label: 'Light', icon: '🌤️', multiplier: 0.7 },
    { id: 'moderate', label: 'Moderate', icon: '☀️', multiplier: 1.0 },
    { id: 'vigorous', label: 'Vigorous', icon: '🔥', multiplier: 1.5 },
  ];

  const calculateImpact = () => {
    if (!activityType || !duration || !intensity) return null;

    const selectedActivity = activityTypes.find(a => a.id === activityType);
    const selectedIntensity = intensityLevels.find(i => i.id === intensity);
    const durationMin = parseInt(duration);

    if (!selectedActivity || !selectedIntensity || isNaN(durationMin)) return null;

    const baseCalories = selectedActivity.caloriesPerMin * durationMin;
    const adjustedCalories = Math.round(baseCalories * selectedIntensity.multiplier);

    // Exercise typically lowers glucose by ~1-2 mg/dL per 100 calories burned
    const glucoseReduction = Math.round((adjustedCalories / 100) * 1.5);
    const currentGlucose = 142;
    const predicted = Math.max(70, currentGlucose - glucoseReduction);

    return {
      calories: adjustedCalories,
      glucoseReduction,
      predicted,
      safe: predicted >= 70,
    };
  };

  const saveExercise = async () => {
    if (!activityType || !duration || !intensity) {
      Alert.alert('Missing Info', 'Please select activity type, duration, and intensity');
      return;
    }

    const impact = calculateImpact();

    try {
      const response = await fetch('http://localhost:3000/api/exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_type: activityTypes.find(a => a.id === activityType)?.name,
          duration: parseInt(duration),
          intensity: intensity,
          calories_burned: impact?.calories,
          notes: notes,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        Alert.alert('Success! 💪', 'Exercise logged successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to log exercise');
    }
  };

  const selectedActivity = activityTypes.find(a => a.id === activityType);
  const impact = calculateImpact();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#3B82F6', '#60A5FA']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log Exercise</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {/* Activity Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Type</Text>
          <View style={styles.activityGrid}>
            {activityTypes.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityButton,
                  { backgroundColor: activity.color },
                  activityType === activity.id && styles.activityButtonActive,
                ]}
                onPress={() => setActivityType(activity.id)}
              >
                <Text style={styles.activityIcon}>{activity.icon}</Text>
                <Text style={styles.activityLabel}>{activity.name}</Text>
                {activityType === activity.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" style={styles.checkmark} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durationContainer}>
            <TextInput
              style={styles.durationInput}
              placeholder="30"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
            <Text style={styles.durationUnit}>minutes</Text>
          </View>
        </View>

        {/* Intensity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intensity Level</Text>
          <View style={styles.intensityRow}>
            {intensityLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.intensityButton,
                  intensity === level.id && styles.intensityButtonActive,
                ]}
                onPress={() => setIntensity(level.id)}
              >
                <Text style={styles.intensityIcon}>{level.icon}</Text>
                <Text style={[
                  styles.intensityLabel,
                  intensity === level.id && styles.intensityLabelActive,
                ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Impact Prediction */}
        {impact && (
          <View style={styles.impactCard}>
            <Text style={styles.impactTitle}>💪 Exercise Impact</Text>
            <View style={styles.impactGrid}>
              <View style={styles.impactItem}>
                <Text style={styles.impactIcon}>🔥</Text>
                <Text style={styles.impactValue}>{impact.calories}</Text>
                <Text style={styles.impactLabel}>Calories Burned</Text>
              </View>
              <View style={styles.impactItem}>
                <Text style={styles.impactIcon}>📉</Text>
                <Text style={styles.impactValue}>-{impact.glucoseReduction}</Text>
                <Text style={styles.impactLabel}>Glucose Drop (mg/dL)</Text>
              </View>
              <View style={styles.impactItem}>
                <Text style={styles.impactIcon}>🎯</Text>
                <Text style={[
                  styles.impactValue,
                  { color: impact.safe ? '#10B981' : '#F59E0B' }
                ]}>
                  {impact.predicted}
                </Text>
                <Text style={styles.impactLabel}>Predicted Level</Text>
              </View>
            </View>
            <View style={[styles.impactWarning, { backgroundColor: impact.safe ? '#D1FAE5' : '#FEF3C7' }]}>
              <Text style={styles.impactWarningText}>
                {impact.safe
                  ? '✅ Safe to exercise - glucose predicted to stay in range'
                  : '⚠️ Consider a small snack to prevent low glucose'}
              </Text>
            </View>
          </View>
        )}

        {/* Exercise Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color="#3B82F6" />
            <Text style={styles.tipsTitle}>Exercise Tips</Text>
          </View>
          <Text style={styles.tipsText}>
            • Check glucose before and after exercise{'\n'}
            • Carry fast-acting carbs (glucose tabs, juice){'\n'}
            • Exercise can lower glucose for up to 24 hours{'\n'}
            • Stay hydrated during and after activity{'\n'}
            • Monitor for delayed hypoglycemia
          </Text>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="How did you feel? Any observations..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveExercise}
        >
          <Text style={styles.saveButtonText}>Save Exercise</Text>
        </TouchableOpacity>
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
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  activityButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activityButtonActive: {
    borderColor: '#10B981',
  },
  activityIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  durationInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  durationUnit: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  intensityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  intensityButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  intensityButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  intensityIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  intensityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  intensityLabelActive: {
    color: '#3B82F6',
  },
  impactCard: {
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
  impactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  impactGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  impactItem: {
    flex: 1,
    alignItems: 'center',
  },
  impactIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  impactValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  impactWarning: {
    padding: 12,
    borderRadius: 8,
  },
  impactWarningText: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 18,
    textAlign: 'center',
  },
  tipsCard: {
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginLeft: 8,
  },
  tipsText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 22,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
