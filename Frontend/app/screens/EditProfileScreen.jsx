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
import { useUser } from "@/context/UserContext";
import { t } from "i18next";

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
  }, [user]);

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
        "http://10.42.0.1:8000/api/users/profile/update",
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
              email: Yup.string()
                .email("Invalid email")
                .required("Email is required"),
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

                  {/* Region Dropdown */}
                  <DropDownPicker
                    open={regionOpen}
                    setOpen={setRegionOpen}
                    value={values.region}
                    items={ethiopianRegions}
                    setValue={(val) => {
                      console.log("Selected Region:", val()); // Debugging the region selection
                      setFieldValue("region", val());
                      setSelectedRegion(val());
                      setFieldValue("zone", "");
                      setSelectedZone(null);
                      setFieldValue("woreda", "");
                    }}
                    placeholder="Select your region"
                    style={styles.picker}
                  />

                  {/* Zone Dropdown */}
                  <DropDownPicker
                    open={zoneOpen}
                    setOpen={setZoneOpen}
                    value={values.zone}
                    items={ethiopianZones[selectedRegion] || []}
                    setValue={(val) => {
                      console.log("Selected Zone:", val()); // Debugging the zone selection
                      setFieldValue("zone", val());
                      setSelectedZone(val);
                      setFieldValue("woreda", "");
                    }}
                    placeholder="Select your zone"
                    disabled={!selectedRegion}
                    style={styles.picker}
                    zIndex={10000}
                  />

                  {/* Woreda Dropdown */}
                  <DropDownPicker
                    open={woredaOpen}
                    setOpen={setWoredaOpen}
                    value={values.woreda}
                    items={ethiopianWoredas[selectedZone] || []}
                    setValue={(val) => setFieldValue("woreda", val())}
                    placeholder="Select your woreda"
                    disabled={!selectedZone}
                    style={styles.picker}
                  />

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
