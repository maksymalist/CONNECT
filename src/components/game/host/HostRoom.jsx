import React, { useState, useEffect } from "react";
import socket from "../../../socket-io";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import {
  Share,
  People,
  PlayArrow,
  ExitToAppRounded,
  VolumeOffRounded,
  VolumeUpRounded,
} from "@mui/icons-material";
import GameEnded from "./GameEnded";

import {
  Divider,
  Typography,
  Button,
  Slider,
  ClickAwayListener,
} from "@mui/material";

//Icons
import FirstPlaceIcon from "../../../img/PodiumIcons/firstPlace.svg";
import SecondPlaceIcon from "../../../img/PodiumIcons/secondPlace.svg";
import ThirdPlaceIcon from "../../../img/PodiumIcons/thirdPlace.svg";

//Material Ui
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";

import "react-toastify/dist/ReactToastify.css";
import "../../../style/style.css";
import "../../../style/playButtonAnimation.css";
import CountDown from "./CountDown";

import SharePopup from "./SharePopup";

import Translations from "../../../translations/translations.json";

import axios from "axios";

import config from "../../../config.json";
import useMediaQuery from "@mui/material/useMediaQuery";

import QRCode from "react-qr-code";

import ReactHowler from "react-howler";
import themeSong from "../../../audio/connect_theme.mp3";

const playersTime = [];

export default function HostRoom(props) {
  var [playerPodiumMax, setPlayerPodiumMax] = useState(props.podiumPlaces);
  const [userLimit, setUserLimit] = useState(8);
  const podium = [];
  var numArray = [];
  var playerArr = [];
  const podiumObj = {};
  var [currentPlace, setCurrentPlace] = useState(0);
  var [numberOfUsers, setNumberOfUsers] = useState(0);

  const [isCountdown, setIsCountdown] = useState(false);
  const [sharePopupActive, setSharePopupActive] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);

  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const [isRoomLeft, setIsRoomLeft] = useState(false);

  const [lowestTimeState, setLowestTime] = useState({});

  const [finalPodium, setFinalPodium] = useState([]);

  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  const [isSlider, setIsSlider] = useState(false);
  const [musicVolume, setMusicVolume] = useState(50);

  const smallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    setMusicIsPlaying(true);
    if (props.friendlyroom === true) {
      socket.emit("addFriendlyRoom", {
        room: props.room,
      });
    }
    CheckPlanStatus();
    socket.emit("joinHostRoom", {
      room: props.room,
    });
    socket.on("addeduser", (data) => {
      // var RoomUsers = [];

      // for (var i = 0; i < data.names.length; i++) {
      //   if (data.UserRooms[i] == undefined) return;
      //   if (data.currentRoom == data.UserRooms[i]) {
      //     RoomUsers.push(data.names[i]);
      //   }
      // }
      // document.getElementById("userList").innerHTML = data.UsersInRoom;
      console.log(`
        Here it the number of users: ${data.UsersInRoom.length}
        Here is the limit: ${userLimit}
      `);
      setNumberOfUsers(data.UsersInRoom.length);
      updateUserDiv(data.UsersInRoom);
      if (numberOfUsers >= userLimit) {
        socket.emit("roomLimitReached", props.room);
      }
    });

    socket.on("timeBoard", (data) => {
      if (podium.includes(data.user)) {
        return;
      }

      if (playersTime.includes(data.user) == true) {
        document.getElementById(
          data.user
        ).innerHTML = `${data.user}<span style='color:#fff'>⠀</span><span style='color:#6976EA'>${data.time}s</span>`;
        document.getElementById(data.user).dataset.time = data.time;
      } else {
        playersTime.push(data.user);

        let newTime = document.createElement("h1");

        newTime.innerHTML = `${data.user}<span style='color:#fff'>⠀</span><span style='color:#6976EA'>${data.time}s</span>`;
        newTime.id = data.user;
        newTime.className = "time-box";
        newTime.dataset.time = data.time;

        document.getElementById("time__div").appendChild(newTime);
      }
    });

    socket.on("roomTerminated", (data) => {
      EndGame();
    });

    socket.on("playerLeftRoom", (data) => {
      setNumberOfUsers(data.UsersInRoom.length);
      updateUserDiv(data.UsersInRoom);
    });

    socket.on("EndGame", (data) => {
      setIsRoomLeft(true);
      localStorage.removeItem(
        JSON.parse(localStorage.getItem("user")).profileObj.googleId
      );
    });

    socket.on("UpdatePodium", (data) => {
      if (podium.includes(data.user)) return;
      podium.push(data.user);
      podiumObj[data.user] = {
        time: data.time,
        id: data.id,
      };
      handleUpdatePodium(data.user, data.time);
      //'first-place', 'second-place', 'third-place', 'other-place'
      setCurrentPlace(currentPlace++);

      toast.success(
        `${data.user} ${Translations[userLanguage].alerts.playerfinishedgame}`,
        {
          autoClose: 750,
        }
      );

      if (podium.length == playerPodiumMax) {
        toast.info(
          `${playerPodiumMax} ${Translations[userLanguage].alerts.maxpodiumlimitreached}`
        );
      }
    });
    if (playerPodiumMax < 3) {
      setPlayerPodiumMax(3);
    }
  }, []);

  const updateUserDiv = (users) => {
    if (gameStarted) return;
    if (document.getElementById("userDiv") == null) return;
    document
      .getElementById("userDiv")
      .querySelectorAll("*")
      .forEach((n) => n.remove());
    users.map((user, index) => {
      let newUser = document.createElement("div");
      newUser.id = user;
      document.getElementById("userDiv").appendChild(newUser);
      ReactDOM.render(
        <div>
          <h2
            className="userH1"
            onClick={() => {
              kickUser(user);
            }}
          >
            {user}
          </h2>
        </div>,
        newUser
      );
    });
  };

  const handleUpdatePodium = () => {
    if (document.getElementById("podium") == null) return;

    Object.keys(podiumObj).map((key, index) => {
      numArray.push(podiumObj[key].time);
    });

    numArray.sort((a, b) => {
      return a - b;
    });

    Object.keys(podiumObj).map((key, index) => {
      numArray.map((time, timeIndex) => {
        if (time === podiumObj[Object.keys(podiumObj)[index]].time) {
          playerArr.push({
            player: Object.keys(podiumObj)[index],
            time: time,
            place: timeIndex + 1,
            id: podiumObj[Object.keys(podiumObj)[index]].id || "",
          });
        }
      });
    });

    document
      .getElementById("podium")
      .querySelectorAll("*")
      .forEach((n) => n.remove());

    //render header + first-place-div + second-place-div + third-place-div
    let podiumHeader = document.createElement("div");
    document.getElementById("podium").appendChild(podiumHeader);
    ReactDOM.render(
      <>
        <Typography
          variant="h3"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Translations[userLanguage].hostroom.podium}{" "}
          <AssessmentRoundedIcon
            color="primary"
            style={{ width: "50px", height: "50px" }}
          />
        </Typography>
        <Divider
          light
          style={{ marginTop: "10px", marginBottom: "10px", width: "100%" }}
        />
      </>,
      podiumHeader
    );

    //first-place-div
    let firstPlaceDiv = document.createElement("div");
    firstPlaceDiv.id = "first-place-div";
    document.getElementById("podium").appendChild(firstPlaceDiv);
    //second-place-div
    let secondPlaceDiv = document.createElement("div");
    secondPlaceDiv.id = "second-place-div";
    document.getElementById("podium").appendChild(secondPlaceDiv);
    //third-place-div
    let thirdPlaceDiv = document.createElement("div");
    thirdPlaceDiv.id = "third-place-div";
    document.getElementById("podium").appendChild(thirdPlaceDiv);

    for (var i = 0; i < playerArr.length; i++) {
      let newPlayerTime = document.createElement("div");
      if (playerArr[i].place > 3) {
        document.getElementById("podium").appendChild(newPlayerTime);
      }

      if (playerArr[i].place === 1) {
        ReactDOM.render(
          <>
            <div className="first-place-sub-div">
              <h1
                className="first-place podium-time"
                data-position={playerArr[i].place}
                data-time={playerArr[i].time}
                data-playerid={playerArr[i].id}
                id={playerArr[i].player + "⠀"}
              >
                <img
                  width="40"
                  height="40"
                  src={FirstPlaceIcon}
                  alt="FirstPlaceIcon"
                />
                {playerArr[i].player} {Translations[userLanguage].hostroom.time}
                : {playerArr[i].time}{" "}
                {Translations[userLanguage].hostroom.place}:{" "}
                {playerArr[i].place}
              </h1>
            </div>
          </>,
          document.getElementById("first-place-div")
        );
      }
      if (playerArr[i].place === 2) {
        ReactDOM.render(
          <>
            <h1
              className="second-place podium-time"
              data-position={playerArr[i].place}
              data-time={playerArr[i].time}
              data-playerid={playerArr[i].id}
              id={playerArr[i].player + "⠀"}
            >
              <img
                width="40"
                height="40"
                src={SecondPlaceIcon}
                alt="SecondPlaceIcon"
              />
              {playerArr[i].player} {Translations[userLanguage].hostroom.time}:{" "}
              {playerArr[i].time} {Translations[userLanguage].hostroom.place}:{" "}
              {playerArr[i].place}
            </h1>
          </>,
          document.getElementById("second-place-div")
        );
      }
      if (playerArr[i].place === 3) {
        ReactDOM.render(
          <>
            <h1
              className="third-place podium-time"
              data-position={playerArr[i].place}
              data-time={playerArr[i].time}
              data-playerid={playerArr[i].id}
              id={playerArr[i].player + "⠀"}
            >
              <img
                width="40"
                height="40"
                src={ThirdPlaceIcon}
                alt="ThirdPlaceIcon"
              />
              {playerArr[i].player} {Translations[userLanguage].hostroom.time}:{" "}
              {playerArr[i].time} {Translations[userLanguage].hostroom.place}:{" "}
              {playerArr[i].place}
            </h1>
          </>,
          document.getElementById("third-place-div")
        );
      }
      if (playerArr[i].place > 3) {
        ReactDOM.render(
          <>
            <h1
              className="other-place podium-time"
              data-position={playerArr[i].place}
              data-time={playerArr[i].time}
              data-playerid={playerArr[i].id}
              id={playerArr[i].player + "⠀"}
            >
              {playerArr[i].player} {Translations[userLanguage].hostroom.time}:{" "}
              {playerArr[i].time} {Translations[userLanguage].hostroom.place}:{" "}
              {playerArr[i].place}
            </h1>
          </>,
          newPlayerTime
        );
      }
    }

    numArray = [];
    playerArr = [];
  };

  const kickUser = (user) => {
    socket.emit("kickUser", {
      room: props.room,
      user: user,
    });
  };

  const CheckPlanStatus = async () => {
    const res = await axios.post(`${config["api-server"]}/user`, {
      userId: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
    });
    const plan = res.data.plan;

    if (plan === "Classroom") {
      if (props.maxPlayers > 90) {
        setUserLimit(90);
      }

      setUserLimit(props.maxPlayers);

      if (props.maxPlayers < 3) {
        setUserLimit(3);
      }
    }

    if (plan === "Starter") {
      if (props.maxPlayers > 8) {
        setUserLimit(8);
      }

      setUserLimit(props.maxPlayers);

      if (props.maxPlayers < 3) {
        setUserLimit(3);
      }
    }
  };

  const getLowestTime = () => {
    const times = [];
    if (document.getElementsByClassName("time-box").length > 0) {
      for (
        let i = 0;
        i < document.getElementsByClassName("time-box").length;
        i++
      ) {
        const el = document.getElementsByClassName("time-box")[i];
        times.push({ player: el.id, time: el.dataset.time });
      }
      if (times.length > 0) {
        times.sort((a, b) => a.time - b.time);
        setLowestTime({ player: times[0].player, time: times[0].time });
      }
    }
  };

  const StartGame = (room) => {
    socket.emit("startGame", {
      room: room,
      gamecode: props.gamecode,
      gamemode: props.gamemode,
      maxPodium: playerPodiumMax,
    });
    setInterval(() => {
      getLowestTime();
    }, 1000);
    setGameStarted(true);
  };
  const EndGame = () => {
    socket.emit("EndGame", {
      room: props.room,
      googleId: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
    });
    setGameStarted(false);
    setIsRoomLeft(true);
    localStorage.removeItem(
      JSON.parse(localStorage.getItem("user")).profileObj.googleId
    );
    mute();
  };

  const addPoints = async (points, userId) => {
    const res = await axios.post(`${config["api-server"]}/add-points`, {
      points: points,
      userId: userId,
      classId: props.classid,
    });
  };

  const createRecentGame = async () => {
    const Podium = [];

    const recentGame = {
      mode: props.gamemode,
      quizId: props.gamecode,
      finalists: Podium,
      roomCode: props.room,
      classId: props.classid,
    };

    for (
      let i = 0;
      i < document.getElementsByClassName("podium-time").length;
      i++
    ) {
      Podium.push({
        time: document.getElementsByClassName("podium-time")[i].dataset.time,
        position:
          document.getElementsByClassName("podium-time")[i].dataset.position,
        player: document.getElementsByClassName("podium-time")[i].id,
        playerID:
          document.getElementsByClassName("podium-time")[i].dataset.playerid,
      });
    }

    if (props.classid !== null) {
      await axios.post(
        `${config["api-server"]}/create-recent-game`,
        recentGame
      );

      //add points to winners
      Podium.map(async (player) => {
        if (player.position == 1) {
          const userId = player.playerID;
          const res = await axios.post(`${config["api-server"]}/member`, {
            userId: userId,
            classId: props.classid,
          });
          if (res.data) {
            addPoints(100, userId);
          }
        }
      });
      Podium.map(async (player) => {
        if (player.position == 2) {
          const userId = player.playerID;
          const res = await axios.post(`${config["api-server"]}/member`, {
            userId: userId,
            classId: props.classid,
          });
          if (res.data) {
            addPoints(50, userId);
          }
        }
      });
      Podium.map(async (player) => {
        if (player.position == 3) {
          const userId = player.playerID;
          const res = await axios.post(`${config["api-server"]}/member`, {
            userId: userId,
            classId: props.classid,
          });
          if (res.data) {
            addPoints(20, userId);
          }
        }
      });
    }
  };

  const GameOver = async () => {
    const Podium = [];

    const res = await axios.post(`${config["api-server"]}/user`, {
      userId: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
    });
    const plan = res.data.plan;
    if (plan !== null && plan !== "" && plan !== undefined) {
      if (plan === "Classroom") {
        if (props.classid != "null" && props.classid !== null) {
          createRecentGame();
        }
      }
    }
    for (
      var i = 0;
      i < document.getElementsByClassName("podium-time").length;
      i++
    ) {
      Podium.push({
        time: document.getElementsByClassName("podium-time")[i].dataset.time,
        position:
          document.getElementsByClassName("podium-time")[i].dataset.position,
        player: document.getElementsByClassName("podium-time")[i].id,
        playerID:
          document.getElementsByClassName("podium-time")[i].dataset.playerid,
      });
    }

    socket.emit("GameOver", {
      room: props.room,
      podium: Podium,
      googleId: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
    });
    setGameStarted(false);
    mute();
    console.log(Podium);
    setFinalPodium(Podium);
    setIsRoomLeft(true);
    localStorage.removeItem(
      JSON.parse(localStorage.getItem("user")).profileObj.googleId
    );
  };
  const shareLink = () => {
    setSharePopupActive(!sharePopupActive);
  };

  const mute = () => {
    setMusicIsPlaying(false);
  };

  const unmute = () => {
    setMusicIsPlaying(true);
  };

  const VolumeSlider = () => (
    <div
      style={{
        backgroundColor: "white",
        paddingTop: 8,
        paddingBottom: 8,
        paddingInline: 5,
        marginTop: 10,
        width: isSlider ? 150 : 45,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
        boxShadow: "5px 5px 0 #262626",
      }}
    >
      <div
        onClick={() => setIsSlider(true)}
        style={{ marginRight: isSlider ? 12 : 0 }}
      >
        <VolumeUpRounded />
      </div>
      {isSlider ? (
        <ClickAwayListener onClickAway={() => setIsSlider(false)}>
          <Slider
            onChange={(e, value) => setMusicVolume(value)}
            value={musicVolume}
            min={0}
            max={100}
            color="secondary"
          />
        </ClickAwayListener>
      ) : null}
    </div>
  );

  return (
    <div>
      <ReactHowler
        src={themeSong}
        playing={musicIsPlaying}
        loop={true}
        volume={musicVolume / 100}
      />
      {isRoomLeft ? (
        <GameEnded podium={finalPodium} maxPodiumPlayers={playerPodiumMax} />
      ) : (
        <div>
          {isCountdown ? (
            <CountDown
              start={StartGame}
              room={props.room}
              muteMusic={mute}
              unmuteMusic={unmute}
            />
          ) : null}
          {sharePopupActive ? (
            <SharePopup
              shareLink={`https://quiz-connect.netlify.app/play?code=${props.room}`}
              close={shareLink}
            />
          ) : null}
          {props.classid != "null" && (
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              {props.classid !== null && (
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
                    {Translations[userLanguage].hostroom.private}
                  </Typography>
                </div>
              )}
            </div>
          )}
          <div
            style={{
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "2px solid #000",
                boxShadow: "10px 10px 0 #262626",
                padding: "10px",
                margin: "10px",
                paddingInline: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="h2" style={{ fontWeight: "10000" }}>
                    <b>{props.room}</b>
                  </Typography>
                  <Typography variant="sub1">
                    {Translations[userLanguage].hostroom.joinat}
                    <span
                      style={{ color: "#6C63FF", textDecoration: "underline" }}
                      onClick={() =>
                        window.open("https://quiz-connect.netlify.app/play")
                      }
                    >
                      quiz-connect.netlify.app/play
                    </span>
                  </Typography>
                </div>
              </div>
            </div>
            {smallScreen ? null : (
              <div
                style={{
                  backgroundColor: "white",
                  border: "2px solid #000",
                  boxShadow: "10px 10px 0 #262626",
                  padding: "10px",
                  marginLeft: "10px",
                }}
              >
                <QRCode
                  value={`https://quiz-connect.netlify.app/play?code=${props.room}`}
                  size={86}
                />
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "150px",
              }}
            >
              <Button
                style={{ width: "120px" }}
                variant="contained"
                color="primary"
                size="medium"
                id="playButtonSvg"
                onClick={() => {
                  shareLink();
                }}
              >
                {Translations[userLanguage].hostroom.sharebutton}
              </Button>
              <VolumeSlider />
            </div>
            {gameStarted ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  GameOver();
                }}
              >
                <ExitToAppRounded />
              </Button>
            ) : (
              <div style={{ display: "flex" }}>
                <Button
                  onClick={() => {
                    setIsCountdown(true);
                  }}
                  variant="contained"
                >
                  {Translations[userLanguage].hostroom.startbutton}
                </Button>
                <div style={{ width: "10px", height: "10px" }} />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    GameOver();
                  }}
                >
                  <ExitToAppRounded />
                </Button>
              </div>
            )}
          </div>
          {gameStarted ? null : (
            <h2 style={{ color: "white" }} id="maxPlayersText">
              {numberOfUsers}/{userLimit}
            </h2>
          )}

          {gameStarted ? null : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "50px",
              }}
            >
              <svg
                id="connectText"
                width="340"
                height="90"
                viewBox="0 0 340 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 5C0 2.23858 2.23858 0 5 0H335C337.761 0 340 2.23858 340 5V84.4737C340 87.2351 337.761 89.4737 335 89.4737H5C2.23858 89.4737 0 87.2351 0 84.4737V5Z"
                  fill="#4e54c8"
                />
                <path
                  d="M85.0702 69.9543C60.1881 70.7168 63.7294 24.62 87.7728 24.62C112.003 24.62 110.605 69.1918 85.0702 69.9543ZM87.4932 60.2497C93.4575 60.3884 95.4145 49.3667 95.694 44.3064C95.9736 39.2462 93.8302 32.1757 88.1455 32.3143C82.4609 32.453 79.3856 43.2667 79.5719 47.4258C79.8515 52.7633 81.4358 60.1111 87.4932 60.2497ZM122.44 64.5475L109.3 64.1316L112.468 22.8177L120.39 22.6097L134.555 44.5837L138.562 21.6393L146.949 23.5802L142.756 60.5963L134.368 61.4281L120.39 38.8996L122.44 64.5475ZM165.215 64.5475L152.075 64.1316L155.243 22.8177L163.165 22.6097L177.33 44.5837L181.337 21.6393L189.724 23.5802L185.531 60.5963L177.143 61.4281L163.165 38.8996L165.215 64.5475ZM221.596 70.093L196.154 69.7464L194.85 28.0859L219.732 25.6597L219.452 33.4927H205.194V46.7326L217.122 45.9701L217.775 53.8724L205.66 53.7338L205.008 63.785L222.528 63.2998L221.596 70.093ZM264.557 67.3202C248.714 80.4214 227.839 76.2623 227.653 51.7929C227.467 30.7893 249.367 22.4711 262.413 31.9677L258.499 38.2757C253.374 34.3939 239.209 37.8598 238.09 51.5849C237.065 63.7157 248.994 71.1328 257.754 60.8043L264.557 67.3202ZM299.224 24.4813L298.385 32.6609L288.787 32.9382L289.439 67.4589L275.367 69.1918L277.976 33.2155L267.819 33.4927L268.098 25.8677L299.224 24.4813ZM305.841 52.2088V12.9744L319.074 12.2812L312.737 52.0008L305.841 52.2088ZM308.077 67.3202C301.554 67.3202 301.833 57.6849 308.73 57.6849C315.533 57.6849 318.887 67.3202 308.077 67.3202Z"
                  fill="white"
                />
                <path
                  d="M58.7665 60.9058C63.8091 62.3473 64.3484 66.3862 54.8564 72.3045C49.6152 75.5723 43.2216 77.9872 37.521 77.0212C31.8205 76.0551 26.7525 72.9248 23.1805 68.1635C19.6085 63.4022 17.7536 57.3046 17.9317 50.9095C18.1099 44.5145 20.3101 38.2177 24.1575 33.0921C28.0049 27.9666 33.2615 24.3293 39.0315 22.8001C44.8015 21.2709 51.1081 20.8902 55.4027 25.0165C58.7665 27.8308 60.0929 32.0078 60.0929 32.0078L47.0362 42.0759L36.6012 42.0759L36.6012 60.9058C46.0924 62.721 53.7238 59.4643 58.7665 60.9058Z"
                  fill="white"
                />
                <path
                  d="M48.2502 52.1915C55.2081 61.4342 41.5958 62.6329 36.8785 61.4342C32.1612 60.2355 29.6042 54.1539 31.1673 47.8506C32.7304 41.5473 37.8217 37.4092 42.539 38.608C47.2563 39.8067 49.8133 45.8882 48.2502 52.1915Z"
                  fill="#4e54c8"
                />
                <path
                  d="M42.9473 41.5103C48.4611 41.5103 47.2724 43.0163 50.1052 40.3516V45.6147H43.6808L42.9473 41.5103Z"
                  fill="#4e54c8"
                />
                <path
                  d="M45.1458 40.3516C45.1458 40.3516 46.714 42.3667 49.9263 40.9463L51.8947 45.6147H44.7368L45.1458 40.3516Z"
                  fill="#4e54c8"
                />
                <path
                  d="M58.3355 27.5923C55.1701 21.2553 66.7662 27.6167 66.7662 27.6167L66.6937 34.2739L56.2197 34.8898C56.2197 34.8898 61.5008 33.9293 58.3355 27.5923Z"
                  fill="#4e54c8"
                />
              </svg>
            </div>
          )}
          {gameStarted ? null : (
            <div style={{ color: "white" }} id="userDiv"></div>
          )}
          {gameStarted && (
            <div id="game-container">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "50px",
                }}
              >
                <svg
                  id="connectText"
                  width="340"
                  height="90"
                  viewBox="0 0 340 90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 5C0 2.23858 2.23858 0 5 0H335C337.761 0 340 2.23858 340 5V84.4737C340 87.2351 337.761 89.4737 335 89.4737H5C2.23858 89.4737 0 87.2351 0 84.4737V5Z"
                    fill="#4e54c8"
                  />
                  <path
                    d="M85.0702 69.9543C60.1881 70.7168 63.7294 24.62 87.7728 24.62C112.003 24.62 110.605 69.1918 85.0702 69.9543ZM87.4932 60.2497C93.4575 60.3884 95.4145 49.3667 95.694 44.3064C95.9736 39.2462 93.8302 32.1757 88.1455 32.3143C82.4609 32.453 79.3856 43.2667 79.5719 47.4258C79.8515 52.7633 81.4358 60.1111 87.4932 60.2497ZM122.44 64.5475L109.3 64.1316L112.468 22.8177L120.39 22.6097L134.555 44.5837L138.562 21.6393L146.949 23.5802L142.756 60.5963L134.368 61.4281L120.39 38.8996L122.44 64.5475ZM165.215 64.5475L152.075 64.1316L155.243 22.8177L163.165 22.6097L177.33 44.5837L181.337 21.6393L189.724 23.5802L185.531 60.5963L177.143 61.4281L163.165 38.8996L165.215 64.5475ZM221.596 70.093L196.154 69.7464L194.85 28.0859L219.732 25.6597L219.452 33.4927H205.194V46.7326L217.122 45.9701L217.775 53.8724L205.66 53.7338L205.008 63.785L222.528 63.2998L221.596 70.093ZM264.557 67.3202C248.714 80.4214 227.839 76.2623 227.653 51.7929C227.467 30.7893 249.367 22.4711 262.413 31.9677L258.499 38.2757C253.374 34.3939 239.209 37.8598 238.09 51.5849C237.065 63.7157 248.994 71.1328 257.754 60.8043L264.557 67.3202ZM299.224 24.4813L298.385 32.6609L288.787 32.9382L289.439 67.4589L275.367 69.1918L277.976 33.2155L267.819 33.4927L268.098 25.8677L299.224 24.4813ZM305.841 52.2088V12.9744L319.074 12.2812L312.737 52.0008L305.841 52.2088ZM308.077 67.3202C301.554 67.3202 301.833 57.6849 308.73 57.6849C315.533 57.6849 318.887 67.3202 308.077 67.3202Z"
                    fill="white"
                  />
                  <path
                    d="M58.7665 60.9058C63.8091 62.3473 64.3484 66.3862 54.8564 72.3045C49.6152 75.5723 43.2216 77.9872 37.521 77.0212C31.8205 76.0551 26.7525 72.9248 23.1805 68.1635C19.6085 63.4022 17.7536 57.3046 17.9317 50.9095C18.1099 44.5145 20.3101 38.2177 24.1575 33.0921C28.0049 27.9666 33.2615 24.3293 39.0315 22.8001C44.8015 21.2709 51.1081 20.8902 55.4027 25.0165C58.7665 27.8308 60.0929 32.0078 60.0929 32.0078L47.0362 42.0759L36.6012 42.0759L36.6012 60.9058C46.0924 62.721 53.7238 59.4643 58.7665 60.9058Z"
                    fill="white"
                  />
                  <path
                    d="M48.2502 52.1915C55.2081 61.4342 41.5958 62.6329 36.8785 61.4342C32.1612 60.2355 29.6042 54.1539 31.1673 47.8506C32.7304 41.5473 37.8217 37.4092 42.539 38.608C47.2563 39.8067 49.8133 45.8882 48.2502 52.1915Z"
                    fill="#4e54c8"
                  />
                  <path
                    d="M42.9473 41.5103C48.4611 41.5103 47.2724 43.0163 50.1052 40.3516V45.6147H43.6808L42.9473 41.5103Z"
                    fill="#4e54c8"
                  />
                  <path
                    d="M45.1458 40.3516C45.1458 40.3516 46.714 42.3667 49.9263 40.9463L51.8947 45.6147H44.7368L45.1458 40.3516Z"
                    fill="#4e54c8"
                  />
                  <path
                    d="M58.3355 27.5923C55.1701 21.2553 66.7662 27.6167 66.7662 27.6167L66.6937 34.2739L56.2197 34.8898C56.2197 34.8898 61.5008 33.9293 58.3355 27.5923Z"
                    fill="#4e54c8"
                  />
                </svg>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "50px",
                }}
              >
                <div className="lowest__time__container">
                  <Typography style={{ color: "white" }} variant="h3">
                    👑
                  </Typography>
                  <div className="lowest-time-box">
                    <Typography variant="h3">
                      {lowestTimeState.player}{" "}
                      <span style={{ color: "#6976EA" }}>
                        {lowestTimeState.time}s
                      </span>
                    </Typography>
                  </div>
                </div>
              </div>
              <div hidden id="podium__container" className="podium__container">
                <div hidden id="podium">
                  <Typography
                    variant="h3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {Translations[userLanguage].hostroom.podium}{" "}
                    <AssessmentRoundedIcon
                      color="primary"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </Typography>
                  <Divider
                    light
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                      width: "100%",
                    }}
                  />
                  <div id="first-place-div"></div>
                  <div id="second-place-div"></div>
                  <div id="third-place-div"></div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div id="time__div"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
