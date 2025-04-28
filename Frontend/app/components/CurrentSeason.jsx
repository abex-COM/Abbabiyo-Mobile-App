import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext"; // 🔥 Added

const CurrentSeason = ({ season }) => {
  const { isDarkMode } = useTheme(); // 🔥 Added

  const backgroundColor = isDarkMode ? "#333" : "#f0f0f0";
  const textColor = isDarkMode ? "#fff" : "#333";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.seasonText, { color: textColor }]}>
        Current Season: {season}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  seasonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CurrentSeason;
