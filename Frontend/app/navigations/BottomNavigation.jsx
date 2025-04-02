import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChatScreen from "../screens/ChatScreen";
import HomeScreen from "../screens/HomeScreen";
import LanguageDropdown from "../components/LanguageSelector";
import { ActivityIndicator, Text, View } from "react-native";
import { useUser } from "@/context/UserContext";
import PageStack from "../navigations/PageNavigator";
import { useLanguage } from "@/context/LanguageContexts";
import { useTranslation } from "react-i18next";
// Create the Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarActiveBackgroundColor: "#006400",
        tabBarInactiveTintColor: "white",

        tabBarStyle: {
          backgroundColor: "#009000",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("home"),
          headerStyle: {
            backgroundColor: "#f3f4f6",
            shadowColor: "transparent",
          },

          headerRight: () => (
            <View style={{ alignItems: "center", paddingRight: 10 }}>
              <LanguageDropdown value={language} onChange={setLanguage} />
            </View>
          ),
          headerTitle: () => <HeaderWelcome language={language} />,
          tabBarIcon: ({ color, size = 30 }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: t("chat"),

          headerTitle: "Posts",
          headerRight: () => (
            <View className="pr-2">
              <Text> {new Date().toLocaleDateString()}</Text>
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
  return (
    <View style={{ flexDirection: "row", gap: 5 }}>
      <Text style={{ fontWeight: "500" }}>{t("welcome_back")}</Text>
      <Text style={{ fontWeight: "900", color: "green" }}>
        {user?.name ? user?.name : <ActivityIndicator />}
      </Text>
    </View>
  );
};
