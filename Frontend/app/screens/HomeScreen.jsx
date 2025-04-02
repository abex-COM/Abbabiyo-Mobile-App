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
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Colors.darkTheme.backgroundColor
            : Colors.lightTheme.backgroundColor,
        },
      ]}
    >
      <StatusBar
        backgroundColor={
          isDarkMode
            ? Colors.darkTheme.backgroundColor
            : Colors.lightTheme.textColor
        }
      />
      {/* Weather Section */}
      <View style={styles.weatherContainer}>
        <Text style={styles.weatherTitle}>{t("weather_today")}</Text>
        <Text style={styles.weatherText}>{t("temperature")}</Text>
      </View>

      {/* Recommended Crops */}
      <View style={styles.cropContainer}>
        <Text style={styles.cropTitle}>{t("recommended_crops")}</Text>
        <View style={styles.cropList}>
          <CropCard name="Maize" image="https://placeimg.com/150/150" />
          <CropCard name="Wheat" image="https://via.placeholder.com/100" />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <MyButton
          title="Ask AI Assistant"
          onPress={() => navigation.navigate("Chat")}
        />
        <MyButton
          title="Detect Disease"
          onPress={() => navigation.navigate("Upload")}
          style={styles.detectButton}
        />
        <MyButton
          title="My Farm Data"
          onPress={() => navigation.navigate("Account")}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  weatherContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    width: "83%",
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
  },
  buttonContainer: {
    marginTop: 16,
    width: "80%",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "#fef9c3",
    padding: 16,
    borderRadius: 12,
  },
  detectButton: {
    backgroundColor: "#d97706", // Yellow-600
  },
});
