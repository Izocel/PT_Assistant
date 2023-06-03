import React, { useEffect, useRef, useState } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import flaskSocket from "./socket/flaskSocket";

const mockValue = `Powder oat cake cupcake cotton candy ice cream lemon drops dessert. Chupa chups cake donut toffee cookie. Cotton candy shortbread jujubes bonbon cheesecake. Toffee gummies jujubes marshmallow cake cotton candy gummies. Sugar plum chupa chups fruitcake cotton candy lemon drops croissant dessert liquorice. Tiramisu tart gummies muffin fruitcake gummies jelly chocolate bar dragée. Macaroon gummies donut cake candy tart macaroon chocolate bar. Sweet roll candy canes chupa chups pastry toffee sweet roll. Apple pie wafer tootsie roll bear claw shortbread halvah pudding toffee jujubes. Chocolate toffee jelly bonbon powder. Croissant donut apple pie apple pie caramels jelly-o caramels. Wafer gingerbread oat cake cupcake sugar plum cake dessert bear claw. Fruitcake apple pie tart dragée tart sweet roll topping toffee cotton candy. Cheesecake marzipan chocolate cake jelly beans apple pie jujubes icing.

Muffin halvah sugar plum tootsie roll bonbon bonbon cake topping pudding. Topping cake halvah dragée pudding cotton candy candy canes. Lollipop sesame snaps danish cheesecake bear claw halvah. Brownie pastry danish chocolate bar sugar plum cotton candy. Gingerbread apple pie pastry chupa chups tart liquorice lollipop muffin. Jelly beans soufflé bonbon cake dessert dessert. Marzipan macaroon macaroon pie tootsie roll cake cookie jelly. Shortbread pie chocolate cake pie pudding marshmallow. Apple pie sesame snaps candy sugar plum oat cake cake gingerbread. Chocolate bar lemon drops liquorice pastry oat cake wafer pie marshmallow biscuit. Chocolate caramels dragée powder bonbon biscuit cupcake halvah shortbread. Dragée tart sweet cake cake.
`;

function Home(props) {
  const [devices, setDevices] = useState();
  const videoRef = useRef();

  const peers = {};
  const myPeer = new Peer(undefined, {
    host: "/",
    port: "3001",
  });

  myPeer.on("call", (call) => {});

  myPeer.on("open", (id) => {
    flaskSocket.emit("join-room", 888, id);
  });

  function addVideoStream(video, stream, self = false) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });

    if (self) {
      videoRef.stream = stream;
    }
    videoGrid.append(video);
  }

  function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");

    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });

    call.on("close", () => {
      video.remove();
    });

    peers[userId] = call;
  }

  async function init() {
    await navigator.permissions.query({ name: "camera" });
    const options = { audio: true, video: true };
    const founds = navigator.mediaDevices;
    setDevices(founds);

    try {
      const stream = await founds.getUserMedia(options);
      addVideoStream(videoRef.current, stream, true);

      myPeer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (useVrideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });

      socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    flaskSocket.emit("message", "CLIENT: question.....");
    init();
  }, []);

  function render() {
    return (
      <div className="root">
        <div className="topRow">
          <div className="d-flex flex-row-reverse topVideo">
            <video id={"myMedia"} ref={videoRef} />
          </div>
        </div>

        <div hidden id="video-grid">
          <video />
          <video />
          <video />
          <video />
          <video />
          <video />

          <video />
          <video />
          <video />
          <video />
          <video />
          <video />

          <video />
          <video />
          <video />
          <video />
          <video />
          <video />

          <video />
          <video />
          <video />
          <video />
          <video />
          <video />
        </div>

        <div id="chat-container">
          <p className="aiResponse">{mockValue}</p>
          <p className="userResponse">{mockValue}</p>

          <div className="col">
            <p className="userResponse">hello bob</p>
          </div>
        </div>

        <div id="bottom-container">
          <div className="input-group bottomInput">
            <input
              type="text"
              className="form-control"
              aria-label="Text input with send button"
              placeholder="🤖 Prompt everyone..."
            />

            <div className="input-group-append">
              <button type="button" className="btn btn-lg btn-primary">
                <i className="fa-regular fa-paper-plane"></i>
              </button>
            </div>
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
