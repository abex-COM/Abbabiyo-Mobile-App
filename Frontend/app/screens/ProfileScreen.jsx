import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MyButton from "../components/MyButton";
import { useUser } from "@/context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Switch } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../constants/Colors";
import LanguageDropdown from "../components/LanguageSelector";
import { useLanguage } from "@/context/LanguageContexts";

export default function ProfileScreen({ navigation }) {
  const { logout, user, isLoading } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  const { setLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigation.replace("welcomeScreen");
  };

  const themeColors = isDarkMode ? Colors.darkTheme : Colors.lightTheme;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.backgroundColor },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={themeColors.textColor} />
      ) : (
        <View style={styles.profileConatiner}>
          <Image
            style={[styles.image, { borderColor: themeColors.cardColor }]}
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
            <Text style={{ color: themeColors.textColor }}>
              {user?.phoneNumber}
            </Text>
            <Text style={{ color: themeColors.textColor }}>
              Location: {user?.location?.woreda}, {user?.location?.zone},{" "}
              {user?.location?.region}
            </Text>
          </View>
        </View>
      )}

      <View
        style={[
          styles.divider,
          { borderColor: isDarkMode ? "#4b5563" : "#cfd4cb" },
        ]}
      />

      {/* Language Selector */}
      <LanguageDropdown onChange={setLanguage} />

      {/* Edit Profile */}
      <Pressable onPress={() => navigation.navigate("EditProfile")}>
        <View style={[styles.list, { backgroundColor: themeColors.cardColor }]}>
          <MaterialCommunityIcons
            name="account-edit"
            size={40}
            color={themeColors.textColor}
          />
          <Text style={[styles.listText, { color: themeColors.textColor }]}>
            {t("edit_profile")}
          </Text>
        </View>
      </Pressable>

      {/* Manage Farm Locations */}
      <Pressable onPress={() => navigation.navigate("ManageFarmLocations")}>
        <View style={[styles.list, { backgroundColor: themeColors.cardColor }]}>
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={40}
            color={themeColors.textColor}
          />
          <Text style={[styles.listText, { color: themeColors.textColor }]}>
            Manage Farm Locations
          </Text>
        </View>
      </Pressable>

      {/* Toggle Theme */}
      <View style={[styles.list, { backgroundColor: themeColors.cardColor }]}>
        <Switch value={isDarkMode} onChange={toggleTheme} />
        <Text style={[styles.listText, { color: themeColors.textColor }]}>
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
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  divider: {
    borderWidth: 1,
    marginVertical: 10,
  },
  list: {
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    borderRadius: 10,
    padding: 10,
  },
  listText: {
    fontSize: 16,
    fontWeight: "900",
  },
});