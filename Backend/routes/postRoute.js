const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const {authenticateUser} = require('../middleWare/authmiddleWare')
router.post("/createPost",authenticateUser,postController.createPost);

router.get("/getAllposts", postController.getAllPosts);
router.get("/:postId", postController.getPostById);
// delete post

router.delete("/:postId", authenticateUser,postController.deletePost);
// liking post
router.patch("/:postId/like", authenticateUser, postController.likePost);
// Get Posts by Author (new route)
router.get("/author/:authorId", postController.getPostsByAuthor);

module.exports = router;
