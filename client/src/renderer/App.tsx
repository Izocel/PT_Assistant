import React, { useEffect, useRef, useState } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import icon from "../../assets/icon.svg";
import "./App.css";

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
  }, [devices]);

  function render() {
    return (
      <div className="text-center">
        <img width="200" alt="icon" src={icon} />
        <h1>electron-react-boilerplate</h1>

        <video width={"50%"} ref={videoRef} />
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
