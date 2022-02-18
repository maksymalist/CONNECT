import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../style/viewQuizStyles.css";

import { Divider, Typography, Button, Chip } from "@mui/material";

import { AccountCircle } from "@mui/icons-material";

import Placeholder from "../../img/quizCoverPlaceholder.svg";

import "../../style/playButtonAnimation.css";

import Translations from "../../translations/translations.json";

import { useLocation } from "react-router-dom";

import { useQuery, gql } from "@apollo/client";

import { CircularProgress } from "@mui/material";

const GET_QUIZ = gql`
  query quiz($id: ID!) {
    quiz(id: $id) {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
      questions
    }
  }
`;

function ViewQuiz() {
  const [ansIsShown, setAnsIsShown] = useState(false);

  const search = useLocation().search;

  const { mode, code } = useParams();

  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const classid = new URLSearchParams(search).get("classid");

  const {
    loading,
    error,
    data: quiz,
  } = useQuery(GET_QUIZ, {
    variables: {
      id: code,
    },
  });

  useEffect(() => {
    Object.keys(
      document.getElementsByClassName("view__quiz__content__question")
    ).map((el, index) => {
      if (
        document.getElementsByClassName("view__quiz__content__question")[
          index
        ] !== undefined
      )
        document
          .getElementsByClassName("view__quiz__content__question")
          [index].remove();
    });
  }, []);

  const handleShowAnswers = () => {
    setAnsIsShown(true);
  };

  const handleHideAnswers = () => {
    setAnsIsShown(false);
  };

  const StartButton = ({ code }) => (
    <svg
      style={{ position: "unset" }}
      onClick={() => {
        window.location = `/play?gamecode=${code}&classid=${classid}&mode=quiz`;
      }}
      id="playButtonSvg"
      width="69"
      height="100"
      viewBox="0 0 69 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="triangles" clip-path="url(#clip0)">
        <g id="darkGroup">
          <path
            id="dark2"
            opacity="0.75"
            d="M44 48.268C45.3333 49.0378 45.3333 50.9622 44 51.732L9.5 71.6506C8.16666 72.4204 6.5 71.4582 6.5 69.9186L6.5 30.0814C6.5 28.5418 8.16667 27.5796 9.5 28.3494L44 48.268Z"
            fill="#1BB978"
          />
          <path
            id="dark1"
            opacity="0.75"
            d="M66 48.268C67.3333 49.0378 67.3333 50.9622 66 51.732L31.5 71.6506C30.1667 72.4204 28.5 71.4582 28.5 69.9186L28.5 30.0814C28.5 28.5418 30.1667 27.5796 31.5 28.3494L66 48.268Z"
            fill="#1BB978"
          />
        </g>
        <g id="lightGroup">
          <path
            id="light1"
            opacity="0.75"
            d="M44 48.268C45.3333 49.0378 45.3333 50.9622 44 51.732L9.5 71.6506C8.16666 72.4204 6.5 71.4582 6.5 69.9186L6.5 30.0814C6.5 28.5418 8.16667 27.5796 9.5 28.3494L44 48.268Z"
            fill="#6ED69A"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="69" height="100" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <div>
      {loading ? (
        <CircularProgress
          size={150}
          thickness={3}
          style={{ color: "white", margin: "100px" }}
        />
      ) : quiz ? (
        <div className="view__quiz__flex">
          <div className="view__quiz__content">
            <img
              style={{ width: "100%", height: "400px" }}
              src={quiz.quiz.coverImg || Placeholder}
              alt="quiz"
              className="view__quiz__image"
            />
            <div style={{ textAlign: "left", padding: "10px" }}>
              <Typography variant="h4" component="h4">
                {quiz.quiz.name}
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <br></br>
                <StartButton code={code} />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {quiz.quiz.userProfilePic !== undefined ? (
                    <img
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                        borderRadius: "50%",
                      }}
                      draggable="false"
                      src={quiz.quiz.userProfilePic}
                      alt="quiz-img"
                    />
                  ) : (
                    <AccountCircle
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                        borderRadius: "50%",
                      }}
                      color="primary"
                    />
                  )}
                  <h3>
                    {Translations[userLanguage].quiz.by}{" "}
                    {quiz.quiz.userName || "undefined"}
                  </h3>
                </div>
                <div>
                  {quiz.quiz.tags == undefined ? null : (
                    <div>
                      <br></br>
                      {quiz.quiz.tags.map((tag, index) => {
                        return (
                          <Chip
                            style={{ margin: "5px" }}
                            key={tag + index}
                            label={tag}
                            color="primary"
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="view__quiz__content__questions">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                position: "sticky",
                top: "0",
                backgroundColor: "white",
                padding: "10px",
                zIndex: "1",
                borderBottom: "1px solid #c4c4c4",
              }}
            >
              <Typography variant="h5" component="h5">
                {Translations[userLanguage].quiz.questions}(
                {quiz.quiz.questions.length})
              </Typography>
              {ansIsShown ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleHideAnswers()}
                >
                  {Translations[userLanguage].quiz.hideanswers}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleShowAnswers()}
                >
                  {Translations[userLanguage].quiz.showanswers}
                </Button>
              )}
            </div>
            {quiz.quiz.questions.map((data, index) => {
              data = JSON.parse(data);
              return (
                <div className="view__quiz__content__question" key={index}>
                  <Typography variant="h5" component="h5">
                    {index + 1}. {data.question}
                  </Typography>
                  {ansIsShown ? (
                    <div style={{ width: "100%" }}>
                      <br></br>
                      <Divider light />
                      <br></br>
                      <Typography variant="h5" component="h5">
                        {data.answer}
                      </Typography>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ViewQuiz;
