import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Vibration,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import Toast from "react-native-toast-message";
import { Audio } from "expo-av";

export default function DiseaseDetector() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isDarkMode } = useTheme();

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      base64: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
      setError(""); // Clear previous errors
    }
  };

  const playErrorSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/error-call-to-attention-129258.mp3")
      );
      await sound.playAsync();
    } catch (e) {
      console.warn("Could not play error sound", e);
    }
  };

  const playSucessSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/success-221935.mp3")
      );
      await sound.playAsync();
    } catch (e) {
      console.warn("Could not play success sound", e);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", {
      uri: image,
      name: "image.jpg",
      type: "image/jpeg",
    });

    try {
      const res = await axios.post(
        `http://192.168.137.1:8000/predict`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(res.data);
      setError("");
      setLoading(false);
      await playSucessSound();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.detail || err?.message || "Unknown error occurred";
      console.log("Prediction failed", errorMsg);
      setError(errorMsg);
      Vibration.vibrate();
      await playErrorSound();
      Toast.show({
        type: "error",
        text1: "Failed to predict",
        text2: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const theme = isDarkMode ? styles.dark : styles.light;

  return (
    <ScrollView style={{ height: "100%" }}>
      <View style={[styles.container, theme.bg]}>
        <Text style={[styles.description, theme.text]}>
          <Text style={{ fontWeight: "bold", color: "green" }}>
            Abbaa Biyyo
          </Text>{" "}
          is an agricultural assistant for Ethiopian farmers. Upload a plant
          image to detect disease.
        </Text>

        <View style={[styles.card, theme.card]}>
          <Text style={[styles.subtitle, { color: "green" }]}>
            🌿 Plant Disease Detector
          </Text>

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Feather name="upload-cloud" size={20} color="green" />
            <Text style={styles.uploadText}>Choose Image</Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image }}
              style={styles.preview}
              resizeMode="contain"
            />
          )}

          <TouchableOpacity
            style={styles.predictButton}
            onPress={handleUpload}
            disabled={!image || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.predictText}>Predict</Text>
            )}
          </TouchableOpacity>

          <View style={{ marginTop: 16, alignItems: "center" }}>
            {error ? (
              <Text style={{ color: "red", marginTop: 10 }}>❌ {error}</Text>
            ) : result ? (
              <>
                <Text
                  style={{ color: "green", fontWeight: "bold", fontSize: 16 }}
                >
                  ✅ Prediction: {result.predicted_class}
                </Text>
                <Text style={theme.text}>Confidence: {result.confidence}%</Text>
              </>
            ) : null}
          </View>
        </View>

        <View style={[styles.footer, theme.footer]}>
          <Text style={theme.text}>
            © 2025 Abbaa Biyyo. All Rights Reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold" },
  description: { textAlign: "center", paddingHorizontal: 20, marginTop: 10 },
  card: {
    marginTop: 20,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: "green",
    borderStyle: "dashed",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  uploadText: { color: "green", marginLeft: 8 },
  preview: { height: 200, width: "100%", borderRadius: 10, marginTop: 10 },
  predictButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  predictText: { color: "#fff", fontWeight: "bold" },
  footer: { padding: 20, alignItems: "center", marginTop: 30 },
  light: {
    bg: { backgroundColor: "#f0f0f0" },
    text: { color: "#333" },
    header: { backgroundColor: "#fff" },
    footer: { backgroundColor: "#ddd" },
    card: { backgroundColor: "#fff" },
  },
  dark: {
    bg: { backgroundColor: "#111" },
    text: { color: "#eee" },
    header: { backgroundColor: "#222" },
    footer: { backgroundColor: "#222" },
    card: { backgroundColor: "#333" },
  },
});
