// routes/geminiRoutes.js
const express = require("express");
const askGemini = require("../controllers/geminiAPI");

const router = express.Router();

router.post("/ask", askGemini);

module.exports = router;
