import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import MyButton from "../components/MyButton";
import MyTextInput from "../components/MyTextInput";
import * as ImagePicker from "expo-image-picker";
import baseUrl from "@/baseUrl/baseUrl";
import ErrorText from "../components/ErrorText";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ethiopianRegions, {
  ethiopianZones,
  ethiopianWoredas,
} from "./../constants/ethiopianData";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserContext";
import { t } from "i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../constants/Colors";
export default function EditProfileScreen() {
  const { language } = useUser();
  const navigation = useNavigation();

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [regionOpen, setRegionOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [woredaOpen, setWoredaOpen] = useState(false);
  const { user, isLoading, refetch, token } = useUser();
  const [initialValues, setInitialValue] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    region: "",
    zone: "",
    woreda: "",
    profilePicture: "",
  });
  const [imageUri, setImageUri] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setInitialValue({
      name: user.name || "",
      phoneNumber: user.phoneNumber || "", // Set phoneNumber instead of email
      password: "", // Keep password empty for security
      region: user.location?.region || "",
      zone: user.location?.zone || "",
      woreda: user.location?.woreda || "",
      profilePicture: user.profilePicture || "",
    });
    setSelectedRegion(user.location?.region || "");
    setSelectedZone(user.location?.zone || "");
    setImageUri(user.profilePicture);
  }, [user]);

  const handleSubmit = async (values) => {
    try {
      const formattedData = {
        name: values.name,
        phoneNumber: values.phoneNumber, // Include phoneNumber instead of email
        password: values.password,
        profilePicture: imageUri,
        location: {
          region: values.region,
          zone: values.zone,
          woreda: values.woreda,
        },
      };
      await axios.patch(`${baseUrl}/api/users/profile/update`, formattedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refetch();
      navigation.goBack();
      Toast.show({
        type: "success",
        text1: "Updated Successfully",
        shadow: true,
        animation: true,
        hideOnPress: true,
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: error.response?.data?.message || "An error occurred",
      });
    }
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  const handlePickImage = async () => {
    try {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        alert("Permission to access the media library is required.");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets?.[0]?.uri) {
        const imageUri = pickerResult.assets[0].uri;

        // Convert to FormData
        const formData = new FormData();
        formData.append("image", {
          uri: imageUri,
          name: "profile.jpg",
          type: "image/jpeg",
        });

        // Upload to server
        const res = await axios.post(
          `${baseUrl}/api/users/upload`, // adjust your endpoint
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Set uploaded image URL
        setImageUri(res.data.url); // `res.data.url` should be the hosted image URL
      }
    } catch (error) {
      console.log("Error uploading image:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to upload image",
      });
    }
  };

  const backgroundColor = isDarkMode
    ? Colors.darkTheme.backgroundColor
    : Colors.lightTheme.backgroundColor;
  const textColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ backgroundColor: backgroundColor }}>
          <View style={styles.imageWrapper}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.imageTouch}
            >
              <Image
                style={styles.image}
                source={
                  imageUri
                    ? { uri: imageUri }
                    : require("../../assets/images/user.png")
                }
              />
              <View style={styles.iconOverlay}>
                <MaterialCommunityIcons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.text}>{user?.name}</Text>
          </View>

          <View contentContainerStyle={styles.scrollContainer}>
            <Formik
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={Yup.object({
                name: Yup.string().required("Name is required"),
                phoneNumber: Yup.string()
                  .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
                  .required("Phone number is required"), // Validate phone number
                password: Yup.string()
                  .min(6, "Password must be at least 6 characters")
                  .required("Password is required"),
              })}
              onSubmit={handleSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                setFieldValue,
                isSubmitting,
                errors,
                touched,
              }) => (
                <View style={styles.container}>
                  <View style={styles.form}>
                    <MyTextInput
                      placeholder="Name"
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                    />
                    {touched.name && errors.name && (
                      <ErrorText message={errors.name} />
                    )}

                    {/* Updated phone number field */}
                    <MyTextInput
                      placeholder="Phone Number"
                      value={values.phoneNumber}
                      onChangeText={handleChange("phoneNumber")}
                      onBlur={handleBlur("phoneNumber")}
                      keyboardType="numeric" // Make it numeric for phone number
                    />
                    {touched.phoneNumber && errors.phoneNumber && (
                      <ErrorText message={errors.phoneNumber} />
                    )}

                    <MyTextInput
                      placeholder="Password"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureText={true}
                    />
                    {touched.password && errors.password && (
                      <ErrorText message={errors.password} />
                    )}

                    <View style={{ zIndex: 3000 }}>
                      <DropDownPicker
                        open={regionOpen}
                        setOpen={(open) => {
                          setRegionOpen(open);
                          if (open) {
                            setZoneOpen(false);
                            setWoredaOpen(false);
                          }
                        }}
                        value={values.region}
                        items={ethiopianRegions}
                        setValue={(val) => {
                          setFieldValue("region", val);
                          setSelectedRegion(val);
                          setFieldValue("zone", "");
                          setSelectedZone(null);
                          setFieldValue("woreda", "");
                        }}
                        placeholder="Select your region"
                        searchable={true}
                        searchablePlaceholder="Search for region"
                        searchTextInputStyle={{
                          color: textColor,
                          backgroundColor,
                        }}
                        searchContainerStyle={{
                          backgroundColor: backgroundColor,
                        }}
                        style={[styles.picker, { backgroundColor }]}
                        textStyle={{ color: textColor }}
                        dropDownContainerStyle={{ backgroundColor }}
                      />
                    </View>

                    <View style={{ zIndex: 2000 }}>
                      <DropDownPicker
                        open={zoneOpen}
                        setOpen={(open) => {
                          setZoneOpen(open);
                          if (open) {
                            setRegionOpen(false);
                            setWoredaOpen(false);
                          }
                        }}
                        value={values.zone}
                        items={ethiopianZones[selectedRegion] || []}
                        setValue={(val) => {
                          setFieldValue("zone", val);
                          setSelectedZone(val);
                          setFieldValue("woreda", "");
                        }}
                        placeholder="Select your zone"
                        disabled={!selectedRegion}
                        searchable={true}
                        searchablePlaceholder="Search for zone"
                        searchTextInputStyle={{
                          color: textColor,
                          backgroundColor,
                        }}
                        searchContainerStyle={{
                          backgroundColor: backgroundColor,
                        }}
                        style={[styles.picker, { backgroundColor }]}
                        textStyle={{ color: textColor }}
                        dropDownContainerStyle={{ backgroundColor }}
                      />
                    </View>

                    <View style={{ zIndex: 1000 }}>
                      <DropDownPicker
                        open={woredaOpen}
                        setOpen={(open) => {
                          setWoredaOpen(open);
                          if (open) {
                            setRegionOpen(false);
                            setZoneOpen(false);
                          }
                        }}
                        value={values.woreda}
                        items={ethiopianWoredas[selectedZone] || []}
                        setValue={(val) => setFieldValue("woreda", val)}
                        placeholder="Select your woreda"
                        disabled={!selectedZone}
                        searchable={true}
                        searchablePlaceholder="Search for woreda"
                        searchTextInputStyle={{
                          color: textColor,
                          backgroundColor,
                        }}
                        searchContainerStyle={{
                          backgroundColor: backgroundColor,
                        }}
                        style={[styles.picker, { backgroundColor }]}
                        textStyle={{ color: textColor }}
                        dropDownContainerStyle={{ backgroundColor }}
                      />
                    </View>

                    <MyButton
                      onPress={handleSubmit}
                      title={t("update")}
                      isSubmitting={isSubmitting}
                      style={styles.button}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    marginTop: 10,
  },
  container: {
    justifyContent: "center",
    padding: 20,
    alignItems: "center",
    marginTop: 10,
  },
  form: {
    gap: 10,
    width: "100%",
    zIndex: 1000,
  },
  picker: {
    marginVertical: 10,
    zIndex: 1000,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    backgroundColor: "#d9dee1",
    borderRadius: 30,
  },
  image: {
    borderWidth: 1,
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: "#50C878",
  },
  imageWrapper: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  imageTouch: {
    position: "relative",
  },

  iconOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#50C878",
    borderRadius: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },

  text: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  button: {
    margin: "auto",
    width: 200,
  },
});
