const express = require("express");
const router = express.Router();
const {
  getRecommendations,
  prescribe,
} = require("../controllers/recommendation");
const { authenticateUser } = require("../middleWare/authmiddleWare");

// Routes
router.post("/personalized", authenticateUser, getRecommendations);

router.post("/prescribe", prescribe);

module.exports = router;
