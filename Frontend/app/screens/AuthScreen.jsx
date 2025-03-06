import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthNavigator from "./../navigations/AuthNavigation";

export default function AuthScreen() {
  return (
    <GestureHandlerRootView>
      <AuthNavigator />
    </GestureHandlerRootView>
  );
}
