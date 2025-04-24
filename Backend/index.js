const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const geminiRoute = require("./routes/geminiRoute");
const farmLocationRoute = require("./routes/farmLocationRoute"); // Import farm location route
const { initializeSocket } = require("./socket/webSocket"); // Import WebSocket setup

const app = express();
const server = http.createServer(app);

// CORS Configuration
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use("/uploads", express.static("uploads"));

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON data

// Initialize WebSocket
const io = initializeSocket(server);
app.set("socketio", io); // Attach socket instance to app for controllers

// Routes
app.use("/api/users", userRoute);
app.use("/api/comments", commentRoute);
app.use("/api/posts", postRoute);
app.use("/api/gemini", geminiRoute);
app.use("/api/farm-locations", farmLocationRoute);

// 404 Error Handler
app.all("/*", (req, res) => {
  return res.status(404).json({
    status: "fail",
    message: `Cannot access the route ${req.originalUrl}`,
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error(`Error connecting to DB: ${err.message}`));

const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export app and server for testing & integration
module.exports = { app, server };