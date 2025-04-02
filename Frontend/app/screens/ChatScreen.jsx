import {
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";

import React, { useRef, useState } from "react";
import ChatInput from "./../components/ChatInput";
import PostCard from "./../components/PostCard";
import * as ImagePicker from "expo-image-picker";
import ItemSepartor from "./../components/ItemSepartor";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserContext";
import { useQueries } from "@tanstack/react-query";

// Function to fetch posts
const getAllPosts = async (token) => {
  try {
    const resp = await axios.get(
      "http://10.42.0.1:8000/api/posts/getAllposts",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return resp.data.posts;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Failed to fetch posts.",
    });
    console.log("Error fetching posts:", error);
    return []; // Return an empty array in case of error
  }
};

// Function to fetch comments for a specific post
const getCommentsForPost = async (postId, token) => {
  try {
    const resp = await axios.get(
      `http://10.42.0.1:8000/api/comments/getComment/${postId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { postId, comments: resp.data.comments || [] };
  } catch (error) {
    console.log(`Error fetching comments for post ${postId}:`, error);
    return { postId, comments: [] }; // Return empty comments in case of error
  }
};

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const flatlist = useRef(null);
  const { token } = useUser();

  // Using useQueries to fetch both posts and comments
  const results = useQueries({
    queries: [
      {
        queryKey: ["posts", token],
        queryFn: () => getAllPosts(token),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
      {
        queryKey: ["comments", token],
        queryFn: async () => {
          const posts = await getAllPosts(token);
          const commentsPromises = posts.map((post) =>
            getCommentsForPost(post._id, token)
          );
          return Promise.all(commentsPromises);
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    ],
  });

  const postsData = results[0].data || [];
  const commentsData = results[1].data || [];

  // Transform comments data into an object with postId as keys for easy lookup
  const comments = commentsData.reduce((acc, { postId, comments }) => {
    acc[postId] = comments;
    return acc;
  }, {});

  // Handle image picker
  const handlePickImage = async () => {
    try {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        alert("Permission to access the camera roll is required");
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });
      if (!pickerResult.canceled) {
        setImageUri(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  // Handle post submission
  const handleSubmit = async () => {
    const newPost = {
      text: message,
      image: imageUri,
      // Add any other fields required by the API
    };

    try {
      // Send the POST request to create a new post
      const response = await axios.post(
        "http://10.42.0.1:8000/api/posts/createPost",
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        }
      );

      // Assuming the API returns the created post, you can update the state with the new post
      const createdPost = response.data.post; // Adjust according to your API response
      postsData.push(createdPost); // Add the new post to the posts array
      setMessage(""); // Clear the message input
      setImageUri(null); // Clear the image URI
    flatlist.current.scrollToIndex({ index: 0, animated: true });
      postRefetch(); // Refetch posts to get the latest data
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

  // Check if posts or comments are loading
  const isPostsLoading = results[0].isLoading;
  const isCommentsLoading = results[1].isLoading;
  const postRefetch = results[0].refetch;
  if (isPostsLoading || isCommentsLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading posts and comments...</Text>
      </View>
    );
  }

  // Check if there are no posts
  if (postsData.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No posts available yet. Be the first to post!</Text>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View style={styles.content}>
        <FlatList
          ref={flatlist}
          style={styles.flatlist}
          data={postsData}
          renderItem={({ item }) => (
            <PostCard
              imageUri={item.image}
              poster={item.author.name}
              likes={item.likes.length}
              content={item.text}
              comments={comments[item._id] || []}
            />
          )}
          keyExtractor={(item) => item._id} // Use a unique identifier for each item
          ItemSeparatorComponent={ItemSepartor}
        />
      </View>
      <View style={styles.inputContainer}>
        <ChatInput
          style={styles.chatInput}
          placeholder="Type a message..."
          value={message}
          onImagePick={handlePickImage}
          onChangeText={setMessage}
          imageUri={imageUri}
          onSend={handleSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  flatlist: {
    gap: 16,
  },
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
