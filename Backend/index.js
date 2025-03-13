const express = require("express");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const cors = require("cors");
// const socketIo = require("socket.io");
const http = require("http");
require("dotenv").config(); // Make sure this is at the very top
const mongoose = require("mongoose");
const app = express();

const server = http.createServer(app);

const corsOptions = {
  origin: "*",
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON data

// const io = socketIo(server, {
//   cors: {
//     origin: corsOptions.origin, // Adjust for your frontend
//   },
// });

// app.set("socketio", io); // Attach io to the app object

// Middleware

// const studentRoute = require("./routes/studentRoute");
// const attendanceRoute = require("./routes/attendanceRoute"); // Corrected typo

app.use("/api/users", userRoute);
app.use("/api/comments", commentRoute);
app.use("/api/posts", postRoute);

app.all("/*", (req, res) => {
  return res.status(404).json({
    status: "fail",
    message: `Cannot access the route ${req.originalUrl}`,
  });
});

// Start the server
// io.on("connection", (socket) => {
//   console.log("A client connected");

//   // Handle events
//   socket.on("disconnect", () => {
//     console.log("A client disconnected");
//   });
// });

// Set up the port
// Start the server

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MONGODB"))
  .catch((err) => console.log(`Error occurred: ${err}`));

const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export both app and server
module.exports = { app };
