import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  View,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

const ChatInput = ({
  onSend,
  onImagePick,
  placeholder = "Type a message...",
  value,
  onChangeText,
  imageUri,
  isLoading,
  imagePickerIcon = false,
  customStyle,
}) => {
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode ? "#374151" : "#f3f4f6";
  const borderColor = isDarkMode ? "#4B5563" : "#bbbdc1";
  const textColor = isDarkMode ? "#F9FAFB" : "#111827";

  return (
    <View
      style={[
        styles.innerContainer,
        { backgroundColor, borderColor },
        customStyle,
      ]}
    >
      {/* Image Picker Button */}
      {imagePickerIcon && (
        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={onImagePick}
        >
          {!imageUri ? (
            <Ionicons name="image" size={24} color="gray" />
          ) : (
            <Image style={styles.image} source={{ uri: imageUri }} />
          )}
        </TouchableOpacity>
      )}

      {/* TextInput for Comment */}
      <TextInput
        style={[styles.textInput, { color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
        value={value}
        onChangeText={onChangeText}
      />

      {/* Send Button */}
      <TouchableOpacity onPress={onSend}>
        {isLoading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Ionicons name="send" size={24} color="green" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;

// Stylesheet
const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#f3f4f6", // will be overridden
  },
  imagePickerButton: {
    borderRadius: 8,
    overflow: "hidden",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textInput: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
  },
});
