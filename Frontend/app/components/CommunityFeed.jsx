import React from "react";
import { View, Text, FlatList, Image } from "react-native";

export default function CommunityFeed({ communityPosts }) {
  return (
    <FlatList
      data={communityPosts}
      renderItem={({ item }) => (
        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1 }}>
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: 200 }}
          />
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {item.postContent}
          </Text>
          <Text>Likes: {item.likes}</Text>
          <Text>Comments:</Text>
          {item.comments.map((comment, index) => (
            <Text key={index} style={{ marginLeft: 10 }}>
              {comment.commenter}: {comment.comment}
            </Text>
          ))}
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
