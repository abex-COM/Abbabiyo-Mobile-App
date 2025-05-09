import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./navigations/AuthNavigation";
import BottomNavigator from "./navigations/BottomNavigation";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { StatusBar } from "react-native";

export default function index() {
  return <AuthNavigator />;
}
