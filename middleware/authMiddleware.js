const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    token = token.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "JWT_SECRET is missing in environment variables" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.driver = await Driver.findById(decoded.id).select("-password"); // Attach driver to request
    if (!req.driver) {
      return res.status(401).json({ message: "Driver not found" });
    }

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired, please log in again" });
    }
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { protect };
