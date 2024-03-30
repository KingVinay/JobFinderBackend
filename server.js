const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const jobRoute = require("./routes/job");
const verifyToken = require("./middlewares/verifyToken");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected!"))
  .catch((error) => console.log("DB failed to connect!", error));

app.get("/api/health", (req, res) => {
  console.log("hey health");
  res.json({
    service: "Backend joblisting server",
    staus: "active",
    time: new Date(),
  });
});

// Middleware
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/job", jobRoute);

app.use("*", (req, res) => {
  res.status(401).json({ errorMessage: "Route not found!" });
});

// Middleware for catch block error statements
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ errorMessage: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Backend server running at port: ${PORT}`);
});
