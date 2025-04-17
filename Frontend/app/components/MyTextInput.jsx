import { useTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // or use another icon library
import { Colors } from "../constants/Colors";

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
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        // placeholderTextColor={
        //   isDarkMode ? Colors.darkTheme.textColor : Colors.lightTheme.textColor
        // }
        value={value}
        style={[
          styles.input,
          style,
          // {
          //   backgroundColor: isDarkMode
          //     ? Colors.darkTheme.backgroundColor
          //     : Colors.lightTheme.backgroundColor,
          //   color: isDarkMode
          //     ? Colors.darkTheme.textColor
          //     : Colors.lightTheme.textColor,
          // },
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
    borderWidth: 1,
    borderColor: "#f1eee7",
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
