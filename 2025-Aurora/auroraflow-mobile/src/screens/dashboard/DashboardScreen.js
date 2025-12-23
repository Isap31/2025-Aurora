import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing } from '../../constants/theme';

export default function DashboardScreen() {
  const { user, isGuest } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to AuroraFlow! 👋
      </Text>

      {isGuest && (
        <Card style={styles.guestCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.guestTitle}>
              You're in Guest Mode
            </Text>
            <Text variant="bodyMedium" style={styles.guestText}>
              Your data is stored locally only. Create an account to save your progress to the cloud!
            </Text>
            <Button
              mode="contained"
              style={styles.createAccountButton}
              onPress={() => {/* TODO: Navigate to signup */}}
            >
              Create Account
            </Button>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Dashboard</Text>
          <Text variant="bodyMedium" style={styles.description}>
            Track your glucose levels, meals, and exercise all in one place.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Quick Actions</Text>
          <View style={styles.actions}>
            <Button mode="contained" style={styles.actionButton}>
              Log Glucose
            </Button>
            <Button mode="contained" style={styles.actionButton}>
              Log Meal
            </Button>
            <Button mode="contained" style={styles.actionButton}>
              Log Exercise
            </Button>
          </View>
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
  guestCard: {
    marginBottom: spacing.lg,
    backgroundColor: '#F3E8FF',
  },
  guestTitle: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  guestText: {
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  createAccountButton: {
    marginTop: spacing.sm,
  },
  card: {
    marginBottom: spacing.lg,
  },
  description: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  actions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});
