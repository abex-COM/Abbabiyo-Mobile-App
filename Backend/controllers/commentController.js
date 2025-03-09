const Comment = require("../models/commentModel");
const Post = require("../models/Post");

// Create a Comment
const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user.id; // Assuming user authentication middleware

    // Check if post exists
    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const newComment = await Comment.create({
      postId,
      author: userId,
      text,
    });

    res.status(201).json({ success: true, message: "Comment added!", comment: newComment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get all Comments for a Post
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId }).populate("author", "username profilePicture").sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Delete a Comment (Only Author or Admin)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id; // Get logged-in user
    const userRole = req.user.role; // Role from auth middleware

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // Check if the user is the author or an admin
    if (comment.author.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

module.exports = { createComment, getCommentsByPost, deleteComment };
