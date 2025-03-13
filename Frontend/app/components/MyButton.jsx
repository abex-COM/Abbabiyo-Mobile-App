import {
  Text,
  Pressable,
  TouchableHighlight,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React from "react";

export default function MyButton({
  onPress,
  className,
  title = "Submit",
  isSubmitting,
  style,
  textStyle,
}) {
  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      {isSubmitting ? (
        <ActivityIndicator color="white" size={24} />
      ) : (
        <Text style={textStyle} className="text-white text-xl">
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#009000",
    borderRadius: 10,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 160,
  },
});
