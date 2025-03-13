import React from "react";
import { View, Button } from "react-native";
import Toast from "react-native-toast-message";

export default function Toasts() {
  const showToast = () => {
    Toast.show({
      type: "success", // 'success', 'error', 'info'
      text1: "Hello!",
      text2: "This is a toast message 👋",
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Show Toast" onPress={showToast} />
      <Toast />
    </View>
  );
}
