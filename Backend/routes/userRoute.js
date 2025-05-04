const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateUser } = require("../middleWare/authmiddleWare"); // Ensure this is correctly imported
const upload = require("../middleWare/upload");
// Public routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post(
  "/push-token",
  authenticateUser,
  userController.updateExpoPushToken
);

// Protected routes (Requires authentication)
router.get("/profile", authenticateUser, userController.getUser); // Get user profile
router.put(
  "/profile/update",
  authenticateUser,
  upload.single("profilePicture"),
  userController.updateUser
); // Edit user profile

module.exports = router;
