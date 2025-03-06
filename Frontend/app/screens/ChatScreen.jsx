import { View, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import React, { useRef, useState } from "react";
import ChatInput from "./../components/ChatInput";
import PostCard from "./../components/PostCard";
import * as ImagePicker from "expo-image-picker";
import ItemSepartor from "./../components/ItemSepartor";

// Updated communityPosts array with require statements for images
const communityPosts = [
  {
    id: "1",
    poster: "Jemal Ahmed",
    postContent: "Had an amazing time at the beach today! 🌊☀️",
    likes: 150,
    comments: [
      { commenter: "Alice", comment: "Looks like so much fun!" },
      { commenter: "Bob", comment: "Wish I was there!" },
      { commenter: "Charlie", comment: "That's beautiful!" },
    ],
    image: require("../../assets/images/dan-meyers-IQVFVH0ajag-unsplash.jpg"),
  },
  {
    id: "2",
    poster: "Kedir Jemal",
    postContent: "Check out my new tech gadget! 📱💡",
    likes: 220,
    comments: [
      { commenter: "Dave", comment: "I need one of these!" },
      { commenter: "Emma", comment: "How much was it?" },
    ],
    image: require("../../assets/images/irewolede-PvwdlXqo85k-unsplash.jpg"),
  },
  {
    id: "3",
    poster: "Muhammed Kesir",
    postContent: "Just finished reading a great book! 📚✨",
    likes: 80,
    comments: [
      { commenter: "Grace", comment: "What's the book about?" },
      { commenter: "Hannah", comment: "I love reading too!" },
    ],
    image: require("../../assets/images/megan-thomas-xMh_ww8HN_Q-unsplash.jpg"),
  },
  {
    id: "4",
    poster: "Lela Muslim",
    postContent: "Workout done for the day! 💪🏋️‍♂️",
    likes: 300,
    comments: [
      { commenter: "Ivy", comment: "Keep it up!" },
      { commenter: "Jack", comment: "You're an inspiration!" },
      { commenter: "Ivy", comment: "Keep it up!" },
      { commenter: "Jack", comment: "You're an inspiration!" },
      { commenter: "Ivy", comment: "Keep it up!" },
      { commenter: "Jack", comment: "You're an inspiration!" },
      { commenter: "Ivy", comment: "Keep it up!" },
      { commenter: "Jack", comment: "You're an inspiration!" },
      { commenter: "Ivy", comment: "Keep it up!" },
      { commenter: "Jack", comment: "You're an inspiration!" },
      { commenter: "Ivy", comment: "Keep it up!" },
      { commenter: "Jack", comment: "You're an inspiration!" },
    ],
    image: require("../../assets/images/raphael-rychetsky-li9JfUHQfOY-unsplash.jpg"),
  },
];

export default function ChatScreen() {
  const [posts, setPosts] = useState(communityPosts);
  const [message, setMessage] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const flatlist = useRef(null);
  const handlePickImage = async () => {
    try {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        alert("Permsiion to access camer roll is required");
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
    } catch (error) {}
  };
  const handleSubmit = () => {
    const newPost = {
      id: Date.now().toString(),
      poster: "User",
      postContent: message,
      likes: 0,
      comments: [],
      image: imageUri,
      // Use dynamic URI or static image
    };
    setPosts((prev) => [...prev, newPost]);
    setMessage("");
    setImageUri("");
    flatlist.current.scrollToEnd({ Animated: true });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="p-2 flex-1">
        <FlatList
          ref={flatlist}
          className="gap-4"
          data={posts}
          renderItem={({ item }) => (
            <PostCard
              imageUri={item.image}
              poster={item.poster}
              likes={item.likes}
              content={item.postContent}
              comments={item.comments} // Pass the entire comments object
            />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ItemSepartor}
        />
      </View>

      <View className="p-4 w-full">
        <ChatInput
          className="rounded-lg p-2 py-4 border border-slate-300"
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
