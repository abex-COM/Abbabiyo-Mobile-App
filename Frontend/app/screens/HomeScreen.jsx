import React from "react";
import { View, Text, StatusBar, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MyButton from "../components/MyButton";
import CropCard from "../components/CropCard";
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
      {/* Weather Section */}
      <View style={styles.weatherContainer}>
        <Text style={styles.weatherTitle}>{t("weather_today")}</Text>
        <Text style={styles.weatherText}>{t("temperature")}</Text>
      </View>

      {/* Recommended Crops */}
      <View style={styles.cropContainer}>
        <Text style={styles.cropTitle}>{t("recommended_crops")}</Text>
        <View style={styles.cropList}>
          {/* <CropCard name="Maize" image="https://placeimg.com/150/150" />
          <CropCard name="wheat" image="https://via.placeholder.com/100" /> */}
        </View>
      </View>

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
        {/* <MyButton
          title="My Farm Data"
          onPress={() => navigation.navigate("Account")}
        /> */}
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
  weatherContainer: {
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
    width: "80%",
    marginTop: 12,
    alignItems: "center",
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  weatherText: {
    color: "#6b7280",
  },
  cropContainer: {
    padding: 16,
    borderRadius: 12,
    shadowRadius: 4,
    marginBottom: 16,
    width: "83%",
    borderWidth: 1,
    borderColor: "#5e6269",
    alignItems: "center",
  },
  cropTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cropList: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    width: "83%",
    height: 200,
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
