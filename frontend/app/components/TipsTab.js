// ============================
// frontend/app/components/TipsTab.js
// Static content component that lists general
// seasonal, soil, water, and scheme tips for farmers.
// Organized as multiple tip cards within a scroll view.
// ----------------------------
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import styles from '../styles';

export default function TipsTab() {
  return (
    <ScrollView style={styles.tipsContainer}>
      {/* Seasonal Tips */}
      <View style={styles.tipCard}>
        <Text style={styles.tipCardTitle}>🌱 Seasonal Farming Tips</Text>
        <Text style={styles.tipCardText}>
          <Text style={styles.bold}>Kharif Season (June-Oct):</Text>{'\n'}
           Best for rice, cotton, maize{'\n'}
           Ensure good drainage{'\n'}
           Monitor for monsoon pests{'\n'}
          {'\n'}
          <Text style={styles.bold}>Rabi Season (Nov-Mar):</Text>{'\n'}
           Ideal for wheat, mustard{'\n'}
           Manage irrigation carefully{'\n'}
           Protect from frost damage
        </Text>
      </View>

      {/* Soil Health */}
      <View style={styles.tipCard}>
        <Text style={styles.tipCardTitle}>🌍 Soil Health Management</Text>
        <Text style={styles.tipCardText}>
           Test soil pH every 2-3 years{'\n'}
           Add organic manure regularly{'\n'}
           Practice crop rotation{'\n'}
           Avoid over-fertilization{'\n'}
           Use cover crops in off-season{'\n'}
           Maintain proper drainage
        </Text>
      </View>

      {/* Water Management */}
      <View style={styles.tipCard}>
        <Text style={styles.tipCardTitle}>💧 Water Management</Text>
        <Text style={styles.tipCardText}>
           Drip irrigation saves 40% water{'\n'}
           Water early morning or evening{'\n'}
           Mulching reduces evaporation{'\n'}
           Check soil moisture before irrigation{'\n'}
           Harvest rainwater when possible
        </Text>
      </View>

      {/* Government Schemes */}
      <View style={styles.tipCard}>
        <Text style={styles.tipCardTitle}>🏛️ Government Schemes</Text>
        <Text style={styles.tipCardText}>
           PM-KISAN: ₹6000/year direct benefit{'\n'}
           Soil Health Card Scheme{'\n'}
           Pradhan Mantri Fasal Bima Yojana{'\n'}
           KCC: Kisan Credit Card{'\n'}
           e-NAM: National Agriculture Market
        </Text>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.tipCard}>
        <Text style={styles.tipCardTitle}>📞 Important Contacts</Text>
        <Text style={styles.tipCardText}>
           Kisan Call Centre: 1800-180-1551{'\n'}
           Agricultural Officer: Contact local office{'\n'}
           Soil Testing Lab: Check district center{'\n'}
           Mandi Bhav: 1800-270-0224{'\n'}
           e-NAM Helpline: 1800-270-0224
        </Text>
      </View>
    </ScrollView>
  );
}
