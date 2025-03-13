const mongoose = require("mongoose");
const validator = require("validator");
const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: (value) => mongoose.Types.ObjectId.isValid(value),
      message: "Invalid author ID",
    },
  },
  text: { type: String, required: true, trim: true },
  image: { type: String, default: null }, // Ensure null if not provided
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [], // Ensure empty array instead of undefined
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
