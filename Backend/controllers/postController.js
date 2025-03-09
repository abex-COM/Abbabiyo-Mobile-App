const Post = require("../models/postModel");

// ✅ Create a Post
exports.createPost = async (req, resp) => {
  try {
    const { author, text, image } = req.body;

    if (!author || !text) {
      return resp.status(400).json({ status: "fail", message: "Author and text are required" });
    }

    const newPost = new Post({ author, text, image });
    await newPost.save();

    resp.status(201).json({ status: "success", post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    resp.status(500).json({ status: "fail", error: "Internal server error" });
  }
};

// ✅ Get All Posts
exports.getAllPosts = async (req, resp) => {
  try {
    const posts = await Post.find().populate("author", "username email").sort({ createdAt: -1 });

    if (posts.length === 0) {
      return resp.status(404).json({ status: "fail", message: "No posts found" });
    }

    resp.status(200).json({ status: "success", posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    resp.status(500).json({ status: "fail", error: "Internal server error" });
  }
};

// ✅ Get Post by ID
exports.getPostById = async (req, resp) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("author", "username email");

    if (!post) {
      return resp.status(404).json({ status: "fail", message: "Post not found" });
    }

    resp.status(200).json({ status: "success", post });
  } catch (err) {
    console.error("Error fetching post:", err);
    resp.status(500).json({ status: "fail", error: "Internal server error" });
  }
};

// ✅ Delete a Post
exports.deletePost = async (req, resp) => {
  try {
    const { postId } = req.params;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return resp.status(404).json({ status: "fail", message: "Post not found" });
    }

    resp.status(200).json({ status: "success", message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    resp.status(500).json({ status: "fail", error: "Internal server error" });
  }
};

// ✅ Like a Post
exports.likePost = async (req, resp) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return resp.status(400).json({ status: "fail", message: "User ID is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return resp.status(404).json({ status: "fail", message: "Post not found" });
    }

    // Check if the user already liked the post
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    resp.status(200).json({ status: "success", message: isLiked ? "Post unliked" : "Post liked", post });
  } catch (err) {
    console.error("Error liking post:", err);
    resp.status(500).json({ status: "fail", error: "Internal server error" });
  }
};
