import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useLocation } from "react-router-dom";
import WaitingRoom from "./game/player/WaitingRoom";
import HostRoom from "./game/host/HostRoom";
import MultiHostRoom from "./game/host/MultiHostRoom";
import Background from "./misc/Background";

import "../style/style.css";
import { toast } from "react-toastify";

import { Button, Switch, Typography, CircularProgress } from "@mui/material";

import Translations from "../translations/translations.json";

import axios from "axios";

import { useMutation, gql } from "@apollo/client";

import list from "badwords-list";

import config from "../config.json";
import socket from "../socket-io";

//hooks
import getUser from "../hooks/getUser";

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

const INCREMENT_PLAYS = gql`
  mutation ($type: String!, $visibility: String!, $id: ID!) {
    incrementPlays(type: $type, visibility: $visibility, _id: $id)
  }
`;

let joined = false;

export default function EnterCodeForm({ match, location }) {
  const user = getUser();
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
  const [incrementPlays] = useMutation(INCREMENT_PLAYS);

  //spinners
  const [spinner1, setSpinner1] = useState(false);
  const [spinner2, setSpinner2] = useState(false);

  useEffect(() => {
    const Gamecode = new URLSearchParams(search).get("code");

    if (!user) {
      if (Gamecode !== null) {
        window.location = `/login?code=${Gamecode}`;
        return;
      } else {
        window.location = "/login";
        return;
      }
    }

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

    socket.on("myroom", (data) => {
      socket.emit("adduser", {
        name: data.name,
        room: data.room,
      });
    });

    socket.on("roomcallback", (data) => {
      if (data.joined == true) {
        joined = true;
        setSpinner1(false);
      } else {
        if (joined == true) return;
        toast.error(Translations[userLanguage].alerts.roomnotfound);
        setSpinner1(false);
      }
    });

    socket.on("roomcreated", async (data) => {
      setRole((role = "host"));
      setSpinner2(false);

      var validclassId = data.classId;

      if (maxPlayers.current == null || podiumPlaces.current == null) return;
      if (data.gamemode === "normal") {
        try {
          const response = await axios.post(
            `${config["api-server"]}/get-quiz-all-types`,
            { quizID: data.gamecode }
          );

          const visibility = response.data.visibility;

          incrementPlays({
            variables: {
              type: "quiz",
              visibility: visibility,
              id: data.gamecode,
            },
          });
        } catch (error) {
          console.log(error);
        }

        ReactDOM.render(
          <div>
            <HostRoom
              maxPlayers={
                maxPlayers.current.value < 3 ? 3 : maxPlayers.current.value
              }
              podiumPlaces={
                podiumPlaces.current.value < 3 ? 3 : podiumPlaces.current.value
              }
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
        try {
          const response = await axios.post(
            `${config["api-server"]}/get-multi-all-types`,
            { multiID: data.gamecode }
          );

          const visibility = response.data?.visibility;

          incrementPlays({
            variables: {
              type: "multi",
              visibility: visibility,
              id: data.gamecode,
            },
          });
        } catch (error) {
          console.log(error);
        }

        ReactDOM.render(
          <div>
            <MultiHostRoom
              maxPlayers={
                maxPlayers.current.value < 3 ? 3 : maxPlayers.current.value
              }
              podiumPlaces={
                podiumPlaces.current.value < 3 ? 3 : podiumPlaces.current.value
              }
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
      localStorage.setItem(user?.profileObj.googleId, true);

      socket.emit("addHost", {
        googleId: user?.profileObj.googleId,
        room: data.room,
      });

      if (validclassId != "null" && validclassId != null) {
        socket.emit("addPrivateRoom", {
          room: data.room,
          classId: validclassId,
          googleId: user?.profileObj.googleId,
        });

        const res = await axios.post(
          `${config["api-server"]}/get-members-of-class`,
          { id: validclassId }
        );
        const members = res.data;

        members?.map((member) => {
          const memberId = member.userId;
          const notification = {
            userId: memberId.replace(/user:/g, ""),
            type: "invitation_to_room",
            message: `${user?.profileObj.name} has invited you to play a game in room ${data.room}!`,
            data: JSON.stringify({ room: data.room, classId: validclassId }),
          };

          createNotification({ variables: notification });
        });
      }
    });

    socket.on("changeName", (data) => {
      if (sessionStorage.getItem("roomJoined") !== "true") {
        if (role !== "host") {
          toast.error(Translations[userLanguage].alerts.nametaken);
        }
      }
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
    if (sessionStorage.getItem("roomJoined") == "true") {
      toast.info(Translations[userLanguage].alerts.sessionexpired);
      return;
    } else {
      if (joinFormNickname === "") {
        toast.error(Translations[userLanguage].alerts.entername);
        return;
      }
      if (joinFormCode === "") {
        toast.error(Translations[userLanguage].alerts.entercode);
        return;
      }
      const res = await axios.post(`${config["api-server"]}/get-user-classes`, {
        userId: user?.profileObj.googleId,
      });
      const classes = res.data;
      setSpinner1(true);
      socket.emit("joinroom", {
        code: joinFormCode,
        name: joinFormNickname,
        profane: list.array.includes(joinFormNickname),
        classes: classes ? classes : [],
      });
    }
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
      const res = await axios.post(`${config["api-server"]}/user`, {
        userId: user?.profileObj.googleId,
      });
      const userData = res.data;
      console.log(userData);
      if (userData?.plan === "Starter") {
        socket.emit("createroom", {
          room: document.getElementById("roomName").value,
          gamecode: gameCode,
          host: user?.profileObj.googleId,
          friendly: checked,
          gamemode: gameMode,
          classId: null,
        });
      }
      if (userData.plan === "Classroom") {
        socket.emit("createroom", {
          room: document.getElementById("roomName").value || "",
          gamecode: gameCode,
          host: user?.profileObj.googleId,
          friendly: checked,
          gamemode: gameMode,
          classId: classID,
        });
      }
    } else {
      socket.emit("createroom", {
        room: document.getElementById("roomName").value,
        gamecode: gameCode,
        host: user?.profileObj.googleId,
        friendly: checked,
        gamemode: gameMode,
        classId: null,
      });
    }
    setSpinner2(true);
  };

  const Generatecode = () => {
    socket.emit("GenerateCode", "");
  };
  const terminateRoom = (room) => {
    socket.emit("EndGameTerminated", {
      room: room,
      googleId: user?.profileObj.googleId,
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  style={{
                    fontSize: "1.2rem",
                    height: "48px",
                    width: "100%",
                    margin: "10px",
                  }}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    JoinRoom();
                  }}
                >
                  {spinner1 ? (
                    <CircularProgress size={24} style={{ color: "white" }} />
                  ) : (
                    Translations[userLanguage].play.join.button2
                  )}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  style={{
                    fontSize: "1.2rem",
                    height: "48px",
                    width: "100%",
                  }}
                  onClick={() => {
                    setJoinFormStep(0);
                  }}
                >
                  {Translations[userLanguage].play.join.back}
                </Button>
              </div>
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
            style={{ marginBottom: "1vh", width: "150px" }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              CreateRoom();
            }}
          >
            {spinner2 ? (
              <CircularProgress size={24} style={{ color: "white" }} />
            ) : (
              Translations[userLanguage].play.host.presets.button2
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
