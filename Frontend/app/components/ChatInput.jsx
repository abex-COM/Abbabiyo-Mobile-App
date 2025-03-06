import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, TextInput, Image } from "react-native";

const ChatInput = ({
  onSend,
  onImagePick,
  placeholder = "Type a message...",
  value,
  onChangeText,
  imageUri,
  className,
}) => {
  return (
    <View
      className={`border ${className} rounded-lg p-4 w-full first-letter:border-slate-300 `}
    >
      <View className="flex-row items-center space-x-2 ">
        {/* Image Picker Button */}
        <TouchableOpacity
          className="w-10 h-10 rounded-md overflow-hidden"
          onPress={onImagePick}
        >
          {!imageUri ? (
            <Ionicons name="image" size={24} color="gray" />
          ) : (
            <Image height="100%" width="100%" source={{ uri: imageUri }} />
          )}
        </TouchableOpacity>

        {/* TextInput for Comment */}
        <TextInput
          className="flex-1 rounded-lg p-2"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />

        {/* Send Button */}
        <TouchableOpacity onPress={onSend}>
          <Ionicons name="send" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInput;
