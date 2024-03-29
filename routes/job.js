const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job");
const verifyToken = require("../middlewares/verifyToken.js");

router.post("/create", verifyToken, jobController.createJobPost);

router.get("/job-details/:jobId", jobController.getJobDetailsById);

router.put("/update/:jobId", verifyToken, jobController.updateJobDetailsById);

module.exports = router;
