import { View, Text } from "react-native";
import React from "react";

export default function ErrorText({ message }) {
  if (!message) return null;

  return <Text className="w-full text-red-500 h-8 ">{message}</Text>;
}
