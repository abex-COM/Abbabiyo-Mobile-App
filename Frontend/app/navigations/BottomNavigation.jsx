import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChatScreen from "../screens/AllPostsScreen";
import HomeScreen from "../screens/HomeScreen";
import LanguageDropdown from "../components/LanguageSelector";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useUser } from "@/context/UserContext";
import PageStack from "../navigations/PageNavigator";
import { useLanguage } from "@/context/LanguageContexts";
import { useTranslation } from "react-i18next";
import GeminiScreen from "@/app/screens/GeminiScreen";
import { useTheme } from "@/context/ThemeContext";
import { useNavigation } from "expo-router";

// Create the Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const tabBarBackgroundColor = isDarkMode ? "#1f2937" : "#009000";
  const tabBarActiveBackgroundColor = isDarkMode ? "#111227" : "#006400";
  const headerBackgroundColor = isDarkMode ? "#111827" : "#f3f4f6";
  const textColor = isDarkMode ? "#F9FAFB" : "#1f2937";
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarActiveBackgroundColor: tabBarActiveBackgroundColor,
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("home"),
          headerStyle: {
            backgroundColor: headerBackgroundColor,
            shadowColor: "transparent",
          },
          headerTintColor: textColor,
          headerRight: () => (
            <View style={{ alignItems: "center", paddingRight: 10 }}>
              <LanguageDropdown value={language} onChange={setLanguage} />
            </View>
          ),
          headerTitle: () => <HeaderWelcome />,
          tabBarIcon: ({ color, size = 30 }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="askGemini"
        component={GeminiScreen}
        options={{
          title: t("chatbot"),
          headerTitle: t("ask_gemini"),
          headerStyle: {
            backgroundColor: headerBackgroundColor,
            shadowColor: "transparent",
          },
          headerTintColor: textColor,

          tabBarIcon: ({ color, size = 30 }) => (
            <MaterialCommunityIcons name="robot" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: t("chat"),
          headerTitle: "Posts",
          headerStyle: {
            backgroundColor: headerBackgroundColor,
            shadowColor: "transparent",
          },
          headerTintColor: textColor,
          headerRight: () => (
            <View className="pr-10">
              <Pressable onPress={() => navigation.navigate("myposts")}>
                <Text style={{ color: textColor, fontWeight: 600 }}>
                  My Posts
                </Text>
              </Pressable>
            </View>
          ),
          tabBarIcon: ({ color, size = 30 }) => (
            <MaterialCommunityIcons name="chat" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={PageStack}
        options={{
          title:
            language === "en"
              ? "Account"
              : language == "om"
                ? "Akkaawuntii"
                : "አካውንት",
          headerShown: false,
          tabBarIcon: ({ color, size = 30 }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const HeaderWelcome = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? "#F9FAFB" : "#1f2937";
  return (
    <View style={{ flexDirection: "row", gap: 5 }}>
      <Text style={{ fontWeight: "500", color: textColor }}>
        {t("welcome_back") + " ,"}
      </Text>
      <Text style={{ fontWeight: "900", color: "green" }}>
        {user?.name ? user?.name : <ActivityIndicator />}
      </Text>
    </View>
  );
};
