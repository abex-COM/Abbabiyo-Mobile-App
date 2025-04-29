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
const ManageFarmLocationsScreen = () => {
  const { user, token } = useUser();
  const [newFarmName, setNewFarmName] = useState("");
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLon, setCurrentLon] = useState(null);
  const [farmLocations, setFarmLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingFarmId, setEditingFarmId] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) fetchFarmLocations();
  }, [user, token]);

  const fetchFarmLocations = async () => {
    if (!user || !token) return; // arly return if no user/token
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/api/farm-locations/all/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFarmLocations(res.data?.farmLocations || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status !== 401) {
        // Only show toast for non-401 errors
        Toast.show({
          type: "error",
          text1:
            typeof err.response?.data?.error === "string"
              ? err.response.data.error
              : err.response?.data?.error?.message ||
                "Could not load farm locations",
        });
      }
    } finally {
      setLoading(false);
    }
  };

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
      setLoading(true);
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
      await fetchFarmLocations();
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
    } finally {
      setLoading(false);
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
            setLoading(true);
            await axios.delete(
              `${baseUrl}/api/farm-locations/${user._id}/${farmId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            await fetchFarmLocations();
            Toast.show({ type: "success", text1: "Deleted successfully!" });
          } catch (err) {
            console.log(err);
            Toast.show({
              type: "error",
              text1: "Failed to delete farm.",
            });
          } finally {
            setLoading(false);
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
    const socket = getSocket();
    if (!user || !token) return; // Early return if no user
    {
      initiateSocketConnection(user._id);
    }
    socket.on("newFarm", (newFarmLocations) => {
      console.log("Received new farm locations:", newFarmLocations);
      setFarmLocations(newFarmLocations);
    });

    return () => {
      socket.off("newFarm");
    };
  }, [user, token]);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>
        Manage Farm Locations
      </Text>

      {!showForm && (
        <Button
          mode="outlined"
          onPress={() => setShowForm(true)}
          style={styles.addFarmButton}
        >
          + Add Farm Location
        </Button>
      )}

      {showForm && (
        <View style={styles.form}>
          <TextInput
            label="Farm Name"
            mode="outlined"
            value={newFarmName}
            onChangeText={setNewFarmName}
            style={styles.input}
          />

          <Button
            mode="outlined"
            icon={detectingLocation ? null : "crosshairs-gps"}
            onPress={getCurrentLocation}
            disabled={detectingLocation}
            style={styles.detectLocationButton}
          >
            {detectingLocation ? (
              <ActivityIndicator size={20} color="#1070ff" />
            ) : (
              "Detect Current Location"
            )}
          </Button>

          {currentLat && currentLon && (
            <Text style={styles.coords}>
              📍 {currentLat.toFixed(4)}, {currentLon.toFixed(4)}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleAddOrUpdateFarmLocation}
            disabled={!newFarmName.trim() || !currentLat || !currentLon}
            style={{ marginTop: 10 }}
          >
            {editingFarmId ? "Update Farm" : "Add Farm"}
          </Button>

          {editingFarmId && (
            <Button mode="text" onPress={resetForm} style={{ marginTop: 5 }}>
              Cancel Edit
            </Button>
          )}
        </View>
      )}

      <Text variant="titleMedium" style={styles.subHeader}>
        Your Farms
      </Text>

      {loading ? (
        <ActivityIndicator animating={true} size="large" />
      ) : farmLocations.length > 0 ? (
        farmLocations.map((farm) => (
          <Card key={farm._id} style={styles.card} mode="outlined">
            <Card.Title
              title={String(farm.name)}
              subtitle={`Lat: ${farm.lat?.toFixed(4)} | Lon: ${farm.lon?.toFixed(4)}`}
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
        <Text style={styles.noFarms}>No farms added yet.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FAFAFA",
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
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
    color: "#555",
  },
  subHeader: {
    marginBottom: 10,
    fontWeight: "bold",
    color: "#555",
  },
  card: {
    marginBottom: 12,
  },
  noFarms: {
    textAlign: "center",
    color: "#999",
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
