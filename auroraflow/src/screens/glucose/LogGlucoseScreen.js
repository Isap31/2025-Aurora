import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import glucoseService from '../../services/glucoseService';

export default function LogGlucoseScreen({ navigation }) {
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get color feedback based on glucose value
  const getValueColor = () => {
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue)) return '#E5E7EB';

    const { backgroundColor, textColor } = glucoseService.getGlucoseCategory(numValue);
    return { backgroundColor, textColor };
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const validateAndSave = async () => {
    // Validate glucose value
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue)) {
      Alert.alert('Invalid Input', 'Please enter a valid glucose value');
      return;
    }

    if (numValue < 20 || numValue > 600) {
      Alert.alert(
        'Invalid Range',
        'Glucose value must be between 20 and 600 mg/dL'
      );
      return;
    }

    setLoading(true);

    try {
      // Combine date and time
      const timestamp = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        0
      );

      // Save reading
      await glucoseService.createReading(
        numValue,
        timestamp.toISOString(),
        notes
      );

      Alert.alert(
        'Success',
        'Glucose reading saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear form
              setValue('');
              setNotes('');
              setDate(new Date());
              setTime(new Date());
              // Navigate to history
              navigation.navigate('History');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save reading');
    } finally {
      setLoading(false);
    }
  };

  const colors = getValueColor();
  const numValue = parseFloat(value);
  const category = !isNaN(numValue) && value
    ? glucoseService.getGlucoseCategory(numValue).category
    : '';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Log Glucose Reading</Text>

        {/* Glucose Value Input */}
        <View
          style={[
            styles.valueContainer,
            { backgroundColor: colors.backgroundColor || '#F3F4F6' },
          ]}
        >
          <Text style={styles.label}>Glucose Level (mg/dL)</Text>
          <TextInput
            style={[
              styles.valueInput,
              { color: colors.textColor || '#1F2937' },
            ]}
            value={value}
            onChangeText={setValue}
            placeholder="Enter value"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={3}
          />
          {category ? (
            <Text
              style={[
                styles.categoryText,
                { color: colors.textColor },
              ]}
            >
              {category}
            </Text>
          ) : null}
        </View>

        {/* Date Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Time Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}
        </View>

        {/* Notes Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about this reading..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            loading && styles.saveButtonDisabled,
          ]}
          onPress={validateAndSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Reading</Text>
          )}
        </TouchableOpacity>

        {/* Range Guide */}
        <View style={styles.rangeGuide}>
          <Text style={styles.rangeTitle}>Target Ranges:</Text>
          <View style={styles.rangeItem}>
            <View style={[styles.rangeDot, { backgroundColor: '#DC2626' }]} />
            <Text style={styles.rangeText}>Very Low: &lt;55 mg/dL</Text>
          </View>
          <View style={styles.rangeItem}>
            <View style={[styles.rangeDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.rangeText}>Low: 55-69 mg/dL</Text>
          </View>
          <View style={styles.rangeItem}>
            <View style={[styles.rangeDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.rangeText}>Normal: 70-180 mg/dL</Text>
          </View>
          <View style={styles.rangeItem}>
            <View style={[styles.rangeDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.rangeText}>High: 181-250 mg/dL</Text>
          </View>
          <View style={styles.rangeItem}>
            <View style={[styles.rangeDot, { backgroundColor: '#DC2626' }]} />
            <Text style={styles.rangeText}>Very High: &gt;250 mg/dL</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 30,
  },
  valueContainer: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  valueInput: {
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 200,
    padding: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  dateButton: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#1F2937',
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: '#7B2CBF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  rangeGuide: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  rangeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  rangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  rangeText: {
    fontSize: 14,
    color: '#4B5563',
  },
});
