const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { userSockets } = require("../socket/webSocket"); // Import userSockets

exports.signup = async (req, resp) => {
  try {
    const { email, location } = req.body;
    const { region, zone, woreda } = location;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return resp.status(400).json({
        status: "fail",
        message: "Email already exists, please find another one",
      });
    }

    if (!region || !woreda || !zone) {
      return resp.status(400).json({
        status: "fail",
        message: "Please fill all location fields",
      });
    }

    const newUser = new User(req.body);
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    resp.status(201).json({ status: "success", newUser, token });
  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue)[0]; // Get the field that caused the duplication
      return resp.status(400).json({
        status: "fail",
        message: `${duplicateField} already exists. Please use a different one.`,
      });
    }
    resp.status(500).json({ status: "fail", err: err.message });
  }
};

exports.login = async (req, resp) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return resp
        .status(400)
        .json({ status: "fail", message: "Invalid email" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return resp
        .status(400)
        .json({ status: "fail", message: "Wrong password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    resp.status(200).json({ status: "success", user, token });
  } catch (err) {
    return resp.status(404).json({ status: "fail", error: err.message });
  }
};

// Get profile information (Authenticated User)
exports.getUser = async (req, resp) => {
  try {
    const userId = req.user.id; // From authenticateUser middleware
    const user = await User.findById(userId).select("-password"); // Exclude password field

    if (!user) {
      return resp
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    resp.status(200).json({ status: "success", user });
  } catch (err) {
    return resp.status(500).json({ status: "fail", error: err.message });
  }
};

// Edit profile information (Authenticated User)
// Update User function - updated to handle image uploads similar to createPost
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let profilePicture = req.user.profilePicture; // Default to existing profile picture

    if (req.file) {
      // If a new profile image is uploaded
      profilePicture = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches the one in the database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Update user data
    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    // Send WebSocket event after updating user data
    const io = req.app.get("socketio");
    io.to(user._id).emit("userUpdated", user); // Emit the updated user data

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Failed to update profile." });
  }
};

