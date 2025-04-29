import React, { useState } from "react";
import { View } from "react-native";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import Colors from "../constants/Colors";
import useDeletePost from "@/app/hooks/useDelete"; // Assuming this is a hook
import { useUser } from "@/context/UserContext";
import { usePosts } from "@/context/PostContext";
import { useNavigation } from "expo-router";

export default function ThreeDotMenu({ post, postId, comments, likes }) {
  const [visible, setVisible] = useState(false);
  const { refetchAll } = usePosts();
  const { user, token } = useUser();
  const handleDeletePost = useDeletePost(token, refetchAll);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;
  const backgroundColor = isDarkMode
    ? Colors.darkTheme.backgroundColor
    : Colors.lightTheme.backgroundColor;
  const navigation = useNavigation();
  const handleDelete = () => {
    hideMenu(); // Hide the menu first
    handleDeletePost(post?._id); // Then delete the post
  };
  const handleViewPost = () => {
    navigation.navigate("PostDetail", {
      post: post,
      comments: comments,
      likes: likes,
    });
    hideMenu();
  };
  const handleEditPost = () => {
    navigation.navigate("EditPost", { post: post });
    hideMenu();
  };
  return (
    <View
      style={{
        height: 30,
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: 16,
      }}
    >
      <Menu
        visible={visible}
        anchor={
          <MaterialIcons
            name="more-horiz"
            size={24}
            onPress={showMenu}
            color={textColor}
          />
        }
        onRequestClose={hideMenu}
        style={{ backgroundColor: backgroundColor }}
      >
        {postId == user?._id && (
          <>
            <MenuItem
              textStyle={{ color: textColor }}
              onPress={handleDelete} // <-- call actual delete function
              style={{ backgroundColor: backgroundColor }}
            >
              Delete Post
            </MenuItem>
            <MenuItem
              textStyle={{ color: textColor }}
              style={{ backgroundColor: backgroundColor }}
              onPress={handleEditPost}
            >
              Edit Post
            </MenuItem>
            <MenuDivider />
          </>
        )}
        <MenuItem
          textStyle={{ color: textColor }}
          style={{ backgroundColor: backgroundColor }}
          onPress={handleViewPost}
        >
          View post
        </MenuItem>
      </Menu>
    </View>
  );
}
