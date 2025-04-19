import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import MyButton from "../components/MyButton";
import { useUser } from "@/context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Switch } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../constants/Colors";

export default function ProfileScreen({ navigation }) {
  const { logout, user, isLoading } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const handleLogout = () => {
    logout();
    navigation.replace("welcomeScreen");
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
              source={
                user.profilePicture
                  ? { uri: user.profilePicture }
                  : require("../../assets/images/user.png")
              }
            />
            <View style={{ gap: 5 }}>
              <Text
                style={[
                  styles.text,
                  { color: isDarkMode ? "#c0c0c0" : "#006400" },
                ]}
              >
                {user?.name}
              </Text>
              <Text>{user?.phoneNumber}</Text>
              <Text>
                Location:{" "}
                {user?.location?.woreda +
                  ", " +
                  user?.location?.zone +
                  ", " +
                  user?.location?.region}
              </Text>
            </View>
          </View>
        </View>
      )}
      <View
        style={{
          borderWidth: 1,
          borderColor: isDarkMode ? "#4b5563" : "#cfd4cb",
          marginVertical: 10,
        }}
      />
      {/* Edit Profile */}
      <Pressable onPress={() => navigation.navigate("EditProfile")}>
        <View
          style={[
            styles.list,
            {
              backgroundColor: isDarkMode ? "#374151" : "#dddfda",
            },
          ]}
        >
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
      {/* Toggle Dark Mode */}
      <View
        style={[
          styles.list,
          {
            backgroundColor: isDarkMode ? "#374151" : "#dddfda",
          },
        ]}
      >
        <Switch value={isDarkMode} onChange={toggleTheme} />
        <Text
          style={[styles.lisText, { color: isDarkMode ? "#fff" : "#5a5751" }]}
        >
          {t("dark_mode")}
        </Text>
      </View>
      {/* Logout Button */}
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
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: "#ced8d1",
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
