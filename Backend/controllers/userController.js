const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
// Creating user

exports.signup = async (req, resp) => {
  try {
    const { email } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return resp
        .status(400)
        .json({ status: "fail", message: "email alredy exist" });
    }

    const newUser = new User.create(req.body);

    resp.status(201).json({ status: "success", newUser });
  } catch (err) {
    resp.status(500).json({ status: "fail", error: err.message });
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
  
    const isMatch = await user.comparedPassword(password)
    if (!isMatch) {
      return resp.status(400)
        .json({ status: "fail", message: "Wrong password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    resp.status(200).json({ status: "success", user: user, token });
  } catch (err) {
    return resp.status(404).json({ status: "fail", error: err.message });
  }
};

