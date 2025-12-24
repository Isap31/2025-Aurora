import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const [articleModalVisible, setArticleModalVisible] = useState(false);

  const handleNotifyMe = () => {
    Alert.alert('Thank you!', "We'll notify you when the community launches!");
  };

  const handleTopicPress = (topic) => {
    Alert.alert('Coming Soon', `More ${topic} articles coming soon!`);
  };

  const topics = [
    {
      id: 1,
      title: 'Nutrition',
      icon: 'restaurant-outline',
      description: 'Meal planning & recipes',
    },
    {
      id: 2,
      title: 'Exercise',
      icon: 'fitness-outline',
      description: 'Physical activity tips',
    },
    {
      id: 3,
      title: 'Mental Health',
      icon: 'heart-outline',
      description: 'Stress & wellbeing',
    },
    {
      id: 4,
      title: 'New Diagnosis',
      icon: 'information-circle-outline',
      description: 'Getting started guide',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: 20 + insets.top }]}>
        <Text style={styles.headerTitle}>Care Circle</Text>
        <Text style={styles.headerSubtitle}>Resources & Support</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* FEATURED ARTICLE CARD */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Featured Article</Text>
          <TouchableOpacity
            style={styles.articleCard}
            onPress={() => setArticleModalVisible(true)}
          >
            <View style={styles.articleHeader}>
              <Ionicons name="document-text-outline" size={24} color="#374151" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.articleTitle}>
                  5 Tips for Managing Glucose on a Budget
                </Text>
                <Text style={styles.articlePreview}>
                  Eating healthy with diabetes doesn't have to break the bank...
                </Text>
                <Text style={styles.readTime}>3 min read</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>

        {/* TOPICS SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Browse Topics</Text>
          <View style={styles.topicsGrid}>
            {topics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={styles.topicCard}
                onPress={() => handleTopicPress(topic.title)}
              >
                <Ionicons name={topic.icon} size={32} color="#374151" />
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription}>{topic.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* COMMUNITY SECTION */}
        <View style={styles.communitySection}>
          <View style={styles.communityCard}>
            <Ionicons name="people-outline" size={48} color="#6B7280" style={styles.communityIcon} />
            <Text style={styles.communityTitle}>Join the Conversation</Text>
            <Text style={styles.communityDescription}>
              Community forums launching 2025. Connect with others managing diabetes, share experiences, and get support.
            </Text>
            <TouchableOpacity style={styles.notifyButton} onPress={handleNotifyMe}>
              <Text style={styles.notifyButtonText}>Get Notified</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ARTICLE MODAL */}
      <Modal
        isVisible={articleModalVisible}
        onBackdropPress={() => setArticleModalVisible(false)}
        onSwipeComplete={() => setArticleModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>5 Tips for Managing Glucose on a Budget</Text>

          <ScrollView style={styles.articleContent}>
            <Text style={styles.articleText}>
              Managing diabetes doesn't have to be expensive. Here are five practical tips to help you maintain healthy glucose levels while staying within your budget:
            </Text>

            <Text style={styles.articleSubheading}>1. Plan Your Meals</Text>
            <Text style={styles.articleText}>
              Planning meals ahead helps you buy only what you need and reduces impulse purchases. Make a weekly menu and shopping list before heading to the store.
            </Text>

            <Text style={styles.articleSubheading}>2. Buy Seasonal Produce</Text>
            <Text style={styles.articleText}>
              Seasonal fruits and vegetables are often more affordable and fresher. Visit local farmers markets for great deals on produce.
            </Text>

            <Text style={styles.articleSubheading}>3. Choose Whole Grains</Text>
            <Text style={styles.articleText}>
              Whole grains like brown rice, oats, and whole wheat pasta are budget-friendly and help stabilize blood sugar levels.
            </Text>

            <Text style={styles.articleSubheading}>4. Cook at Home</Text>
            <Text style={styles.articleText}>
              Preparing meals at home gives you control over portions and ingredients while saving money compared to eating out.
            </Text>

            <Text style={styles.articleSubheading}>5. Use Budget Meal Planning Tools</Text>
            <Text style={styles.articleText}>
              Take advantage of apps and tools that help you find affordable meal options based on your budget and dietary needs.
            </Text>

            <View style={{ height: 20 }} />
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setArticleModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  articleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  articlePreview: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 6,
  },
  readTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  topicCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  topicDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  communitySection: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  communityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  communityIcon: {
    marginBottom: 16,
  },
  communityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  communityDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  notifyButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  notifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // MODAL STYLES
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  articleContent: {
    flex: 1,
  },
  articleText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  articleSubheading: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
