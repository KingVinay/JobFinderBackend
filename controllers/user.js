const User = require("../models/user");
const bcrypt = require("bcrypt");

// Register User API (with user data and password encryption)
const registerUser = async (req, res) => {
  try {
    const { name, password, email, mobile } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({
        errorMessage: "Bad Request!",
      });
    }

    // checking is user with email present or not
    const isExistingUser = await User.findOne({ email: email });

    if (isExistingUser) {
      return res.status(400).json({ errorMessage: "User already exists" });
    }

    // Using password hashing using bcrypt module for password encryption
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    await userData.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ErrorMessage: "Something Went Wrong!" });
  }
};

// Login User API (User Details check and Password Match)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        errorMessage: "Bad Request! Invalid Credentials",
      });
    }

    const userDetails = await User.findOne({ email });

    if (!userDetails) {
      return res.status(401).json({ errorMessage: "Invalid Credentials!" });
    }

    const passwordMatch = await bcrypt.compare(password, userDetails.password);

    if (!passwordMatch) {
      return res.status(401).json({ errorMessage: "Invalid Credentials!" });
    }

    res.json({ message: "User Logged In!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

module.exports = { registerUser, loginUser };
