import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import baseUrl from "@/baseUrl/baseUrl";
import { useUser } from "@/context/UserContext";

const UpdatePostScreen = ({ route }) => {
  const { post } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { token } = useUser();
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleUpdatePost = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", values.text);

      if (selectedImage) {
        const uriParts = selectedImage.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("image", {
          uri: selectedImage.uri,
          name: `image.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const response = await axios.put(
        `${baseUrl}/api/posts/update/${post._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Toast.show({
        type: "success",
        text1: "Post updated!",
      });

      navigation.goBack();
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Failed to update post",
        text2: err?.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Post</Text>
      <Formik
        initialValues={{ text: post.text || "" }}
        validationSchema={Yup.object({
          text: Yup.string().required("Text is required"),
        })}
        onSubmit={handleUpdatePost}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="What's on your mind?"
              value={values.text}
              onChangeText={handleChange("text")}
            />
            {touched.text && errors.text && (
              <Text style={styles.error}>{errors.text}</Text>
            )}

            <TouchableOpacity
              style={styles.imagePicker}
              onPress={handleImagePick}
            >
              <Text style={{ color: "#2563eb" }}>
                {selectedImage ? "Change Image" : "Pick Image"}
              </Text>
            </TouchableOpacity>

            {(selectedImage || post.image) && (
              <Image
                source={{ uri: selectedImage?.uri || post.image }}
                style={styles.image}
              />
            )}

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Update Post</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

export default UpdatePostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    textAlignVertical: "top",
    marginBottom: 12,
    fontSize: 16,
    minHeight: 200,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  imagePicker: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 8,
    alignItems: "center",
    borderStyle: "dashed",
    backgroundColor: "#f0f8ff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
