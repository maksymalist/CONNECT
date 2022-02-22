import React, { useState, useEffect } from "react";
import socket from "../../../socket-io";
import ReactDOM from "react-dom";

import FinishedScreen from "./FinishedScreen";

import "../../../style/style.css";
import { toast } from "react-toastify";
import { Typography, Stepper, Step, StepLabel } from "@mui/material";

import Translations from "../../../translations/translations.json";

import axios from "axios";

import config from "../../../config.json";

function MultiGameRoom({ match }) {
  const [activeStep, setActiveStep] = useState(0);

  const [steps, setSteps] = useState([]);

  var [maxSteps, setMaxSteps] = useState();

  var [time, updateTime] = useState(0);
  var [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  var cards = [];

  var CurrentRoom = match.params.room;
  var [GameOver, setGameOver] = useState(false);
  var gameLeft = false;
  var secondTimer = 0;

  var quiz;

  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  var [emitted, setEmitted] = useState(false);

  const getQuiz = async (currentQuiz, name) => {
    quiz = currentQuiz;
    setName(name); //name = quiz.name
    setCardsFunction();
  };

  const UpdateTimeFunction = () => {
    if (GameOver === true) return;
    updateTime((prev) => (time = Math.round((prev += 0.1) * 10) / 10));
    secondTimer++;
    if (secondTimer === 10) {
      secondTimer = 0;
      socket.emit("time", {
        time: time,
        room: CurrentRoom,
        user: match.params.user,
      });
    }
  };

  const setCardsFunction = () => {
    console.log(quiz);

    const keys = Object.keys(quiz);

    keys.map((key, index) => {
      const question = quiz[key].question;
      const answer = quiz[key].answer;

      cards.push({
        question: question,
        ans: answer,
      });
    });
    GetCards();
  };

  var elements = 0;
  const numberOfCardsArr = [];
  var randomNum = []; //[0,1,2,3,4,5].sort( () => .5 - Math.random() )
  const GetCards = () => {
    cards.map((card, i) => {
      numberOfCardsArr.push(i);
    });
    randomNum = numberOfCardsArr.sort(() => 0.5 - Math.random());
    for (var i = 0; i < cards.length; i++) {
      let newCard = document.createElement("div");
      let newCard2 = document.createElement("div");
      const item = cards[randomNum[i]].question;
      const ans = cards[randomNum[i]].ans;
      newCard.id = "cardDiv";
      document.getElementById("cardContainer").appendChild(newCard);

      ReactDOM.render(
        <>
          <div
            className="card quest-card"
            id={item}
            onClick={() => {
              CardClick(item, ans, item, i);
            }}
          >
            {item}
          </div>
        </>,
        newCard
      );
    }
    const randomNum2 = numberOfCardsArr.sort(() => 0.5 - Math.random());
    for (var i = 0; i < cards.length; i++) {
      let newCard2 = document.createElement("div");
      const item = cards[randomNum2[i]].question;
      const ans = cards[randomNum2[i]].ans;
      newCard2.id = "cardDiv2";
      document.getElementById("cardContainer").appendChild(newCard2);

      ReactDOM.render(
        <>
          <div
            className="card ans-card"
            id={ans}
            onClick={() => {
              CardClick(item, ans, ans, i + 10);
            }}
          >
            {ans}
          </div>
        </>,
        newCard2
      );

      elements += 2;
    }
  };
  var memory = [];
  function CardClick(ques, ans, id, index) {
    setSelected((selected) => [
      ...selected,
      {
        question: ques,
        ans: ans,
      },
    ]);
    document.getElementById(id).style = "transform: scale(1.05)";

    memory.push({
      question: ques,
      ans: ans,
      index: index,
    });

    if (memory.length == 2) {
      for (var i = 0; i < document.getElementsByClassName("card").length; i++) {
        document.getElementById(
          document.getElementsByClassName("card")[i].id
        ).style = "transform: scale(1)";
      }
      if (memory[0].question == memory[1].question) {
        if (memory[0].index == memory[1].index) {
          updateTime((prev) => (time = prev += 5));
          memory = [];
          setSelected((selected = []));
          return;
        }

        console.log(memory[0].question, memory[1].ans);
        document.getElementById(memory[0].question).remove();
        document.getElementById(memory[1].ans).remove();

        elements -= 2;

        if (elements == 0) {
          setActiveStep(activeStep + 1);
        }
      } else {
        updateTime((prev) => (time = prev += 5));
      }

      memory = [];
      setSelected((selected = []));
    }
  }

  useEffect(() => {
    if (steps.length <= 0) return;
    if (activeStep === maxSteps) {
      setGameOver(true);
      setGameOver(true);

      if (emitted === false) {
        socket.emit("PlayerFinsihed", {
          room: match.params.room,
          user: match.params.user,
          time: time,
          id: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
        });
        setEmitted(true);
      }
      document.getElementById("popUp").removeAttribute("hidden");
      document.getElementById("gameContent").hidden = true;
      ReactDOM.render(
        <FinishedScreen user={match.params.user} />,
        document.getElementById("popUp")
      );
      document.getElementById("quizTextDiv").remove();
      document.getElementById("stepRef").hidden = true;
    }
    document.getElementById("cardContainer").innerHTML = "";
    elements = 0;
    cards = [];
    steps.map((step, index) => {
      if (index == activeStep) {
        axios
          .post(`${config["api-server"]}/get-multi-all-types`, {
            multiID: match.params.gameid,
          })
          .then((res) => {
            const multi = res.data;
            getQuiz(JSON.parse(multi.steps)[step], multi.name);
          });
      }
    });
    return () => {
      // cleanup
    };
  }, [activeStep, steps]);

  const startTime = () => {
    setInterval(() => {
      UpdateTimeFunction();
    }, 100);
  };

  useEffect(() => {
    axios
      .post(`${config["api-server"]}/get-multi-all-types`, {
        multiID: match.params.gameid,
      })
      .then((res) => {
        const multi = res.data;

        const stepArr = [];
        console.log(Object.keys(multi.steps));
        Object.keys(JSON.parse(multi.steps)).map((step, index) => {
          console.log(step);

          stepArr.push(step);
        });
        console.log(stepArr);
        console.log(stepArr.length);
        setSteps((prev) => (prev = stepArr));
        setMaxSteps(stepArr.length);
        startTime();
      });

    document.querySelector("nav").hidden = true;

    socket.on("joinedGameRoom", (data) => {
      console.log(data);
    });
    socket.emit("joinGame", {
      room: match.params.room,
      user: match.params.user,
    });

    socket.on("timeBoard", (data) => {
      //console.log(data.time, data.user)
    });
    socket.on("PlayerFinished2", (data) => {
      toast.success(
        `${data} ${Translations[userLanguage].alerts.playerfinishedgame}`,
        {
          autoClose: 750,
        }
      );
    });

    socket.on("EndedGame", (data) => {
      if (gameLeft) return;
      socket.emit("leaveRoom", {
        room: match.params.room,
        user: match.params.user,
      });
      setGameOver(true);
      window.location = "/roomleave/ended";
      sessionStorage.setItem("roomJoined", "false");
    });
    socket.on("GameIsOver", (data) => {
      gameLeft = true;
      socket.emit("leaveRoom", {
        room: match.params.room,
        user: match.params.user,
      });
      const pos = data.find(
        (player) =>
          player.playerID ===
            JSON.parse(localStorage.getItem("user")).profileObj.googleId &&
          player.player === match.params.user + "⠀"
      );
      window.location = `/roomleave/gameover?position=${pos && pos.position}`;
      sessionStorage.setItem("roomJoined", "false");
    });
    return () => {
      setGameOver(true);
      socket.emit("leaveRoom", {
        room: match.params.room,
        user: match.params.user,
      });
      sessionStorage.setItem("roomJoined", "false");
    };
  }, []);

  return (
    <div>
      <div>
        <div id="gameContent">
          <div id="quizTextDiv">
            <Typography
              variant="h2"
              style={{ marginTop: "100px", color: "white" }}
            >
              <b>{name}</b>
            </Typography>
            <Typography
              variant="h4"
              style={{ marginTop: "10px", color: "white" }}
            >
              {steps[activeStep]}
            </Typography>
            <Typography
              variant="h4"
              style={{ marginTop: "10px", color: "white" }}
            >
              {time}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Stepper
              id="stepRef"
              style={{
                width: "100%",
                maxWidth: "400px",
                margin: "20px",
                border: "2px solid black",
                boxShadow: "10px 10px 0 #262626",
                overflowX: "auto",
                backgroundColor: "white",
                padding: "15px",
              }}
              activeStep={activeStep}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                marginTop: "0",
                position: "unset",
                transform: "none",
                marginBottom: "100px",
              }}
              id="cardContainer"
            ></div>
            <h1 hidden>{JSON.stringify(selected)}</h1>
          </div>
        </div>
        <div>
          <nav style={{ height: "50px", backgroundColor: "white" }}>
            <div
              style={{
                float: "left",
                color: "black",
                marginLeft: "10px",
                marginTop: "-10px",
              }}
            >
              <h2>{match.params.user}</h2>
            </div>
          </nav>
        </div>
        <div
          hidden
          style={{ width: "100%", height: "100vh", zIndex: "500" }}
          id="popUp"
        ></div>
      </div>
    </div>
  );
}

export default MultiGameRoom;
