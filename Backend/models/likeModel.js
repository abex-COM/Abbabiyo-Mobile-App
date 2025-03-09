const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who liked the post
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Post that was liked
  createdAt: { type: Date, default: Date.now },
});

// Ensure a user can only like a post once
LikeSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model("Like", LikeSchema);
