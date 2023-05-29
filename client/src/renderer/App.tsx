import React, { useEffect, useRef, useState } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import flaskSocket from "./socket/flaskSocket";

function Home(props) {
  const [devices, setDevices] = useState();
  const videoRef = useRef();

  async function getMediaDevices() {
    if(!videoRef.current) {
      return;
    }

    await navigator.permissions.query({ name: "camera" });

    const options = { audio: true, video: true };
    const founds = navigator.mediaDevices;
    setDevices(founds);

    try {
      let video = videoRef.current;
      const stream = await founds.getUserMedia(options);
      video.srcObject = stream;
      video.play();

      flaskSocket.emit("stream", stream);
    } catch (error) {
      console.error(error);
    }

    console.warn(devices);
  }

  useEffect(() => {
    flaskSocket.emit("message", "CLIENT: question.....");
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
