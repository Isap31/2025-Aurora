import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { colors, spacing } from '../../constants/theme';

export default function GoalsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Goals 🎯
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Set Your Health Goals</Text>
          <Text variant="bodyMedium" style={styles.description}>
            Create personalized goals for glucose management, exercise, and nutrition.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Suggested Goals</Text>
          <Text variant="bodyMedium" style={styles.description}>
            • Maintain 70% time in range{'\n'}
            • Log glucose 4 times daily{'\n'}
            • Exercise 30 min, 3x weekly{'\n'}
            • Track all meals
          </Text>
          <Button mode="contained" style={styles.button}>
            Set Your Goals
          </Button>
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
  button: {
    marginTop: spacing.md,
  },
});
