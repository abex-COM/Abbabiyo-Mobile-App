import "../global.css";
import "../i18n/i18n"; // Import the i18n configuration

import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";
import { LanguageProvider } from "@/context/LanguageContexts";
import { ThemeProvider } from "@/context/ThemeContext";
import { PostsProvider } from "@/context/PostContext";
import { Stack } from "expo-router";
export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <ThemeProvider>
            <UserProvider>
              <PostsProvider>
                <Stack screenOptions={{ headerShown: false }} />
                <Toast />
              </PostsProvider>
            </UserProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </LanguageProvider>
  );
}
