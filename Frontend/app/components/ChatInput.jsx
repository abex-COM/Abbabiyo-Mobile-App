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

const ChatInput = ({
  onSend,
  onImagePick,
  placeholder = "Type a message...",
  value,
  onChangeText,
  imageUri,
  isLoading,
  imagePickerIcon = false,
}) => {
  return (
    // <View style={[styles.container, styles.firstLetter]}>
    <View style={styles.innerContainer}>
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
        style={styles.textInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />

      {/* Send Button */}
      <TouchableOpacity onPress={onSend}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Ionicons name="send" size={24} color="green" />
        )}
      </TouchableOpacity>
    </View>
    // </View>
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
    borderColor: "#bbbdc1", // Border color similar to "border-slate-300"
    borderRadius: 8,
    padding: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6", // slate-200
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
