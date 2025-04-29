import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { useUser } from "@/context/UserContext";
import useLikePost from "../hooks/useLike";
import { usePosts } from "@/context/PostContext";
import { useTheme } from "@/context/ThemeContext";
import Colors from "../constants/Colors";
import { Dimensions } from "react-native";

export default function PostDetailScreen({ route }) {
  const { post = {}, comments = [] } = route.params || {};
  const { user } = useUser();
  const { handleNewComment } = usePosts();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [commentText, setCommentText] = useState("");
  const [likes, setLikes] = useState(post.likes || []);
  const [showAllComments, setShowAllComments] = useState(false);

  const { mutate: likePost } = useLikePost();
  const hasLiked = likes.includes(user?._id);

  const handleLike = () => {
    likePost(post._id);
    setLikes((prev) =>
      hasLiked ? prev.filter((id) => id !== user._id) : [...prev, user._id]
    );
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    handleNewComment(post._id, commentText);
    setCommentText("");
  };

  const visibleComments = showAllComments ? comments : comments.slice(-6);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const screenWidth = Dimensions.get("window").width;
  const imageAspectRatio = imageSize.width / imageSize.height;
  const displayWidth = screenWidth - 32; // subtract padding/margin if needed
  const displayHeight = displayWidth / imageAspectRatio;

  useEffect(() => {
    if (post.image) {
      Image.getSize(
        post.image,
        (width, height) => {
          setImageSize({ width, height });
        },
        (error) => {
          console.error("Failed to get image size", error);
        }
      );
    }
  }, [post.image]);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <FlatList
        data={visibleComments}
        keyExtractor={(item) => item._id || item.id}
        ListHeaderComponent={
          <View style={{ padding: 5, justifyContent: "center" }}>
            <Text style={styles.postAuthor}>{post.author?.name}</Text>

            {post.image && (
              <Image
                source={{ uri: post.image }}
                style={{
                  width: displayWidth,
                  height: displayHeight,
                  borderRadius: 9,
                  alignSelf: "center",
                }}
                resizeMode="cover"
              />
            )}

            <Text style={styles.postText}>{post.text}</Text>

            <View style={styles.likesRow}>
              <TouchableOpacity onPress={handleLike}>
                <Text style={styles.likeBtn}>
                  {hasLiked ? "💙" : "🤍"} {likes.length} Likes
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.CommentTitle}>Comments: {comments.length}</Text>

            {comments.length > 6 && !showAllComments && (
              <TouchableOpacity
                onPress={() => setShowAllComments(true)}
                style={styles.seeMoreBtn}
              >
                <Text style={styles.seeMoreText}>See previous comments</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  item?.author?.profilePicture
                    ? { uri: item?.author?.profilePicture }
                    : require("../../assets/images/user.png")
                }
                style={styles.profilePicture}
              />
              <Text style={styles.commentAuthor}>{item?.author?.name}</Text>
            </View>
            <Text style={styles.commentText}>{item?.text}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor={isDarkMode ? "#999" : "#888"}
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleComment}>
          <Text style={{ color: "#fff" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? Colors.darkTheme.backgroundColor : "#fff",
      paddingTop: 20,
      paddingHorizontal: 3,
    },
    postAuthor: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 8,
      color: isDarkMode ? "#fff" : "#333",
    },
    image: {
      width: "100%",
      height: 230,
      borderRadius: 5,
      marginBottom: 12,
    },
    postText: {
      fontSize: 16,
      marginTop: 8,
      color: isDarkMode ? "#ccc" : "#000",
      marginLeft: 8,
    },
    likesRow: {
      flexDirection: "row",
      marginBottom: 16,
      marginTop: 8,
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
    likeBtn: {
      fontSize: 18,
      color: isDarkMode ? "#fff" : "#000",
    },
    CommentTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 8,
      paddingVertical: 8,
      color: isDarkMode ? "#eee" : "#111",
    },
    comment: {
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    avatarContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    profilePicture: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: "#ccc",
    },
    commentAuthor: {
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#000",
    },
    commentText: {
      color: isDarkMode ? "#aaa" : "#666",
      marginLeft: 48,
      marginTop: 4,
    },
    commentInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
      borderColor: isDarkMode ? "#333" : "#ccc",
      padding: 8,
      backgroundColor: isDarkMode ? "#1f2937" : "#fff",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    input: {
      flex: 1,
      padding: 14,
      backgroundColor: isDarkMode ? "#374151" : "#f0f0f0",
      borderRadius: 8,
      marginRight: 8,
      color: isDarkMode ? "#fff" : "#000",
    },
    sendBtn: {
      backgroundColor: "#2563eb",
      paddingHorizontal: 16,
      paddingVertical: 12,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
    },
    seeMoreBtn: {
      paddingVertical: 8,
      marginBottom: 12,
      backgroundColor: isDarkMode ? "#2d3748" : "#f0f0f0",
      borderRadius: 6,
      alignItems: "center",
    },
    seeMoreText: {
      color: "#2563eb",
      fontWeight: "bold",
    },
  });
