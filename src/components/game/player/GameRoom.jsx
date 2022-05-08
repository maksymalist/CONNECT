import React, { useState, useEffect } from "react";
import socket from "../../../socket-io";
import ReactDOM from "react-dom";

import FinishedScreen from "./FinishedScreen";

import "../../../style/style.css";
import { toast } from "react-toastify";

import { Typography } from "@mui/material";

import Translations from "../../../translations/translations.json";

import axios from "axios";

import config from "../../../config.json";

//hooks
import getUser from "../../../hooks/getUser";

export default function GameRoom({ match }) {
  const user = getUser();
  var [time, updateTime] = useState(0);
  var [selected, setSelected] = useState([]);
  var [name, setName] = useState("");
  const cards = [];

  var CurrentRoom = match.params.room;
  var GameOver = false;
  var gameLeft = false;
  var secondTimer = 0;

  let quiz = [];

  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const getQuiz = async () => {
    const response = await axios.post(
      `${config["api-server"]}/get-quiz-all-types`,
      { quizID: match.params.gameid }
    );
    quiz = response.data;
    setName((name = quiz?.name));
    setCardsFunction();
  };

  const UpdateTimeFunction = () => {
    if (GameOver == false) {
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
    }
  };

  const setCardsFunction = () => {
    quiz.questions.map((question, index) => {
      question = JSON.parse(question);
      cards.push({
        question: question.question,
        ans: question.answer,
        type: question.type === undefined ? "ques_ans" : question.type,
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
            {cards[randomNum[i]].type === "ques_ans" && item}
            {cards[randomNum[i]].type === "ques_img" && (
              <img
                src={item}
                alt="quiz-cover"
                style={{ width: "100%", height: "100%" }}
              />
            )}
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
    document.getElementById(id).style =
      "color: rgb(99, 108, 255); font-weight: bold; transform: scale(1.05);";

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
          memory = [];
          setSelected((selected = []));
          return;
        }

        console.log(memory[0].question, memory[1].ans);
        document.getElementById(memory[0].question).remove();
        document.getElementById(memory[1].ans).remove();

        elements -= 2;

        if (elements == 0) {
          GameOver = true;
          socket.emit("PlayerFinsihed", {
            room: match.params.room,
            user: match.params.user,
            time: time,
            id: user?.profileObj.googleId,
          });
          document.getElementById("popUp").removeAttribute("hidden");
          document.getElementById("gameContent").remove();
          ReactDOM.render(
            <FinishedScreen user={match.params.user} />,
            document.getElementById("popUp")
          );
        }
      } else {
        updateTime((prev) => (time = prev += 5));
      }

      memory = [];
      setSelected((selected = []));
    }
  }

  useEffect(() => {
    getQuiz();
    setInterval(() => {
      UpdateTimeFunction();
    }, 100);

    document.getElementById("main-nav").remove();

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
      GameOver = true;
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
          player.playerID === user?.profileObj.googleId &&
          player.player === match.params.user + "⠀"
      );
      window.location = `/roomleave/gameover?position=${pos && pos.position}`;
      sessionStorage.setItem("roomJoined", "false");
    });
    return () => {
      GameOver = true;
      socket.emit("leaveRoom", {
        room: match.params.room,
        user: match.params.user,
      });
      sessionStorage.setItem("roomJoined", "false");
    };
  }, []);

  return (
    <div>
      <nav
        style={{
          height: "60px",
          backgroundColor: "white",
          paddingInline: "10px",
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
          <h2>{match.params.user}</h2>
          <div style={{ display: "flex", width: "150px" }}>
            <Typography variant="h4">⏳</Typography>
            <Typography variant="h4" style={{ textAlign: "left" }}>
              {time}
            </Typography>
          </div>
        </div>
      </nav>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
          id="gameContent"
        >
          <div>
            <Typography
              variant="h3"
              style={{
                backgroundColor: "white",
                padding: "15px",
                border: "2px solid black",
                boxShadow: "5px 5px 0 #262626",
                marginTop: "20px",
                color: "#636CFF",
              }}
            >
              <b>{name}</b>
            </Typography>
          </div>
          <div>
            <div style={{ marginTop: "50px" }} id="cardContainer"></div>
            <h1 hidden>{JSON.stringify(selected)}</h1>
          </div>
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
