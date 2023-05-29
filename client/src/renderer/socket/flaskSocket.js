import { io } from "socket.io-client";
const socket = io("http://127.0.0.1:5000");

socket.on("connect", () => {
  console.warn("ON CONNECTION:\n", socket.id);
});

socket.on("disconnect", () => {
  console.warn("ON DISCONNECT: ");
});

socket.on("message", (data) => {
  console.log("ON MESSAGE:\n", data);
});

export default socket;
