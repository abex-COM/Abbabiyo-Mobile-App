import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../constants/Colors";

export default function DiseaseDetector() {
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
      <Text>DiseaseDetectionScree</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
