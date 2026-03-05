// ============================
// frontend/app/home.js
// Main application screen displayed after login.
// Contains tab navigation for Ask AI, Weather, Tips,
// and Market modules. Uses router params to get user
// info and manages activeTab state. Renders appropriate
// tab component and provides history/logout actions.
// ----------------------------
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import AskTab from './components/AskTab';
import WeatherTab from './components/WeatherTab';
import TipsTab from './components/TipsTab';
import MarketTab from './components/MarketTab';
import styles from './styles';

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { farmerId, farmerName } = params;
  const [activeTab, setActiveTab] = useState('ask');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {farmerName}! </Text>
        <Text style={styles.subtitle}>Your Smart Farming Assistant</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ask' && styles.activeTab]}
          onPress={() => setActiveTab('ask')}
        >
          <Text style={[styles.tabText, activeTab === 'ask' && styles.activeTabText]}>
            🤖 Ask AI
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weather' && styles.activeTab]}
          onPress={() => setActiveTab('weather')}
        >
          <Text style={[styles.tabText, activeTab === 'weather' && styles.activeTabText]}>
            🌤️ Weather
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tips' && styles.activeTab]}
          onPress={() => setActiveTab('tips')}
        >
          <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>
            💡 Tips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'market' && styles.activeTab]}
          onPress={() => setActiveTab('market')}
        >
          <Text style={[styles.tabText, activeTab === 'market' && styles.activeTabText]}>
            💰 Market
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content}>
        {activeTab === 'ask' && <AskTab farmerId={farmerId} />}
        {activeTab === 'weather' && <WeatherTab />}
        {activeTab === 'tips' && <TipsTab />}
        {activeTab === 'market' && <MarketTab />}

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() =>
              router.push({
                pathname: '/history',
                params: { farmerId },
              })
            }
          >
            <Text style={styles.historyButtonText}>📚 View Query History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: () => router.replace('/login') },
              ]);
            }}
          >
            <Text style={styles.logoutButtonText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}
