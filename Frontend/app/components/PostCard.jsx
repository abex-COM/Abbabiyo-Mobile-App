import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { memo } from "react"; // Import memo here
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChatInput from "./ChatInput";
import { ScrollView } from "react-native-gesture-handler";

const PostCard = ({
  imageUri,
  likes,
  comments = [],
  content,
  poster,
  onComment,
}) => {
  return (
    <View className="shadow-md w-full bg-slate-400 gap-2 rounded-md p-2">
      <View>
        <Text className="text-xl font-bold text-slate-600">{poster}</Text>
        <Text className="text-sky-100">{content}</Text>
      </View>
      {imageUri && (
        <View className="overflow-hidden mt-4">
          <Image
            className="w-full h-60"
            source={imageUri}
            resizeMethod="contain"
          />
        </View>
      )}
      <View className="flex-row items-center gap-4 mt-4">
        <View className="justify-center items-center">
          <TouchableOpacity className="flex-row justify-center items-center p-2 bg-slate-200 rounded-md gap-2">
            <Text>Likes {likes}</Text>
            <MaterialCommunityIcons name="thumb-up" size={20} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="bg-slate-200 p-2 rounded-md"
          onPress={onComment}
        >
          <Text>Comments {comments.length}</Text>
        </TouchableOpacity>
      </View>
      {comments && comments.length > 0 ? (
        <ScrollView className="w-full bg-slate-100 h-60 pl-10 gap-2 p-2 rounded-md mb-3 overflow-y-auto">
          {comments.map((comment, index) => (
            <View
              key={index}
              className="p-2 w-full bg-slate-200 rounded-md mb-4"
            >
              <Text className="font-bold">{comment.commenter}</Text>
              <Text>{comment.comment}</Text>
            </View>
          ))}
        </ScrollView>
      ) : null}
      <ChatInput
        placeholder="Write Comment"
        className="bottom-0 bg-slate-50 mb-4 stickyleft-0"
      />
    </View>
  );
};

// Memoize the PostCard component
export default memo(PostCard);
