const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {authenticateUser} = require("../middleWare/authmiddleWare");  // Ensure this is correctly imported

// Public routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Protected routes (Requires authentication)
router.get("/profile", authenticateUser, userController.getUser);  // Get user profile
router.patch("/profile/update", authenticateUser, userController.updateUser);  // Edit user profile

module.exports = router;
