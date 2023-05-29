import React, { useEffect, useRef, useState } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { io } from "socket.io-client";
const socket = io("http://127.0.0.1:5000");

// client-side
socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log(socket.id); // undefined
});

// client-side
socket.on("message", (data) => {
  console.log(data);
});

// client-side
socket.emit("message", "CLIENT: Hello world");


function Home(props) {
  const [devices, setDevices] = useState();
  const videoRef = useRef();

  async function getMediaDevices() {
    await navigator.permissions.query({ name: "camera" });

    const options = { audio: true, video: true };
    const founds = navigator.mediaDevices;
    setDevices(founds);

    try {
      let video = videoRef.current;
      video.srcObject = await founds.getUserMedia(options);
      video.play();
    } catch (error) {
      console.error(error);
    }

    console.warn(devices);
  }

  useEffect(() => {
    getMediaDevices();
  }, []);

  function render() {
    return (
      <div>
        <div className="d-flex flex-row-reverse topVideo">
          <video ref={videoRef} />
        </div>


        <div className="input-group bottomInput">
          <input
            type="text"
            className="form-control"
            aria-label="Text input with send button"
            placeholder="Ask something to the AI..."
          />
          <div className="input-group-append">
            <button type="button" className="btn btn-lg btn-primary">
              <i className="fa-regular fa-paper-plane"></i>
            </button>

          </div>
        </div>
      </div>
    );
  }

  return render();
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
