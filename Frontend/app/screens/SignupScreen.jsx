import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
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
import ethiopianRegions, {
  ethiopianZones,
  ethiopianWoredas,
} from "./../constants/ethiopianData";
import { useUser } from "@/context/UserContext";
import Toast from "react-native-toast-message";

export default function SignupScreen() {
  const navigation = useNavigation();
  const { storeToken } = useUser();
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
        email: values.email,
        password: values.password,
        confirmPassword: values.passwordConfirm,
        location: {
          region: regionValue,
          zone: zoneValue,
          woreda: woredaValue,
        },
      };

      const resp = await axios.post(
        "http://10.42.0.1:8000/api/users/signup",
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar backgroundColor="#009000" />

      <View
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            passwordConfirm: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string()
              .email("Invalid email")
              .required("Email is required"),
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
            <View style={styles.container}>
              <View style={styles.form}>
                {/* Input Fields */}
                <MyTextInput
                  placeholder="Name"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                />
                {touched.name && errors.name && (
                  <ErrorText message={errors.name} />
                )}

                <MyTextInput
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                {touched.email && errors.email && (
                  <ErrorText message={errors.email} />
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

                {/* Region Selector */}
                <DropDownPicker
                  open={regionOpen}
                  setOpen={setRegionOpen}
                  value={regionValue}
                  items={ethiopianRegions}
                  setValue={setRegionValue}
                  placeholder="Select your region"
                  style={styles.picker}
                  zIndex={3000}
                  zIndexInverse={1000}
                  onChangeValue={(val) => {
                    setRegionValue(val);
                    setZoneValue(null);
                    setWoredaValue(null);
                  }}
                />

                {/* Zone Selector */}
                <DropDownPicker
                  open={zoneOpen}
                  setOpen={setZoneOpen}
                  value={zoneValue}
                  items={ethiopianZones[regionValue] || []}
                  setValue={setZoneValue}
                  placeholder="Select your zone"
                  disabled={!regionValue}
                  style={styles.picker}
                  zIndex={2000}
                  zIndexInverse={2000}
                  onChangeValue={(val) => {
                    setZoneValue(val);
                    setWoredaValue(null);
                  }}
                />

                {/* Woreda Selector */}
                <DropDownPicker
                  open={woredaOpen}
                  setOpen={setWoredaOpen}
                  value={woredaValue}
                  items={ethiopianWoredas[zoneValue] || []}
                  setValue={setWoredaValue}
                  placeholder="Select your woreda"
                  disabled={!zoneValue}
                  style={styles.picker}
                  zIndex={1000}
                  zIndexInverse={3000}
                />

                {/* Submit Button */}
                <MyButton
                  onPress={handleSubmit}
                  title="Sign Up"
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
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
});
