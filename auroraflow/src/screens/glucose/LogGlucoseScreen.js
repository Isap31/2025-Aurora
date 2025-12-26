import React, { useState, useEffect } from 'react';
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
  Animated,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
  const [showSuccess, setShowSuccess] = useState(false);

  const scaleAnim = useState(new Animated.Value(1))[0];
  const successAnim = useState(new Animated.Value(0))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Get color feedback based on glucose value
  const getValueColor = () => {
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue)) {
      return {
        backgroundColor: '#F3F4F6',
        textColor: '#9CA3AF',
        borderColor: '#E5E7EB',
      };
    }

    const { backgroundColor, textColor } = glucoseService.getGlucoseCategory(numValue);
    return { backgroundColor, textColor, borderColor: textColor };
  };

  const getEncouragingMessage = () => {
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue)) return '';

    const { category } = glucoseService.getGlucoseCategory(numValue);

    if (category === 'Normal') {
      return "Great! You're in your target range! 🎉";
    } else if (category === 'Low' || category === 'Very Low') {
      return "Low reading - consider a snack 🍎";
    } else if (category === 'High' || category === 'Very High') {
      return "High reading - stay hydrated 💧";
    }
    return '';
  };

  const handleValueChange = (text) => {
    setValue(text);
    // Pulse animation when typing
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
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

  const showSuccessAnimation = () => {
    setShowSuccess(true);
    Animated.sequence([
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccess(false);
    });
  };

  const validateAndSave = async () => {
    // Validate glucose value
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue)) {
      Alert.alert('Oops!', 'Please enter a valid glucose value 😊');
      return;
    }

    if (numValue < 20 || numValue > 600) {
      Alert.alert(
        'Out of Range',
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

      // Show success animation
      showSuccessAnimation();

      // Clear form after a delay
      setTimeout(() => {
        setValue('');
        setNotes('');
        setDate(new Date());
        setTime(new Date());
        navigation.navigate('Dashboard');
      }, 2000);
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#14B8A6', '#0D9488']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={28} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Log Reading</Text>
              <View style={styles.placeholder} />
            </View>
          </LinearGradient>

          <View style={styles.content}>
            {/* Glucose Value Input */}
            <Animated.View
              style={[
                styles.valueCard,
                {
                  backgroundColor: colors.backgroundColor,
                  borderColor: colors.borderColor,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.valueHeader}>
                <Ionicons name="water" size={32} color={colors.textColor} />
                <Text style={[styles.valueLabel, { color: colors.textColor }]}>
                  Glucose Level
                </Text>
              </View>
              <View style={styles.valueInputContainer}>
                <TextInput
                  style={[
                    styles.valueInput,
                    { color: colors.textColor },
                  ]}
                  value={value}
                  onChangeText={handleValueChange}
                  placeholder="000"
                  placeholderTextColor="#D1D5DB"
                  keyboardType="numeric"
                  maxLength={3}
                  autoFocus
                />
                <Text style={[styles.unitText, { color: colors.textColor }]}>
                  mg/dL
                </Text>
              </View>
              {category ? (
                <View style={styles.categoryContainer}>
                  <Text
                    style={[
                      styles.categoryBadge,
                      { color: colors.textColor },
                    ]}
                  >
                    {category}
                  </Text>
                  {getEncouragingMessage() ? (
                    <Text style={styles.encouragingText}>
                      {getEncouragingMessage()}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <Text style={styles.promptText}>
                  Enter your glucose reading
                </Text>
              )}
            </Animated.View>

            {/* Date and Time */}
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeItem}>
                <View style={styles.dateTimeHeader}>
                  <Ionicons name="calendar" size={20} color="#14B8A6" />
                  <Text style={styles.dateTimeLabel}>Date</Text>
                </View>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateTimeText}>
                    {date.toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
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

              <View style={styles.dateTimeItem}>
                <View style={styles.dateTimeHeader}>
                  <Ionicons name="time" size={20} color="#14B8A6" />
                  <Text style={styles.dateTimeLabel}>Time</Text>
                </View>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.dateTimeText}>
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
            </View>

            {/* Notes Input */}
            <View style={styles.notesCard}>
              <View style={styles.notesHeader}>
                <Ionicons name="document-text" size={20} color="#6B7280" />
                <Text style={styles.notesLabel}>Notes (Optional)</Text>
              </View>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="How are you feeling? Any notes..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Save Button with Gradient */}
            <TouchableOpacity
              style={styles.saveButtonContainer}
              onPress={validateAndSave}
              disabled={loading || !value}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  loading || !value
                    ? ['#D1D5DB', '#9CA3AF']
                    : ['#14B8A6', '#0D9488']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButton}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                    <Text style={styles.saveButtonText}>
                      Save Reading
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Range Guide */}
            <View style={styles.rangeGuide}>
              <Text style={styles.rangeTitle}>📊 Target Ranges</Text>
              <View style={styles.rangeList}>
                <View style={styles.rangeItem}>
                  <View style={[styles.rangeDot, { backgroundColor: '#DC2626' }]} />
                  <Text style={styles.rangeText}>Very Low: &lt;55</Text>
                </View>
                <View style={styles.rangeItem}>
                  <View style={[styles.rangeDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.rangeText}>Low: 55-69</Text>
                </View>
                <View style={styles.rangeItem}>
                  <View style={[styles.rangeDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.rangeText}>Normal: 70-180</Text>
                </View>
                <View style={styles.rangeItem}>
                  <View style={[styles.rangeDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.rangeText}>High: 181-250</Text>
                </View>
                <View style={styles.rangeItem}>
                  <View style={[styles.rangeDot, { backgroundColor: '#DC2626' }]} />
                  <Text style={styles.rangeText}>Very High: &gt;250</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Success Overlay */}
      {showSuccess && (
        <Animated.View
          style={[
            styles.successOverlay,
            {
              opacity: successAnim,
              transform: [
                {
                  scale: successAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.successContent}>
            <Ionicons name="checkmark-circle" size={80} color="#10B981" />
            <Text style={styles.successTitle}>Logged Successfully! 🎉</Text>
            <Text style={styles.successMessage}>
              {value} mg/dL - {category}
            </Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 44,
  },
  content: {
    padding: 20,
  },
  valueCard: {
    borderRadius: 24,
    padding: 32,
    marginTop: -10,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  valueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  valueLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  valueInputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  valueInput: {
    fontSize: 80,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 200,
    padding: 0,
  },
  unitText: {
    fontSize: 28,
    fontWeight: '600',
    marginLeft: 8,
  },
  categoryContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  categoryBadge: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  encouragingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  promptText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  dateTimeItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dateTimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dateTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  dateTimeButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  notesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 80,
  },
  saveButtonContainer: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#14B8A6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rangeGuide: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
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
  rangeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  rangeList: {
    gap: 12,
  },
  rangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rangeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  rangeText: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 15,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 20,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});
