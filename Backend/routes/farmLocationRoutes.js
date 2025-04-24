const express = require("express");
const router = express.Router();
const farmLocationController = require("../controllers/farmLocationController"); // Adjust the path
const { authenticateUser } = require("../middleWare/authmiddleWare");

router.post("/add", authenticateUser, farmLocationController.addFarmLocation);
router.put("/update", authenticateUser, farmLocationController.updateFarmLocation);
router.delete("/delete", authenticateUser, farmLocationController.deleteFarmLocation);
router.get("/all/:userId", authenticateUser, farmLocationController.getAllFarmLocations);

module.exports = router;