import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContexts";
import axios from "axios";
import baseUrl from "@/baseUrl/baseUrl";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";

const Recommendation = () => {
  const { user, token } = useUser();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [newFarmName, setNewFarmName] = useState("");
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLon, setCurrentLon] = useState(null);
  const [farmLocations, setFarmLocations] = useState([]);
  const [selectedFarmLocation, setSelectedFarmLocation] = useState("");
  const [apiError, setApiError] = useState(null);

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
      console.error("Farm locations fetch error:", err);
      setApiError(err.response?.data?.error || err.message || "Failed to fetch farm locations");
      Alert.alert("Error", apiError);
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
    setRecommendations(null);
    setApiError(null);

    try {
      const response = await axios.post(
        `${baseUrl}/api/recommendations/personalized`,
        {
          farmerId: user._id,
          farmId: farmId,
          language: language,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000, // 15 seconds for Gemini API
        }
      );

      if (response.data?.recommendations) {
        setRecommendations(response.data.recommendations);
      } else {
        throw new Error("Received empty recommendations from server");
      }
    } catch (error) {
      console.error("Recommendation fetch error:", error);
      
      let errorMessage = "Failed to get recommendations";
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.error || 
                      error.response.data?.message || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response
        errorMessage = "No response from server - check your connection";
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || "Request setup error";
      }

      setApiError(errorMessage);
      Alert.alert("Recommendation Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarmLocation = async () => {
    if (!newFarmName.trim()) {
      Alert.alert("Validation Error", "Please enter a farm name");
      return;
    }

    if (currentLat === null || currentLon === null) {
      Alert.alert("Location Required", "Please detect location first");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${baseUrl}/api/farm-locations/add`,
        {
          userId: user._id,
          name: newFarmName.trim(),
          lat: parseFloat(currentLat),
          lon: parseFloat(currentLon),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );
      
      await fetchFarmLocations();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Farm location added successfully!",
      });
      setNewFarmName("");
      setCurrentLat(null);
      setCurrentLon(null);
    } catch (error) {
      console.error("Add farm error:", error);
      const errorMsg = error.response?.data?.error || error.message || "Failed to add farm";
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Location permission is required to add farms",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setCurrentLat(coords.latitude);
      setCurrentLon(coords.longitude);

      Toast.show({
        type: "success",
        text1: "Location Detected",
        text2: `Lat: ${coords.latitude.toFixed(4)}, Lon: ${coords.longitude.toFixed(4)}`,
      });
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert("Location Error", "Failed to get current location");
    }
  };

  useEffect(() => {
    if (selectedFarmLocation) {
      fetchRecommendations(selectedFarmLocation);
    }
  }, [selectedFarmLocation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading recommendations...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Please log in to view recommendations</Text>
      </View>
    );
  }

  if (farmLocations.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Your First Farm</Text>
        <Text style={styles.subtitle}>You need to add at least one farm location to get recommendations</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Farm Name (e.g., My Coffee Farm)"
            value={newFarmName}
            onChangeText={setNewFarmName}
            placeholderTextColor="#999"
          />

          <View style={styles.locationContainer}>
            <Button 
              title="Detect Current Location" 
              onPress={getCurrentLocation}
              color="#4A90E2"
            />
            {currentLat && currentLon ? (
              <Text style={styles.coordinatesText}>
                Location: {currentLat.toFixed(4)}, {currentLon.toFixed(4)}
              </Text>
            ) : (
              <Text style={styles.coordinatesText}>No location detected</Text>
            )}
          </View>

          <Button
            title="Add Farm Location"
            onPress={handleAddFarmLocation}
            disabled={!newFarmName.trim() || !currentLat || !currentLon}
            color="#4CAF50"
          />
        </View>

        {apiError && (
          <Text style={styles.errorText}>Error: {apiError}</Text>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Select Farm Location</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedFarmLocation}
          onValueChange={(value) => setSelectedFarmLocation(value)}
          style={styles.picker}
          dropdownIconColor="#4A90E2"
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
      </View>

      {apiError && (
        <Text style={styles.errorText}>Error: {apiError}</Text>
      )}

      {recommendations ? (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationTitle}>Your Personalized Recommendations</Text>
          {recommendations.split("\n").map((rec, idx) => (
            <View key={idx} style={styles.recommendationItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.recommendationText}>{rec.trim()}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.placeholderText}>
          {selectedFarmLocation 
            ? "Generating recommendations..." 
            : "Select a farm to view recommendations"}
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
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
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  locationContainer: {
    marginBottom: 15,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
  },
  recommendationsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2E7D32',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    marginRight: 8,
    fontSize: 16,
    color: '#4A90E2',
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#D32F2F',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default Recommendation;