const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
// Creating user
exports.signup = async (req, resp) => {
  try {
    const { email, location } = req.body;
    const { region, zone, woreda } = location;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return resp.status(400).json({
        status: "fail",
        message: "email alredy exist, please find another one",
      });
    }

    if (!region || !woreda || !zone) {
      return resp.status(400).json({
        status: "fail",
        message: "please fill all locations",
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

    // Using select to deselect password
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
exports.updateUser = async (req, resp) => {
  try {
    const userId = req.user.id; // From authenticateUser middleware
    const { name, email, profilePicture } = req.body; // Fields to update

    const user = await User.findById(userId);
    if (!user) {
      return resp
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    // Update only the fields provided by the user
    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;

    // Save the updated user document
    await user.save();

    resp
      .status(200)
      .json({ status: "success", message: "Profile updated", user });
  } catch (err) {
    return resp.status(500).json({ status: "fail", error: err.message });
  }
};
