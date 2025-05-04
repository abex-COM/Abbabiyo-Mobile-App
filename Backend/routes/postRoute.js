const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateUser } = require("../middleWare/authmiddleWare");
const upload = require("../middleWare/upload");

router.post(
  "/createPost",
  authenticateUser,
  upload.single("image"),
  postController.createPost
);

router.get("/getAllposts", postController.getAllPosts);
router.get("/getPostBypostId/:postId", postController.getPostById);
// delete post

router.delete("/delete/:postId", authenticateUser, postController.deletePost);
// update post
router.put(
  "/update/:postId",
  authenticateUser,
  upload.single("image"),
  postController.updatePost
);
// liking post

router.patch("/:postId/like", authenticateUser, postController.likePost);
// Get Posts by Author (new route)
router.get(
  "/getpostsByAuthor",
  authenticateUser,
  postController.getPostsByAuthor
);
module.exports = router;
