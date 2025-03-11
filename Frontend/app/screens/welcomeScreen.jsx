import { ImageBackground, StatusBar, Text, View } from "react-native";
import React, { useEffect } from "react";
import background from "../../assets/images/farmer2.png";
import MyButton from "../components/MyButton";
import { useUser } from "@/context/userContext";

export default function Welcome({ navigation }) {
  const { token } = useUser();
  // useEffect(() => {
  //   console.log(token);
  //   if (token) {
  //     navigation.replace("bottomNavigator");
  //   }
  // }, []); //  Dependency array includes `token` and `navigation`

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
        <Text className="text-green-100 text-2xl font-bold mb-40   p-4 rounded-[10rem]">
          Welcome to Abbabiyo AI Assitant
        </Text>
      </View>
      <View className="gap-5">
        <MyButton
          title="Login"
          className="bg-[#009000]"
          onPress={() => navigation.navigate("loginScreen")}
        />
        <MyButton
          title="SignUp"
          className="bg-[#009000]"
          onPress={() => navigation.navigate("signupScreen")}
        />
      </View>
    </ImageBackground>
  );
}
