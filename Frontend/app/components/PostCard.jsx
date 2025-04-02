import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { memo, useState } from "react"; // Import memo here
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChatInput from "./ChatInput";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import OverflowMenu from "../components/ThreeDotMenu"; // Assuming you have a ThreeDotMenu component
const PostCard = ({ imageUri, likes, comments = [], content, poster }) => {
  const [isCommentVisible, setIsCommentVisible] = useState(false);

  return (
    <View style={styles.cardContainer}>
      {/* <OverflowMenu /> */}
      <View>
        <Text style={styles.posterName}>{poster}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>

      {/* Display image if it exists */}
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../../assets/images/image.png")} // Ensure this is correctly fetching image by URI
            resizeMethod="contain"
          />
        </View>
      )}

      {/* Likes section */}
      <View style={styles.likesContainer}>
        <View style={styles.likesButtonContainer}>
          <TouchableOpacity style={styles.likesButton}>
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
          onPress={() => setIsCommentVisible(!isCommentVisible)} // Toggle comment visibility
        >
          <Text>Comments: {comments.length}</Text>
        </TouchableOpacity>
      </View>

      {/* Comments display */}
      {comments && comments.length > 0 && isCommentVisible && (
        <ScrollView style={[styles.commentsContainer]}>
          {comments.map((comment, index) => (
            <View key={index} style={styles.commentItem}>
              <Text style={styles.commentAuthor}>
                {comment.author?.name || "Anonymous"}
              </Text>
              <Text>{comment.text}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Chat input to post a new comment */}
      <ChatInput placeholder="Write Comment" style={styles.chatInput} />
    </View>
  );
};

// Memoize the PostCard component for better performance
export default memo(PostCard);

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    width: "100%",
    backgroundColor: "#E5E7EB", // slate-400
    gap: 8,
    borderRadius: 8,
    padding: 8,
  },
  posterName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B5563", // slate-600
  },
  content: {
    marginTop: 8,
    color: "#303a45", // sky-100
  },
  imageContainer: {
    overflow: "hidden",
    marginTop: 16,
  },
  image: {
    width: "100%",
    height: 240,
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
    backgroundColor: "#E5E7EB", // slate-200
    borderRadius: 8,
    gap: 8,
  },
  commentsButton: {
    backgroundColor: "#E5E7EB", // slate-200
    padding: 8,
    borderRadius: 8,
  },
  commentsContainer: {
    width: "100%",
    backgroundColor: "#cad6e1", // slate-100
    height: 240,
    paddingLeft: 10,
    gap: 8,
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    overflowY: "auto",
  },
  commentItem: {
    padding: 8,
    width: "100%",
    backgroundColor: "#E5E7EB", // slate-200
    borderRadius: 8,
    marginBottom: 16,
  },
  commentAuthor: {
    fontWeight: "bold",
  },
  chatInput: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#F9FAFB", // slate-50
    marginBottom: 16,
    left: 0,
    width: "100%",
  },
});
