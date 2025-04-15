import React from "react";
// Only import react-native-gesture-handler on native platforms
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import FeedNavigator from "../navigations/BottomNavigation";
import welcomeScreen from "../screens/welcomeScreen";
import MyPosts from "../screens/MyPosts";
import { t } from "i18next";
import { Colors } from "../constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import DiseaseDetector from "../screens/DiseaseDetectionScreen";

export default function AuthNavigator() {
  const { isDarkMode } = useTheme();
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
      <Stack.Screen
        name="myposts"
        component={MyPosts}
        options={{
          headerTitle: t("myposts"),
          headerTintColor: isDarkMode
            ? Colors.darkTheme.textColor
            : Colors.lightTheme.textColor,
          headerStyle: {
            backgroundColor: isDarkMode
              ? "#111827"
              : Colors.lightTheme.backgroundColor, // Dynamic background color for header
          },
          headerShown: true, // Show header for back navigation
        }}
      />
      <Stack.Screen
        name="DiseaseDetector"
        component={DiseaseDetector}
        options={{
          headerTitle: t("disease_detector"), // Automatically handles translation based on current language
          headerTintColor: isDarkMode
            ? Colors.darkTheme.textColor
            : Colors.lightTheme.textColor,
          headerStyle: {
            backgroundColor: isDarkMode
              ? "#111827"
              : Colors.lightTheme.backgroundColor, // Dynamic background color for header
          },
          headerShown: true, // Show header for back navigation
        }}
      />
    </Stack.Navigator>
  );
}
