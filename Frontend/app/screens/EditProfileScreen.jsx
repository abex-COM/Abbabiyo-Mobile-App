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
  ScrollView,
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
import Toast from "react-native-toast-message";
import { useUser } from "@/context/userContext";

export default function EditProfileScreen() {
  const navigation = useNavigation();

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [regionOpen, setRegionOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [woredaOpen, setWoredaOpen] = useState(false);
  const { token } = useUser();
  const { user, isLoading, refetch } = useUser();
  const [initialValues, setInitialValue] = useState({
    name: "",
    email: "",
    password: "",
    region: "",
    zone: "",
    woreda: "",
  });
  useEffect(() => {
    setInitialValue({
      name: user.name || "",
      email: user.email || "",
      password: "", // Keep password empty for security
      region: user.location?.region || "",
      zone: user.location?.zone || "",
      woreda: user.location?.woreda || "",
    });
    setSelectedRegion(user.location?.region || "");
    setSelectedZone(user.location?.zone || "");
  }, []);
  const handleSubmit = async (values) => {
    try {
      const formattedData = {
        name: values.name,
        email: values.email,
        password: values.password,
        location: {
          region: values.region,
          zone: values.zone,
          woreda: values.woreda,
        },
      };

      await axios.patch(
        "http://192.168.74.196:8000/api/users/profile/update",
        formattedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
      Toast.show({
        type: "error",
        text1: "Signup failed",
        text2: error.response?.data?.message || "An error occurred",
      });
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <StatusBar backgroundColor="#009000" barStyle="light-content" />
        <View contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={Yup.object({
              name: Yup.string().required("Name is required"),
              email: Yup.string().email("Invalid email"),
              password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("password required"),
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
                    secureTextEntry={true}
                  />
                  {touched.password && errors.password && (
                    <ErrorText message={errors.password} />
                  )}

                  <DropDownPicker
                    open={regionOpen}
                    setOpen={setRegionOpen}
                    value={values.region}
                    items={ethiopianRegions}
                    setValue={(val) => {
                      setFieldValue("region", val());
                      setSelectedRegion(val());
                      setFieldValue("zone", "");
                      setSelectedZone(null);
                      setFieldValue("woreda", "");
                    }}
                    placeholder="Select your region"
                    style={styles.picker}
                  />
                  <DropDownPicker
                    open={zoneOpen}
                    setOpen={setZoneOpen}
                    value={values.zone}
                    items={ethiopianZones[selectedRegion] || []}
                    setValue={(val) => {
                      setFieldValue("zone", val());
                      setSelectedZone(val());
                      setFieldValue("woreda", "");
                    }}
                    placeholder="Select your zone"
                    disabled={!selectedRegion}
                    style={styles.picker}
                    zIndex={10000}
                  />
                  <DropDownPicker
                    open={woredaOpen}
                    setOpen={setWoredaOpen}
                    value={values.woreda}
                    items={ethiopianWoredas[selectedZone] || []}
                    setValue={setFieldValue.bind(null, "woreda")}
                    placeholder="Select your woreda"
                    disabled={!selectedZone}
                    style={styles.picker}
                  />
                  <MyButton
                    onPress={handleSubmit}
                    title="Update"
                    isSubmitting={isSubmitting}
                    style={styles.button}
                  />
                </View>
              </View>
            )}
          </Formik>
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
  },
  picker: {
    marginVertical: 10,
  },
  button: {
    margin: "auto",
    width: 200,
  },
});
