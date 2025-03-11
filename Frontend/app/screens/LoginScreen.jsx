import React, { useEffect, useCallback } from "react";
import {
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import MyButton from "../components/MyButton";
import MyTextInput from "../components/MyTextInput";
import ErrorText from "../components/ErrorText";
import axios from "axios";
import { useUser } from "@/context/userContext";

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
          "http://192.168.234.196:8000/api/users/login",
          values
        );

        await storeToken(resp.data.token);
        navigation.replace("bottomNavigator");
      } catch (error) {
        if (error.response) {
          console.log("Server Error:", error.response.data);
          alert(error.response.data.message);
        } else if (error.request) {
          console.log("No Response:", error.request);
        } else {
          console.log("Request Error:", error.message);
        }
      }
    },
    [storeToken, navigation]
  );

  useEffect(() => {
    if (token) {
      navigation.replace("bottomNavigator");
    }
  }, [navigation]); //  Dependency array includes `token` and `navigation`

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar backgroundColor="#009000" />
      <View
        style={{
          flex: 1,
          backgroundColor: "orange-100",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
                secureTextEntry
                accessibilityLabel="Enter your password"
              />
              {touched.password && errors.password && (
                <ErrorText message={errors.password} />
              )}

              {/* Submit Button */}
              <MyButton
                onPress={handleSubmit} //  No unnecessary re-renders due to `useCallback`
                title="Submit"
                isSubmitting={isSubmitting}
                className="self-center h-max w-max"
              />
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}
