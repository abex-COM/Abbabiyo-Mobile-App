import React, { useState } from "react";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../constants/Colors";

const LanguageDropdown = ({
  value = "en", // Default to English
  onChange,
  items = [
    { label: "🇺🇸 English", value: "en" },
    { label: "🇪🇹 Amharic", value: "am" },
    { label: "🇪🇹 Oromo", value: "om" },
  ],
}) => {
  const [open, setOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode
    ? Colors.darkTheme.statusbarColor
    : Colors.lightTheme.backgroundColor;
  const textColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={onChange}
      setItems={() => {}}
      style={[styles.dropdown, { backgroundColor }]} // main dropdown style
      dropDownContainerStyle={{
        backgroundColor: backgroundColor,
        width: 350,
      }} // dropdown list container style
      textStyle={{
        fontSize: 11,
        color: textColor, // selected item text
      }}
      listItemLabelStyle={{
        color: textColor, // list items text color
      }}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    width: 350,
    height: 50,
    borderRadius: 5,
  },
});

export default LanguageDropdown;
