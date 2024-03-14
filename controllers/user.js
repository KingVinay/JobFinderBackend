const registerUser = async (req, res) => {
  try {
    const { name, password, email, mobile } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({
        errorMessage: "Bad Request!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ ErrorMessage: "Something Went Wrong!" });
  }
};

module.exports = { registerUser };
