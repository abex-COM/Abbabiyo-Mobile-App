import {
  Text,
  Pressable,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import React from "react";

export default function MyButton({
  onPress,
  className,
  title = "Submit",
  isSubmitting,
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`bg-[#009000] ${className}  rounded-md w-40 p-2 justify-center items-center `}
    >
      {isSubmitting ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-xl">{title}</Text>
      )}
    </Pressable>
  );
}
