const Like = require("../models/likeModel");
const Post = require("../models/postModel");

// Like a Post
const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id; // Authenticated user ID

    // Check if post exists
    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Check if user already liked the post
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      return res.status(400).json({ success: false, message: "You already liked this post" });
    }

    // Create new like
    await Like.create({ user: userId, post: postId });

    res.status(201).json({ success: true, message: "Post liked!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Unlike a Post
const unlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    // Find and remove the like
    const like = await Like.findOneAndDelete({ user: userId, post: postId });

    if (!like) {
      return res.status(400).json({ success: false, message: "You have not liked this post" });
    }

    res.status(200).json({ success: true, message: "Like removed!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get Like Count for a Post
const getLikeCount = async (req, res) => {
  try {
    const { postId } = req.params;
    const likeCount = await Like.countDocuments({ post: postId });

    res.status(200).json({ success: true, likeCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

module.exports = { likePost, unlikePost, getLikeCount };
