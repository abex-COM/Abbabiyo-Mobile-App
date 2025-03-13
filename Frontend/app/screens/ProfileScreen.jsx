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
import { useUser } from "@/context/userContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Switch } from "react-native-gesture-handler";
export default function ProfileScreen({ navigation }) {
  const { logout, isEnabled, setIsenabled, user, isLoading } = useUser();
  const toggleSwitch = () => {
    setIsenabled((prev) => !prev);
  };
  const handleLogout = () => {
    logout();
    navigation.replace("loginScreen");
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <View style={styles.profileConatiner}>
            <Image
              style={styles.image}
              source={require("../../assets/images/user.png")}
            />
            <Text style={styles.text}>{user?.name}</Text>
          </View>
        </View>
      )}
      <View style={{ borderWidth: 1, borderColor: "#cfd4cb" }}></View>
      <Pressable onPress={() => navigation.navigate("EditProfile")}>
        <View style={styles.list}>
          <MaterialCommunityIcons
            name="account-edit"
            size={40}
            color="#b9b2a3"
          />
          <Text style={styles.lisText}> Edit Profile</Text>
        </View>
      </Pressable>
      <View style={styles.list}>
        <Switch value={isEnabled} onChange={toggleSwitch} />
        <Text style={styles.lisText}>Dark Mode</Text>
      </View>
      <MyButton title="Logout" onPress={handleLogout} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: 30,
    padding: 10,
    backgroundColor: "white",
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
    color: "#006400",
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
    color: "#G864",
  },
});
