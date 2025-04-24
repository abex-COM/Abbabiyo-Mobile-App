const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../controllers/recommendation");
const { authenticateUser } = require("../middleWare/authmiddleWare");


router.post("/personalized", authenticateUser, getRecommendations);

module.exports = router;
