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

  const { code } = useParams();

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

  const handleUserProfile = (userID) => {
    const id = userID.replace("user:", "");
    window.location.href = `/profiles/${id}`;
  };

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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    width: "100%",
                    marginTop: "30px",
                    marginBottom: "30px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      window.location = `/play?gamecode=${code}&classid=${classid}&mode=quiz`;
                    }}
                  >
                    {Translations[userLanguage].multiquiz.play}
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    style={{ marginLeft: "20px" }}
                    onClick={() => {
                      window.location = `/practice/normal/${code}`;
                    }}
                  >
                    {Translations[userLanguage].multiquiz.practice}
                  </Button>
                </div>
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
                      onClick={() => {
                        handleUserProfile(quiz.quiz.userID);
                      }}
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
                            label={"#" + tag}
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
