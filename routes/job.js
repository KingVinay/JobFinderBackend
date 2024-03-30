const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job");
const verifyToken = require("../middlewares/verifyToken.js");

router.post("/create", verifyToken, jobController.createJobPost);

router.get("/job-details/:jobId", jobController.getJobDetailsById);

router.put("/update/:jobId", verifyToken, jobController.updateJobDetailsById);

router.get("/all", jobController.getAllJobs);

router.delete("/delete/:jobId", verifyToken, jobController.deleteJobPost);

module.exports = router;
