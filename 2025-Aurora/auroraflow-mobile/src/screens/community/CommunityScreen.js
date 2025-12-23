import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { colors, spacing } from '../../constants/theme';

export default function CommunityScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Community 🫂
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Care Circle Community</Text>
          <Text variant="bodyMedium" style={styles.description}>
            Connect with others managing diabetes. Share experiences, celebrate milestones, and support each other.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Coming Soon</Text>
          <Text variant="bodyMedium" style={styles.description}>
            • Post updates{'\n'}
            • Join discussions{'\n'}
            • Connect with mentors{'\n'}
            • Share achievements
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
