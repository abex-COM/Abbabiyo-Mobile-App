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
import useFarmLocations from "../hooks/useFarmLocation";

const HomeScreen = () => {
  const { user, token } = useUser();
  const { language } = useLanguage();
  const navigation = useNavigation();
  const [forecast, setForecast] = useState(null);
  const [season, setSeason] = useState(null);
  const [selectedFarmLocation, setSelectedFarmLocation] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  const { isDarkMode } = useTheme();
  const { loading, farmLocations, refetch, setFarmLocations } =
    useFarmLocations();

  const backgroundColor = isDarkMode
    ? Colors.darkTheme.backgroundColor
    : Colors.lightTheme.backgroundColor;
  const textColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;
  const cardColor = isDarkMode ? Colors.darkTheme.backgroundColor : "#fff";
  const inputBackgroundColor = isDarkMode ? "#444" : "#e9e9e9";

  const fetchRecommendations = async (farmId) => {
    if (!farmId) {
      Alert.alert("Selection Required", "Please select a farm location first.");
      return;
    }

    setForecast("");
    setSeason("");
    setRecommendationLoading(true);

    if (!user?._id || !token) return;
    try {
      const response = await axios.post(
        `${baseUrl}/api/recommendations/personalized`,
        {
          farmerId: user?._id,
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
      console.error("Recommendation fetch error:", error);

      Toast.show({
        type: "error",
        text1: "Error occurred while fetching recommendations",
      });
    } finally {
      setRecommendationLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFarmLocation) {
      fetchRecommendations(selectedFarmLocation);
    }
  }, [selectedFarmLocation, language]);

  useEffect(() => {
    if (!user._id || !token) return;

    initiateSocketConnection(user?._id);
    const socket = getSocket();

    console.log("spcket", socket);
    socket.on("newFarm", (newFarmLocations) => {
      setFarmLocations(newFarmLocations);
    });

    socket.on("farmUpdated", (farmUpdated) => {
      setFarmLocations(farmUpdated);
    });

    socket.on("farmDeleted", (farmDeleted) => {
      setFarmLocations(farmDeleted);
    });
    return () => {
      socket.off("newFarm");
      socket.off("farmUpdated");
      socket.off("farmDeleted");
    };
  }, [token]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ color: textColor }}>Loading farm locations...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? Colors.darkTheme.statusbarColor : "white"}
      />

      {farmLocations.length === 0 ? (
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
            enabled={!recommendationLoading}
            dropdownIconColor={textColor}
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

          {recommendationLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={[styles.loadingText, { color: textColor }]}>
                Fetching recommendations...
              </Text>
            </View>
          ) : (
            <>
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
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
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
