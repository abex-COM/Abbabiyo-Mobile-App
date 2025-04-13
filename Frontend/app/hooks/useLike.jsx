import { useUser } from "@/context/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useLikePost = () => {
  const queryClient = useQueryClient();
  const { token } = useUser();
  return useMutation({
    mutationFn: async (postId) => {
      // Sending the PATCH request to like/unlike the post
      const res = await axios.patch(
        `http://192.168.17.196:8000/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data; // Returning the updated post data
    },
    onMutate: async (postId) => {
      // Optimistic update: Update the liked status locally before the mutation completes
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update the posts cache with the new liked status
      queryClient.setQueryData(["posts"], (oldPosts) =>
        oldPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                liked: typeof post.liked === "boolean" ? !post.liked : false,
              }
            : post
        )
      );

      // Return the previous state for rollback in case of error
      return { previousPosts };
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error("Axios error message:", error.message);
        if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Data:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        }
      } else {
        console.error("Non-Axios error:", error);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch posts after the mutation
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export default useLikePost;
