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
import Toast from "react-native-toast-message";
import baseUrl from "@/baseUrl/baseUrl";
import { useTranslation } from "react-i18next";
import useDeletePost from "@/app/hooks/useDelete";

import {
  initiateSocketConnection,
  getSocket,
  disconnectSocket,
} from "@/app/utils/socket";
import axios from "axios";

export default function MyPosts() {
  const { posts, comments, postsQuery, refetchAll } = usePosts();
  const { token, user } = useUser();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const handleDeletePost = useDeletePost(token, refetchAll);

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

  // Filter user posts
  const userPosts = posts.filter((post) => post?.author?._id === user?._id);
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {userPosts.length === 0 ? (
        <Text style={[styles.noPostsText, { color: textColor }]}>
          {t("No Post Yet")}
        </Text>
      ) : (
        <FlatList
          ref={flatlist}
          data={userPosts}
          renderItem={({ item }) => (
            <PostCard
              onLongPress={() => handleDeletePost(item._id)}
              onLike={() => handleLike(item._id)}
              postId={item.author?._id}
              post={item}
              posterImageUri={item.author?.profilePicture}
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
