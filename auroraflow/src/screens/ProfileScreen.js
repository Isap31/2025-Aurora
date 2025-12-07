import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => Alert.alert('Logged out', 'Demo: Would navigate to login')
        },
      ]
    );
  };

  const showComingSoon = (feature) => {
    Alert.alert('Coming Soon', `${feature} feature is in development!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header with Profile Picture */}
        <LinearGradient
          colors={['#8B5CF6', '#3B82F6']}
          style={styles.header}
        >
          <View style={styles.profilePicture}>
            <Text style={styles.profileInitials}>BT</Text>
          </View>
          <Text style={styles.userName}>Bridget Thompson</Text>
          <View style={styles.diabetesBadge}>
            <Text style={styles.diabetesBadgeText}>Type 1 Diabetes</Text>
          </View>
          <Text style={styles.memberSince}>Member since May 2024</Text>
        </LinearGradient>

        {/* Personal Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>👤</Text>
              <View>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>34 years old</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⚧️</Text>
              <View>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>Female</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📏</Text>
              <View>
                <Text style={styles.infoLabel}>Height</Text>
                <Text style={styles.infoValue}>165 cm (5'5")</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⚖️</Text>
              <View>
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>68 kg (150 lbs)</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📊</Text>
              <View>
                <Text style={styles.infoLabel}>BMI</Text>
                <Text style={styles.infoValue}>24.9 (Healthy)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Health Metrics Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Metrics</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>😴</Text>
              <View>
                <Text style={styles.infoLabel}>Sleep Quality</Text>
                <Text style={styles.infoValue}>7/10</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>😰</Text>
              <View>
                <Text style={styles.infoLabel}>Stress Level</Text>
                <Text style={styles.infoValue}>3/10 (Low)</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>💧</Text>
              <View>
                <Text style={styles.infoLabel}>Hydration</Text>
                <Text style={styles.infoValue}>Good</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🚶</Text>
              <View>
                <Text style={styles.infoLabel}>Daily Steps</Text>
                <Text style={styles.infoValue}>8,500 avg</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Diabetes Management Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Diabetes Management</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>🎯</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Target Range</Text>
              <Text style={styles.settingValue}>70-180 mg/dL</Text>
            </View>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>⏰</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Testing Frequency</Text>
              <Text style={styles.settingValue}>6x daily</Text>
            </View>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>💊</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Insulin Type</Text>
              <Text style={styles.settingValue}>Rapid + Long-acting</Text>
            </View>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>📅</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Last A1C</Text>
              <Text style={styles.settingValue}>6.8% (3 months ago)</Text>
            </View>
          </View>
        </View>

        {/* Settings Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => showComingSoon('Notifications')}
          >
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => showComingSoon('Theme & Display')}
          >
            <Text style={styles.settingIcon}>🎨</Text>
            <Text style={styles.settingLabel}>Theme & Display</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => showComingSoon('Units')}
          >
            <Text style={styles.settingIcon}>📊</Text>
            <Text style={styles.settingLabel}>Units (mg/dL)</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => showComingSoon('Privacy & Security')}
          >
            <Text style={styles.settingIcon}>🔒</Text>
            <Text style={styles.settingLabel}>Privacy & Security</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => showComingSoon('About')}
          >
            <Text style={styles.settingIcon}>ℹ️</Text>
            <Text style={styles.settingLabel}>About AuroraFlow</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Support Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Support</Text>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => showComingSoon('Help & Support')}
          >
            <Text style={styles.settingIcon}>💬</Text>
            <Text style={styles.settingLabel}>Help & Support</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => showComingSoon('Contact Us')}
          >
            <Text style={styles.settingIcon}>📧</Text>
            <Text style={styles.settingLabel}>Contact Us</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => showComingSoon('Rate the App')}
          >
            <Text style={styles.settingIcon}>⭐</Text>
            <Text style={styles.settingLabel}>Rate the App</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  diabetesBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  diabetesBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  memberSince: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#D1D5DB',
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
