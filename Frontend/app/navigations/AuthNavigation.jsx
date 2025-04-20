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
import PostDetailScreen from "@/app/screens/PostDetailScreen";
import UpdatePostScreen from "./../screens/EditPostScreen";

export default function AuthNavigator() {
  const headerBackgroundColor = isDarkMode
    ? "#111827"
    : Colors.lightTheme.backgroundColor;
  const headerTintColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;

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
          title: t("myposts"), // Automatically handles translation based on current language
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
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          headerTitle: t("post"), // Automatically handles translation based on current language
          headerTintColor: headerTintColor, // Dynamic text color based on theme
          headerStyle: {
            backgroundColor: isDarkMode
              ? "#111827"
              : Colors.lightTheme.backgroundColor, // Dynamic background color for header
          },
          headerShown: true, // Show header for back navigation
        }}
      />
      <Stack.Screen
        name="EditPost"
        component={UpdatePostScreen}
        options={{
          headerTitle: t("update"), // Automatically handles translation based on current language
          headerTintColor: headerTintColor, // Dynamic text color based on theme
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
