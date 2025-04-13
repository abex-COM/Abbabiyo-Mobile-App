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
import Toast from "react-native-toast-message";
import { usePosts } from "@/context/PostContext"; //  use PostsContext
import useLikePost from "../hooks/useLike";
import axios from "axios";
import { useUser } from "@/context/UserContext";
export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const flatlist = useRef(null);
  const { token } = useUser();
  const { posts, comments, postsQuery, refetchAll, user } = usePosts(); //  from context
  const { mutate: likePost } = useLikePost();

  const handleRefetch = async () => {
    setRefreshing(true);
    try {
      await refetchAll(); //  use context refetch
    } finally {
      setRefreshing(false);
    }
  };

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
        // allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets?.[0]?.uri) {
        setImageUri(pickerResult.assets[0].uri);
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
  // create new post
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
    };

    try {
      await axios.post(
        `http://192.168.17.196:8000/api/posts/createPost`,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`, // or context `token` if you pass that too
          },
        }
      );

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
      console.log("Error creating post:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create post.",
      });
    }
  };
  // create new Comment
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
        `http://192.168.17.196:8000/api/comments/createComment`,
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
    }
  };

  const handleLike = (postId) => {
    likePost(postId);
  };

  if (postsQuery.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading posts and comments...</Text>
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
          data={posts}
          style={styles.flatlist}
          renderItem={({ item }) => (
            <PostCard
              onLike={() => handleLike(item._id)}
              postId={item._id}
              imageUri={item.image}
              poster={item.author?.name || "Unknown"}
              likes={item.likes?.length || 0}
              content={item.text}
              liked={item.likes?.includes(user?._id)}
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
