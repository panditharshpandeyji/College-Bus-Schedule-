const Bus = require("../models/Bus");
const mongoose = require("mongoose");
// Get all buses
const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find(); //.populate("driver");
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new bus
const addBus = async (req, res) => {
  try {
    const { number, route, driver, schedule } = req.body;
    const newBus = new Bus({ number, route, driver, schedule });
    await newBus.save();
    res.status(201).json(newBus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a bus
const updateBus = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate if id is a valid ObjectId
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid Bus ID format" });
    // }

    const updatedBus = await Bus.findByIdAndUpdate(id.trim(), req.body, {
      new: true,
    });

    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json(updatedBus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a bus
const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    await Bus.findByIdAndDelete(id);
    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Bus Location (Only Authorized Drivers)
const updateBusLocation = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim(); // Trim any extra whitespace

    // Validate if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Bus ID format" });
    }

    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Update bus location
    bus.location = { latitude, longitude };
    await bus.save();

    res.status(200).json({ message: "Bus location updated successfully", bus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBuses, addBus, updateBus, deleteBus, updateBusLocation };
