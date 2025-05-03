import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import MyButton from "../components/MyButton";
import MyTextInput from "../components/MyTextInput";
import ErrorText from "../components/ErrorText";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "expo-router";
import baseUrl from "@/baseUrl/baseUrl";
import ethiopianRegions, {
  ethiopianZones,
  ethiopianWoredas,
} from "./../constants/ethiopianData";
import { useUser } from "@/context/UserContext";
import Toast from "react-native-toast-message";
import { useTheme } from "@/context/ThemeContext";
import Colors from "../constants/Colors";
import { t } from "i18next";

export default function SignupScreen() {
  const navigation = useNavigation();
  const { storeToken } = useUser();
  const { isDarkMode } = useTheme(); // Get the current theme

  // Dropdown states
  const [regionOpen, setRegionOpen] = useState(false);
  const [regionValue, setRegionValue] = useState(null);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [zoneValue, setZoneValue] = useState(null);
  const [woredaOpen, setWoredaOpen] = useState(false);
  const [woredaValue, setWoredaValue] = useState(null);

  const handleSubmit = async (values) => {
    try {
      const formattedData = {
        name: values.name,
        phoneNumber: values.phoneNumber, // Changed 'email' to 'phoneNumber'
        password: values.password,
        confirmPassword: values.passwordConfirm,
        location: {
          region: regionValue,
          zone: zoneValue,
          woreda: woredaValue,
        },
      };

      const resp = await axios.post(
        `${baseUrl}/api/users/signup`,
        formattedData
      );
      storeToken(resp.data.token);
      navigation.replace("bottomNavigator");
      Toast.show({
        type: "success",
        text1: "Registered Successfully",
        shadow: true,
        animation: true,
        hideOnPress: true,
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response?.data || error.message);
        Toast.show({
          type: "error",
          text1: "Signup failed",
          text2: error.response?.data?.message,
        });
      }
    }
  };

  const backgroundColor = isDarkMode
    ? Colors.darkTheme.backgroundColor
    : Colors.lightTheme.backgroundColor;
  const textColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor }} // Apply background color based on theme
      >
        <Formik
          initialValues={{
            name: "",
            phoneNumber: "", // Changed email to phoneNumber
            password: "",
            passwordConfirm: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Name is required"),
            phoneNumber: Yup.string()
              .matches(/^[0-9]{10}$/, "Phone number must be 10 digits") // Validating phone number format
              .required("Phone number is required"),
            password: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("Password is required"),
            passwordConfirm: Yup.string()
              .oneOf([Yup.ref("password"), null], "Passwords must match")
              .required("Password confirmation is required"),
          })}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            isSubmitting,
            errors,
            touched,
          }) => (
            <View style={[styles.container, { backgroundColor }]}>
              <View style={styles.form}>
                {/* Input Fields */}
                <MyTextInput
                  placeholder={t("name")}
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  placeholderTextColor={textColor} // Adjust placeholder color
                />
                {touched.name && errors.name && (
                  <ErrorText message={errors.name} />
                )}

                {/* Phone Number Input */}
                <MyTextInput
                  placeholder={t("phone_number")} // Changed to phoneNumber
                  value={values.phoneNumber} // Changed to phoneNumber
                  onChangeText={handleChange("phoneNumber")} // Changed to phoneNumber
                  onBlur={handleBlur("phoneNumber")} // Changed to phoneNumber
                  keyboardType="phone-pad"
                  placeholderTextColor={textColor} // Adjust placeholder color
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <ErrorText message={errors.phoneNumber} />
                )}

                <MyTextInput
                  placeholder={t("password")}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  secureText={true}
                  placeholderTextColor={textColor} // Adjust placeholder color
                />
                {touched.password && errors.password && (
                  <ErrorText message={errors.password} />
                )}

                <MyTextInput
                  placeholder={t("confirm_password")}
                  value={values.passwordConfirm}
                  onChangeText={handleChange("passwordConfirm")}
                  onBlur={handleBlur("passwordConfirm")}
                  secureText={true}
                  placeholderTextColor={textColor} // Adjust placeholder color
                />
                {touched.passwordConfirm && errors.passwordConfirm && (
                  <ErrorText message={errors.passwordConfirm} />
                )}

                {/* Region, Zone, Woreda Selectors */}
                <DropDownPicker
                  open={regionOpen}
                  setOpen={setRegionOpen}
                  value={regionValue}
                  items={ethiopianRegions}
                  setValue={setRegionValue}
                  placeholder={t("select_your_region")}
                  style={[styles.picker, { backgroundColor }]}
                  textStyle={{ color: textColor }}
                  dropDownContainerStyle={{ backgroundColor }}
                  zIndex={3000}
                  zIndexInverse={1000}
                  onChangeValue={(val) => {
                    setRegionValue(val);
                    setZoneValue(null);
                    setWoredaValue(null);
                  }}
                />

                <DropDownPicker
                  open={zoneOpen}
                  setOpen={setZoneOpen}
                  value={zoneValue}
                  items={ethiopianZones[regionValue] || []}
                  setValue={setZoneValue}
                  placeholder={t("select_your_zone")}
                  disabled={!regionValue}
                  style={[styles.picker, { backgroundColor }]}
                  textStyle={{ color: textColor }}
                  dropDownContainerStyle={{ backgroundColor }}
                  zIndex={2000}
                  zIndexInverse={2000}
                  onChangeValue={(val) => {
                    setZoneValue(val);
                    setWoredaValue(null);
                  }}
                />

                <DropDownPicker
                  open={woredaOpen}
                  setOpen={setWoredaOpen}
                  value={woredaValue}
                  items={ethiopianWoredas[zoneValue] || []}
                  setValue={setWoredaValue}
                  placeholder={t("select_your_woreda")}
                  disabled={!zoneValue}
                  style={[styles.picker, { backgroundColor }]}
                  textStyle={{ color: textColor }}
                  zIndex={1000}
                  dropDownContainerStyle={{ backgroundColor }}
                  zIndexInverse={3000}
                />

                {/* Submit Button */}
                <MyButton
                  onPress={handleSubmit}
                  title={t("register")}
                  isSubmitting={isSubmitting}
                  style={{ margin: "auto", width: 200 }}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  form: {
    gap: 10,
  },
  picker: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
});
