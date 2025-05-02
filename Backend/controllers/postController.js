const Post = require("../models/postModel");
const { getIO } = require("../socket/webSocket");

// Create a Post
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = "";

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
      if (process.env.NODE_ENV === "production") {
        imageUrl = imageUrl.replace("http://", "https://");
      }
    }

    const newPost = await Post.create({
      text,
      image: imageUrl,
      author: req.user._id,
    });

    const populatedPost = await Post.findById(newPost._id).populate("author");

    const io = getIO();
    io.emit("newPost", populatedPost);

    res.status(201).json(populatedPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create post.", error: err.message });
  }
};

// Get All Posts
exports.getAllPosts = async (req, resp) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    if (posts.length === 0) {
      return resp
        .status(404)
        .json({ status: "fail", message: "No posts found" });
    }

    resp.status(200).json({ status: "success", posts });
  } catch (err) {
    console.log("Error fetching posts:", err);
    resp.status(500).json({ status: "fail", error: err.message });
  }
};

// Get Post by ID
exports.getPostById = async (req, resp) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate(
      "author",
      "username email"
    );

    if (!post) {
      return resp
        .status(404)
        .json({ status: "fail", message: "Post not found" });
    }

    resp.status(200).json({ status: "success", post });
  } catch (err) {
    console.log("Error fetching post:", err);
    resp.status(500).json({ status: "fail", error: err.message });
  }
};

// Delete a Post
exports.deletePost = async (req, resp) => {
  try {
    const { postId } = req.params;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return resp
        .status(404)
        .json({ status: "fail", message: "Post not found" });
    }

    resp
      .status(200)
      .json({ status: "success", message: "Post deleted successfully" });
  } catch (err) {
    resp.status(500).json({ status: "fail", error: err.message });
  }
};

// Like/Unlike a Post
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("author", "-password")
      .populate("likes", "-password");

    const io = getIO();
    io.emit("newLike", {
      postId: updatedPost._id,
      likeCount: updatedPost.likes.length,
      likedBy: updatedPost.likes.map((user) => user._id),
      userId,
      liked: !hasLiked,
    });

    res.status(200).json({
      success: true,
      message: hasLiked ? "Post unliked" : "Post liked",
      post: updatedPost,
    });
  } catch (error) {
    console.log("Error liking/unliking post:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Posts by Author
exports.getPostsByAuthor = async (req, resp) => {
  try {
    const author = req.user.id;

    const posts = await Post.find({ author })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return resp
        .status(404)
        .json({ status: "fail", message: "No posts found for this author" });
    }

    resp.status(200).json({ status: "success", posts });
  } catch (err) {
    console.log("Error fetching posts by author:", err.message);
    resp.status(500).json({ status: "fail", error: err.message });
  }
};

// Update a Post (Only if current user is the author)
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this post" });
    }

    let updatedData = {};
    if (text) updatedData.text = text;

    if (req.file) {
      let imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
      if (process.env.NODE_ENV === "production") {
        imageUrl = imageUrl.replace("http://", "https://");
      }
      updatedData.image = imageUrl;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: updatedData },
      { new: true }
    ).populate("author");

    const io = getIO();
    io.emit("postUpdated", updatedPost);

    res.status(200).json({ message: "Post updated", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    });
  }
};
