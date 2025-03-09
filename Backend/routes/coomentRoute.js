const express = require("express");
const { createComment, getCommentsByPost, deleteComment } = require("../controllers/commentController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes
router.get("/:postId", getCommentsByPost); // Get all comments for a post
router.delete("/:commentId",  deleteComment); // Delete a comment

module.exports = router;
