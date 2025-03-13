import React from "react";
// Only import react-native-gesture-handler on native platforms
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import FeedNavigator from "../navigations/BottomNavigation";
import welcomeScreen from "../screens/welcomeScreen";

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "#009000",
        },
      }}
    >
      <Stack.Screen
        name="welcomeScreen"
        component={welcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="loginScreen"
        component={LoginScreen}
        options={{ headerTitle: "Login" }}
      />
      <Stack.Screen
        name="signupScreen"
        component={SignupScreen}
        options={{ headerTitle: "SignUp" }}
      />

      <Stack.Screen
        name="bottomNavigator"
        component={FeedNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
