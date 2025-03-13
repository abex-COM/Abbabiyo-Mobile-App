import { StatusBar, Text, View } from "react-native";
import AuthNavigator from "./navigations/AuthNavigation";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import BottomNavigator from "./navigations/BottomNavigation";
import { UserProvider } from "../context/userContext";
import ProfileScreen from "./screens/ProfileScreen";
export default function index() {
  return (
    <UserProvider>
      <AuthNavigator />
    </UserProvider>
  );
}
