const express = require("express");
const { likePost, unlikePost, getLikeCount } = require("../controllers/likeControler");

const router = express.Router();

// Like a post
router.post("/", likePost);

// Unlike a post
router.delete("/", unlikePost);

// Get like count for a post
router.get("/:postId", getLikeCount);

module.exports = router;
