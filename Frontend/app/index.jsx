import { StatusBar, Text, View } from "react-native";
import AuthNavigator from "./navigations/AuthNavigation";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function index() {
  return <AuthNavigator />
}
