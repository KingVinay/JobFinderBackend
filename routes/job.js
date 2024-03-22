const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job");
const verifyToken = require("../middlewares/verifyToken.js");

router.post("/create", verifyToken, jobController.createJobPost);

router.get("/job-details/:jobId", jobController.getJobDetailsById);

module.exports = router;
