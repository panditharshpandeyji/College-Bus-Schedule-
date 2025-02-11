require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const busRoutes = require("./routes/busRoutes");
const driverRoutes = require("./routes/driverRoutes");
const { initializeSocket } = require("./config/socket");
const { protect } = require("./middleware/authMiddleware");

connectDB();
const app = express();
const server = http.createServer(app);
initializeSocket(server); // Use WebSocket from config socket.js

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/buses", protect, busRoutes);
app.use("/api/drivers", driverRoutes);

// Sample Route
app.get("/", (req, res) => {
  res.send("Hello, Express with WebSockets!");
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
