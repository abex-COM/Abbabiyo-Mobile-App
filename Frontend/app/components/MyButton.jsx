import { Text, Pressable, TouchableHighlight } from "react-native";
import React from "react";

export default function MyButton({ onPress, className, title = "Submit" }) {
  return (
    <Pressable
      onPress={onPress}
      className={`bg-orange-700 ${className}  rounded-md w-40 p-2 justify-center items-center `}
    >
      <Text className="text-white text-xl">{title}</Text>
    </Pressable>
  );
}
