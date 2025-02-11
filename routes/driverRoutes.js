const express = require("express");
const {
  registerDriver,
  loginDriver,
} = require("../controllers/driverController");

const router = express.Router();

router.post("/register", registerDriver); // Register new driver
router.post("/login", loginDriver); // Login driver

module.exports = router;
