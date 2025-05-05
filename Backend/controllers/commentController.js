const Comment = require("../models/commentModel");

//  Create a Comment
const Post = require("../models/postModel");
const { getIO } = require("../socket/webSocket"); //import socket helper

const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user.id;

    if (!text || !postId) {
      return res
        .status(400)
        .json({ success: false, message: "Post ID and text are required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const newComment = await Comment.create({
      postId,
      author: userId,
      text,
    });

    const populatedComment = await Comment.findById(newComment._id).populate(
      "author",
      "name profilePicture"
    );

    const io = getIO();

    //  Broadcast comment to everyone (for UI updates)
    io.emit("newComment", {
      postId,
      comment: populatedComment,
    });

    //  Send comment notification to post author if not the commenter
    res.status(201).json({
      success: true,
      message: "Comment added!",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// /  Get all Comments for a Post
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId })
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

//  Delete a Comment (Only Author or Admin)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id; // Get logged-in user

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (!comment.author.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this comment",
      });
    }

    await comment.deleteOne(); // More efficient than `findByIdAndDelete`

    const io = getIO();
    io.emit("commentDeleted", {
      postId: comment.postId,
      commentId: comment._id,
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      comment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getAllComments = async (req, resp) => {
  try {
    const comments = await Comment.find();
    resp.status(200).json({ status: "success", data: comments });
  } catch (err) {
    resp.status(500).json({ status: "fail", error: err.message });
  }
};
const getCommentByAuthor = async (req, resp) => {
  try {
    const author = req.user.id;
    const comment = await Comment.find({ author: author });
    resp.status(200).json({ status: "success", data: comment });
  } catch (err) {
    resp.status(500).json({ status: "fail", error: err.message });
  }
};
module.exports = {
  createComment,
  getCommentsByPost,
  deleteComment,
  getAllComments,
  getCommentByAuthor,
};
