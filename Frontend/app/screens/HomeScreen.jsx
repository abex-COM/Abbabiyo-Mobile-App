import React from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MyButton from "../components/MyButton";
import Recommendation from "../components/Recommendation"; // Import the new Recommendation component
import { useTranslation } from "react-i18next";
import { Colors } from "../constants/Colors";
import { useTheme } from "@/context/ThemeContext";

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode
    ? Colors.darkTheme.backgroundColor
    : Colors.lightTheme.backgroundColor;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}
    >
      <StatusBar backgroundColor={isDarkMode ? backgroundColor : "green"} />

      {/* Recommendation Section */}
      <Recommendation /> {/* Add the recommendation component here */}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <MyButton
          title={t("ask_ai_assistant")}
          onPress={() => navigation.navigate("askGemini")}
        />
        <MyButton
          title={t("detect_disease")}
          onPress={() => navigation.navigate("DiseaseDetector")}
          style={styles.detectButton}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  buttonContainer: {
    marginTop: 76,
    width: "80%",
    gap: 12,
    padding: 16,
    alignItems: "center",
  },
  detectButton: {
    backgroundColor: "#d97706", // Yellow-600
  },
});