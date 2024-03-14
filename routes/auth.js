const express = require("express");
const router = express.Router();
const authController = require("../controllers/user");

router.post("/register", authController.registerUser);
router.post("/login");

module.exports = router;
