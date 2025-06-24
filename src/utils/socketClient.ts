import { io } from "socket.io-client";

export const socketClient = io("http://takiback-production.up.railway.app", {
  transports: ["websocket"], // Prefer WebSocket transport
});
