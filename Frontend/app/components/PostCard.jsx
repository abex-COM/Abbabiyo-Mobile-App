import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { memo, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChatInput from "./ChatInput";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../constants/Colors";

const PostCard = ({
  imageUri,
  likes,
  comments = [],
  content,
  poster,
  liked,
  onCommentSubmit,
  isLoading,
  onLongPress,
  onLike,
}) => {
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [showFullContent, setShowFullContent] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const { isDarkMode } = useTheme();

  // Dynamic color variables
  const textColor = isDarkMode ? Colors.darkTheme.textColor : "#4B5563";
  const contentColor = isDarkMode ? Colors.darkTheme.textColor : "#303a45";
  const cardBackground = isDarkMode
    ? Colors.darkTheme.backgroundColor
    : "#E5E7EB";
  const commentBackground = isDarkMode ? Colors.darkTheme.cardColor : "#cad6e1";
  const commentItemBg = isDarkMode ? Colors.darkTheme.cardColor : "#E5E7EB";
  const commentAuthorColor = isDarkMode
    ? Colors.darkTheme.textColor
    : "#1F2937";

  const handleCommentSubmit = () => {
    setComment("");
    onCommentSubmit(comment);
  };

  return (
    <Pressable onLongPress={onLongPress} delayLongPress={300} activeOpacity={1}>
      <View style={[styles.cardContainer, { backgroundColor: cardBackground }]}>
        <View>
          <Text style={[styles.posterName, { color: textColor }]}>
            {poster}
          </Text>

          <Text
            onTextLayout={(e) => {
              if (e.nativeEvent.lines.length > 2 && !showFullContent) {
                setIsTruncated(true);
              }
            }}
            numberOfLines={showFullContent ? undefined : 2}
            style={[styles.content, { color: contentColor }]}
          >
            {content}
          </Text>

          {isTruncated && (
            <TouchableOpacity
              onPress={() => setShowFullContent((prev) => !prev)}
            >
              <Text style={{ color: "#2563eb", marginTop: 4 }}>
                {showFullContent ? "Show less" : "...more"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {imageUri && (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: imageUri }}
              resizeMode="contain"
            />
          </View>
        )}

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

        {comments.length > 0 && isCommentVisible && (
          <ScrollView
            style={[
              styles.commentsContainer,
              { backgroundColor: commentBackground },
            ]}
          >
            {comments.map((comment, index) => (
              <View
                key={`${comment._id || index}`}
                style={[styles.commentItem, { backgroundColor: commentItemBg }]}
              >
                <Text
                  style={[styles.commentAuthor, { color: commentAuthorColor }]}
                >
                  {comment.author?.name || "Anonymous"}
                </Text>
                <Text style={{ color: commentAuthorColor }}>
                  {comment.text}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        <ChatInput
          placeholder="Write Comment"
          onChangeText={setComment}
          value={comment}
          style={styles.chatInput}
          isLoading={isLoading}
          onSend={handleCommentSubmit}
        />
      </View>
    </Pressable>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    width: "100%",
    gap: 8,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  posterName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    marginTop: 8,
    fontSize: 16,
  },
  imageContainer: {
    overflow: "hidden",
    marginTop: 16,
    borderRadius: 20,
    borderColor: "#286128",
    width: "100%",
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
    maxHeight: 240,
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  commentItem: {
    padding: 8,
    width: "100%",
    borderRadius: 8,
    marginBottom: 8,
  },
  commentAuthor: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  chatInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 12,
  },
});
