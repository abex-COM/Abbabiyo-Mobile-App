// context/PostsContext.js

import React, { createContext, useContext } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserContext";
import baseUrl from "@/baseUrl/baseUrl";

const PostsContext = createContext();
export const PostsProvider = ({ children }) => {
  const { token, user } = useUser();
  const queryClient = useQueryClient();

  const getAllPosts = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/api/posts/getAllposts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return resp.data?.posts || [];
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch posts.",
      });
      console.log(error.message);
      return []; // <- Ensure a defined return value
    }
  };
  const getCommentsForPost = async (postId) => {
    try {
      const resp = await axios.get(
        `${baseUrl}/api/comments/getComment/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { postId, comments: resp.data?.comments || [] };
    } catch (error) {
      console.log(`Failed to fetch comments for post ${postId}`, error.message);
      return { postId, comments: [] };
    }
  };

  const results = useQueries({
    queries: [
      {
        queryKey: ["posts"],
        queryFn: () => getAllPosts(),
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["comments"],
        queryFn: async () => {
          const posts = await getAllPosts();
          if (!Array.isArray(posts)) return []; // Fallback to empty array
          const comments = await Promise.all(
            posts.map((post) => getCommentsForPost(post._id))
          );
          return comments;
        },
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [postsQuery, commentsQuery] = results;

  const refetchAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries(["posts"]),
      queryClient.invalidateQueries(["comments"]),
    ]);
  };

  const postsData = postsQuery.data || [];
  const commentsData = commentsQuery.data || [];
  const comments = commentsData.reduce((acc, { postId, comments }) => {
    acc[postId] = comments;
    return acc;
  }, {});

  return (
    <PostsContext.Provider
      value={{
        posts: postsData,
        comments,
        postsQuery,
        commentsQuery,
        refetchAll,
        user,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined)
    throw new Error("post Context used outside provider");
  return context;
};
