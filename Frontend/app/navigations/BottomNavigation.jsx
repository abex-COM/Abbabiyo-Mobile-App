import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChatScreen from "../screens/AllPostsScreen";
import HomeScreen from "../screens/HomeScreen";
import { useFonts, Montserrat_900Black } from "@expo-google-fonts/montserrat";
import { Pressable, Text, View } from "react-native";
import { useUser } from "@/context/UserContext";
import PageStack from "../navigations/PageNavigator";
import { useTranslation } from "react-i18next";
import GeminiScreen from "@/app/screens/GeminiScreen";
import { useTheme } from "@/context/ThemeContext";
import { useNavigation } from "expo-router";
import DiseaseDetector from "../screens/DiseaseDetectionScreen";

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();

  const tabBarBackgroundColor = isDarkMode ? "#1f2937" : "#009000";
  const tabBarActiveBackgroundColor = isDarkMode ? "#111227" : "#006400";
  const headerBackgroundColor = isDarkMode ? "#111827" : "#f3f4f6";
  const textColor = isDarkMode ? "#F9FAFB" : "#1f2937";
  const [fontsLoaded] = useFonts({
    Montserrat_900Black,
  });

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
          headerTitle: t("Abbabiyo AI"),
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
          title: t("posts"),
          headerTitle: t("posts"),
          headerStyle: {
            backgroundColor: headerBackgroundColor,
            shadowColor: "transparent",
          },
          headerTintColor: textColor,
          headerRight: () => (
            <View className="pr-10">
              <Pressable
                style={{
                  padding: 5,
                  borderRadius: 5,
                  borderColor: "#009000",
                  alignItems: "center",
                  borderStyle: "dashed",
                }}
                onPress={() => navigation.navigate("myposts")}
              >
                <Text style={{ color: textColor, fontWeight: "600" }}>
                  {t("myposts")}
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
        name="Disease Detection"
        component={DiseaseDetector}
        options={{
          title: t("disease"),
          headerTitle: t("disease_detector"),
          headerStyle: {
            backgroundColor: headerBackgroundColor,
            shadowColor: "transparent",
          },
          headerTintColor: textColor,
          tabBarIcon: ({ color, size = 30 }) => (
            <MaterialCommunityIcons name="leaf" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={PageStack}
        options={{
          title: t("account"),
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
        {t("welcome_back") + ","}
      </Text>
      <Text style={{ fontWeight: "900", color: "green" }}>{user?.name}</Text>
    </View>
  );
};
