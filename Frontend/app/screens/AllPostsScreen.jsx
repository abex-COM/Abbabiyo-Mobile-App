import {
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  initiateSocketConnection,
  getSocket,
  disconnectSocket,
} from "@/app/utils/socket";
import { useQueryClient } from "@tanstack/react-query";
import ChatInput from "../components/ChatInput";
import PostCard from "../components/PostCard";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import ItemSepartor from "../components/ItemSepartor";
import Toast from "react-native-toast-message";
import { usePosts } from "@/context/PostContext";
import useLikePost from "../hooks/useLike";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import baseUrl from "@/baseUrl/baseUrl";
import useDeletePost from "@/app/hooks/useDelete";
export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [commentLoadingMap, setCommentLoadingMap] = useState({});
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const flatlist = useRef(null);
  const { token } = useUser();
  const { posts, comments, postsQuery, refetchAll, user } = usePosts();
  const handleDeletePost = useDeletePost(token, refetchAll);

  const { mutate: likePost } = useLikePost();
  const queryClient = useQueryClient();
  const backgroundColor = isDarkMode ? "#1F2937" : "#f3f4f6";
  const textColor = isDarkMode ? "#F9FAFB" : "#111827";
  const handleRefetch = async () => {
    setRefreshing(true);
    try {
      await postsQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        alert("Permission required");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });

      if (!pickerResult.canceled && pickerResult.assets?.[0]?.uri) {
        const manipResult = await ImageManipulator.manipulateAsync(
          pickerResult.assets[0].uri,
          [{ resize: { width: 800 } }], // adjust to your needs
          { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
        );

        setImageUri(manipResult.uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to pick image",
      });
    }
  };

  const handleNewPost = async () => {
    if (!message.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Message cannot be empty",
      });
      return;
    }

    const formData = new FormData();
    formData.append("text", message);

    if (imageUri) {
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "post-image.jpg",
      });
    }

    try {
      setIsPostLoading(true);
      await axios.post(`${baseUrl}/api/posts/createPost`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await postsQuery.refetch();
      setMessage("");
      setImageUri(null);
      flatlist.current?.scrollToOffset({ offset: 0, animated: true });
      Toast.show({
        type: "success",
        text1: "Post Created",
        text2: "Your post has been successfully created!",
      });
    } catch (error) {
      console.log("Error creating post:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create post.",
      });
    } finally {
      setIsPostLoading(false);
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
    await postsQuery.refetch();
    await queryClient.refetchQueries(["comments"]);
    setCommentLoadingMap((prev) => ({ ...prev, [postId]: true }));

    try {
      await axios.post(
        `${baseUrl}/api/comments/createComment`,
        { text: commentText, postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await postsQuery.refetch();

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
      setCommentLoadingMap((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleLike = async (postId) => {
    likePost(postId);
    console.log(postId);
  };
// I set this because comment is net being fetched on the first time when comment mounts
  useEffect(() => {
    const refetch = async () => {
      try {
        await queryClient.refetchQueries(["comments"]);
        console.log(" Comments refetched on mount");
      } catch (error) {
        console.error(" Error refetching comments:", error);
      }
    };

    refetch();
  }, [queryClient]);
  useEffect(() => {
    if (!user?._id) return;

    initiateSocketConnection(user._id);
    const socket = getSocket();

    const handleNewComment = ({ postId, comment }) => {
      console.log("Received newComment via socket:", comment);
      queryClient.setQueryData(["comments"], (oldCommentsData = []) => {
        return oldCommentsData.map((entry) =>
          entry.postId === postId
            ? {
                ...entry,
                comments: [...entry.comments, comment],
              }
            : entry
        );
      });
    };

    const handleNewPost = (newPost) => {
      console.log("Received newPost via socket:", newPost);
      queryClient.setQueryData(["posts"], (oldPosts = []) => {
        return [newPost, ...oldPosts]; // Add new post to the top
      });
    };
    const handleNewLike = ({ postId, likeCount, likedBy }) => {
      queryClient.setQueryData(["posts"], (oldPosts = []) =>
        oldPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: likedBy, // store liked user IDs for easier checks
              }
            : post
        )
      );
    };

    socket.on("connect", () => console.log("Connected to socket:", socket.id));
    socket.on("newComment", handleNewComment);
    socket.on("newPost", handleNewPost);
    socket.on("newLike", handleNewLike);
    socket.on("disconnect", () => console.log("Disconnected from socket"));
    return () => {
      socket.off("newComment", handleNewComment);
      socket.off("newPost", handleNewPost);
      disconnectSocket();
    };
  }, [user?._id]);

  const uniquePosts = Array.from(
    new Map(posts.map((post) => [post._id, post])).values()
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View style={[styles.content, { backgroundColor }]}>
        <FlatList
          ref={flatlist}
          data={uniquePosts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PostCard
              onLike={() => handleLike(item._id)}
              onLongPress={
                item.author?._id === user?._id
                  ? () => handleDeletePost(item._id)
                  : undefined
              }
              postId={item.author?._id}
              imageUri={item.image}
              poster={item.author?.name || "Unknown"}
              likes={item.likes?.length || 0}
              content={item.text}
              post={item}
              liked={item.likes?.includes(user?._id)}
              isLoading={commentLoadingMap[item._id] || false}
              comments={comments[item._id] || []}
              onCommentSubmit={(commentText) =>
                handleNewComment(item._id, commentText)
              }
            />
          )}
          ItemSeparatorComponent={ItemSepartor}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefetch} />
          }
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
      </View>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: isDarkMode ? "#1F2937" : "" },
        ]}
      >
        <ChatInput
          placeholder={t("what_is_on_your_mind")}
          value={message}
          onChangeText={setMessage}
          imageUri={imageUri}
          onSend={handleNewPost}
          onImagePick={handlePickImage}
          imagePickerIcon={true}
          isLoading={isPostLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  flatlist: { gap: 16 },
  inputContainer: {
    padding: 16,
    width: "100%",
  },
});
