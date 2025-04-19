import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function PostDetailScreen({ route }) {
  const { post } = route.params;
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [liked, setLiked] = useState(post.likes.includes("yourUserId")); // replace with real user ID
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    // TODO: Send like to server
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      author: "You", // replace with current user
    };
    setComments([...comments, newComment]);
    setCommentText("");
    // TODO: Send comment to server
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ListHeaderComponent={
          <View>
            <Text style={styles.author}>{post.author.name}</Text>
            {post.image && (
              <Image source={{ uri: post.image }} style={styles.image} />
            )}
            <Text style={styles.content}>{post.text}</Text>

            <View style={styles.likesRow}>
              <TouchableOpacity onPress={handleLike}>
                <Text style={styles.likeBtn}>
                  {liked ? "❤️" : "🤍"} {likesCount}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.commentHeading}>Comments</Text>
          </View>
        }
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentAuthor}>{item.author}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity onPress={handleComment} style={styles.sendBtn}>
          <Text style={{ color: "#fff" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  author: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  image: { width: "100%", height: 300, borderRadius: 8, marginBottom: 12 },
  content: { fontSize: 16, marginBottom: 12 },
  likesRow: { flexDirection: "row", marginBottom: 16 },
  likeBtn: { fontSize: 18 },
  commentHeading: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  comment: { marginBottom: 12 },
  commentAuthor: { fontWeight: "bold" },
  commentText: {},
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
