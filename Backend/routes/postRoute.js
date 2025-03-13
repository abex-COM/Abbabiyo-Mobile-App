const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateUser } = require("../middleWare/authmiddleWare");
router.post("/createPost", authenticateUser, postController.createPost);

router.get("/getAllposts", postController.getAllPosts);
router.get("/getPostBypostId/:postId", postController.getPostById);
// delete post

router.delete("/delete/:postId", authenticateUser, postController.deletePost);
// liking post
router.patch("/:postId/like", authenticateUser, postController.likePost);
// Get Posts by Author (new route)
router.get(
  "/getpostsByAuthor",
  authenticateUser,
  postController.getPostsByAuthor
);
module.exports = router;
