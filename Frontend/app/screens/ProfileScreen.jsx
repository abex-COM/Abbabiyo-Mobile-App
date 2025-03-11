import { View, Text } from "react-native";
import React from "react";
import MyButton from "../components/MyButton";
import { useUser } from "@/context/userContext";

export default function ProfileScreen({ navigation }) {
  const { logout } = useUser();

  return (
    <View className="mt-10 m-autoborder-2 w-full flex-1">
      <MyButton
        title="Logout"
        className="bg-yellow-900"
        onPress={() => {
          logout();
          navigation.navigate("welcomeScreen");
        }}
      >
        Logout
      </MyButton>
    </View>
  );
}
