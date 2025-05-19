import {
  ImageBackground,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import background from "../../assets/images/farmer-b.jpg";
import MyButton from "../components/MyButton";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import LanguageDropdown from "../components/LanguageSelector";
import { useLanguage } from "@/context/LanguageContexts";

export default function Welcome({ navigation }) {
  const { token, user } = useUser();
  const { setLanguage, language } = useLanguage();

  const { t } = useTranslation();
  const handleLogin = () => {
    navigation.replace("loginScreen");
  };
  useEffect(() => {
    if (token && user) {
      navigation.replace("bottomNavigator");
    }
  }, [token]);
  return (
    <ImageBackground
      source={background}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome to Abbabiyo AI Assistant</Text>
        <Text style={styles.welcomeText}>
          Baga Gara Abbabiyo AI tti Nagaan Dhufta
        </Text>
        <Text style={styles.welcomeText}>ወደ አባቢዮ AI ረዳት እንኳን በደህና መጡ</Text>
        <LanguageDropdown onChange={setLanguage} value={language} />
      </View>
      <View style={styles.buttonContainer}>
        <MyButton
          title={t("login")}
          onPress={handleLogin}
          style={styles.button}
          textStyle={styles.buttonText}
        />
        <MyButton
          title={t("register")}
          style={styles.button}
          onPress={() => navigation.navigate("signupScreen")}
          textStyle={styles.buttonText}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    color: "#157015", // Green color (similar to text-green-400)
    fontSize: 20, // Text size (similar to text-2xl)
    fontWeight: "bold",
    padding: 16,
    borderRadius: 100, // Rounded corners (similar to rounded-[10rem])
  },
  buttonContainer: {
    gap: 20, // Similar to gap-5
  },
  button: {
    width: 200,
  },
  buttonText: {
    fontSize: 20,
  },
});
