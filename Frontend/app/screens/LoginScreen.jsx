import React, { useEffect, useCallback } from "react";
import {
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import MyButton from "../components/MyButton";
import MyTextInput from "../components/MyTextInput";
import ErrorText from "../components/ErrorText";
import axios from "axios";
import Toast from "react-native-toast-message"; // Ensure correct import
import { useUser } from "@/context/UserContext";

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginScreen({ navigation }) {
  const { storeToken, token } = useUser();

  const handleSubmit = useCallback(
    async (values) => {
      try {
        const resp = await axios.post(
          "http://10.42.0.1:8000/api/users/login",
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

  useEffect(() => {
    if (token) {
      navigation.replace("bottomNavigator");
    }
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar backgroundColor="#009000" />
      <View style={styles.form}>
        <Formik
          initialValues={{
            email: "",
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
              {/* Email Field */}
              <MyTextInput
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                accessibilityLabel="Enter your email"
              />
              {touched.email && errors.email && (
                <ErrorText message={errors.email} />
              )}

              {/* Password Field */}
              <MyTextInput
                placeholder="Password"
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
                title="Login"
                isSubmitting={isSubmitting}
                style={{ margin: "auto", width: 200, height: 50 }}
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
