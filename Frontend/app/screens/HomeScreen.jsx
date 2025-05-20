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
  KeyboardAvoidingView,
} from "react-native";
import Recommendation from "../components/Recommendation";
import WeatherForecastScroller from "../components/WeatherForecastScroller";
import CurrentSeason from "../components/CurrentSeason";
import axios from "axios";
import baseUrl from "@/baseUrl/baseUrl";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContexts";
import Toast from "react-native-toast-message";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "@/context/ThemeContext";
import Colors from "../constants/Colors";
import { getSocket, initiateSocketConnection } from "../utils/socket";
import useFarmLocations from "../hooks/useFarmLocation";
import { t } from "i18next";

const HomeScreen = () => {
  const { user, token } = useUser();
  const { language } = useLanguage();
  const navigation = useNavigation();
  const [forecast, setForecast] = useState(null);
  const [season, setSeason] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  const { isDarkMode } = useTheme();
  const { loading, farmLocations, refetch, setFarmLocations } =
    useFarmLocations();

  const [open, setOpen] = useState(false);
  const [selectedFarmLocation, setSelectedFarmLocation] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([]);

  const backgroundColor = isDarkMode
    ? Colors.darkTheme.backgroundColor
    : Colors.lightTheme.backgroundColor;
  const textColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;
  const cardColor = isDarkMode ? Colors.darkTheme.backgroundColor : "#fff";
  const inputBackgroundColor = isDarkMode ? "#1c5f1c" : "#e9e9e9";

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
    if (farmLocations.length > 0) {
      const items = farmLocations.map((farm) => ({
        label: `${farm?.name} (${farm?.lat?.toFixed(2)}, ${farm?.lon?.toFixed(2)})`,
        value: farm?._id,
      }));
      setDropdownItems(items);
    }
  }, [farmLocations]);

  useEffect(() => {
    if (selectedFarmLocation) {
      fetchRecommendations(selectedFarmLocation);
    }
  }, [selectedFarmLocation, language]);

  useEffect(() => {
    initiateSocketConnection(user?._id);
    const socket = getSocket();

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

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? Colors.darkTheme.statusbarColor : "white"}
      />
      {loading ? (
        <View style={[styles.center, { backgroundColor }]}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={{ color: textColor }}>Loading farm locations...</Text>
        </View>
      ) : (
        <>
          {farmLocations.length === 0 ? (
            <View
              style={[styles.formContainer, { backgroundColor: cardColor }]}
            >
              <Text style={[styles.title, { color: textColor }]}>
                {t("add_your_first_farm_location")}
              </Text>
              <Text style={[styles.subtitle, { color: textColor }]}>
                {t("you_need_to_add_at_least_one_farm_location_to_proceed")}
              </Text>
              <Button
                title={t("go_to_manage_farm_locations")}
                onPress={() => navigation.navigate("ManageFarmLocations")}
                color="#4CAF50"
              />
            </View>
          ) : (
            <>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                {t("select_farm_location")}
              </Text>

              <View style={{ zIndex: 1000, marginBottom: 20, padding: 10 }}>
                <DropDownPicker
                  open={open}
                  value={selectedFarmLocation}
                  items={dropdownItems}
                  setOpen={setOpen}
                  setValue={setSelectedFarmLocation}
                  setItems={setDropdownItems}
                  placeholder="Select a farm..."
                  disabled={recommendationLoading}
                  style={{
                    backgroundColor: inputBackgroundColor,
                    borderColor: "#838181",
                  }}
                  textStyle={{
                    color: textColor,
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: inputBackgroundColor,
                    borderColor: "#777373",
                  }}
                  placeholderStyle={{
                    color: textColor,
                  }}
                  listItemLabelStyle={{
                    color: textColor,
                  }}
                />
              </View>

              {recommendationLoading ? (
                <View style={[styles.center, { backgroundColor }]}>
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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // height: "100%",
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
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default HomeScreen;
