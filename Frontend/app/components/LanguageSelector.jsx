import React, { useState } from "react";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "@/context/ThemeContext";

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

  const dropdownStyles = isDarkMode
    ? {
        backgroundColor: "#333",
        borderColor: "#444",
      }
    : {
        backgroundColor: "#fff",
        borderColor: "#ccc",
      };

  const dropdownContainerStyles = isDarkMode
    ? {
        backgroundColor: "#333",
        borderColor: "#444",
      }
    : {
        backgroundColor: "#fff",
        borderColor: "#ccc",
      };

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={onChange}
      setItems={() => {}}
      style={[styles.dropdown, dropdownStyles]} // main dropdown style
      dropDownContainerStyle={dropdownContainerStyles} // dropdown list container style
      textStyle={{
        fontSize: 11,
        color: isDarkMode ? "#fff" : "#000", // selected item text
      }}
      listItemLabelStyle={{
        color: isDarkMode ? "#fff" : "#000", // list items text color
      }}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    width: 110,
    height: 50,
    borderRadius: 5,
  },
});

export default LanguageDropdown;
