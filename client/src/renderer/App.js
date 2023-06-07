import React, { createElement, useEffect, useRef, useState } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import flaskSocket from "./socket/flaskSocket";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const mockValue = `Powder oat cake cupcake cotton candy ice cream lemon drops dessert. Chupa chups cake donut toffee cookie. Cotton candy shortbread jujubes bonbon cheesecake. Toffee gummies jujubes marshmallow cake cotton candy gummies. Sugar plum chupa chups fruitcake cotton candy lemon drops croissant dessert liquorice. Tiramisu tart gummies muffin fruitcake gummies jelly chocolate bar dragée. Macaroon gummies donut cake candy tart macaroon chocolate bar. Sweet roll candy canes chupa chups pastry toffee sweet roll. Apple pie wafer tootsie roll bear claw shortbread halvah pudding toffee jujubes. Chocolate toffee jelly bonbon powder. Croissant donut apple pie apple pie caramels jelly-o caramels. Wafer gingerbread oat cake cupcake sugar plum cake dessert bear claw. Fruitcake apple pie tart dragée tart sweet roll topping toffee cotton candy. Cheesecake marzipan chocolate cake jelly beans apple pie jujubes icing.

Muffin halvah sugar plum tootsie roll bonbon bonbon cake topping pudding. Chocolate caramels dragée powder bonbon biscuit cupcake halvah shortbread. Dragée tart sweet cake cake.
`;

const mockAdvancedValue = `
here's some \`\`\`code-blocks\`\`\` :

\`\`\`js
    const message = event?.currentTarget.value;
    const chatBox = getChatBox();
    const newElement = getuserMsgNodeFromTemplate();

    let time = new Date();
    time = time.toLocaleString();
\`\`\`
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

  function scrollChatToBottom() {
    const element = document.getElementById("chat-container")?.parentElement;
    element?.scrollTo(0, Number.MAX_SAFE_INTEGER - 1);
  }

  function scrollChatToTop() {
    const element = document.getElementById("chat-container")?.parentElement;
    element?.scrollTo(0, 0);
  }

  function handleKeyEnter(event) {
    if (event.currentTarget.value.length) {
      event.currentTarget.classList.remove("border-danger");
    }

    if (
      event.code !== "Enter" &&
      event.code !== "NumpadEnter" ||
      event.shiftKey ||
      event.altKey ||
      event.ctrlKey
    ) {
      return;
    }

    event.preventDefault();
    if (!event.currentTarget.value.length) {
      event.currentTarget.classList.add("border-danger");
      return;
    }
    sendChatMessage(event);
  }

  async function sendChatMessage(event) {
    const message = mockAdvancedValue || event?.currentTarget.value;
    const chatBox = getChatBox();
    const newElement = getuserMsgNodeFromTemplate();

    let time = new Date();
    time = time.toLocaleString();

    const codeBlocks = message;
    const highlightedCode = hljs.highlightAuto(codeBlocks.replaceAll('```', ''));

    const textNode = newElement.firstElementChild;
    textNode.innerHTML = message;

    const codeNode = document.createElement('div');
    codeNode.classList.add('chatCode');
    codeNode.innerHTML = highlightedCode.value;
    newElement.appendChild(codeNode);

    chatBox.appendChild(newElement);
    console.warn("SEND CHAT MSG:", message);
    event.currentTarget.value = null;
    scrollChatToBottom();
  }

  function getChatBox() {
    return document.getElementById("chat-container");
  }

  function getuserMsgNodeFromTemplate() {
    return document
      .getElementById("userResponse")
      .firstElementChild.cloneNode(true);
  }

  function getAiMsgNodeFromTemplate() {
    return document
      .getElementById("aiResponse")
      .firstElementChild.cloneNode(true);
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
      console.warn(error);
    }
  }

  useEffect(() => {
    flaskSocket.emit("message", "CLIENT: question.....");
    init();
  }, []);

  function render() {
    return (
      <div className="root">
        <header>
          <div id={"myMedia"} className="d-flex flex-row-reverse topVideo">
            <video ref={videoRef} />
          </div>
        </header>

        <main>
          <div className="headerMargin"></div>
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
            <template hidden id="aiResponse">
              <div className="aiResponse">
                <span></span>
              </div>
            </template>

            <template hidden id="userResponse">
              <div className="userResponse">
                <span></span>
              </div>
            </template>

            <div className="aiResponse">
              <p>{"AI:\n" + mockValue}</p>
            </div>

            <p className="userResponse">{"USER:\n" + mockValue}</p>
            <p className="userResponse">{"USER:\n" + mockValue}</p>
            <p className="userResponse">{"USER:\n" + mockValue}</p>
            <p className="userResponse">{"USER:\n" + mockValue}</p>
            <p className="userResponse">{"USER:\n" + mockValue}</p>

            <div id="scrollToBottom">
              <button
                onClick={scrollChatToBottom}
                type="button"
                className="btn btn-lg btn-outline-light"
              >
                <i class="fa-solid fa-arrow-down"></i>
              </button>
            </div>
          </div>

          <div className="footerMargin"></div>
        </main>

        <footer>
          <div className="input-group bottomInput">
            <textarea
              onKeyDown={handleKeyEnter}
              type="text"
              className="form-control"
              aria-label="Text input with send button"
              placeholder="🤖 Prompt everyone..."
            />

            <div className="input-group-append">
              <button
                onClick={handleKeyEnter}
                type="button"
                className="btn btn-lg btn-primary"
              >
                <i className="fa-regular fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </footer>
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
