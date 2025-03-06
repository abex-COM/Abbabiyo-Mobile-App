import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      // Navigate to the main screen after the splash screen
      router.push("/screens/welcomeScreen"); // Change "/home" to the appropriate path of your next screen
    }, 2000); // Splash screen duration (2 seconds)
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={{ uri: "https://your-image-url.com/your-image.jpg" }} // Add your image URL here
        style={styles.image}
        resizeMode="cover"
      />

      {/* Text Overlay */}
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>ABBABiyo</Text>
        <Text style={styles.subText}>AI assistant for farmers</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // To position text over the image
  },
  image: {
    width: "100%",
    height: "100%", // Adjust height of the image
    position: "absolute",
    top: 0,
    left: 0,
  },
  textContainer: {
    position: "absolute",
    top: "50%", // Center text vertically
    left: "10%",
    right: "10%",
    transform: [{ translateY: -50 }], // Adjust for precise centering
    textAlign: "center", // Center text horizontally
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
    borderRadius: 10, // Rounded corners for the text box
  },
  mainText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  subText: {
    fontSize: 18,
    color: "white",
    marginTop: 5,
  },
});
