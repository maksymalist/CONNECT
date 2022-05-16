import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import FinishedScreen from "./FinishedSceen";

import "../../../style/style.css";
import { toast } from "react-toastify";
import { Typography, Stepper, Step, StepLabel } from "@mui/material";

import axios from "axios";

import config from "../../../config.json";

import ReactHowler from "react-howler";
import themeSong from "../../../audio/connect_theme.mp3";
import getUser from "../../../hooks/getUser";

function MultiGameRoom({ match }) {
  const [activeStep, setActiveStep] = useState(0);

  const [steps, setSteps] = useState([]);

  var [maxSteps, setMaxSteps] = useState();

  var [time, updateTime] = useState(0);
  var [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  var cards = [];

  const userData = getUser();

  const user = userData?.profileObj.name;
  const gameID = match.params.gameid;
  var [GameOver, setGameOver] = useState(false);
  const [isMusic, setIsMusic] = useState(false);
  var secondTimer = 0;

  var quiz;

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
        type: quiz[key].type === undefined ? "ques_ans" : quiz[key].type,
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

      document.getElementById("popUp").removeAttribute("hidden");
      document.getElementById("gameContent").hidden = true;
      ReactDOM.render(
        <FinishedScreen time={time} />,
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
            multiID: gameID,
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
        multiID: gameID,
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
        setIsMusic(true);
      });

    document.getElementById("main-nav").remove();
  }, []);

  return (
    <>
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
      <ReactHowler src={themeSong} playing={isMusic} loop={true} volume={1} />
      <div>
        <div>
          <div id="gameContent">
            <div id="quizTextDiv">
              <div>
                <Typography
                  variant="h3"
                  style={{
                    backgroundColor: "white",
                    padding: "15px",
                    border: "2px solid black",
                    boxShadow: "5px 5px 0 #262626",
                    marginTop: "20px",
                    color: "black",
                  }}
                >
                  <b>{name}</b>
                </Typography>
              </div>
              <div>
                <Typography
                  variant="h4"
                  style={{
                    backgroundColor: "white",
                    padding: "15px",
                    border: "2px solid black",
                    boxShadow: "5px 5px 0 #262626",
                    marginTop: "20px",
                    color: "#636CFF",
                  }}
                >
                  <b>{steps[activeStep]}</b>
                </Typography>
              </div>
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
                  maxWidth: "800px",
                  margin: "20px",
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
          <div
            hidden
            style={{ width: "100%", height: "100vh", zIndex: "500" }}
            id="popUp"
          ></div>
        </div>
      </div>
    </>
  );
}

export default MultiGameRoom;
