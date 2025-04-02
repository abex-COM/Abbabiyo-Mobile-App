import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next"; // Import the hook for translations
import ProfileScreen from "../screens/ProfileScreen";
import EditProfile from "../screens/EditProfileScreen";

const Stack = createStackNavigator();

const PageStack = () => {
  const { t } = useTranslation(); // Use the translation hook

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: t("settings"), // Automatically handles translation based on current language
          headerStyle: {
            shadowColor: "transparent",
          },
          headerLeft: "",
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: t("edit_profile"), // Automatically handles translation based on current language
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "#009000",
          },
          presentation: "modal", // Optional: for a modal effect
          headerShown: true, // Show header for back navigation
        }}
      />
    </Stack.Navigator>
  );
};

export default PageStack;
