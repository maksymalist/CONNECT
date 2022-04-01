import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import FinishedScreen from "./FinishedSceen";

import "../../../style/style.css";
import { toast } from "react-toastify";

import { Typography } from "@mui/material";

import Translations from "../../../translations/translations.json";

import axios from "axios";

import config from "../../../config.json";

import ReactHowler from "react-howler";
import themeSong from "../../../audio/connect_theme.mp3";
import getUser from "../../../hooks/getUser";

export default function GameRoom({ match }) {
  var [time, updateTime] = useState(0);
  var [selected, setSelected] = useState([]);
  var [name, setName] = useState("");
  const cards = [];

  const userData = getUser();

  const gameID = match.params.gameid;
  const user = userData?.profileObj.name;
  let gameOver = false;
  const [isMusic, setIsMusic] = useState(false);
  const [popUpHidden, setPopUpHidden] = useState(true);

  let quiz = [];

  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const getQuiz = async () => {
    const response = await axios.post(
      `${config["api-server"]}/get-quiz-all-types`,
      { quizID: gameID }
    );
    quiz = response.data;
    setName((name = quiz?.name));
    setCardsFunction();
  };

  const setCardsFunction = () => {
    quiz.questions.map((question, index) => {
      question = JSON.parse(question);
      cards.push({
        question: question.question,
        ans: question.answer,
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
    document.getElementById(id).style =
      "color: rgb(99, 108, 255); font-weight: bold;";

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
          gameOver = true;
          setPopUpHidden(false);
        }
      } else {
        updateTime((prev) => (time = prev += 5));
      }

      memory = [];
      setSelected((selected = []));
    }
  }

  useEffect(() => {
    setInterval(() => {
      if (gameOver) return;
      updateTime((prev) => (time = Math.round((prev += 0.1) * 10) / 10));
    }, 100);
    getQuiz();
    document.querySelector("nav").hidden = true;
    setIsMusic(true);
  }, []);

  return (
    <>
      <ReactHowler src={themeSong} playing={isMusic} loop={true} volume={1} />
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
          <h2>{user}</h2>
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
        {popUpHidden ? (
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
            </div>
          </div>
        ) : (
          <FinishedScreen time={time} />
        )}
      </div>
    </>
  );
}
