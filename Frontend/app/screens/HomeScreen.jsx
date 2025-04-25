import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContexts";
import { useTheme } from "@/context/ThemeContext";
import baseUrl from "@/baseUrl/baseUrl";
import Toast from "react-native-toast-message";
import axios from "axios";
import * as Location from "expo-location";
import { Colors } from "../constants/Colors";

const HomeScreen = () => {
  const { user, token } = useUser();
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode
    ? Colors.darkTheme.backgroundColor
    : Colors.lightTheme.backgroundColor;

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [newFarmName, setNewFarmName] = useState("");
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLon, setCurrentLon] = useState(null);
  const [farmLocations, setFarmLocations] = useState([]);
  const [selectedFarmLocation, setSelectedFarmLocation] = useState("");
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (user) fetchFarmLocations();
  }, [user]);

  const fetchFarmLocations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/farm-locations/all/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmLocations(res.data.farmLocations || []);
      setApiError(null);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to fetch farm locations";
      setApiError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (farmId) => {
    if (!farmId) return;

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
        }
      );

      if (response.data?.recommendations) {
        setRecommendations(response.data.recommendations);
      } else {
        throw new Error("Empty recommendations from server");
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to get recommendations";
      setApiError(message);
      Alert.alert("Recommendation Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarmLocation = async () => {
    if (!newFarmName.trim()) {
      Alert.alert("Validation", "Enter a farm name.");
      return;
    }

    if (currentLat === null || currentLon === null) {
      Alert.alert("Location Missing", "Please detect location.");
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchFarmLocations();
      Toast.show({
        type: "success",
        text1: "Farm location added!",
      });

      setNewFarmName("");
      setCurrentLat(null);
      setCurrentLon(null);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to add farm";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Location permission is needed.");
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
    } catch (err) {
      Alert.alert("Location Error", "Could not fetch current location.");
    }
  };

  useEffect(() => {
    if (selectedFarmLocation) {
      fetchRecommendations(selectedFarmLocation);
    }
  }, [selectedFarmLocation]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <StatusBar backgroundColor={backgroundColor} />

      {!user ? (
        <Text style={styles.center}>Please log in to view recommendations</Text>
      ) : loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading recommendations...</Text>
        </View>
      ) : farmLocations.length === 0 ? (
        <View>
          <Text style={styles.title}>Add Your First Farm</Text>
          <TextInput
            style={styles.input}
            placeholder="Farm Name"
            value={newFarmName}
            onChangeText={setNewFarmName}
          />
          <Button title="Detect Location" onPress={getCurrentLocation} />
          {currentLat && currentLon && (
            <Text style={styles.coordinatesText}>
              Location: {currentLat.toFixed(4)}, {currentLon.toFixed(4)}
            </Text>
          )}
          <Button
            title="Add Farm"
            onPress={handleAddFarmLocation}
            disabled={!newFarmName || !currentLat || !currentLon}
            color="#4CAF50"
          />
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Select a Farm</Text>
          <Picker
            selectedValue={selectedFarmLocation}
            onValueChange={setSelectedFarmLocation}
            style={styles.picker}
          >
            <Picker.Item label="Select a farm..." value="" />
            {farmLocations.map((farm) => (
              <Picker.Item
                key={farm._id}
                label={`${farm.name} (${farm.lat.toFixed(2)}, ${farm.lon.toFixed(2)})`}
                value={farm._id}
              />
            ))}
          </Picker>

          {recommendations ? (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationTitle}>Recommendations</Text>
              {recommendations.split("\n").map((rec, idx) => (
                <View key={idx} style={styles.recommendationItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.recommendationText}>{rec.trim()}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.placeholderText}>
              {selectedFarmLocation ? "Loading..." : "Select a farm to view recommendations"}
            </Text>
          )}
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
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  coordinatesText: {
    marginBottom: 10,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  recommendationsContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2E7D32",
  },
  recommendationItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bullet: {
    marginRight: 6,
    color: "#4A90E2",
  },
  recommendationText: {
    flex: 1,
  },
  placeholderText: {
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
});

export default HomeScreen;