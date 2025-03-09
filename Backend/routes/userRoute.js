const express = require("express");
const router = express.Router();
const userControlller = require("../controllers/userController");
router.post("/signup", userControlller.signup);
router.post("/login", userControlller.login);
// Use the router with the app

module.exports = router;
