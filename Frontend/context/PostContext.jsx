// context/PostsContext.js

import React, { createContext, useContext } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserContext";

const BASE_URL = "http://192.168.17.196:8000";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const { token, user } = useUser();
  const queryClient = useQueryClient();

  const getAllPosts = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/api/posts/getAllposts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return resp.data.posts;
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch posts.",
      });
      throw error;
    }
  };

  const getCommentsForPost = async (postId) => {
    try {
      const resp = await axios.get(
        `${BASE_URL}/api/comments/getComment/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { postId, comments: resp.data.comments || [] };
    } catch (error) {
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
