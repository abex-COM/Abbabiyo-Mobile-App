import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuTrigger,
  MenuOption,
} from "react-native-popup-menu";
import { Entypo } from "@expo/vector-icons";

const Divider = () => <View style={styles.divider} />;

const OverflowMenu = () => {
  return (
    <MenuProvider style={styles.container}>
      <Menu>
        {/* Menu Trigger (Three-dot Icon) */}
        <MenuTrigger
          customStyles={{
            triggerWrapper: {
              top: -20,
            },
          }}
        >
          <Entypo name="dots-three-horizontal" size={24} color="black" />
        </MenuTrigger>

        {/* Menu Options */}
        <MenuOptions
          customStyles={{
            optionsContainer: {
              borderRadius: 10,
            },
          }}
        >
          <Divider />
          <MenuOption onSelect={() => console.log("Option 1 selected")}>
            <Text>Option 1</Text>
          </MenuOption>
          <Divider />
          <MenuOption onSelect={() => console.log("Option 2 selected")}>
            <Text>Option 2</Text>
          </MenuOption>
          <Divider />
          <MenuOption onSelect={() => console.log("Option 3 selected")}>
            <Text>Option 3</Text>
          </MenuOption>
          <Divider />
        </MenuOptions>
      </Menu>
    </MenuProvider>
  );
};

export default OverflowMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 100,
    // marginHorizontal: 100,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#7F8487",
  },
});
