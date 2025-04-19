import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios";
import baseUrl from "@/baseUrl/baseUrl";

const useDeletePost = (token, refetchAll) => {
  const handleDeletePost = (postId) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${baseUrl}/api/posts/delete/${postId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              await refetchAll();
              Toast.show({
                type: "success",
                text1: "Post Deleted",
              });
            } catch (error) {
              console.error("Delete post error:", error);
              Toast.show({
                type: "error",
                text1: "Failed to delete post",
                text2:
                  error.response?.data?.message || "Please try again later.",
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return handleDeletePost;
};

export default useDeletePost;
