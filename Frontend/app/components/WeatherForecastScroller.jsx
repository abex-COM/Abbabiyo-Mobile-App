import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import WeatherIcon from 'react-native-weather-icons'; // Ensure this package is installed

const WeatherForecastScroller = ({ forecastData }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      {forecastData.map((day, index) => (
        <View key={index} style={styles.dayContainer}>
          <WeatherIcon name={day.icon} size={40} color="#000" />
          <Text style={styles.dayText}>{day.date}</Text>
          <Text style={styles.tempText}>{day.temp}°C</Text>
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
    marginHorizontal: 10,
  },
  dayText: {
    fontSize: 12,
    color: '#000',
  },
  tempText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default WeatherForecastScroller;