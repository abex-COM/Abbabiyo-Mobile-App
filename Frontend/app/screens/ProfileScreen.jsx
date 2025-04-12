import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React from "react";
import MyButton from "../components/MyButton";
import { useUser } from "@/context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Switch } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../constants/Colors"; // Import colors
export default function ProfileScreen({ navigation }) {
  const { logout, isEnabled, setIsEnabled, user, isLoading } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigation.replace("loginScreen");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Colors.darkTheme.backgroundColor
            : Colors.lightTheme.backgroundColor,
        },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <View style={styles.profileConatiner}>
            <Image
              style={styles.image}
              source={require("../../assets/images/user.png")}
            />
            <Text
              style={[
                styles.text,
                { color: isDarkMode ? "#c0c0c0" : "#006400" },
              ]}
            >
              {user?.name}
            </Text>
          </View>
        </View>
      )}
      <View style={{ borderWidth: 1, borderColor: "#cfd4cb" }}></View>
      <Pressable onPress={() => navigation.navigate("EditProfile")}>
        <View style={styles.list}>
          <MaterialCommunityIcons
            name="account-edit"
            size={40}
            color={isDarkMode ? "#fff" : "#5a5751"}
          />
          <Text
            style={[styles.lisText, { color: isDarkMode ? "#fff" : "#5a5751" }]}
          >
            {t("edit_profile")}
          </Text>
        </View>
      </Pressable>
      <View style={styles.list}>
        <Switch value={isDarkMode} onChange={toggleTheme} />
        <Text
          style={[styles.lisText, { color: isDarkMode ? "#fff" : "#5a5751" }]}
        >
          {t("dark_mode")}
        </Text>
      </View>
      <MyButton title={t("logout")} onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 30,
    padding: 10,
    minHeight: "100%",
  },
  profileConatiner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 10,
  },
  image: {
    borderWidth: 1,
    width: 60,
    height: 60,
    borderRadius: 50,
    borderColor: "#50C878",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },

  list: {
    fontSize: 20,
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    backgroundColor: "#dddfda",
    borderRadius: 10,
    padding: 10,
  },
  lisText: {
    fontSize: 16,
    gap: 10,
    fontWeight: "900",
    flexDirection: "row",
  },
});
