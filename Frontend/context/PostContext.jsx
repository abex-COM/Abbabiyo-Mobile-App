import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserContext";
import baseUrl from "@/baseUrl/baseUrl";
import { getSocket } from "@/app/utils/socket";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const { token, user } = useUser();
  const queryClient = useQueryClient();
  const [commentLoadingMap, setCommentLoadingMap] = useState({});
  const [newPostCount, setNewPostCount] = useState(0); // { [postId]: count }

  // Fetch all posts
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
      console.error(error.message);
      return [];
    }
  };

  // Fetch comments for all posts
  const getCommentsForAllPosts = async () => {
    const posts = postsQuery.data || [];
    const allComments = await Promise.all(
      posts.map((post) => getCommentsForPost(post._id))
    );
    return allComments;
  };

  // Fetch comments for a specific post
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

  // Posts query
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  // Comments query
  const commentsQuery = useQuery({
    queryKey: ["comments", postsQuery.data?.length || 0],
    queryFn: getCommentsForAllPosts,
    enabled: !!token && !!postsQuery.data,
    refetchOnWindowFocus: false,
  });

  // Refetch both
  const refetchAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries(["posts"]),
      queryClient.invalidateQueries(["comments"]),
    ]);
  };

  // Extract data
  const postsData = postsQuery.data || [];
  const commentsData = commentsQuery.data || [];
  const comments = Array.isArray(commentsData)
    ? commentsData.reduce((acc, { postId, comments }) => {
        acc[postId] = comments;
        return acc;
      }, {})
    : {};

  // Post a new comment
  const postComment = async (postId, commentText) => {
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await queryClient.invalidateQueries(["comments"]);

      Toast.show({
        type: "success",
        text1: "Comment Posted",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
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
        postComment,
        commentLoadingMap,
        getCommentsForAllPosts,
        newPostCount,
        setNewPostCount,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

// Custom hook
export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};
