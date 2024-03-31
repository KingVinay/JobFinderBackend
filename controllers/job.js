const Job = require("../models/job");

// CreateJobPost Api with job details saved to database fetched from body and refuserId from verifyToken middleware from generated json web token
const createJobPost = async (req, res, next) => {
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
    next(error);
  }
};

//getJobDetailsById api works by fetching jobId  using findById() yo check whether a job exists wrt jobId or not

const getJobDetailsById = async (req, res, next) => {
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
    next(error);
  }
};

// updateJobDetailsById api works by precheck through verifyToken middleware then fetching jobId and userId and using findOne() finding whether a job exists wrt them and fetching data to update form body finally updating using updateOne() with $set parameter to change data in database

const updateJobDetailsById = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.userId;

    if (!jobId) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    const isJobExists = await Job.findOne({ _id: jobId, refUserId: userId });

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
    next(error);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    // filter by title
    const title = req.query.title || "";
    const skills = req.query.skills;
    let filteredskills;
    let filter = {};

    if (skills) {
      filteredskills = skills.split(",");
      const caseInsensitiveFilteredSkills = filteredskills.map(
        (element) => new RegExp(element, "i")
      );
      filter = { skills: { $in: caseInsensitiveFilteredSkills } };
    }

    const jobList = await Job.find(
      {
        title: { $regex: title, $options: "i" },
        ...filter,
      },
      { companyName: 1, title: 1 }
    );
    res.json({ data: jobList });
  } catch (error) {
    next(error);
  }
};

//

const deleteJobPost = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    if (!jobId) {
      return res.status(400).json({
        message: "Bad request!",
      });
    }

    const isJobExists = Job.findOne({ _id: jobId });

    if (!isJobExists) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    await Job.deleteOne({ _id: jobId });

    res.json({ message: "Job Post deleted Successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJobPost,
  getJobDetailsById,
  updateJobDetailsById,
  getAllJobs,
  deleteJobPost,
};
