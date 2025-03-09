const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/posts", postController.createPost);
router.get("/posts", postController.getAllPosts);
router.get("/posts/:postId", postController.getPostById);
router.delete("/posts/:postId", postController.deletePost);
router.post("/posts/:postId/like", postController.likePost);

module.exports = router;
