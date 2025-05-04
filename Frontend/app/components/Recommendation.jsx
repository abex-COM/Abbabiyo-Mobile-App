import { useTheme } from "@/context/ThemeContext";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Colors from "../constants/Colors";

const Recommendation = ({ recommendations }) => {
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode ? "#232d3a" : "#e9e9e9";
  const textColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;

  if (
    !recommendations ||
    typeof recommendations !== "string" ||
    recommendations.trim() === ""
  ) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={{ color: textColor }}>
          No recommendations available at the moment.
        </Text>
      </View>
    );
  }

  const recommendationList = recommendations
    .split("\n")
    .map((rec) => rec.trim())
    .filter(Boolean);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {recommendationList.map((rec, index) => (
          <View
            key={index}
            style={[
              styles.card,
              { backgroundColor: isDarkMode ? "#364354" : "#fff" },
            ]}
          >
            <Text style={[styles.cardDescription, { color: textColor }]}>
              {rec}
            </Text>
          </View>
        ))}
      </ScrollView>
      {/* <TouchableOpacity style={[styles.button]}>
        <Text style={styles.buttonText}>Learn More</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 100,
  },
  scrollContainer: {
    height: 300,
  },
  card: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 100,
    alignSelf: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Recommendation;
