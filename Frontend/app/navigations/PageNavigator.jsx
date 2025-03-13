import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfile from "../screens/EditProfileScreen";

const Stack = createStackNavigator();

const PageStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: "Setting",
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
          headerTitle: "Edit Profile",
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
