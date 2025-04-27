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
import { useTranslation } from "react-i18next";
import ManageFarmLocationsScreen from "../screens/ManageFarmLocationsScreen";

export default function AuthNavigator() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const headerBackgroundColor = isDarkMode
    ? Colors.darkTheme.statusbarColor
    : Colors.lightTheme.backgroundColor;
  const headerTintColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;

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
        options={{
          headerTitle: "Sign Up",
          headerTintColor: headerTintColor,
          headerStyle: {
            backgroundColor: headerBackgroundColor, // Dynamic background color for header
          },
        }}
      />
      <Stack.Screen
        name="signupScreen"
        component={SignupScreen}
        options={{
          headerTitle: "Sign Up",
          headerTintColor: headerTintColor,
          headerStyle: {
            backgroundColor: headerBackgroundColor, // Dynamic background color for header
          },
        }}
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
          headerTintColor: headerTintColor,
          headerStyle: {
            backgroundColor: headerBackgroundColor, // Dynamic background color for header
          },
          headerShown: true, // Show header for back navigation
        }}
      />
      <Stack.Screen
        name="DiseaseDetector"
        component={DiseaseDetector}
        options={{
          headerTitle: t("disease_detector"), // Automatically handles translation based on current language
          headerTintColor: headerTintColor,
          headerStyle: {
            backgroundColor: headerBackgroundColor, // Dynamic background color for header
          },
          headerShown: true, // Show header for back navigation
        }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={({ route }) => ({
          headerTitle: route.params?.post?.author?.name + `'s ${t("post")}`,
          headerTintColor: headerTintColor,
          headerStyle: {
            backgroundColor: headerBackgroundColor,
          },
          animation: "slide_from_bottom", // Animation for the screen transition",
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="EditPost"
        component={UpdatePostScreen}
        options={{
          headerTitle: t("edit_post"), // Automatically handles translation based on current language
          headerTintColor: headerTintColor, // Dynamic text color based on theme
          headerStyle: {
            backgroundColor: headerBackgroundColor, // Dynamic background color for header
          },
          headerShown: true, // Show header for back navigation
        }}
      />
        <Stack.Screen
              name="ManageFarmLocations"
              component={ManageFarmLocationsScreen}  // Register the new screen
              options={{
                headerStyle: {
                  backgroundColor: headerBackgroundColor,
                },
                headerTintColor: headerTintColor,
                headerTitle: t("manage_farm_locations"),
              }}
            />
          {/* </Stack.Navigator> */}
    </Stack.Navigator>
  );
}
