import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserContext";
import baseUrl from "@/baseUrl/baseUrl";
const PostsContext = createContext();
export const PostsProvider = ({ children }) => {
  const { token } = useUser();
  const queryClient = useQueryClient();
  const [commentLoadingMap, setCommentLoadingMap] = useState({});

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
      console.error(
        `Failed to fetch comments for post ${postId}`,
        error.message
      );
      return { postId, comments: [] };
    }
  };

  const results = useQueries({
    queries: [
      {
        queryKey: ["posts"],
        queryFn: getAllPosts,
        enabled: !!token, // Only run if token is ready
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["comments"],
        queryFn: async () => {
          if (!postsQuery.data) return [];
          const comments = await Promise.all(
            postsQuery.data.map((post) => getCommentsForPost(post._id))
          );
          return comments;
        },
        enabled: !!token, // Wait for posts to load first
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

  // Add this function inside your PostContext
  const handleNewComment = async (postId, commentText) => {
    if (!commentText.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Comment cannot be empty",
      });
      return;
    }

    setCommentLoadingMap((prev) => ({ ...prev, [postId]: true }));

    try {
      await axios.post(
        `${baseUrl}/api/comments/createComment`,
        { text: commentText, postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await postsQuery.refetch();
      await queryClient.refetchQueries(["comments"]);

      Toast.show({
        type: "success",
        text1: "Comment Posted",
      });
    } catch (error) {
      console.log("Error posting comment:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to post comment.",
      });
    } finally {
      setCommentLoadingMap((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <PostsContext.Provider
      value={{
        posts: postsData,
        comments,
        postsQuery,
        commentsQuery,
        refetchAll,
        handleNewComment,
        commentLoadingMap,
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
