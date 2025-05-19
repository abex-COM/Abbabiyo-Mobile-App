import React, { useEffect, useState } from "react";
import { View, ScrollView, Alert, StyleSheet } from "react-native";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Card,
  IconButton,
} from "react-native-paper";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";
import axios from "axios";
import { getSocket, initiateSocketConnection } from "../utils/socket";
import { useUser } from "@/context/UserContext";
import baseUrl from "@/baseUrl/baseUrl";
import useFarmLocations from "../hooks/useFarmLocation";
import { useTheme } from "@/context/ThemeContext"; // Add the theme context
import { t } from "i18next";

const ManageFarmLocationsScreen = () => {
  const { user, token } = useUser();
  const { isDarkMode } = useTheme(); // Access the theme context
  const [newFarmName, setNewFarmName] = useState("");
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLon, setCurrentLon] = useState(null);
  const [editingFarmId, setEditingFarmId] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { loading, farmLocations, refetch, setFarmLocations } =
    useFarmLocations();

  const backgroundColor = isDarkMode ? "#333" : "#FAFAFA"; // Background color
  const textColor = isDarkMode ? "#FFF" : "#000"; // Text color
  const cardColor = isDarkMode ? "#444" : "#FFF"; // Card background color

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please enable location permission.");
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    try {
      const granted = await requestLocationPermission();
      if (!granted) return;

      setDetectingLocation(true);
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
      console.error(err);
      Toast.show({
        type: "error",
        text1:
          typeof err.response?.data?.error === "string"
            ? err.response.data.error
            : err.response?.data?.error?.message || "Failed to detect location",
      });
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleAddOrUpdateFarmLocation = async () => {
    if (!newFarmName.trim()) {
      Alert.alert("Validation", "Please enter a farm name.");
      return;
    }
    if (currentLat === null || currentLon === null) {
      Alert.alert("Location Missing", "Please detect your location.");
      return;
    }

    try {
      if (editingFarmId) {
        await axios.put(
          `${baseUrl}/api/farm-locations/update`,
          {
            userId: user._id,
            farmLocationId: editingFarmId,
            name: newFarmName.trim(),
            lat: currentLat,
            lon: currentLon,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Toast.show({ type: "success", text1: "Farm Updated!" });
      } else {
        await axios.post(
          `${baseUrl}/api/farm-locations/add`,
          {
            userId: user._id,
            name: newFarmName.trim(),
            lat: currentLat,
            lon: currentLon,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Toast.show({ type: "success", text1: "Farm Added!" });
      }
      await refetch(); // FIXED: this must be called as a function
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1:
          typeof err.response?.data?.error === "string"
            ? err.response.data.error
            : err.response?.data?.error?.message || "Operation failed",
      });
    }
  };

  const handleEditFarm = (farm) => {
    setEditingFarmId(farm._id);
    setNewFarmName(farm.name);
    setCurrentLat(farm.lat);
    setCurrentLon(farm.lon);
    setShowForm(true);
  };

  const handleDeleteFarmLocation = async (farmId) => {
    Alert.alert("Confirm Delete", "Delete this farm location?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(
              `${baseUrl}/api/farm-locations/${user._id}/${farmId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            await refetch(); // ✅ FIXED
            Toast.show({ type: "success", text1: "Deleted successfully!" });
          } catch (err) {
            console.log(err);
            Toast.show({
              type: "error",
              text1: "Failed to delete farm.",
            });
          }
        },
      },
    ]);
  };

  const resetForm = () => {
    setEditingFarmId(null);
    setNewFarmName("");
    setCurrentLat(null);
    setCurrentLon(null);
  };

  useEffect(() => {
    if (!user?._id || !token) return;

    initiateSocketConnection(user._id);
    const socket = getSocket();

    socket.on("newFarm", (newFarmLocations) => {
      setFarmLocations(newFarmLocations);
    });

    return () => {
      socket.off("newFarm");
    };
  }, [user, token]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Text
        variant="headlineSmall"
        style={[styles.header, { color: textColor }]}
      >
        {t("manage_farm_locations")}
      </Text>

      {!showForm && (
        <Button
          mode="outlined"
          textColor="#1070ff"
          onPress={() => setShowForm(true)}
          style={styles.addFarmButton}
        >
          + {t("add_farm_location")}
        </Button>
      )}

      {showForm && (
        <View style={[styles.form, { backgroundColor: cardColor }]}>
          <TextInput
            label="Farm Name"
            mode="outlined"
            value={newFarmName}
            onChangeText={setNewFarmName}
            style={[styles.input, { backgroundColor, color: textColor }]}
            textColor={textColor}
          />

          <Button
            mode="outlined"
            icon={detectingLocation ? null : "crosshairs-gps"}
            onPress={getCurrentLocation}
            disabled={detectingLocation}
            style={styles.detectLocationButton}
            background={backgroundColor}
            textColor={textColor}
          >
            {detectingLocation ? (
              <ActivityIndicator size={20} color="#1070ff" />
            ) : (
              t("detect_location")
            )}
          </Button>

          {currentLat && currentLon && (
            <Text style={[styles.coords, { color: textColor }]}>
              📍 {currentLat.toFixed(4)}, {currentLon.toFixed(4)}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleAddOrUpdateFarmLocation}
            background={backgroundColor}
            textColor={textColor}
            disabled={!newFarmName.trim() || !currentLat || !currentLon}
            style={{ marginTop: 10 }}
          >
            {editingFarmId ? t("update-farm") : t("add-farm")}
          </Button>

          {editingFarmId && (
            <Button mode="text" onPress={resetForm} style={{ marginTop: 5 }}>
              Cancel Edit
            </Button>
          )}
        </View>
      )}

      <Text
        variant="titleMedium"
        style={[styles.subHeader, { color: textColor }]}
      >
        {t("farm_locations")}
      </Text>

      {loading ? (
        <ActivityIndicator animating={true} size="large" />
      ) : farmLocations.length > 0 ? (
        farmLocations.map((farm) => (
          <Card
            key={farm._id}
            style={[styles.card, { backgroundColor: cardColor }]}
            mode="outlined"
          >
            <Card.Title
              title={String(farm.name)}
              // titleStyle={{ color: textColor }}
              subtitleStyle={{ color: textColor }}
              // subtitle={`Lat: ${farm.lat?.toFixed(4)} | Lon: ${farm.lon?.toFixed(4)}`}
              right={() => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton
                    icon="pencil"
                    iconColor="#007BFF"
                    onPress={() => handleEditFarm(farm)}
                  />
                  <IconButton
                    icon="delete"
                    iconColor="#FF6347"
                    onPress={() => handleDeleteFarmLocation(farm._id)}
                  />
                </View>
              )}
            />
          </Card>
        ))
      ) : (
        <Text style={[styles.noFarms, { color: textColor }]}>
          {t("no_farm_locations")}
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    elevation: 2,
  },
  input: {
    marginBottom: 15,
  },
  coords: {
    textAlign: "center",
    marginVertical: 10,
  },
  subHeader: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 12,
  },
  noFarms: {
    textAlign: "center",
    marginTop: 20,
  },
  addFarmButton: {
    marginBottom: 15,
  },
  detectLocationButton: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default ManageFarmLocationsScreen;
