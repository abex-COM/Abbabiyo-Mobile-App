import { ImageBackground, StatusBar, Text, View } from "react-native";
import React, { useEffect } from "react";
import background from "../../assets/images/farmer-b.jpg";
import MyButton from "../components/MyButton";
import { useUser } from "@/context/UserContext";

export default function Welcome({ navigation }) {
  const { token, language } = useUser();
  const handleLogin = () => {
    if (token) {
      navigation.navigate("bottomNavigator");
    } else navigation.navigate("loginScreen");
  };
  return (
    <ImageBackground
      source={background}
      className="w-full h-full flex-1 justify-around items-center "
      resizeMode="cover"
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content" // Use "dark-content" for dark images
      />
      <View className="text-center">
        <Text className="text-yellow-900 text-2xl font-bold mb-40   p-4 rounded-[10rem]">
          {language === "en"
            ? "Welcome to Abbabiyo AI Assitant "
            : language == "om"
              ? "Baga  Gara Abbabiyo AI tti Nagaa n Dhufta"
              : "ወደ አባቢዮ  AI ረዳት እንኳን በደህና መጡ"}
        </Text>
      </View>
      <View className="gap-5">
        <MyButton
          title="Login"
          onPress={handleLogin}
          style={{ width: 200 }}
          textStyle={{ fontSize: 20 }}
        />
        <MyButton
          title="SignUp"
          style={{ width: 200 }}
          onPress={() => navigation.navigate("signupScreen")}
          textStyle={{ fontSize: 20 }}
        />
      </View>
    </ImageBackground>
  );
}
