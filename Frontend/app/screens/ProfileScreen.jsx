import { View, Text } from "react-native";
import React from "react";
import MyButton from "../components/MyButton";

export default function ProfileScreen({ navigation }) {
  return (
    <View className="mt-10 m-autoborder-2 w-full flex-1">
      <MyButton
        title="Logout"
        className="bg-yellow-900"
        onPress={() => navigation.navigate("welcomeScreen")}
      >
        Logout
      </MyButton>
    </View>
  );
}
