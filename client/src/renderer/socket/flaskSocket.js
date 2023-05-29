import { env } from "renderer/configs/env";
import { io } from "socket.io-client";
const socket = io(env.SERVER_URI);

socket.on("connect", () => {
  console.warn("ON CONNECTION:\n", socket.id);
});

socket.on("disconnect", () => {
  console.warn("ON DISCONNECT: ");
});

socket.on("message", (data) => {
  console.log("ON MESSAGE:\n", data);
});

socket.on("stream", function (data) {
  console.log("ON STREAM:\n", data);
});

export default socket;
