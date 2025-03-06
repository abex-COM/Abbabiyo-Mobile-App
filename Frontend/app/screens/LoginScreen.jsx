import React from "react";
import { View, StatusBar, KeyboardAvoidingView, Platform } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import MyButton from "../components/MyButton";
import MyTextInput from "../components/MyTextInput";
import ErrorText from "../components/ErrorText";

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginScreen({ navigation }) {
  const handleSubmit = (values) => {
    console.log(values);
    navigation.replace("bottomNavigator");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar backgroundColor="orange" />
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
                onPress={handleSubmit}
                title="Submit"
                className="self-center w-4/5"
              />
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}
