const socketIo = require("socket.io");

let userSockets = {}; // Declare userSockets at the top level for WebSocket management

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Listen for the authentication event and associate socket with userId
    socket.on("authenticate", (userId) => {
      userSockets[userId] = socket; // Store user socket
      console.log(`User ${userId} authenticated`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Remove the socket from the userSockets object on disconnect
      Object.keys(userSockets).forEach((key) => {
        if (userSockets[key] === socket) {
          delete userSockets[key]; // Remove the disconnected socket from userSockets
        }
      });
    });
  });

  return io;
};

module.exports = { initializeSocket, userSockets };
