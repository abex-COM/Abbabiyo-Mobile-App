import React, { useState } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MyButton from "../components/MyButton";
import LanguageDropDown from "../components/LanguageSelector";
import CropCard from "../components/CropCard";
import { useUser } from "@/context/userContext";
const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View className="flex-1 bg-gray-100 items-center w-full gap-10">
      <StatusBar backgroundColor="#f3f4f6" barStyle="dark-content" />

      <View className="bg-white p-4 rounded-xl shadow-md mb-4 w-4/5 mt-3 items-center">
        <Text className="text-lg font-bold">🌦️ Today's Weather</Text>
        <Text className="text-gray-600">Temperature: 28°C | Rain: 10%</Text>
      </View>

      {/* Recommended Crops */}
      <View className="bg-white p-4 rounded-xl shadow-md mb-4 w-5/6">
        <Text className="text-lg font-bold">🌾 Recommended Crops</Text>
        <View className="flex-row justify-between mt-3 w-5/6">
          <CropCard name="Maize" image="https://placeimg.com/150/150" />
          <CropCard name="Wheat" image="https://via.placeholder.com/100" />
        </View>
      </View>

      <View className="mt-4 w-4/5 gap-3 shadow-md bg-yellow-100 p-4">
        <MyButton
          title="Ask AI Assistant"
          className="w-full"
          onPress={() => navigation.navigate("Chat")}
        />
        <MyButton
          title="Detecet Disease "
          className="w-full bg-yellow-600"
          onPress={() => navigation.navigate("Upload")}
        />
        <MyButton
          title="My Farm Data"
          className="w-full"
          onPress={() => navigation.navigate("Account")}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
