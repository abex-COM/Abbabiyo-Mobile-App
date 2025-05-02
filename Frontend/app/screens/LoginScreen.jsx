import React, { useEffect, useCallback } from "react";
import { View, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import MyButton from "../components/MyButton";
import MyTextInput from "../components/MyTextInput";
import ErrorText from "../components/ErrorText";
import axios from "axios";
import Toast from "react-native-toast-message"; // Ensure correct import
import { useUser } from "@/context/UserContext";
import baseUrl from "@/baseUrl/baseUrl";
import Colors from "../constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { t } from "i18next";
import { registerForPushNotificationsAsync } from "../utils/natification";

// Validation Schema using Yup for phone number
const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginScreen({ navigation }) {
  const { storeToken, user } = useUser();
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode
    ? Colors.darkTheme.backgroundColor
    : Colors.lightTheme.backgroundColor;
  const handleSubmit = useCallback(
    async (values) => {
      try {
        const resp = await axios.post(
          `${baseUrl}/api/users/login`, //10.42.0.1 // 192.168.172.196
          values
        );

        await storeToken(resp.data.token);
        navigation.replace("bottomNavigator");

        // Correct usage of Toast.show
        Toast.show({
          type: "success", // Type of toast (success, error, info)
          text1: "Login Successful",
          text2: "Welcome back!", // You can customize this message
          shadow: true,
          animation: true,
          hideOnPress: true,

          text2Style: {
            fontSize: 15,
          },
        });
      } catch (error) {
        if (error.response) {
          console.log("Server Error:", error.response.data);
          Toast.show({
            type: "error",
            text1: "Login Failed",
            text2: error.response.data.message,
          });
        } else if (error.request) {
          console.log("No Response:", error.request);
          Toast.show({
            type: "error",
            text1: "Request Failed",
            text2: "Please try again later.",
          });
        } else {
          console.log("Request Error:", error.message);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.message,
          });
        }
      }
    },
    [storeToken, navigation]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={[styles.form, { backgroundColor: backgroundColor }]}>
        <Formik
          initialValues={{
            phoneNumber: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            values,
            errors,
            touched,
          }) => (
            <View style={{ gap: 16, width: "80%", alignSelf: "center" }}>
              {/* Phone Number Field */}
              <MyTextInput
                placeholder={t("phone_number")}
                value={values.phoneNumber}
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                accessibilityLabel="Enter your phone number"
                keyboardType="numeric"
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <ErrorText message={errors.phoneNumber} />
              )}

              {/* Password Field */}
              <MyTextInput
                placeholder={t("password")}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureText={true}
                accessibilityLabel="Enter your password"
              />
              {touched.password && errors.password && (
                <ErrorText message={errors.password} />
              )}

              <MyButton
                onPress={handleSubmit} // No unnecessary re-renders due to `useCallback`
                title={t("login")}
                isSubmitting={isSubmitting}
                style={{ margin: "auto", height: 50 }}
              />
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    backgroundColor: "orange-100",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
  },
});
