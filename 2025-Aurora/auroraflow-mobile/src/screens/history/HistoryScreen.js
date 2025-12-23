import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { colors, spacing } from '../../constants/theme';

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        History 📊
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Your Health History</Text>
          <Text variant="bodyMedium" style={styles.description}>
            View all your logged glucose readings, meals, and exercise activities.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Recent Activity</Text>
          <Text variant="bodyMedium" style={styles.description}>
            No activities logged yet. Start tracking your health data from the Dashboard.
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
  },
});
