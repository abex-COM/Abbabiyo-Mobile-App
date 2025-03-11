const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

//  Create a Comment
const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user.id; // Assuming authentication middleware adds `req.user`

    if (!text || !postId) {
      return res.status(400).json({ success: false, message: "Post ID and text are required" });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const newComment = await Comment.create({
      postId,
      author: userId,
      text,
    });

    res.status(201).json({ success: true, message: "Comment added!", comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//  Get all Comments for a Post
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//  Delete a Comment (Only Author or Admin)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id; // Get logged-in user
    const userRole = req.user.role; // Get user role

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // Check if the user is the author or an admin
    if (comment.author.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
    }

    await comment.deleteOne(); // More efficient than `findByIdAndDelete`
    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createComment, getCommentsByPost, deleteComment };
