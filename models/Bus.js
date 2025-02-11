const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  route: { type: String, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  schedule: [
    {
      stopName: String,
      arrivalTime: String,
    },
  ],
  location: {
    latitude: Number,
    longitude: Number,
    lastUpdated: { type: Date, default: Date.now },
  },
});

module.exports = mongoose.model("Bus", BusSchema);
