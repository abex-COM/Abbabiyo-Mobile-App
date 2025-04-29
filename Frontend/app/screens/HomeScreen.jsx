import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  StatusBar,
} from "react-native";
import Recommendation from "../components/Recommendation";
import WeatherForecastScroller from "../components/WeatherForecastScroller";
import CurrentSeason from "../components/CurrentSeason";
import axios from "axios";
import baseUrl from "@/baseUrl/baseUrl";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContexts";
import Toast from "react-native-toast-message";
import { useTheme } from "@/context/ThemeContext";
import Colors from "../constants/Colors";
import { getSocket, initiateSocketConnection } from "../utils/socket";

const HomeScreen = () => {
  const { user, token } = useUser();
  const { language } = useLanguage();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [season, setSeason] = useState(null);
  const [farmLocations, setFarmLocations] = useState([]);
  const [selectedFarmLocation, setSelectedFarmLocation] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [apiError, setApiError] = useState(null);
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode
    ? Colors.darkTheme.backgroundColor
    : Colors.lightTheme.backgroundColor;
  const textColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;
  const cardColor = isDarkMode ? Colors.darkTheme.cardBackground : "#fff";
  const inputBackgroundColor = isDarkMode ? "#444" : "#e9e9e9";

  useEffect(() => {
    if (user._id && token) {
      fetchFarmLocations();
    }
  }, [user, token]);

  const fetchFarmLocations = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${baseUrl}/api/farm-locations/all/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );
      setFarmLocations(res.data.farmLocations || []);
      setApiError(null);
    } catch (err) {
      console.error("Farm locations fetch error:", err);

      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch farm locations";

      setApiError(errorMessage);
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
          language: language,
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
        throw new Error("Received empty data from the server");
      }
    } catch (error) {
      console.error(error);
      console.error("Recommendation fetch error:", error);

      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch forecast data";

      setApiError(errorMessage);

      Toast.show({
        type: "error",
        text1: "Error occurred",
        text2: String(errorMessage),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFarmLocation) {
      fetchRecommendations(selectedFarmLocation);
    }
  }, [selectedFarmLocation, language]);

  useEffect(() => {
    if (!user._id || !token) return;

    initiateSocketConnection(user._id);
    const socket = getSocket();

    socket.on("newFarm", (newFarmLocations) => {
      setFarmLocations(newFarmLocations);
    });

    socket.on("farmUpdated", (newFarmLocations) => {
      setFarmLocations(newFarmLocations);
    });
    socket.on("farmDeleted", (newFarmLocations) => {
      setFarmLocations(newFarmLocations);
    });
    return () => {
      socket.off("newFarm");
    };
  }, [user, token]);
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? Colors.darkTheme.statusbarColor : "white"}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={[styles.loadingText, { color: textColor }]}>
            Loading weather data...
          </Text>
        </View>
      ) : farmLocations.length === 0 ? (
        <View style={[styles.formContainer, { backgroundColor: cardColor }]}>
          <Text style={[styles.title, { color: textColor }]}>
            Add Your First Farm Location
          </Text>
          <Text style={[styles.subtitle, { color: textColor }]}>
            You need to add at least one farm location to proceed
          </Text>
          <Button
            title="Go to Manage Farm Locations"
            onPress={() => navigation.navigate("ManageFarmLocations")}
            color="#4CAF50"
          />
        </View>
      ) : (
        <>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Select Farm Location
          </Text>
          <Picker
            selectedValue={selectedFarmLocation}
            onValueChange={(value) => setSelectedFarmLocation(value)}
            style={[
              styles.picker,
              { backgroundColor: inputBackgroundColor, color: textColor },
            ]}
            dropdownIconColor={textColor} // optional for Android
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
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
    borderRadius: 8,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default HomeScreen;
