import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
// You can integrate a weather icon library later
// import WeatherIcon from 'react-native-weather-icons';

const WeatherForecastScroller = ({ forecast }) => {
  if (!forecast?.time) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      {forecast.time.map((date, index) => (
        <View key={index} style={styles.dayContainer}>
          {/* Replace below with an actual icon if needed */}
          <Text style={styles.icon}>🌤️</Text>
          <Text style={styles.dayText}>{date}</Text>
          <Text style={styles.tempText}>↑ {forecast.temperature_2m_max[index]}°C</Text>
          <Text style={styles.tempText}>↓ {forecast.temperature_2m_min[index]}°C</Text>
          <Text style={styles.humidityText}>💧 {forecast.relative_humidity_2m_mean[index]}%</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 10,
  },
  dayContainer: {
    alignItems: 'center',
    marginHorizontal: 12,
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 8,
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 12,
    color: '#444',
  },
  tempText: {
    fontSize: 13,
    color: '#222',
  },
  humidityText: {
    fontSize: 12,
    color: '#2e7d32',
  },
});

export default WeatherForecastScroller;