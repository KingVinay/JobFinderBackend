const Job = require("../models/job");

// CreateJobPost Api with job details saved to database fetched from body and refuserId from verifyToken middleware from generated json web token
const createJobPost = async (req, res) => {
  try {
    const {
      companyName,
      logoUrl,
      title,
      description,
      salary,
      location,
      duration,
      locationType,
      skills,
      refUserId,
    } = req.body;

    // Could use joi or yup package for fields validation
    if (
      !companyName ||
      !logoUrl ||
      !title ||
      !description ||
      !salary ||
      !location ||
      !duration ||
      !locationType ||
      !skills
    ) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    const userId = req.userId;

    const jobDetails = new Job({
      companyName,
      logoUrl,
      title,
      description,
      salary,
      location,
      duration,
      locationType,
      skills,
      refUserId: userId,
    });

    await jobDetails.save();
    res.json({ message: "Job Created Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

//getJobDetailsById api works by fetching jobId  using findById() yo check whether a job exists wrt jobId or not

const getJobDetailsById = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const jobDetails = await Job.findById(jobId);

    if (!jobDetails) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    res.json({ data: jobDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

// updateJobDetailsById api works by precheck through verifyToken middleware then fetching jobId and userId and using findOne() finding whether a job exists wrt them and fetching data to update form body finally updating using updateOne() with $set parameter to change data in database

const updateJobDetailsById = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.userId;

    if (!jobId) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    // bug in below statement
    const isJobExists = Job.findOne({ _id: jobId, refUserId: userId });

    if (!isJobExists) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    const {
      companyName,
      logoUrl,
      title,
      description,
      salary,
      location,
      duration,
      locationType,
      skills,
    } = req.body;

    // Could use joi or yup package for fields validation
    if (
      !companyName ||
      !logoUrl ||
      !title ||
      !description ||
      !salary ||
      !location ||
      !duration ||
      !locationType ||
      !skills
    ) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    await Job.updateOne(
      { _id: jobId, refUserId: userId },
      {
        $set: {
          companyName,
          logoUrl,
          title,
          description,
          salary,
          location,
          duration,
          locationType,
          skills,
        },
      }
    );

    res.json({ message: "Job updated successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

module.exports = { createJobPost, getJobDetailsById, updateJobDetailsById };
