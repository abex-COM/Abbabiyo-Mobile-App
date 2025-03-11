const express = require("express");
const { createComment, getCommentsByPost, deleteComment } = require("../controllers/commentController");
const router = express.Router();
const { authenticateUser } = require("../middleWare/authmiddleWare");

// Create a comment
router.post("/createComment",authenticateUser, createComment);

// Get all comments for a post
router.get("/getComment/:postId",authenticateUser, getCommentsByPost);

// Delete a comment
router.delete("/delete/:commentId", authenticateUser, deleteComment);

module.exports = router;
