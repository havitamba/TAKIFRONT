import { io } from "socket.io-client";

export const socketClient = io(import.meta.env.VITE_SERVER_URL, {
  transports: ["websocket"], // Prefer WebSocket transport
});
