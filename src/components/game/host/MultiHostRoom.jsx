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

import { Stepper, Step, StepLabel, LinearProgress } from "@mui/material";

//Icons
import FirstPlaceIcon from "../../../img/PodiumIcons/firstPlace.svg";
import SecondPlaceIcon from "../../../img/PodiumIcons/secondPlace.svg";
import ThirdPlaceIcon from "../../../img/PodiumIcons/thirdPlace.svg";

//logo
import TextLogo from "../../../img/text-logo.svg";
import FilledLogo from "../../../img/filled-logo.svg";

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
let finished2 = [];
let activeStep2 = 0;
let userLimit2 = 0;

export default function HostRoom(props) {
  var [playerPodiumMax, setPlayerPodiumMax] = useState(props.podiumPlaces);
  const [userLimit, setUserLimit] = useState(8);
  const podium = [];
  var numArray = [];
  var playerArr = [];
  const podiumObj = {};
  var [currentPlace, setCurrentPlace] = useState(0);
  var [numberOfUsers, setNumberOfUsers] = useState(0);

  const [finished, setFinished] = useState([]);

  const [isCountdown, setIsCountdown] = useState(false);
  const [sharePopupActive, setSharePopupActive] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);
  const [isTransition, setIsTransition] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  let [transitionTimer, setTransitionTimer] = useState(0);
  let [finishingTimer, setFinishingTimer] = useState(0);

  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const [isRoomLeft, setIsRoomLeft] = useState(false);

  const [lowestTimesState, setLowestTimes] = useState([]);

  const [finalPodium, setFinalPodium] = useState([]);

  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  const [isSlider, setIsSlider] = useState(false);
  const [musicVolume, setMusicVolume] = useState(50);

  const [name, setName] = useState("");
  let [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState([]);

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

    fetchQuiz();

    socket.on("addeduser", (data) => {
      setNumberOfUsers(data.UsersInRoom.length);
      updateUserDiv(data.UsersInRoom);
      if (data.UsersInRoom.length >= userLimit2) {
        socket.emit("roomLimitReached", props.room);
      }
    });

    socket.on("timeBoard", (data) => {
      if (podium.includes(data.user)) {
        return;
      }

      if (playersTime.includes(data.user) == true) {
        if (!document.getElementById(data.user)) return;
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
        newTime.dataset.userId = data.userId;

        document.getElementById("time__div").appendChild(newTime);
      }
    });

    socket.on("playerFinishedSection", (data) => {
      const cloneFinished = [...finished2];

      console.log(data.user);
      console.log([...finished2]);

      if (finished2.includes(data.user) === false) {
        cloneFinished.push(data.user);
        finished2 = cloneFinished;
        setFinished(cloneFinished);
        console.log(cloneFinished);
      } else {
        return;
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
        userLimit2 = 90;
      } else if (props.maxPlayers < 3) {
        setUserLimit(3);
        userLimit2 = 3;
      } else {
        setUserLimit(props.maxPlayers);
        userLimit2 = props.maxPlayers;
      }
    }

    if (plan === "Starter") {
      if (props.maxPlayers > 8) {
        setUserLimit(8);
        userLimit2 = 8;
      } else if (props.maxPlayers < 3) {
        setUserLimit(3);
        userLimit2 = 3;
      } else {
        setUserLimit(props.maxPlayers);
        userLimit2 = props.maxPlayers;
      }
    }
  };

  const fetchQuiz = async () => {
    const res = await axios.post(
      `${config["api-server"]}/get-multi-all-types`,
      {
        multiID: props.gamecode,
      }
    );
    const multi = res.data;

    setName(multi.name);
    setSteps(Object.keys(JSON.parse(multi.steps)));
  };

  const nextSection = () => {
    const positions = [];
    if (document.getElementsByClassName("time-box").length > 0) {
      for (
        let i = 0;
        i < document.getElementsByClassName("time-box").length;
        i++
      ) {
        const el = document.getElementsByClassName("time-box")[i];
        positions.push({
          player: el.id,
          time: el.dataset.time,
          userId: el.dataset.userId,
        });
      }
      if (positions.length > 0) {
        positions.sort((a, b) => {
          return a - b;
        });
      }
    }

    console.log(positions);

    socket.emit("nextSection", {
      room: props.room,
      positions: positions,
    });
  };

  const startNextSection = () => {
    socket.emit("startNextSection", {
      room: props.room,
      activeStep: activeStep2,
    });
  };

  useEffect(() => {
    if (!isTransition) return;
    nextSection();

    const timer = setInterval(() => {
      setTransitionTimer((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 1
      );
    }, 100);

    let tmpTime = 0;
    const timer2 = setInterval(() => {
      tmpTime += 10;
      if (tmpTime >= 100) {
        clearInterval(timer);
        clearInterval(timer2);
        tmpTime = 0;
        setIsTransition(false);
        setTransitionTimer(0);
        setActiveStep((activeStep += 1));
        activeStep2 += 1;
        setFinished([]);
        finished2 = [];
        startNextSection();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(timer2);
    };
  }, [isTransition]);

  useEffect(() => {
    if (!isFinishing) return;

    const timer = setInterval(() => {
      setFinishingTimer((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 1
      );
    }, 100);

    let tmpTime = 0;
    const timer2 = setInterval(() => {
      tmpTime += 10;
      if (tmpTime >= 100) {
        clearInterval(timer);
        clearInterval(timer2);
        tmpTime = 0;
        GameOver();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(timer2);
    };
  }, [isFinishing]);

  const getLowestTime = () => {
    const times = [];
    const podiumLength = props.podiumPlaces;
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
        const lowestTimes = times.filter((time, index) => {
          if (index < podiumLength) {
            return time;
          }
        });
        setLowestTimes(lowestTimes);
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

  const NavBar = () => (
    <>
      <nav
        style={{
          height: "60px",
          backgroundColor: "white",
          paddingInline: "10px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>
            <img src={TextLogo} alt="logo" draggable={false} />
          </div>
          <div style={{ display: "flex" }}>
            <Button
              variant="contained"
              color="action"
              style={{
                backgroundColor:
                  activeStep === steps.length - 1 ? "#1bb978" : "#6c63ff",
                color: "white",
                marginRight: "10px",
              }}
              onClick={
                activeStep === steps.length - 1
                  ? () => setIsFinishing(true)
                  : () => setIsTransition(true)
              }
              disabled={isTransition ? true : isFinishing ? true : false}
            >
              {activeStep === steps.length - 1
                ? Translations[userLanguage].hostroom.finish
                : Translations[userLanguage].hostroom.next}
            </Button>
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
        </div>
      </nav>
      <div style={{ width: "100vw", height: "100px" }} />
    </>
  );

  const SectionStepper = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        marginTop: "50px",
        marginBottom: "50px",
      }}
    >
      <Stepper
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "20px",
          overflowX: "auto",
          backgroundColor: "white",
          padding: "25px",
          border: "2px solid black",
          boxShadow: "5px 5px 0 #262626",
        }}
        activeStep={activeStep + 1}
      >
        {steps.map((step, index) => {
          return (
            <Step key={index}>
              <StepLabel>{step}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );

  return (
    <>
      {gameStarted && <NavBar />}
      <ReactHowler
        src={themeSong}
        playing={musicIsPlaying}
        loop={true}
        volume={musicVolume / 100}
      />
      {isRoomLeft ? (
        <GameEnded podium={finalPodium} maxPodiumPlayers={playerPodiumMax} />
      ) : isFinishing ? (
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <div>
            <div>
              <Typography
                variant="h2"
                style={{
                  padding: "10px",
                  border: "2px solid black",
                  boxShadow: "5px 5px 0 #262626",
                  backgroundColor: "white",
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                <b>{name}</b>
              </Typography>
            </div>
            <div
              style={{
                backgroundColor: "#1bb978",
                padding: "10px",
                border: "2px solid black",
                boxShadow: "10px 10px 0 #262626",
                marginTop: "50px",
              }}
            >
              <Typography
                variant="h4"
                style={{
                  color: "white",
                }}
              >
                <b>{Translations[userLanguage].hostroom.quizcompleted}</b>
              </Typography>
            </div>
            <div
              style={{
                backgroundColor: "white",
                padding: "10px",
                border: "2px solid black",
                boxShadow: "10px 10px 0 #262626",
                marginTop: "25px",
              }}
            >
              <Typography
                variant="h4"
                style={{ color: "black", marginBottom: "50px" }}
              >
                <b>{Translations[userLanguage].hostroom.displayingwinners}</b>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={finishingTimer}
                valueBuffer={100}
                style={{
                  width: "100%",
                  height: "24px",
                }}
                color="success"
              />
            </div>
          </div>
        </div>
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
          {!gameStarted && (
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
                        style={{
                          color: "#6C63FF",
                          textDecoration: "underline",
                        }}
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
          )}
          {gameStarted && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              <div>
                <Typography
                  variant="h2"
                  style={{
                    padding: "10px",
                    border: "2px solid black",
                    boxShadow: "5px 5px 0 #262626",
                    backgroundColor: "white",
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                >
                  <b>{name}</b>
                </Typography>
              </div>

              {!isTransition ? (
                <div
                  style={{
                    padding: "20px",
                    border: "2px solid black",
                    boxShadow: "5px 5px 0 #262626",
                    backgroundColor: "white",
                    marginTop: "20px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5">
                    <b style={{ color: "#636CFF" }}>{steps[activeStep]}</b>
                  </Typography>
                </div>
              ) : (
                <SectionStepper />
              )}
            </div>
          )}
          {!isTransition && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "150px",
                }}
              >
                {!gameStarted && (
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
                )}
                <VolumeSlider />
              </div>
              {gameStarted && !isTransition && (
                <div
                  style={{
                    padding: "5px",
                    border: "2px solid black",
                    boxShadow: "5px 5px 0 #262626",
                    backgroundColor: "white",
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">
                    <b>
                      {finished.length}{" "}
                      {Translations[userLanguage].hostroom.finished}
                    </b>
                  </Typography>
                </div>
              )}
              {!gameStarted && (
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
          )}
          {gameStarted ? null : (
            <h2 style={{ color: "white" }} id="maxPlayersText">
              {numberOfUsers}/{userLimit}
            </h2>
          )}

          {!gameStarted && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "50px",
              }}
            >
              <img src={FilledLogo} alt="logo" draggable={false} />
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
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "50px",
                }}
              >
                {isTransition ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "left",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          padding: "15px",
                          border: "2px solid black",
                          boxShadow: "5px 5px 0 #262626",
                          backgroundColor: "white",
                          marginTop: "10px",
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div>
                          <Typography variant="h3">
                            {Translations[userLanguage].hostroom.nextup}{" "}
                            <b style={{ color: "#636cff" }}>
                              {steps[activeStep + 1]}
                            </b>
                          </Typography>
                        </div>
                        <div style={{ height: "20px", width: "100%" }} />
                        <div>
                          <LinearProgress
                            variant="determinate"
                            value={transitionTimer}
                            valueBuffer={100}
                            style={{
                              width: "100%",
                              height: "24px",
                            }}
                            color="success"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="lowest__time__container"
                      style={{ backgroundColor: "#fcc73e" }}
                    >
                      <Typography style={{ color: "white" }} variant="h3">
                        👑
                      </Typography>
                      <div className="lowest-time-box">
                        <Typography variant="h3">
                          {lowestTimesState[0]?.player}{" "}
                          <span style={{ color: "#6976EA" }}>
                            {lowestTimesState[0]?.time}s
                          </span>
                        </Typography>
                      </div>
                    </div>
                    <div
                      className="lowest__time__container"
                      style={{ backgroundColor: "#1594DB" }}
                    >
                      <Typography style={{ color: "white" }} variant="h3">
                        🥈
                      </Typography>
                      <div className="lowest-time-box">
                        <Typography variant="h3">
                          {lowestTimesState[1]?.player}{" "}
                          <span style={{ color: "#6976EA" }}>
                            {lowestTimesState[1]?.time}s
                          </span>
                        </Typography>
                      </div>
                    </div>
                    <div
                      className="lowest__time__container"
                      style={{ backgroundColor: "#CE3EE5" }}
                    >
                      <Typography style={{ color: "white" }} variant="h3">
                        🥉
                      </Typography>
                      <div className="lowest-time-box">
                        <Typography variant="h3">
                          {lowestTimesState[2]?.player}{" "}
                          <span style={{ color: "#6976EA" }}>
                            {lowestTimesState[2]?.time}s
                          </span>
                        </Typography>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ visibility: "hidden" }} id="time__div"></div>
              </div>
            </div>
          )}
        </div>
      )}
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
    </>
  );
}
