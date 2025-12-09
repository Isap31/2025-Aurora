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

export default function LogMealScreen({ navigation }) {
  const [mealName, setMealName] = useState('');
  const [carbs, setCarbs] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [mealType, setMealType] = useState('');

  const commonFoods = [
    { name: 'Banana (medium)', carbs: 27, calories: 105, icon: '🍌' },
    { name: 'Apple (medium)', carbs: 25, calories: 95, icon: '🍎' },
    { name: 'Bread (1 slice)', carbs: 15, calories: 80, icon: '🍞' },
    { name: 'Rice (1 cup)', carbs: 45, calories: 206, icon: '🍚' },
    { name: 'Pasta (1 cup)', carbs: 43, calories: 221, icon: '🍝' },
    { name: 'Oatmeal (1 cup)', carbs: 27, calories: 166, icon: '🥣' },
  ];

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅', color: '#FEF3C7' },
    { id: 'lunch', label: 'Lunch', icon: '☀️', color: '#DBEAFE' },
    { id: 'dinner', label: 'Dinner', icon: '🌙', color: '#E9D5FF' },
    { id: 'snack', label: 'Snack', icon: '🍿', color: '#D1FAE5' },
  ];

  const addCommonFood = (food) => {
    setMealName(food.name);
    setCarbs(food.carbs.toString());
    setCalories(food.calories.toString());
  };

  const estimateGlucoseImpact = () => {
    const carbCount = parseInt(carbs) || 0;
    if (carbCount === 0) return null;

    const estimatedRise = carbCount * 3.5;
    const currentGlucose = 142;
    const predicted = Math.round(currentGlucose + estimatedRise);

    return {
      rise: Math.round(estimatedRise),
      predicted: predicted,
      inRange: predicted >= 70 && predicted <= 180,
    };
  };

  const saveMeal = async () => {
    if (!mealName || !carbs) {
      Alert.alert('Missing Info', 'Please enter meal name and carb count');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal_name: mealName,
          carbohydrates: parseInt(carbs),
          calories: calories ? parseInt(calories) : null,
          meal_type: mealType,
          notes: notes,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        Alert.alert('Success! 🎉', 'Meal logged successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to log meal');
    }
  };

  const impact = estimateGlucoseImpact();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F97316', '#FB923C']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log Meal</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <View style={styles.mealTypeGrid}>
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.mealTypeButton,
                  { backgroundColor: type.color },
                  mealType === type.id && styles.mealTypeButtonActive,
                ]}
                onPress={() => setMealType(type.id)}
              >
                <Text style={styles.mealTypeIcon}>{type.icon}</Text>
                <Text style={styles.mealTypeLabel}>{type.label}</Text>
                {mealType === type.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" style={styles.checkmark} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.commonFoodsRow}>
              {commonFoods.map((food, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.commonFoodCard}
                  onPress={() => addCommonFood(food)}
                >
                  <Text style={styles.commonFoodIcon}>{food.icon}</Text>
                  <Text style={styles.commonFoodName}>{food.name}</Text>
                  <Text style={styles.commonFoodCarbs}>{food.carbs}g carbs</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Meal Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Grilled chicken with rice"
              value={mealName}
              onChangeText={setMealName}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Carbs (g) *</Text>
              <TextInput
                style={styles.input}
                placeholder="45"
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Calories</Text>
              <TextInput
                style={styles.input}
                placeholder="350"
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any additional details..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.aiHelper}>
          <View style={styles.aiHelperHeader}>
            <Ionicons name="bulb" size={20} color="#F59E0B" />
            <Text style={styles.aiHelperTitle}>AI Carb Estimator</Text>
          </View>
          <Text style={styles.aiHelperText}>
            💡 Tip: A typical meal contains 45-60g carbs. Use our quick add suggestions or search our database of 100,000+ foods for accurate counts.
          </Text>
        </View>

        {impact && (
          <View style={[styles.predictionCard, { borderLeftColor: impact.inRange ? '#10B981' : '#F59E0B' }]}>
            <Text style={styles.predictionTitle}>📊 Predicted Glucose Impact</Text>
            <View style={styles.predictionContent}>
              <View style={styles.predictionItem}>
                <Text style={styles.predictionLabel}>Estimated Rise</Text>
                <Text style={styles.predictionValue}>+{impact.rise} mg/dL</Text>
              </View>
              <View style={styles.predictionDivider} />
              <View style={styles.predictionItem}>
                <Text style={styles.predictionLabel}>Predicted Level</Text>
                <Text style={[styles.predictionValue, { color: impact.inRange ? '#10B981' : '#F59E0B' }]}>
                  {impact.predicted} mg/dL
                </Text>
              </View>
            </View>
            <Text style={styles.predictionNote}>
              {impact.inRange
                ? '✅ Predicted to stay in range (70-180)'
                : '⚠️ May go above target range'}
            </Text>
          </View>
        )}

        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoButton}>
            <Ionicons name="camera" size={32} color="#6B7280" />
            <Text style={styles.photoButtonText}>Add Photo</Text>
            <Text style={styles.comingSoon}>Coming Soon</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveMeal}
        >
          <Text style={styles.saveButtonText}>Save Meal</Text>
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
  mealTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mealTypeButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  mealTypeButtonActive: {
    borderColor: '#10B981',
  },
  mealTypeIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  mealTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  commonFoodsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  commonFoodCard: {
    width: 120,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  commonFoodIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  commonFoodName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  commonFoodCarbs: {
    fontSize: 11,
    color: '#6B7280',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
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
  row: {
    flexDirection: 'row',
  },
  aiHelper: {
    backgroundColor: '#FFFBEB',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  aiHelperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiHelperTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginLeft: 8,
  },
  aiHelperText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
  },
  predictionCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  predictionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionItem: {
    flex: 1,
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  predictionDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  predictionNote: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  photoSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  photoButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
  },
  comingSoon: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
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
    backgroundColor: '#F97316',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
