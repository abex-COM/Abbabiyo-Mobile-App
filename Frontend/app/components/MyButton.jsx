import React from "react";
import { Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Assuming you have theme context

export default function MyButton({
  onPress,
  title = "Submit",
  isSubmitting,
  style,
  textStyle,
}) {
  const { isDarkMode } = useTheme(); // Get theme state (light/dark)

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        style,
        { backgroundColor: isDarkMode ? "#4b5563" : "green" },
      ]}
    >
      {isSubmitting ? (
        <ActivityIndicator color="white" size={24} />
      ) : (
        <Text
          style={[
            textStyle,
            { color: isDarkMode ? "#fff" : "#fff" }, // Text color for both light and dark modes
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 160,
    width: "100%", // Makes sure the button stretches across the width
  },
});
