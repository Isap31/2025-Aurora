import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function CommunityScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#EC4899', '#F472B6']} style={styles.header}>
        <Text style={styles.headerTitle}>Care Circle</Text>
        <Text style={styles.headerSubtitle}>Your diabetes community</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <Ionicons name="people" size={32} color="#EC4899" />
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>Welcome to Care Circle!</Text>
              <Text style={styles.welcomeSubtitle}>
                Connect with 12.5K+ people managing diabetes
              </Text>
            </View>
          </View>
          <Text style={styles.welcomeDescription}>
            This is a safe space where people with diabetes share experiences,
            celebrate milestones, ask questions, and support each other.
            You're never alone on this journey! 💜
          </Text>
        </View>

        {/* Community Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color="#EC4899" />
            <Text style={styles.statNumber}>12.5K</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="chatbubbles" size={24} color="#10B981" />
            <Text style={styles.statNumber}>1.2K</Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="heart" size={24} color="#F97316" />
            <Text style={styles.statNumber}>8.9K</Text>
            <Text style={styles.statLabel}>Support given</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search topics, posts, people..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Topics Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Topics</Text>
          <View style={styles.topicsGrid}>
            <TouchableOpacity style={[styles.topicCard, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.topicIcon}>🏆</Text>
              <Text style={styles.topicName}>Milestones</Text>
              <Text style={styles.topicCount}>2.4K posts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.topicCard, { backgroundColor: '#D1FAE5' }]}>
              <Text style={styles.topicIcon}>💪</Text>
              <Text style={styles.topicName}>Exercise</Text>
              <Text style={styles.topicCount}>1.8K posts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.topicCard, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.topicIcon}>🍽️</Text>
              <Text style={styles.topicName}>Nutrition</Text>
              <Text style={styles.topicCount}>3.2K posts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.topicCard, { backgroundColor: '#FCE7F3' }]}>
              <Text style={styles.topicIcon}>💗</Text>
              <Text style={styles.topicName}>Support</Text>
              <Text style={styles.topicCount}>4.1K posts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.topicCard, { backgroundColor: '#E0E7FF' }]}>
              <Text style={styles.topicIcon}>💡</Text>
              <Text style={styles.topicName}>Tips & Tricks</Text>
              <Text style={styles.topicCount}>1.5K posts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.topicCard, { backgroundColor: '#FED7AA' }]}>
              <Text style={styles.topicIcon}>❓</Text>
              <Text style={styles.topicName}>Q&A</Text>
              <Text style={styles.topicCount}>2.9K posts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Posts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Posts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Post 1 */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>SM</Text>
              </View>
              <View style={styles.postInfo}>
                <Text style={styles.postAuthor}>Sarah M.</Text>
                <Text style={styles.postTime}>2h ago • Milestones</Text>
              </View>
              <View style={styles.postBadge}>
                <Text style={styles.postBadgeText}>⭐ 30-Day Streak</Text>
              </View>
            </View>
            <Text style={styles.postContent}>
              Just hit my 30-day streak! My virtual pet is so happy and I feel amazing.
              This app has completely changed my relationship with diabetes management.
              Thank you to this community for the constant encouragement! 🎉
            </Text>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={20} color="#6B7280" />
                <Text style={styles.actionText}>12</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                <Text style={styles.actionText}>3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Post 2 */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={[styles.postAvatar, { backgroundColor: '#3B82F6' }]}>
                <Text style={styles.postAvatarText}>AR</Text>
              </View>
              <View style={styles.postInfo}>
                <Text style={styles.postAuthor}>Alex R.</Text>
                <Text style={styles.postTime}>4h ago • Exercise</Text>
              </View>
              <View style={styles.postBadge}>
                <Text style={styles.postBadgeText}>⚡ Level 15</Text>
              </View>
            </View>
            <Text style={styles.postContent}>
              Reached Level 15 today! The gamification in AuroraFlow really keeps me
              motivated to log everything consistently. Who else is crushing their goals? 💪
            </Text>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={20} color="#6B7280" />
                <Text style={styles.actionText}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                <Text style={styles.actionText}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Post 3 */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={[styles.postAvatar, { backgroundColor: '#10B981' }]}>
                <Text style={styles.postAvatarText}>MG</Text>
              </View>
              <View style={styles.postInfo}>
                <Text style={styles.postAuthor}>Maria G.</Text>
                <Text style={styles.postTime}>1d ago • Tips & Tricks</Text>
              </View>
              <View style={styles.postBadge}>
                <Text style={styles.postBadgeText}>🎯 Time in Range Master</Text>
              </View>
            </View>
            <Text style={styles.postContent}>
              First week with 90%+ time in range! The AI predictions really helped me
              adjust my meal timing perfectly. Pro tip: Test 2 hours after eating to
              see your peak, not just before meals! 📊
            </Text>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={20} color="#6B7280" />
                <Text style={styles.actionText}>15</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                <Text style={styles.actionText}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Coming Soon */}
        <View style={styles.comingSoonCard}>
          <Ionicons name="star" size={32} color="#8B5CF6" />
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            • Post your own updates{'\n'}
            • Comment on posts{'\n'}
            • Follow other members{'\n'}
            • Private messaging{'\n'}
            • Topic-based groups
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient colors={['#EC4899', '#F472B6']} style={styles.fabGradient}>
          <Ionicons name="add" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  scrollView: {
    flex: 1,
  },
  welcomeCard: {
    backgroundColor: '#FCE7F3',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EC4899',
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    flex: 1,
    marginLeft: 12,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#831843',
    marginBottom: 2,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#9F1239',
  },
  welcomeDescription: {
    fontSize: 14,
    color: '#831843',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EC4899',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  topicIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  topicName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  topicCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  postCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  postInfo: {
    flex: 1,
    marginLeft: 12,
  },
  postAuthor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  postBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  postBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  postContent: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  comingSoonCard: {
    backgroundColor: '#EDE9FE',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B21B6',
    marginTop: 12,
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#6B21A8',
    lineHeight: 24,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
