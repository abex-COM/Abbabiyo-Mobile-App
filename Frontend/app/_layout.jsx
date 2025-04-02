import "../global.css";
import "../i18n/i18n"; // Import the i18n configuration

import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";
import { LanguageProvider } from "@/context/LanguageContexts";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <UserProvider>
            <GestureHandlerRootView>
              <Stack screenOptions={{ headerShown: false }} />
              <Toast />
            </GestureHandlerRootView>
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
