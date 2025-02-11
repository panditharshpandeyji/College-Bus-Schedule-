const BusLocation = require("../models/BusLocation");

// Get Location History for a Bus
const getBusLocationHistory = async (req, res) => {
  try {
    const { busId } = req.params;
    const locations = await BusLocation.find({ busId }).sort({ timestamp: -1 });

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBusLocationHistory };
