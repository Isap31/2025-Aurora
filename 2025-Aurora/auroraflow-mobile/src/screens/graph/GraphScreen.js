import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { colors, spacing } from '../../constants/theme';

export default function GraphScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Graphs 📈
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Visualize Your Data</Text>
          <Text variant="bodyMedium" style={styles.description}>
            Track trends in your glucose levels, meals, and exercise over time.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Available Charts</Text>
          <Text variant="bodyMedium" style={styles.description}>
            • Glucose Trends{'\n'}
            • Time in Range{'\n'}
            • Weekly Averages{'\n'}
            • Exercise Impact{'\n'}
            • Meal Patterns
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.lg,
    color: colors.primary,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: spacing.lg,
  },
  description: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
