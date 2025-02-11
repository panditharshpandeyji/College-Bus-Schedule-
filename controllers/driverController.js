const Driver = require("../models/Driver");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register Driver
const registerDriver = async (req, res) => {
  try {
    const { name, email, password, bus } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ message: "Driver already exists" });
    }

    // Create new driver
    const newDriver = await Driver.create({ name, email, password, bus });

    res.status(201).json({
      _id: newDriver._id,
      name: newDriver.name,
      email: newDriver.email,
      bus: newDriver.bus,
      token: generateToken(newDriver._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Driver
const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if driver exists
    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      bus: driver.bus,
      token: generateToken(driver._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerDriver, loginDriver };
