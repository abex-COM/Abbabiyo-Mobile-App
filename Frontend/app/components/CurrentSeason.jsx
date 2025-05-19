import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext"; // 🔥 Added
import { t } from "i18next";

const CurrentSeason = ({ season }) => {
  const { isDarkMode } = useTheme(); // 🔥 Added
  const backgroundColor = isDarkMode ? "#333" : "#f0f0f0";
  const textColor = isDarkMode ? "#fff" : "#333";

  let correctedSeason;
  if (season) {
    if (season.startsWith("Belg")) {
      correctedSeason = t("belg");
    } else if (season === "Kiremt") {
      correctedSeason = t("kiremt");
    } else if (season === "Bega") {
      correctedSeason = t("bega");
    } else {
      correctedSeason = t("unknown");
    }
  }
  // 🔥 Added
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.seasonText, { color: textColor }]}>
        {t("current_season")}: {correctedSeason}
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
