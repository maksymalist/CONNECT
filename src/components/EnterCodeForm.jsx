import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import WaitingRoom from "./game/player/WaitingRoom";
import HostRoom from "./game/host/HostRoom";
import MultiHostRoom from "./game/host/MultiHostRoom";
import Background from "./misc/Background";

import "../style/style.css";
import { toast } from "react-toastify";

import { Button, Switch, Typography } from "@mui/material";

import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";

import Translations from "../translations/translations.json";

import axios from "axios";

import { useMutation, gql } from "@apollo/client";

import list from "badwords-list";

import config from "../config.json";
import socket from "../socket-io";

const CREATE_NOTIFICATION = gql`
  mutation createNotification(
    $userId: ID!
    $type: String!
    $message: String!
    $data: String!
  ) {
    createNotification(
      userId: $userId
      type: $type
      message: $message
      data: $data
    )
  }
`;

export default function EnterCodeForm({ match, location }) {
  var [role, setRole] = useState("");
  const [checked, setChecked] = useState(false);
  var [code, setCode] = useState("");

  const [gameCode, setGameCode] = useState("");
  const [gameMode, setGameMode] = useState("");

  const [playMode, setPlayMode] = useState(true);

  const maxPlayers = useRef(null);
  const podiumPlaces = useRef(null);

  const search = useLocation().search;

  const [joinFormStep, setJoinFormStep] = useState(0);
  const [joinFormCode, setJoinFormCode] = useState("");
  const [joinFormNickname, setJoinFormNickname] = useState("");

  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const [classid, setClassid] = useState("null");
  const classID = new URLSearchParams(search).get("classid");

  //mutations
  const [createNotification] = useMutation(CREATE_NOTIFICATION);

  useEffect(() => {
    const Gamecode = new URLSearchParams(search).get("code");
    if (Gamecode !== null) {
      setCode(Gamecode);
      setJoinFormCode(Gamecode);
      console.log(Gamecode);
      setPlayMode(true);
    }
    const gamecodeParam = new URLSearchParams(search).get("gamecode");
    if (gamecodeParam !== null) {
      console.log(gamecodeParam);
      setGameCode(gamecodeParam);
      setPlayMode(false);
      setClassid(classID);
      console.log(classID);
      Generatecode();
      const mode = new URLSearchParams(search).get("mode");
      if (mode === null) return;

      if (mode === "quiz") setGameMode("normal");
      if (mode === "multi") setGameMode("multi");
    }

    var joined = false;

    socket.on("myroom", (data) => {
      socket.emit("adduser", {
        name: data.name,
        room: data.room,
      });
    });

    socket.on("roomcallback", (data) => {
      if (data.joined == true) {
        joined = true;
      }
      console.log(data);
    });

    socket.on("roomcreated", async (data) => {
      setRole((role = "host"));

      var validclassId = data.classId;

      if (maxPlayers.current == null || podiumPlaces.current == null) return;
      if (data.gamemode === "normal") {
        ReactDOM.render(
          <div>
            <HostRoom
              maxPlayers={maxPlayers.current.value}
              podiumPlaces={podiumPlaces.current.value}
              room={data.room}
              gamecode={data.gamecode}
              friendlyroom={data.friendly}
              gamemode={data.gamemode}
              classid={validclassId}
            />
            <Background />
          </div>,
          document.getElementById("root")
        );
      }
      if (data.gamemode === "multi") {
        ReactDOM.render(
          <div>
            <MultiHostRoom
              maxPlayers={maxPlayers.current.value}
              podiumPlaces={podiumPlaces.current.value}
              room={data.room}
              gamecode={data.gamecode}
              friendlyroom={data.friendly}
              gamemode={data.gamemode}
              classid={validclassId}
            />
            <Background />
          </div>,
          document.getElementById("root")
        );
      }
      localStorage.setItem(
        JSON.parse(localStorage.getItem("user")).profileObj.googleId,
        true
      );

      socket.emit("addHost", {
        googleId: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
        room: data.room,
      });

      if (validclassId != "null" && validclassId != null) {
        socket.emit("addPrivateRoom", {
          room: data.room,
          classId: validclassId,
          googleId: JSON.parse(localStorage.getItem("user")).profileObj
            .googleId,
        });

        const res = await axios.post(
          `${config["api-server"]}/get-members-of-class`,
          { id: validclassId }
        );
        const members = res.data;

        members.map((member) => {
          const memberId = member.userId;
          const notification = {
            userId: memberId.replace(/user:/g, ""),
            type: "invitation_to_room",
            message: `${
              JSON.parse(localStorage.getItem("user")).profileObj.name
            } has invited you to play a game in room ${data.room}!`,
            data: JSON.stringify({ room: data.room, classId: validclassId }),
          };

          createNotification({ variables: notification });
        });
      }
    });

    socket.on("changeName", (data) => {
      //
    });
    socket.on("roomFull", (data) => {
      toast.warning(data.message);
    });

    socket.on("addeduser", (data) => {
      if (role !== "host") {
        setRole("player");
        if (sessionStorage.getItem("roomJoined") !== "true") {
          ReactDOM.render(
            <div>
              <WaitingRoom
                room={data.currentRoom}
                usersInRoom={data.UsersInRoom}
                user={data.name}
              />
              <Background />
            </div>,
            document.getElementById("root")
          );
          sessionStorage.setItem("roomJoined", "true");
        }
      }
    });
    const terminateRoomPopUp = (room) => (
      <div>
        <h3>{Translations[userLanguage].alerts.terminate.text1}</h3>
        <h4>{Translations[userLanguage].alerts.terminate.text2}</h4>
        <Button
          style={{ marginBottom: "1vh" }}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            terminateRoom(room);
          }}
        >
          {Translations[userLanguage].alerts.terminate.button}
        </Button>
      </div>
    );

    socket.on("roomAlreadyExists", (data) => {
      toast.info(Translations[userLanguage].alerts.roomalreadyexists);
    });

    socket.on("alreadyHostRoom", (data) => {
      toast.info(terminateRoomPopUp(data), { autoClose: 10000 });
    });

    socket.on("GeneratedCode", (data) => {
      console.log(data);
      if (document.getElementById("roomName") == undefined) return;
      document.getElementById("roomName").value = data;
    });

    socket.on("gameAlreadyStarted", (data) => {
      toast.info(
        `${Translations[userLanguage].alerts.gamealreadystarted} ${data.room}`
      );
    });

    socket.on("cannotJoinPrivateRoom", (data) => {
      toast.error(Translations[userLanguage].alerts.cannotjoinprivate);
    });
  }, []);

  const JoinRoom = async () => {
    if (joinFormNickname === "") {
      toast.error(Translations[userLanguage].alerts.entername);
      return;
    }
    if (joinFormCode === "") {
      toast.error(Translations[userLanguage].alerts.entercode);
      return;
    }
    const res = await axios.post(`${config["api-server"]}/get-user-classes`, {
      userId: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
    });
    const classes = res.data;

    socket.emit("joinroom", {
      code: joinFormCode,
      name: joinFormNickname,
      profane: list.array.includes(joinFormNickname),
      classes: classes,
    });
  };

  const CreateRoom = async () => {
    if (document.getElementById("roomName").value === undefined) {
      toast.error(Translations[userLanguage].alerts.enterroomname);
      return;
    }
    if (gameCode === "") {
      toast.error(Translations[userLanguage].alerts.entergamecode);
      return;
    }
    if (gameMode === "") {
      toast.error(Translations[userLanguage].alerts.entergamemode);
      return;
    }
    console.log(checked);

    const res = await axios.post(`${config["api-server"]}/get-class`, {
      id: classID,
    });
    console.log(res.data);

    const data = res.data;

    if (data !== null) {
      const user = await axios.post(`${config["api-server"]}/user`, {
        userId: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
      });
      const userData = user.data;
      console.log(userData);
      if (userData.plan === "Starter") {
        socket.emit("createroom", {
          room: document.getElementById("roomName").value,
          gamecode: gameCode,
          host: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
          friendly: checked,
          gamemode: gameMode,
          classId: null,
        });
      }
      if (userData.plan === "Classroom") {
        socket.emit("createroom", {
          room: document.getElementById("roomName").value || "",
          gamecode: gameCode,
          host: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
          friendly: checked,
          gamemode: gameMode,
          classId: classID,
        });
      }
    } else {
      socket.emit("createroom", {
        room: document.getElementById("roomName").value,
        gamecode: gameCode,
        host: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
        friendly: checked,
        gamemode: gameMode,
        classId: null,
      });
    }
  };

  const Generatecode = () => {
    socket.emit("GenerateCode", "");
  };
  const terminateRoom = (room) => {
    socket.emit("EndGameTerminated", {
      room: room,
      googleId: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
    });
    toast.success(
      `${Translations[userLanguage].alerts.roomterminated} ${room}`
    );
  };

  const toggleChecked = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div
      id="main__container__wrapper"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {playMode ? (
        <div id="mainConatainer">
          <h1>{Translations[userLanguage].play.join.title}</h1>
          {joinFormStep === 0 && (
            <>
              <input
                value={joinFormCode}
                onChange={(event) => setJoinFormCode(event.target.value)}
                style={{ width: "100%", height: "48px" }}
                defaultValue={code}
                placeholder={Translations[userLanguage].play.join.input}
                type="text"
                id="code"
              />
              <br></br>
              <Button
                style={{
                  marginTop: "1vh",
                  width: "100%",
                  fontSize: "1.2rem",
                  height: "48px",
                }}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  setJoinFormStep(1);
                }}
              >
                {Translations[userLanguage].play.join.button}
              </Button>
            </>
          )}
          {joinFormStep === 1 && (
            <>
              <input
                value={joinFormNickname}
                onChange={(event) => setJoinFormNickname(event.target.value)}
                style={{ width: "100%", height: "48px" }}
                placeholder={Translations[userLanguage].play.join.input2}
                type="text"
                id="name"
              />
              <br></br>
              <Button
                style={{
                  marginTop: "1vh",
                  width: "100%",
                  fontSize: "1.2rem",
                  height: "48px",
                }}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  JoinRoom();
                }}
              >
                {Translations[userLanguage].play.join.button2}
              </Button>
            </>
          )}
        </div>
      ) : (
        <div id="subConatainer">
          {classid != "null" && (
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              {classid !== null && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#3f51b5",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    margin: "2px",
                    padding: "10px",
                  }}
                >
                  <Typography variant="sub1">
                    {Translations[userLanguage].play.host.private}
                  </Typography>
                </div>
              )}
            </div>
          )}
          <h1>{Translations[userLanguage].play.host.title}</h1>
          <input
            className="host-input"
            placeholder={Translations[userLanguage].play.host.input}
            type="text"
            id="roomName"
          />
          <input
            hidden
            value={gameCode}
            onChange={(event) => setGameCode(event.target.value)}
            style={{ marginLeft: "8px" }}
            className="host-input"
            placeholder={Translations[userLanguage].play.host.input2}
            type="text"
            id="gameCode"
          />
          <div>
            <h2>{Translations[userLanguage].play.host.presets.title}</h2>
            <label>
              {Translations[userLanguage].play.host.presets.maxplayers}{" "}
            </label>
            <input
              ref={maxPlayers}
              id="max-players"
              type="number"
              min="3"
              max="90"
            />
            <br></br>
            <label>
              {Translations[userLanguage].play.host.presets.podiumplaces}{" "}
            </label>
            <input
              ref={podiumPlaces}
              id="podium-places"
              type="number"
              min="3"
              max="90"
            />
            <br></br>
            <div>
              <label>
                {Translations[userLanguage].play.host.presets.friendly}
              </label>
              <Switch
                size="small"
                checked={checked}
                onChange={() => {
                  toggleChecked();
                }}
                color="primary"
                name="checked"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          </div>
          <br></br>
          <Button
            style={{ marginBottom: "1vh" }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              Generatecode();
            }}
          >
            {Translations[userLanguage].play.host.presets.button}{" "}
          </Button>
          <br></br>
          <Button
            style={{ marginBottom: "1vh" }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              CreateRoom();
            }}
          >
            {Translations[userLanguage].play.host.presets.button2}
          </Button>
        </div>
      )}
    </div>
  );
}
