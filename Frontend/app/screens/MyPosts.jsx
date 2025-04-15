import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  RefreshControl,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { usePosts } from "@/context/PostContext";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import PostCard from "../components/PostCard";
import ItemSeparator from "../components/ItemSepartor";
import useLikePost from "../hooks/useLike";
import Toast from "react-native-toast-message";
import baseUrl from "@/baseUrl/baseUrl";
import { useTranslation } from "react-i18next";
import {
  initiateSocketConnection,
  getSocket,
  disconnectSocket,
} from "@/app/utils/socket";
import axios from "axios";
import { Alert } from "react-native";

export default function MyPosts() {
  const { posts, comments, postsQuery, refetchAll, user } = usePosts();
  const { token } = useUser();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const { mutate: likePost } = useLikePost();
  const [refreshing, setRefreshing] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const flatlist = useRef(null);

  const backgroundColor = isDarkMode ? "#1F2937" : "#f3f4f6";
  const textColor = isDarkMode ? "#F9FAFB" : "#111827";

  const handleLike = (postId) => {
    likePost(postId);
  };

  const handleRefetch = async () => {
    setRefreshing(true);
    try {
      await refetchAll();
    } finally {
      setRefreshing(false);
    }
  };

  const handleNewComment = async (postId, commentText) => {
    if (!commentText.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Comment cannot be empty",
      });
      return;
    }
    try {
      setIsCommentLoading(true);
      await axios.post(
        `${baseUrl}/api/comments/createComment`,
        { text: commentText, postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await refetchAll();
      Toast.show({
        type: "success",
        text1: "Comment Posted",
      });
    } catch (error) {
      console.log("Error posting comment:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to post comment.",
      });
    } finally {
      setIsCommentLoading(false);
    }
  };
  // handle delete
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
              await axios.delete(
                `${baseUrl}/api/posts/delete/${postId}`, //192.168.95.196
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              await refetchAll();
              Toast.show({
                type: "success",
                text1: "Post Deleted",
              });
            } catch (error) {
              console.log("Error deleting post:", error);
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

  useEffect(() => {
    if (user?._id) {
      // Initialize socket connection for the user
      initiateSocketConnection(user._id);
      const socket = getSocket();

      socket.on("connect", () => {
        console.log("Connected to socket:", socket.id);
      });

      // Listen for new posts from WebSocket
      socket.on("newPost", (newPost) => {
        console.log("Received newPost via socket:", newPost);
        postsQuery.setData(["posts"], (oldPosts) => [
          newPost,
          ...(oldPosts || []),
        ]);
      });

      // Cleanup: disconnect socket when component is unmounted
      return () => {
        disconnectSocket();
      };
    }
  }, [user?._id]);

  if (postsQuery.isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" color={textColor} />
        <Text style={{ color: textColor }}>Loading your posts...</Text>
      </View>
    );
  }

  // Filter user posts
  const userPosts = posts.filter((post) => post.author?._id === user?._id);
  console.log(posts.map((post) => post));
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {userPosts.length === 0 ? (
        <Text style={[styles.noPostsText, { color: textColor }]}>
          {t("no_posts_yet")}
        </Text>
      ) : (
        <FlatList
          ref={flatlist}
          data={userPosts}
          renderItem={({ item }) => (
            <PostCard
              onLongPress={() => handleDeletePost(item._id)}
              onLike={() => handleLike(item._id)}
              postId={item._id}
              imageUri={item.image}
              poster={item.author?.name || "Unknown"}
              likes={item.likes?.length || 0}
              content={item.text}
              liked={item.likes?.includes(user?._id)}
              isLoading={isCommentLoading}
              comments={comments[item._id] || []}
              onCommentSubmit={(commentText) =>
                handleNewComment(item._id, commentText)
              }
            />
          )}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={ItemSeparator}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefetch} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    fontWeight: "500",
  },
});
