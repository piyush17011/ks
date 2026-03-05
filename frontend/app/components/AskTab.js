// ============================
// frontend/app/components/AskTab.js
// Component responsible for asking AI questions and
// creating farm sessions. Handles language selection,
// session modal with farm details, posting to backend
// endpoints (/ask and /session), and displaying AI
// responses in structured form (fertilizers, analysis,
// soil tips, etc.).
// Major chunks:
//   • imports & constants
//   • style definitions
//   • SafeText helper
//   • component state and handlers
//   • UI with language picker, session modal, and
//     response rendering
// ----------------------------
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

// Use centrally exported backend URL (reads from Expo extras)
import { BACKEND_URL } from '../config';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000, // 15 seconds (important for college WiFi)
});

const styles = StyleSheet.create({
  languageContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  langButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  langButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#02c812',
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  langButtonActive: {
    backgroundColor: '#2e9e36',
  },
  langText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 12,
  },
  langTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  askButton: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  askButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  responseContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  responseText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  quickBtn: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e8f5e9',
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#4a7c2c',
    flex: 1,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#4a7c2c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    color: '#333',
  },
  fertilizerBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#4a7c2c',
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a7c2c',
    marginBottom: 12,
  },
  fertilizerItem: {
    backgroundColor: '#f0f8f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#4a7c2c',
  },
  fertilizerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d5016',
  },
  fertilizerQuantity: {
    fontSize: 13,
    color: '#333',
    marginTop: 4,
  },
  analysisBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#ff9800',
  },
  analysisText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  soilTipsBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#2196f3',
  },
  tipItem: {
    marginBottom: 8,
    paddingLeft: 10,
  },
  tipText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
});


// Helper to safely render any value (string, number, object, array, etc.)
const SafeText = ({ value, textStyle }) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return <Text style={textStyle}>{String(value)}</Text>;
  }
  if (Array.isArray(value)) {
    return (
      <View>
        {value.map((item, idx) => (
          <Text key={idx} style={textStyle}>{typeof item === 'string' ? item : JSON.stringify(item)}</Text>
        ))}
      </View>
    );
  }
  if (typeof value === 'object' && value !== null) {
    return <Text style={textStyle}>{JSON.stringify(value, null, 2)}</Text>;
  }
  return <Text style={textStyle}>{String(value)}</Text>;
};

export default function AskTab({ farmerId }) {
  const [language, setLanguage] = useState('English');
  // aiResult will hold structured object returned from backend
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  // session form state
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [crop, setCrop] = useState('Wheat');
  const [soilType, setSoilType] = useState('Loamy');
  const [ph, setPh] = useState('6.5');
  const [nitrogen, setNitrogen] = useState('10');
  const [phosphorus, setPhosphorus] = useState('10');
  const [potassium, setPotassium] = useState('10');
  const [waterAvailability, setWaterAvailability] = useState('Moderate');
  const [budgetRange, setBudgetRange] = useState('Medium');
  const [showCropOptions, setShowCropOptions] = useState(false);
  const [showSoilOptions, setShowSoilOptions] = useState(false);
  
  const [showWaterOptions, setShowWaterOptions] = useState(false);
  const [showBudgetOptions, setShowBudgetOptions] = useState(false);

const handleCreateSessionSubmit = async () => {
  if (!crop || !soilType || !ph) {
    Alert.alert('Error', 'Please fill crop, soil type and soil pH');
    return;
  }

  setLoading(true);
  setAiResult(null);

  try {
    const result = await api.post('/session', {
      farmer_id: farmerId,
      crop,
      soil_type: soilType,

      // 🔥 IMPORTANT: convert to numbers
      ph: Number(ph),
      nitrogen_ppm: Number(nitrogen),
      phosphorus_ppm: Number(phosphorus),
      potassium_ppm: Number(potassium),

      water_availability: waterAvailability,
      budget_range: budgetRange,
      language,
    });

    if (!result.data || !result.data.answer) {
      throw new Error('Invalid AI response');
    }

    setAiResult(result.data.answer);
    setShowSessionModal(false);
  } catch (error) {
    console.log('AI ERROR:', error.response?.data || error.message);

    Alert.alert(
      'Error',
      error.response?.data?.message ||
      'Could not get AI response. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <View>
      {/* Language Selection */}
      <View style={styles.languageContainer}>
        <Text style={styles.sectionLabel}>Select Language:</Text>
        <View style={styles.langButtons}>
          {['English', 'Hindi', 'Marathi'].map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.langButton,
                language === lang && styles.langButtonActive,
              ]}
              onPress={() => setLanguage(lang)}
            >
              <Text
                style={[
                  styles.langText,
                  language === lang && styles.langTextActive,
                ]}
              >
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.askButton, loading && styles.buttonDisabled]}
        onPress={() => setShowSessionModal(true)}
        disabled={loading}
      >
        <Text style={styles.askButtonText}>➕ Create Session</Text>
      </TouchableOpacity>

      {/* Session Modal */}
      <Modal visible={showSessionModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center' }}>
          <View style={{ margin: 20, backgroundColor: 'white', borderRadius: 8, padding: 16, maxHeight: '85%' }}>
            <ScrollView>
              <Text style={[styles.sectionLabel, { marginBottom: 8 }]}>Create Farm Session</Text>

              {/* Crop dropdown */}
              <Text style={styles.sectionLabel}>Crop</Text>
              <TouchableOpacity onPress={() => setShowCropOptions(!showCropOptions)} style={{ padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 6 }}>
                <Text>{crop}</Text>
              </TouchableOpacity>
              {showCropOptions && (
                <View style={{ marginTop: 6 }}>
                  {['Wheat', 'Rice', 'Maize', 'Cotton', 'Vegetables'].map((opt) => (
                    <TouchableOpacity key={opt} onPress={() => { setCrop(opt); setShowCropOptions(false); }} style={{ padding: 8 }}>
                      <Text>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Soil type dropdown */}
              <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Soil Type</Text>
              <TouchableOpacity onPress={() => setShowSoilOptions(!showSoilOptions)} style={{ padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 6 }}>
                <Text>{soilType}</Text>
              </TouchableOpacity>
              {showSoilOptions && (
                <View style={{ marginTop: 6 }}>
                  {['Sandy', 'Loamy', 'Clayey', 'Silty'].map((opt) => (
                    <TouchableOpacity key={opt} onPress={() => { setSoilType(opt); setShowSoilOptions(false); }} style={{ padding: 8 }}>
                      <Text>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* pH and nutrients */}
              <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Soil pH</Text>
              <TextInput
                style={styles.questionInput}
                keyboardType="numeric"
                value={ph}
                onChangeText={setPh}
                placeholder="e.g. 6.5"
              />

              <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Nitrogen (ppm)</Text>
              <TextInput style={styles.questionInput} keyboardType="numeric" value={nitrogen} onChangeText={setNitrogen} placeholder="e.g. 10" />

              <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Phosphorus (ppm)</Text>
              <TextInput style={styles.questionInput} keyboardType="numeric" value={phosphorus} onChangeText={setPhosphorus} placeholder="e.g. 10" />

              <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Potassium (ppm)</Text>
              <TextInput style={styles.questionInput} keyboardType="numeric" value={potassium} onChangeText={setPotassium} placeholder="e.g. 10" />

              {/* Water availability */}
              <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Water Availability</Text>
              <TouchableOpacity onPress={() => setShowWaterOptions(!showWaterOptions)} style={{ padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 6 }}>
                <Text>{waterAvailability}</Text>
              </TouchableOpacity>
              {showWaterOptions && (
                <View style={{ marginTop: 6 }}>
                  {['Low', 'Moderate', 'High'].map((opt) => (
                    <TouchableOpacity key={opt} onPress={() => { setWaterAvailability(opt); setShowWaterOptions(false); }} style={{ padding: 8 }}>
                      <Text>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Budget range */}
              <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Budget Range</Text>
              <TouchableOpacity onPress={() => setShowBudgetOptions(!showBudgetOptions)} style={{ padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 6 }}>
                <Text>{budgetRange}</Text>
              </TouchableOpacity>
              {showBudgetOptions && (
                <View style={{ marginTop: 6 }}>
                  {['Low', 'Medium', 'High'].map((opt) => (
                    <TouchableOpacity key={opt} onPress={() => { setBudgetRange(opt); setShowBudgetOptions(false); }} style={{ padding: 8 }}>
                      <Text>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Modal actions */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                <TouchableOpacity onPress={() => setShowSessionModal(false)} style={[styles.modalButton, styles.cancelButton]}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreateSessionSubmit} style={[styles.modalButton, styles.submitButton]}>
                  {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Get Recommendations</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* AI Response */}
      {aiResult ? (
        <ScrollView>
          {/* Fertilizer Recommendations Box */}
          {aiResult.fertilizers && Array.isArray(aiResult.fertilizers) && aiResult.fertilizers.length > 0 && (
            <View style={styles.fertilizerBox}>
              <Text style={styles.boxTitle}>🌾 Fertilizer Recommendations</Text>
              {aiResult.fertilizers.map((fert, idx) => (
                <View key={idx} style={styles.fertilizerItem}>
                  <Text style={styles.fertilizerName}>{fert.name}</Text>
                  <Text style={styles.fertilizerQuantity}>Quantity: {fert.quantity_per_acre} per acre</Text>
                </View>
              ))}
            </View>
          )}

          {/* Overall Analysis Box */}
          {aiResult.overall_analysis && (
            <View style={styles.analysisBox}>
              <Text style={styles.boxTitle}>📋 Overall Analysis</Text>
              <Text style={styles.analysisText}>{aiResult.overall_analysis}</Text>
            </View>
          )}

          {/* Soil Analysis & Tips Box */}
          {aiResult.soil_analysis_and_tips && Array.isArray(aiResult.soil_analysis_and_tips) && aiResult.soil_analysis_and_tips.length > 0 && (
            <View style={styles.soilTipsBox}>
              <Text style={styles.boxTitle}>🌱 Soil Analysis & Tips</Text>
              {aiResult.soil_analysis_and_tips.map((tip, idx) => (
                <View key={idx} style={styles.tipItem}>
                  <Text style={styles.tipText}>• {tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Fallback: render any remaining fields */}
          {Object.keys(aiResult).filter(key => !['fertilizers', 'overall_analysis', 'soil_analysis_and_tips'].includes(key)).length > 0 && (
            <View style={{ marginTop: 15, padding: 10, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 8 }}>Additional Information:</Text>
              {Object.keys(aiResult).filter(key => !['fertilizers', 'overall_analysis', 'soil_analysis_and_tips'].includes(key)).map(key => (
                <View key={key} style={{ marginTop: 6 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 2 }}>{key}:</Text>
                  <SafeText value={aiResult[key]} textStyle={styles.responseText} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      ) : null}
    </View>
  );
}
