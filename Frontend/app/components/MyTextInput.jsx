import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // or use another icon library

export default function MyTextInput({
  placeholder,
  value,
  onChangeText,
  className,
  secureText,
  ...otherProps
}) {
  // State to toggle password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Toggle password visibility when icon is pressed
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={{ position: "relative" }}>
      <TextInput
        placeholder={placeholder}
        className={`w-full bg-white h-max rounded-md p-4 ${className}`}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureText && !isPasswordVisible} // Use secureText prop and toggle visibility
        {...otherProps}
      />

      {secureText && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          className="absolute right-2 top-2 p-2"
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
