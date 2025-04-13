import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { memo, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChatInput from "./ChatInput";
import { ScrollView } from "react-native-gesture-handler";

const PostCard = ({
  imageUri,
  likes,
  comments = [],
  content,
  poster,
  liked,
  onCommentSubmit,
  isLoading, // Added loading state prop
  isCommentSubmitting,
  onLike,
}) => {
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [comment, setComment] = useState("");
  return (
    <View style={styles.cardContainer}>
      <View>
        <Text style={styles.posterName}>{poster}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>

      {/* Display image if it exists */}
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: imageUri }} // Changed to use uri prop
            resizeMode="contain" // Changed from resizeMethod to resizeMode
          />
        </View>
      )}

      {/* Likes section */}
      <View style={styles.likesContainer}>
        <View style={styles.likesButtonContainer}>
          <TouchableOpacity
            style={[
              styles.likesButton,
              { backgroundColor: liked ? "#c3c4c5" : "#E5E7EB" },
            ]}
            onPress={onLike}
          >
            <Text>Likes: {likes}</Text>
            <MaterialCommunityIcons name="thumb-up" size={20} />
          </TouchableOpacity>
        </View>

        {/* Comments section */}
        <TouchableOpacity
          style={[
            styles.commentsButton,
            isCommentVisible &&
              comments.length && { backgroundColor: "#c7cacf" },
          ]}
          onPress={() => setIsCommentVisible(!isCommentVisible)}
        >
          <Text>Comments: {comments.length}</Text>
        </TouchableOpacity>
      </View>

      {/* Comments display */}
      {comments.length > 0 && isCommentVisible && (
        <ScrollView style={styles.commentsContainer}>
          {comments.map((comment, index) => (
            <View key={`${comment._id || index}`} style={styles.commentItem}>
              <Text style={styles.commentAuthor}>
                {comment.author?.name || "Anonymous"}
              </Text>
              <Text>{comment.text}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Chat input to post a new comment */}
      <ChatInput
        placeholder="Write Comment"
        onChangeText={setComment}
        value={comment}
        style={styles.chatInput}
        isLoading={isCommentSubmitting}
        onSend={() => {
          onCommentSubmit(comment);
          setComment("");
        }} // Clear comment input after submission
      />
    </View>
  );
};

export default memo(PostCard);

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    width: "100%",
    backgroundColor: "#E5E7EB",
    gap: 8,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16, // Added margin for better separation
  },
  posterName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B5563",
  },
  content: {
    marginTop: 8,
    color: "#303a45",
  },
  imageContainer: {
    overflow: "hidden",
    marginTop: 16,
    // borderWidth: 1,
    borderRadius: 20, // Match container radius
    borderColor: "#286128",
    width: "100%",
    // height: 200,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 16,
  },
  likesButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  likesButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  commentsButton: {
    backgroundColor: "#E5E7EB",
    padding: 8,
    borderRadius: 8,
  },
  commentsContainer: {
    width: "100%",
    backgroundColor: "#cad6e1",
    maxHeight: 240, // Changed from height to maxHeight
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  commentItem: {
    padding: 8,
    width: "100%",
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 8, // Reduced margin
  },
  commentAuthor: {
    fontWeight: "bold",
    marginBottom: 4, // Added margin
  },
  chatInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 12,
  },
});
