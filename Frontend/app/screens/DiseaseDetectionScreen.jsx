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
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContexts";
import baseUrl from "@/baseUrl/baseUrl";

export default function DiseaseDetector() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prescribeData, setPrescribeData] = useState(null);
  const [prescribing, setPrescribing] = useState(false);

  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();

  const theme = isDarkMode ? styles.dark : styles.light;

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      base64: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
      setPrescribeData(null);
      setError("");
    }
  };

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
      setPrescribeData(null);
      setError("");
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
      const res = await axios.post(`http://192.168.137.1:8000/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      setPrescribeData(null);
      setError("");
      await playSucessSound();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.detail || err?.message || "Unknown error occurred";
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

  const handlePrescribe = async () => {
    if (!result?.predicted_class || !language) return;

    try {
      setPrescribing(true);
      const res = await axios.post("http://192.168.137.1:6000/api/recommendations/prescribe", {
        detectedDisease: result.predicted_class,
        language: language,
      });

      setPrescribeData(res.data);
      await playSucessSound();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Failed to fetch prescription",
        text2: err?.message || "Unknown error",
      });
    } finally {
      setPrescribing(false);
    }
  };

  return (
    <ScrollView style={[styles.container, theme.bg]}>
      <Text style={[styles.description, theme.text]}>
        {t("abbabiyo_is_an_agricultural_assistant_for_Ethiopian_farmers_Upload_a_plant_image_to_detect_disease")}
      </Text>

      <Text style={[styles.subtitle, theme.subtitle]}>
        🌿 {t("plant_disease_detector")}
      </Text>

      <View style={{ gap: 10, marginHorizontal: 20 }}>
        <TouchableOpacity 
          style={[styles.uploadButton, theme.uploadButton]} 
          onPress={pickImage}
        >
          <Feather name="upload-cloud" size={20} color={isDarkMode ? "#4CAF50" : "green"} />
          <Text style={[styles.uploadText, theme.uploadText]}>Upload from Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.uploadButton, theme.uploadButton]} 
          onPress={takePhoto}
        >
          <Feather name="camera" size={20} color={isDarkMode ? "#4CAF50" : "green"} />
          <Text style={[styles.uploadText, theme.uploadText]}>Take a Photo</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <Image
          source={{ uri: image }}
          style={styles.preview}
          resizeMode="contain"
        />
      )}

      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleUpload}
        disabled={!image || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.actionButtonText}>Predict</Text>
        )}
      </TouchableOpacity>

      <View style={{ marginTop: 16, alignItems: "center", marginHorizontal: 20 }}>
        {error ? (
          <Text style={[styles.errorText, theme.errorText]}>
            <Feather name="alert-circle" size={16} color="red" /> {error}
          </Text>
        ) : result ? (
          <>
            <Text style={[styles.resultText, theme.resultText]}>
              <Feather name="check-circle" size={16} color={isDarkMode ? "#4CAF50" : "green"} /> Prediction: {result.predicted_class}
            </Text>
            <Text style={[styles.confidenceText, theme.text]}>
              Confidence: {result.confidence}%
            </Text>

            <TouchableOpacity
              style={[styles.prescribeActionButton]} 
              onPress={handlePrescribe}
              disabled={prescribing}
            >
              {prescribing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionButtonText}>Prescribe & Get Suggestion</Text>
              )}
            </TouchableOpacity>
          </>
        ) : null}
      </View>

      {prescribeData && (
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <View style={styles.sectionHeader}>
            <Feather name="file-text" size={20} color={isDarkMode ? "#bb86fc" : "#333"} />
            <Text style={[styles.sectionTitle, theme.sectionTitle]}>
              Disease Info
            </Text>
          </View>
          <Text style={[styles.infoText, theme.text]}>
            {prescribeData.description}
          </Text>

          <View style={styles.sectionHeader}>
            <Feather name="package" size={20} color={isDarkMode ? "#bb86fc" : "#333"} />
            <Text style={[styles.sectionTitle, theme.sectionTitle]}>
              Medication Suggestion
            </Text>
          </View>
          {prescribeData.recommendedMedications?.map((med, index) => (
            <View key={index} style={[styles.suggestionCard, theme.suggestionCard]}>
              <Text style={theme.text}>{med}</Text>
            </View>
          ))}

          <View style={styles.sectionHeader}>
            <Feather name="user" size={20} color={isDarkMode ? "#bb86fc" : "#333"} />
            <Text style={[styles.sectionTitle, theme.sectionTitle]}>
              Farmer Recommendation
            </Text>
          </View>
          {prescribeData.farmerRecommendations?.map((rec, index) => (
            <View key={index} style={[styles.suggestionCard, theme.suggestionCard]}>
              <Text style={theme.text}>{rec}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  description: {
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  uploadText: {
    marginLeft: 8,
  },
  preview: {
    height: 200,
    width: "90%",
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  actionButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: "center",
  },
  prescribeActionButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: "center",
    width: "100%",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
  },
  resultText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  confidenceText: {
    marginTop: 5,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoText: {
    marginBottom: 15,
    textAlign: "center",
  },
  suggestionCard: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },

  // Light Theme
  light: {
    bg: { backgroundColor: "#fff" },
    text: { color: "#333" },
    subtitle: { color: "green" },
    uploadButton: { borderColor: "green" },
    uploadText: { color: "green" },
    errorText: { color: "red" },
    resultText: { color: "green" },
    sectionTitle: { color: "#333" },
    suggestionCard: { backgroundColor: "#f0f0f0" },
  },

  // Dark Theme
  dark: {
    bg: { backgroundColor: "#121212" },
    text: { color: "#e0e0e0" },
    subtitle: { color: "#4CAF50" },
    uploadButton: { borderColor: "#4CAF50" },
    uploadText: { color: "#4CAF50" },
    errorText: { color: "#f44336" },
    resultText: { color: "#4CAF50" },
    sectionTitle: { color: "#bb86fc" },
    suggestionCard: { backgroundColor: "#1e1e1e" },
  },
});