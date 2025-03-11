import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import MyButton from "../components/MyButton";
import MyTextInput from "../components/MyTextInput";
import ErrorText from "../components/ErrorText";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "expo-router";
import ethiopianRegions, {
  ethiopianZones,
  ethiopianWoredas,
} from "./../constants/ethiopianData";
import { useUser } from "@/context/userContext";

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
  region: Yup.string().required("Region is required"),
  zone: Yup.string().required("Zone is required"),
  woreda: Yup.string().required("Woreda is required"),
});

export default function SignupScreen() {
  const navigation = useNavigation();

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const { storeToken } = useUser();
  const handleSubmit = async (values) => {
    try {
      const formattedData = {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.passwordConfirm, // Fixed field name
        location: {
          region: values.region,
          zone: values.zone,
          woreda: values.woreda,
        },
      };

      const resp = await axios.post(
        "http://192.168.234.196:8000/api/users/signup",
        formattedData
      );
      storeToken(resp.data.token);
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
  };

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
            name: "",
            email: "",
            password: "",
            passwordConfirm: "",
            region: "",
            zone: "",
            woreda: "",
          }}
          validationSchema={validationSchema}
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
            <View style={{ gap: 16, width: "80%", alignSelf: "center" }}>
              {/* Name Field */}
              <MyTextInput
                placeholder="Name"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
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
                secureText={true}
              />
              {touched.passwordConfirm && errors.passwordConfirm && (
                <ErrorText message={errors.passwordConfirm} />
              )}

              {/* Region Selection */}
              <RNPickerSelect
                onValueChange={(value) => {
                  setFieldValue("region", value);
                  setSelectedRegion(value);
                  setFieldValue("zone", ""); // Reset zone when region changes
                  setSelectedZone(null); // Clear zone state
                  setFieldValue("woreda", ""); // Reset woreda when region changes
                }}
                items={ethiopianRegions}
                value={values.region}
                placeholder={{ label: "Select your region", value: null }}
                accessibilityLabel="Select your region"
              />

              {/* Zone Selection */}
              <RNPickerSelect
                onValueChange={(value) => {
                  setFieldValue("zone", value);
                  setSelectedZone(value);
                  setFieldValue("woreda", ""); // Reset woreda when zone changes
                }}
                items={ethiopianZones[selectedRegion] || []}
                value={values.zone}
                placeholder={{ label: "Select your zone", value: null }}
                accessibilityLabel="Select your zone"
                disabled={!selectedRegion} // Disable if no region is selected
              />

              {/* Woreda Selection */}
              <RNPickerSelect
                onValueChange={(value) => {
                  setFieldValue("woreda", value);
                }}
                items={ethiopianWoredas[selectedZone] || []}
                value={values.woreda}
                placeholder={{ label: "Select your woreda", value: null }}
                accessibilityLabel="Select your woreda"
                disabled={!selectedZone} // Disable if no zone is selected
              />

              {/* Submit Button */}
              <MyButton
                onPress={handleSubmit}
                title="Submit"
                className="self-center w-max h-max"
                isSubmitting={isSubmitting}
              />
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}
