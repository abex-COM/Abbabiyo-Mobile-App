import { ImageBackground, StatusBar, Text, View } from "react-native";
import React from "react";
import background from "../../assets/images/farmer2.png";
import MyButton from "../components/MyButton";

export default function Welcome({ navigation }) {
  return (
    <ImageBackground
      source={background}
      className="w-full h-full flex-1 justify-around items-center "
      resizeMode="cover"
    >
      <StatusBar backgroundColor="grey" barStyle="light-content" />
      <View className="text-center">
        <Text className="text-orange-200 text-2xl font-bold mb-40 bg-orange-900 shadow-md p-4 rounded-[10rem]">
          Welcome to Abbabiyo AI Assitant
        </Text>
      </View>
      <View className="gap-5">
        <MyButton
          title="Login"
          className="bg-orange-700"
          onPress={() => navigation.navigate("loginScreen")}
        />
        <MyButton
          title="SignUp"
          className="bg-orange-700"
          onPress={() => navigation.navigate("signupScreen")}
        />
      </View>
    </ImageBackground>
  );
}
