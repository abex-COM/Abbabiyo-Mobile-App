// socket.js
const socketIo = require("socket.io");

let io; // global io instance
let userSockets = {}; // track userId -> socket

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("authenticate", (userId) => {
      userSockets[userId] = socket;
      console.log(`🔐 User ${userId} authenticated`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
      for (const [userId, userSocket] of Object.entries(userSockets)) {
        if (userSocket === socket) {
          delete userSockets[userId];
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initializeSocket, getIO, userSockets };
