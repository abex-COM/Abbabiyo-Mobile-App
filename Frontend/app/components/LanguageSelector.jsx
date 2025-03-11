import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

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

  return (
    <DropDownPicker
      open={open}
      value={value} // Default value is "en"
      items={items}
      setOpen={setOpen}
      setValue={onChange} // Handle value change
      setItems={() => {}} // Prevent modifying items externally
      style={styles.dropdown}
      textStyle={{
        fontSize: 11,
      }}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    width: 110,
    height: 50,
  },
  dropdownContainer: {
    backgroundColor: "#fafafa",
  },
});

export default LanguageDropdown;
