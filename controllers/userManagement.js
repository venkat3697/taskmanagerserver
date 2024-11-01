const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createNewUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username);
  try {
    // Generate a hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate a unique userId
    const userid = uuidv4();
    // Create a new user with the userId
    const user = new User({
      userid,
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Error registering user" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.userid ,username: user.username}, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Error logging in" });
  }
};

module.exports = { createNewUser, loginUser };
