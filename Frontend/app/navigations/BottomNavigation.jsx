import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChatScreen from "../screens/ChatScreen";
import HomeScreen from "../screens/HomeScreen";
import PostScreen from "../screens/PostScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LanguageDropdown from "../components/LanguageSelector";
import { Text, View } from "react-native";
import { useUser } from "@/context/userContext";
import { date } from "yup";
// Create the Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  const { language, setLanguage } = useUser();

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
          headerStyle: {
            backgroundColor: "#f3f4f6",
            shadowColor: "transparent",
          },

          headerRight: () => (
            <View style={{ alignItems: "center", paddingRight: 10 }}>
              <LanguageDropdown value={language} onChange={setLanguage} />
            </View>
          ),
          headerTitle: "Welcome back, Farmer 🌱",
          tabBarIcon: ({ color, size = 30 }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="chat"
        component={ChatScreen}
        options={{
          headerStyle: {
            backgroundColor: "#f3f4f6",
            shadowColor: "transparent",
          },
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
        name="Post"
        component={PostScreen}
        options={{
          tabBarIcon: ({ color, size = 30 }) => (
            <MaterialCommunityIcons name="plus" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size = 30 }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
