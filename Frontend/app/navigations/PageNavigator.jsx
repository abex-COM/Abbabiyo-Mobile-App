// navigation/PageStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfile from "../screens/EditProfileScreen";
import ManageFarmLocationsScreen from "../screens/ManageFarmLocationsScreen"; // Import the new screen
import { useTheme } from "@/context/ThemeContext";
import Colors from "../constants/Colors";

const Stack = createStackNavigator();

const PageStack = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const headerBackgroundColor = isDarkMode
    ? Colors.darkTheme.statusbarColor
    : Colors.lightTheme.backgroundColor;
  const headerTintColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerStyle: {
            backgroundColor: headerBackgroundColor,
          },
          headerTintColor: headerTintColor,
          headerTitle: t("settings"),
          headerLeft: () => null, // removes back button
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerStyle: {
            backgroundColor: headerBackgroundColor,
          },
          headerTintColor: headerTintColor,
          headerTitle: t("edit_profile"),
          animation: "reveal_from_bottom",
          headerShown: true,
        }}
      />

      {/* Add the Manage Farm Locations screen here */}
      <Stack.Screen
        name="ManageFarmLocations"
        component={ManageFarmLocationsScreen} // Register the new screen
        options={{
          headerStyle: {
            backgroundColor: headerBackgroundColor,
          },
          headerTintColor: headerTintColor,
          headerTitle: t("manage_farm_locations"),

          animation: "reveal_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
};

export default PageStack;
