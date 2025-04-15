import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TypingIndicator = ({ visible }) => {
  if (!visible) return null;

  const { isDarkMode } = useTheme();

  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 25,
      height: 50,
      marginBottom: 30,
    },
    text: {
      color: isDarkMode ? "#ccc" : "#555",
      marginRight: 8,
    },
    dotContainer: { flexDirection: "row" },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: isDarkMode ? "#aaa" : "#888",
      marginHorizontal: 2,
      opacity: 0.6,
      marginTop: 20,
      marginBottom: 20,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.text}>Assistant is typing...</Text>
      <View style={dynamicStyles.dotContainer}>
        <View style={dynamicStyles.dot} />
        <View style={dynamicStyles.dot} />
        <View style={dynamicStyles.dot} />
      </View>
    </View>
  );
};

export default TypingIndicator;
