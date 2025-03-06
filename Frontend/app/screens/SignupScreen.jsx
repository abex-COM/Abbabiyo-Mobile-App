import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import MyButton from "../components/MyButton";
import MyTextInput from "../components/MyTextInput";
import ErrorText from "../components/ErrorText";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "expo-router";
import { ethiopianCities } from "./../constants/cities";

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
  location: Yup.string().required("Location is required"),
});

export default function SignupScreen() {
  const navigation = useNavigation();

  // List of cities for the dropdown
  const cities = [
    { label: "New York", value: "New York" },
    { label: "Los Angeles", value: "Los Angeles" },
    { label: "Chicago", value: "Chicago" },
    { label: "Houston", value: "Houston" },
    { label: "Phoenix", value: "Phoenix" },
    { label: "Other", value: "Other" },
  ];

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
            name: "",
            email: "",
            password: "",
            passwordConfirm: "",
            location: "",
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
              {/* Name Field */}
              <MyTextInput
                placeholder="Name"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                accessibilityLabel="Enter your name"
              />
              {touched.name && errors.name && (
                <ErrorText message={errors.name} />
              )}

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

              {/* Confirm Password Field */}
              <MyTextInput
                placeholder="Confirm Password"
                value={values.passwordConfirm}
                onChangeText={handleChange("passwordConfirm")}
                onBlur={handleBlur("passwordConfirm")}
                secureTextEntry
                accessibilityLabel="Confirm your password"
              />
              {touched.passwordConfirm && errors.passwordConfirm && (
                <ErrorText message={errors.passwordConfirm} />
              )}

              {/* Location Field */}
              <RNPickerSelect
                onValueChange={handleChange("location")}
                items={ethiopianCities}
                value={values.location}
                placeholder={{
                  label: "Select your city",
                  value: null,
                  color: "#9EA0A4",
                }}
                style={{
                  inputAndroid: {
                    backgroundColor: "white",
                    borderRadius: 25,
                  },
                }}
                accessibilityLabel="Select your city"
              />
              {touched.location && errors.location && (
                <ErrorText message={errors.location} />
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
