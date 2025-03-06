import { TextInput } from "react-native";
import React from "react";

export default function MyTextInput({
  placeholder,
  value,
  onChangeText,
  className,
}) {
  return (
    <TextInput
      placeholder={placeholder}
      className={`w-full  bg-white rounded-md p-4 ${className}`}
      value={value}
      onChangeText={onChangeText}
    />
  );
}
