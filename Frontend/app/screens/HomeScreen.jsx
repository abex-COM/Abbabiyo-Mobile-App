import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import WeatherForecastScroller from './WeatherForecastScroller'; // Adjust the path as necessary
import CurrentSeason from './CurrentSeason'; // Adjust the path as necessary

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API call
        const response = await fetch('https://api.example.com/forecast');
        const data = await response.json();
        setForecastData(data.forecast);
      } catch (error) {
        setApiError('Failed to fetch forecast data');
        Alert.alert('Error', 'Failed to fetch forecast data');
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : apiError ? (
        <Text style={styles.errorText}>{apiError}</Text>
      ) : (
        <>
          <CurrentSeason />
          <WeatherForecastScroller forecastData={forecastData} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;