//@ts-nocheck
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "../../style/style.css";
import { toast } from "react-toastify";

import { Button, Typography } from "@mui/material";

import ReactHowler from "react-howler";
import themeSong from "../../audio/connect_theme.mp3";
import PopUp from "./PopUp";
import useTranslations from "../../hooks/useTranslations";

export default function Game({ nickname, nextSection }) {
  var [time, updateTime] = useState(0);
  var [selected, setSelected] = useState([]);
  var [name, setName] = useState("");
  const cards = [];

  const user = nickname;

  let gameOver = false;
  const [isMusic, setIsMusic] = useState(false);
  const [popUpHidden, setPopUpHidden] = useState(true);

  const [isTutorial, setIsTutorial] = useState(true);

  let quiz = {
    _id: "quiz:dc15b312-87ee-4429-bb4c-90b5c69bb629",
    name: "Math Quiz",
    coverImg:
      "https://firebasestorage.googleapis.com/v0/b/livequiz-20442.appspot.com/o/quizImg%2FFrame_.png?alt=media&token=e6fe43d0-8c1f-43e6-ba92-060025d5c33b",
    tags: ["description", "cool"],
    userID: "user:107441883042764793504",
    userName: "Eddie Carter",
    userProfilePic:
      "https://lh3.googleusercontent.com/a/AATXAJwGXLhYEvhAArYWUhO3HpV7cwcfLe91m35W9j1Q=s96-c",
    questions: [
      '{"index":0,"question":"1+1","answer":"2"}',
      '{"index":1,"question":"2+2","answer":"4"}',
      '{"index":2,"question":"4+4","answer":"8"}',
      '{"index":3,"question":"8+8","answer":"16"}',
      '{"index":4,"question":"5+5","answer":"10"}',
      '{"index":5,"question":"32+32","answer":"64"}',
    ],
    description: "<p>This quiz has a description</p>",
    plays: { $numberInt: "4" },
    likes: { $numberInt: "0" },
    createdAt: { $date: { $numberLong: "1650449887789" } },
    updatedAt: { $date: { $numberLong: "1651174990857" } },
    __v: { $numberInt: "0" },
  };

  const translations = useTranslations();

  const getQuiz = async () => {
    setName((name = quiz?.name));
    setCardsFunction();
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
      "color: #1594DB; font-weight: bold; transform: scale(1.05); border: 4px solid #1594DB;";

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

  const startGame = () => {
    updateTime((prev) => (time = prev += 5));
    setInterval(() => {
      if (gameOver) return;
      updateTime((prev) => (time = Math.round((prev += 0.1) * 10) / 10));
    }, 100);
    getQuiz();
    setIsMusic(true);
    setIsTutorial(false);
  };

  return (
    <>
      <ReactHowler src={themeSong} playing={isMusic} loop={true} volume={1} />
      {isTutorial ? <PopUp startGame={startGame} /> : null}
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
          <div>
            <Typography
              variant="h3"
              style={{ color: "white", marginTop: "50px" }}
            >
              <b>{translations.tutorial.game.notbad}</b>
            </Typography>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                marginTop: "50px",
              }}
            >
              <Button
                variant="contained"
                size="large"
                color="success"
                onClick={() => {
                  nextSection();
                }}
              >
                {translations.tutorial.game.button}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
