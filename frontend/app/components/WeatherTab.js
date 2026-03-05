// ============================
// frontend/app/components/WeatherTab.js
// Component responsible for fetching and displaying
// weather-related farming advice. Contains helper
// functions to convert API results into actionable tips.
// Sections: imports & constants, API helpers,
// advice logic, component UI and styling.
// ----------------------------
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import styles from '../styles';
import W_API from '../../../.env';

const WEATHER_API_KEY = W_API;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const getFarmingAdvice = (weather) => {
  if (!weather) return [];

  let advice = [];

  // Temperature-based advice
  if (weather.temp > 35) {
    advice.push('🌡️ High temperature - Increase irrigation frequency');
    advice.push('⏰ Irrigate early morning (5-7 AM) or evening (6-8 PM)');
  } else if (weather.temp < 15) {
    advice.push('❄️ Cold weather - Protect young plants from frost');
    advice.push('🌱 Good time for winter crops like wheat, mustard');
  }

  // Humidity-based advice
  if (weather.humidity > 80) {
    advice.push('💧 High humidity - Watch for fungal diseases');
    advice.push('🍃 Ensure good air circulation in crops');
    advice.push('⚠️ Delay spraying pesticides if possible');
  } else if (weather.humidity < 40) {
    advice.push('🏜️ Low humidity - Increase irrigation');
    advice.push('💦 Use mulching to retain soil moisture');
  }

  // Weather condition advice
  if (weather.main === 'Rain' || weather.main === 'Drizzle') {
    advice.push('🌧️ Rain expected - Postpone pesticide spraying');
    advice.push('⛔ Avoid irrigation today');
    advice.push('📅 Good time for transplanting after rain');
  } else if (weather.main === 'Clear') {
    advice.push('☀️ Clear weather - Good for spraying operations');
    advice.push('✅ Suitable for harvesting activities');
  }

  // Wind-based advice
  if (weather.wind_speed > 5) {
    advice.push('💨 Windy conditions - Avoid pesticide/fertilizer spraying');
  }

  return advice;
};

export default function WeatherTab() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleWeather = async () => {
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter your location');
      return;
    }

    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
      Alert.alert(
        'API Key Required',
        'Please add your OpenWeatherMap API key. Get free key at openweathermap.org'
      );
      return;
    }

    setLoading(true);
    setWeatherData(null);

    try {
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          q: location,
          appid: WEATHER_API_KEY,
          units: 'metric',
        },
      });

      const data = response.data;

      const weather = {
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        temp_min: Math.round(data.main.temp_min),
        temp_max: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        main: data.weather[0].main,
        icon: data.weather[0].icon,
        wind_speed: data.wind.speed,
        clouds: data.clouds.all,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setWeatherData(weather);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'City not found. Please check spelling.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.inputSection}>
        <Text style={styles.sectionLabel}>📍 Enter City Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Mumbai, Pune, Delhi"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={[styles.askButton, loading && styles.buttonDisabled]}
        onPress={handleWeather}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.askButtonText}>🌤️ Get Live Weather</Text>
        )}
      </TouchableOpacity>

      {weatherData ? (
        <View>
          {/* Main Weather Card */}
          <View style={styles.weatherCard}>
            <Text style={styles.weatherCity}>
              {weatherData.city}, {weatherData.country}
            </Text>
            <Text style={styles.weatherTemp}>{weatherData.temp}°C</Text>
            <Text style={styles.weatherDesc}>
              {weatherData.description.charAt(0).toUpperCase() +
                weatherData.description.slice(1)}
            </Text>
            <Text style={styles.weatherFeels}>
              Feels like {weatherData.feels_like}°C
            </Text>
          </View>

          {/* Weather Details */}
          <View style={styles.weatherDetails}>
            <View style={styles.weatherDetailRow}>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailLabel}>🌡️ Min/Max</Text>
                <Text style={styles.weatherDetailValue}>
                  {weatherData.temp_min}°C / {weatherData.temp_max}°C
                </Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailLabel}>💧 Humidity</Text>
                <Text style={styles.weatherDetailValue}>
                  {weatherData.humidity}%
                </Text>
              </View>
            </View>

            <View style={styles.weatherDetailRow}>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailLabel}>💨 Wind</Text>
                <Text style={styles.weatherDetailValue}>
                  {weatherData.wind_speed} m/s
                </Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailLabel}>☁️ Clouds</Text>
                <Text style={styles.weatherDetailValue}>
                  {weatherData.clouds}%
                </Text>
              </View>
            </View>

            <View style={styles.weatherDetailRow}>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailLabel}>🌅 Sunrise</Text>
                <Text style={styles.weatherDetailValue}>
                  {weatherData.sunrise}
                </Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.weatherDetailLabel}>🌇 Sunset</Text>
                <Text style={styles.weatherDetailValue}>
                  {weatherData.sunset}
                </Text>
              </View>
            </View>
          </View>

          {/* Farming Advice Based on Real Weather */}
          <View style={styles.adviceCard}>
            <Text style={styles.adviceTitle}>🌾 Farming Advice:</Text>
            {getFarmingAdvice(weatherData).map((tip, index) => (
              <Text key={index} style={styles.adviceText}>
                {tip}
              </Text>
            ))}

            {/* Best time for irrigation */}
            <Text style={styles.adviceText}>
              ⏰ Best irrigation time: {' '}
              {weatherData.temp > 30 ? '6-7 AM or 7-8 PM' : '7-9 AM or 5-7 PM'}
            </Text>
          </View>
        </View>
      ) : null}

      {/* Weather Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>🌤️ Weather Guidelines:</Text>
        <Text style={styles.tipsText}>
          • Check weather daily for farming operations{''}
          {'\n'}• Avoid spraying before rain{''}
          {'\n'}• Plan harvest based on 3-day forecast{''}
          {'\n'}• Monitor temperature for disease control{''}
          {'\n'}• High humidity = fungal disease risk
        </Text>
      </View>
    </View>
  );
}
