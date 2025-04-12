import {
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  RefreshControl,
} from "react-native";
import React, { useRef, useState } from "react";
import ChatInput from "./../components/ChatInput";
import PostCard from "./../components/PostCard";
import * as ImagePicker from "expo-image-picker";
import ItemSepartor from "./../components/ItemSepartor";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserContext";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import useLike from "../hooks/useLike";
import useLikePost from "../hooks/useLike";
// Base API URL for backend requests
const BASE_URL = "http://192.168.172.196:8000"; //192.168.172.196   //0.42.0.1:8000

const getAllPosts = async (token) => {
  try {
    const resp = await axios.get(`${BASE_URL}/api/posts/getAllposts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data.posts;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Failed to fetch posts.",
    });
    console.error("Error fetching posts:", error);
    throw error; // Rethrow to let react-query handle it
  }
};

const getCommentsForPost = async (postId, token) => {
  try {
    const resp = await axios.get(
      `${BASE_URL}/api/comments/getComment/${postId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return { postId, comments: resp.data.comments || [] };
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    return { postId, comments: [] };
  }
};

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const flatlist = useRef(null);
  const queryClient = useQueryClient();
  // const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useUser(); // user._id will be your user ID

  const { mutate: likePost, isPending } = useLikePost();

  // Fetch posts and related comments
  const results = useQueries({
    queries: [
      {
        queryKey: ["posts"],
        queryFn: () => getAllPosts(token),
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["comments"],
        queryFn: async () => {
          const posts = await getAllPosts(token);
          const commentsPromises = posts.map((post) =>
            getCommentsForPost(post._id, token)
          );
          return Promise.all(commentsPromises);
        },
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [postsQuery, commentsQuery] = results;
  const postsData = postsQuery.data || [];
  const commentsData = commentsQuery.data || [];

  // Convert comments to object format: { postId: [comments] }
  const comments = commentsData.reduce((acc, { postId, comments }) => {
    acc[postId] = comments;
    return acc;
  }, {});
  // handling refresh
  const handleRefetch = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries(["posts"]),
        queryClient.invalidateQueries(["comments"]),
      ]);
    } finally {
      setRefreshing(false);
    }
  };
  // handle picking image
  const handlePickImage = async () => {
    try {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        alert("Permission to access the media library is required.");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets?.[0]?.uri) {
        setImageUri(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to pick image",
      });
    }
  };
  //  Handle new Post

  const handleNewPost = async () => {
    if (!message.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Message cannot be empty",
      });
      return;
    }
    const newPost = {
      text: message,
      image: imageUri,
      // Add any other fields required by the API
    };
    try {
      await axios.post(`${BASE_URL}/api/posts/createPost`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      postsQuery.refetch();
      setMessage("");
      setImageUri(null);
      flatlist.current?.scrollToOffset({ offset: 0, animated: true });
      Toast.show({
        type: "success",
        text1: "Post Created",
        text2: "Your post has been successfully created!",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create post.",
      });
    }
  };
  //  handle new Comment
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
      await axios.post(
        `${BASE_URL}/api/comments/createComment`,
        { text: commentText, postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Invalidate the comments query to refresh the data
      queryClient.invalidateQueries(["comments"]);
      postsQuery.refetch();
      Toast.show({
        type: "success",
        text1: "Comment Posted",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to post comment.",
      });
    }
  };

  if (postsQuery.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading posts and comments...</Text>
      </View>
    );
  }

  if (postsQuery.error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading posts. Please try again.</Text>
      </View>
    );
  }

  if (postsData.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No posts available yet. Be the first to post!</Text>
      </View>
    );
  }

  // handling like // unlike
  const handleLike = (postId) => {
    likePost(postId);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      {/* Posts list */}
      <View style={styles.content}>
        <FlatList
          ref={flatlist}
          data={postsData}
          style={styles.flatlist}
          renderItem={({ item }) => (
            <PostCard
              onLike={() => handleLike(item._id)}
              postId={item._id} //  Add this line
              imageUri={item.image}
              poster={item.author?.name || "Unknown"}
              likes={item.likes?.length || 0}
              content={item.text}
              liked={item.likes?.includes(user?._id)} //Determine if user liked the post
              comments={comments[item._id] || []}
              onCommentSubmit={(commentText) =>
                handleNewComment(item._id, commentText)
              }
            />
          )}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={ItemSepartor}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefetch} />
          }
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
      </View>
      {/* New post input */}
      <View style={styles.inputContainer}>
        <ChatInput
          style={styles.chatInput}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          imageUri={imageUri}
          onSend={handleNewPost}
          onImagePick={handlePickImage}
          imagePickerIcon={true}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  flatlist: { gap: 16 },
  inputContainer: {
    padding: 16,
    width: "100%",
  },
  chatInput: {
    borderRadius: 8,
    padding: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
});
