const express = require("express");
const {
  getBuses,
  addBus,
  updateBus,
  deleteBus,
} = require("../controllers/busController");
const { updateBusLocation } = require("../controllers/busController");
const { protect } = require("../middleware/authMiddleware");
const {
  getBusLocationHistory,
} = require("../controllers/busLocationController");

const router = express.Router();

router.get("/", getBuses); // Get all buses & schedules
router.post("/", addBus); // Add a new bus
router.put("/:id", updateBus); // Update bus details
router.delete("/:id", deleteBus); // Delete a bus

router.put("/update-location/:id", protect, updateBusLocation); // Only logged-in drivers can update location

router.get("/:busId/locations", getBusLocationHistory); // Get location history of a specific bus
module.exports = router;
