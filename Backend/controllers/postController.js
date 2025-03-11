const Post = require("../models/postModel");

//  Create a Post
exports.createPost = async (req, resp) => {
  try {
    const { text, image } = req.body;
    const author = req.user.id; // Extract author from authenticated user
    if (!text) {
      return resp.status(400).json({ status: "fail", message: "Text is required" });
    }

    const newPost = new Post({ author, text, image });
    await newPost.save();

    resp.status(201).json({ status: "success", post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    resp.status(500).json({ status: "fail", error: "Internal server error" });
  }
};

//  Get All Posts
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

//  Get Post by ID
exports.getPostById = async (req, resp) => {
  console.log(req.params)
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

//  Delete a Post
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
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // Get user ID from authenticated user

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      // Unlike: Remove userId from likes array
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like: Add userId to likes array
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ success: true, message: hasLiked ? "Post unliked" : "Post liked", post });
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Posts by Author
exports.getPostsByAuthor = async (req, resp) => {
  try {
    const { authorId } = req.params;  // Author ID passed as a parameter in the route
    const posts = await Post.find({ author: authorId }).populate("author", "name email").sort({ createdAt: -1 });

    if (posts.length === 0) {
      return resp.status(404).json({ status: "fail", message: "No posts found for this author" });
    }

    resp.status(200).json({ status: "success", posts });
  } catch (err) {
    console.error("Error fetching posts by author:", err);
    resp.status(500).json({ status: "fail", error: "Internal server error" });
  }
};
