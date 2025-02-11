const { Server } = require("socket.io");
const BusLocation = require("../models/BusLocation");

let io;
const activeDrivers = {}; // Store latest bus locations
const MAX_LOCATIONS_PER_BUS = 50; // Store only last 50 locations per bus

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🚀 User connected: ${socket.id}`);

    // Student joins a bus tracking room
    socket.on("joinBusRoom", (busId) => {
      socket.join(busId);
      console.log(`👨‍🎓 Student joined bus room: ${busId}`);

      // Send the latest known location instantly
      if (activeDrivers[busId]) {
        socket.emit("busLocationUpdate", activeDrivers[busId]);
      }
    });

    // Driver sends live location updates
    socket.on("locationUpdate", async (data) => {
      const { busId, latitude, longitude } = data;

      if (!busId || !latitude || !longitude) {
        return;
      }

      try {
        // Save location to MongoDB
        await BusLocation.create({ busId, latitude, longitude });

        // Keep only the last 50 locations
        const locations = await BusLocation.find({ busId }).sort({
          timestamp: -1,
        });
        if (locations.length > MAX_LOCATIONS_PER_BUS) {
          const excess = locations.slice(MAX_LOCATIONS_PER_BUS);
          await BusLocation.deleteMany({
            _id: { $in: excess.map((loc) => loc._id) },
          });
        }

        // Store latest location in memory
        activeDrivers[busId] = { busId, latitude, longitude };

        // Emit update only to students tracking this bus
        io.to(busId).emit("busLocationUpdate", { busId, latitude, longitude });
      } catch (error) {
        console.error("❌ Error saving location:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { initializeSocket, io };
