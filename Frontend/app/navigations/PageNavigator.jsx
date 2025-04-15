import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next"; // Import the hook for translations
import ProfileScreen from "../screens/ProfileScreen";
import EditProfile from "../screens/EditProfileScreen";
import { useTheme } from "@/context/ThemeContext"; // Import the theme context
import { Colors } from "../constants/Colors"; // Import the colors if you have predefined colors for themes
import DiseaseDetector from "@/app/screens/DiseaseDetectionScreen";
const Stack = createStackNavigator();

const PageStack = () => {
  const { t } = useTranslation(); // Use the translation hook
  const { isDarkMode } = useTheme(); // Get the current theme

  // Dynamic theme colors based on isDarkMode
  const headerBackgroundColor = isDarkMode
    ? "#111827"
    : Colors.lightTheme.backgroundColor;
  const headerTintColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;

  return (
    <Stack.Navigator>
      {/* Profile Screen */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: t("settings"), // Automatically handles translation based on current language
          headerStyle: {
            backgroundColor: headerBackgroundColor, // Dynamic background color based on theme
            shadowColor: "transparent",
          },
          headerLeft: () => null, // Optional: remove the back button on the profile screen
          headerTintColor: headerTintColor, // Dynamic text color based on theme
        }}
      />

      {/* Edit Profile Screen */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: t("disease_detector"), // Automatically handles translation based on current language
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
};

export default PageStack;
