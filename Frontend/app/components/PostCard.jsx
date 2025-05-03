import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChatInput from "./ChatInput";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@/context/ThemeContext";
import Colors from "../constants/Colors";
import ThreeDotMenu from "../components/ThreeDotMenu";
import { useNavigation } from "expo-router";

import { Dimensions } from "react-native";
import axios from "axios";
import baseUrl from "@/baseUrl/baseUrl";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserContext";
import { usePosts } from "@/context/PostContext";

const PostCard = ({
  imageUri,
  likes,
  post,
  comments = [],
  content,
  poster,
  liked,
  onCommentSubmit,
  isLoading,
  onLongPress,
  postId,
  onLike,
}) => {
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [showFullContent, setShowFullContent] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const { isDarkMode } = useTheme();
  const { token, user } = useUser();
  // Dynamic color variables
  const textColor = isDarkMode ? Colors.darkTheme.textColor : "#4B5563";
  const contentColor = isDarkMode ? Colors.darkTheme.textColor : "#303a45";
  const cardBackground = isDarkMode ? "#1F2937" : "#E5E7EB";
  const commentBackground = isDarkMode ? "#101a28" : "#cad6e1";
  const commentItemBg = isDarkMode ? "#08101b" : "#E5E7EB";
  const commentAuthorColor = isDarkMode
    ? Colors.darkTheme.textColor
    : "#1F2937";
  const handleCommentSubmit = () => {
    setComment("");
    onCommentSubmit(comment);
  };

  const handleDeleteComment = async (comment) => {
    if (user._id !== comment.author._id) return;
    Alert.alert("Delete", "Are you sure you want to delete?", [
      {
        text: "Cancel",
        onPress: null,
      },
      {
        text: "Okay",
        onPress: async () => {
          try {
            await axios.delete(
              `${baseUrl}/api/comments/delete/${comment._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Comment deleted",
            });
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          setImageSize({ width, height });
        },
        (error) => {
          console.error("Failed to get image size", error);
        }
      );
    }
  }, [imageUri]);
  const screenWidth = Dimensions.get("window").width;
  const imageAspectRatio = imageSize.width / imageSize.height;
  const displayWidth = screenWidth - 32; // subtract padding/margin if needed
  const displayHeight = displayWidth / imageAspectRatio;

  return (
    <TouchableOpacity delayLongPress={300} activeOpacity={1}>
      <View style={[styles.cardContainer, { backgroundColor: cardBackground }]}>
        <ThreeDotMenu
          post={post}
          postId={postId}
          comments={comments}
          likes={likes}
        />
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

        {imageUri && imageSize.width > 0 && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: displayWidth,
                height: displayHeight,
                borderRadius: 14,
              }}
              resizeMode="cover"
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
              <Text style={{ textAlign: "center", width: 80 }}>
                {" "}
                Likes: {likes}
              </Text>
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
            <Text style={{ width: 110, textAlign: "center" }}>
              Comments: {comments.length}
            </Text>
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
              <TouchableOpacity
                onLongPress={() => handleDeleteComment(comment)}
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
              </TouchableOpacity>
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
    </TouchableOpacity>
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
    gap: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  posterName: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  content: {
    marginTop: 8,
    fontSize: 16,
    marginLeft: 10,
  },
  imageContainer: {
    overflow: "hidden",
    marginTop: 16,
    borderRadius: 20,
    borderColor: "#286128",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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
    marginLeft: 10,
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
    borderWidth: 0.5,
    borderColor: "#7f7c7c",
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
