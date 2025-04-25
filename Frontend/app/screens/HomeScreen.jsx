import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import Recommendation from '../components/Recommendation';
import WeatherForecastScroller from '../components/WeatherForecastScroller';
import CurrentSeason from '../components/CurrentSeason';
import axios from 'axios';
import baseUrl from '@/baseUrl/baseUrl';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContexts'; // Import useLanguage

const HomeScreen = () => {
  const { user, token } = useUser();
  const { language } = useLanguage(); // Access current language from context
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [season, setSeason] = useState(null);
  const [farmLocations, setFarmLocations] = useState([]);
  const [selectedFarmLocation, setSelectedFarmLocation] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [apiError, setApiError] = useState(null);

  // Fetch farm locations when the user is available
  useEffect(() => {
    if (user) {
      fetchFarmLocations();
    }
  }, [user]);

  const fetchFarmLocations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/farm-locations/all/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      setFarmLocations(res.data.farmLocations || []);
      setApiError(null);
    } catch (err) {
      console.error('Farm locations fetch error:', err);
      setApiError(err.response?.data?.error || err.message || 'Failed to fetch farm locations');
      Alert.alert('Error', apiError);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (farmId) => {
    if (!farmId) {
      Alert.alert("Selection Required", "Please select a farm location first.");
      return;
    }

    setLoading(true);
    setForecast(null);
    setSeason(null);
    setApiError(null);

    try {
      const response = await axios.post(
        `${baseUrl}/api/recommendations/personalized`,
        {
          farmerId: user._id,
          farmId: farmId,
          language: language, // Use the selected language from context
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        }
      );

      if (response.data) {
        setRecommendations(response.data.recommendations || []);
        setForecast(response.data.forecast);
        setSeason(response.data.season);
      } else {
        throw new Error('Received empty data from the server');
      }
    } catch (error) {
      console.error('Recommendation fetch error:', error);
      setApiError(error.message || 'Failed to fetch forecast data');
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommendations when selected farm location or language changes
  useEffect(() => {
    if (selectedFarmLocation) {
      fetchRecommendations(selectedFarmLocation);
    }
  }, [selectedFarmLocation, language]); // Trigger the re-fetch when language or selected farm location changes

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {farmLocations.length === 0 ? (
        <View style={styles.formContainer}>
          <Text style={styles.title}>Add Your First Farm Location</Text>
          <Text style={styles.subtitle}>You need to add at least one farm location to proceed</Text>
          <Button
            title="Go to Manage Farm Locations"
            onPress={() => navigation.navigate('ManageFarmLocations')}
            color="#4CAF50"
          />
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Select Farm Location</Text>
          <Picker
            selectedValue={selectedFarmLocation}
            onValueChange={(value) => setSelectedFarmLocation(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select a farm..." value="" />
            {farmLocations.map((farm) => (
              <Picker.Item
                key={farm._id}
                label={`${farm.name} (${farm.lat?.toFixed(2)}, ${farm.lon?.toFixed(2)})`}
                value={farm._id}
              />
            ))}
          </Picker>

          {selectedFarmLocation && (
            <>
              <CurrentSeason season={season} />
              <WeatherForecastScroller forecast={forecast} />
            </>
          )}

          {recommendations.length > 0 && (
            <Recommendation recommendations={recommendations} />
          )}
        </>
      )}

      {apiError && (
        <Text style={styles.errorText}>Error: {apiError}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;