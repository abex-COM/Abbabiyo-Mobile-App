import { Stack } from "expo-router";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export default function RootLayout() {
  const quryClient = new QueryClient();
  return (
    <QueryClientProvider client={quryClient}>
      <GestureHandlerRootView>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
