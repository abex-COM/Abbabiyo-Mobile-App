// utils/socket.js
import { io } from "socket.io-client";
import baseUrl from "@/baseUrl/baseUrl";
let socket;

export const initiateSocketConnection = (userId) => {
  socket = io(`${baseUrl}`, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Connected to socket:", socket.id);
    socket.emit("authenticate", userId); //  send userId to server
  });
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
