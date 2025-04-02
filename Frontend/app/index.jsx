import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./navigations/AuthNavigation";
import BottomNavigator from "./navigations/BottomNavigation";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

export default function index() {
  return <BottomNavigator />;
}
