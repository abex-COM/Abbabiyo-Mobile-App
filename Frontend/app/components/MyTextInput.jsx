import { useTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // or use another icon library
import Colors from "../constants/Colors";

export default function MyTextInput({
  placeholder,
  value,
  onChangeText,
  className,
  secureText,
  style,
  ...otherProps
}) {
  // State to toggle password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { isDarkMode } = useTheme();
  // Toggle password visibility when icon is pressed
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const backgroundColor = isDarkMode
    ? Colors.darkTheme.backgroundColor
    : Colors.lightTheme.backgroundColor;
  const textColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={textColor}
        value={value}
        style={[
          styles.input,
          style,
          {
            backgroundColor: backgroundColor,
            color: textColor,
          },
        ]}
        onChangeText={onChangeText}
        secureTextEntry={secureText && !isPasswordVisible} // Use secureText prop and toggle visibility
        {...otherProps}
      />

      {secureText && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.icon}
        >
          <MaterialCommunityIcons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "white",
    borderRadius: 10,
  },
  input: {
    minWidth: "100%",
    borderWidth: 2,
    borderColor: "#41403e",
    borderRadius: 10,
    padding: 10,
    paddingLeft: 20,
  },
  icon: {
    position: "absolute",
    right: 8,
    top: 10,
  },
});
