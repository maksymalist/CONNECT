import React, { useState, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import "../../style/viewQuizStyles.css";

import { Divider, Typography, Button, Chip } from "@mui/material";

import { AccountCircle } from "@mui/icons-material";

import Placeholder from "../../img/quizCoverPlaceholder.svg";

import "../../style/playButtonAnimation.css";

import { useLocation } from "react-router-dom";

import { useQuery, gql } from "@apollo/client";

import { CircularProgress } from "@mui/material";

import getUser from "../../hooks/getUser";
import useTranslations from "../../hooks/useTranslations";

const GET_QUIZ = gql`
  query privateQuiz($id: ID!) {
    privateQuiz(id: $id) {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
      questions
      description
      plays
    }
  }
`;

function ViewQuiz() {
  const [ansIsShown, setAnsIsShown] = useState(false);

  const search = useLocation().search;

  const { code } = useParams();

  const translations = useTranslations();

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

  const user = getUser();

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
      ) : quiz.privateQuiz.userID === "user:" + user?.profileObj.googleId ? (
        <div className="view__quiz__flex">
          <div className="view__quiz__content">
            <img
              style={{ width: "100%", height: "400px" }}
              src={quiz.privateQuiz.coverImg || Placeholder}
              alt="quiz"
              className="view__quiz__image"
            />
            <div style={{ textAlign: "left", padding: "10px" }}>
              <Typography variant="h4" component="h4">
                {quiz.privateQuiz.name}
              </Typography>
              <br></br>
              <Typography variant="sub1">
                ✨ {quiz.privateQuiz.plays} {translations.quiz.plays} ✨
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
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      window.location = `/play?gamecode=${code}&classid=${classid}&mode=quiz`;
                    }}
                  >
                    {translations.multiquiz.play}
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    style={{ marginLeft: "20px" }}
                    onClick={() => {
                      window.location = `/practice/normal/${code}`;
                    }}
                  >
                    {translations.multiquiz.practice}
                  </Button>
                </div>
              </div>
              <div
                style={{
                  textAlign: "left",
                  marginBottom: "20px",
                  marginTop: "20px",
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    quiz.privateQuiz.description !== ""
                      ? quiz.privateQuiz.description
                      : "",
                }}
              ></div>
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
                  {quiz.privateQuiz.userProfilePic !== undefined ? (
                    <img
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                        borderRadius: "50%",
                      }}
                      draggable="false"
                      src={quiz.privateQuiz.userProfilePic}
                      alt="quiz-img"
                      onClick={() => {
                        handleUserProfile(quiz.privateQuiz.userID);
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
                    {translations.quiz.by}{" "}
                    {quiz.privateQuiz.userName || "undefined"}
                  </h3>
                </div>
                <div>
                  {quiz.privateQuiz.tags == undefined ? null : (
                    <div>
                      <br></br>
                      {quiz.privateQuiz.tags.map((tag, index) => {
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
                {translations.quiz.questions}(
                {quiz.privateQuiz.questions.length})
              </Typography>
              {ansIsShown ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleHideAnswers()}
                >
                  {translations.quiz.hideanswers}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleShowAnswers()}
                >
                  {translations.quiz.showanswers}
                </Button>
              )}
            </div>
            {quiz.privateQuiz.questions.map((data, index) => {
              data = JSON.parse(data);
              const type = data.type === undefined ? "ques_ans" : data.type;
              return (
                <div className="view__quiz__content__question" key={index}>
                  {type === "ques_ans" && (
                    <Typography variant="h5" component="h5">
                      {index + 1}. {data.question}
                    </Typography>
                  )}
                  {type === "ques_img" && (
                    <>
                      <Typography variant="h5" component="h5">
                        {index + 1}.
                      </Typography>
                      <br />
                      <img
                        style={{
                          width: "100%",
                          maxWidth: "200px",
                          height: "150px",
                        }}
                        src={data.question}
                        alt="quiz"
                      />
                    </>
                  )}
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
      ) : (
        <Redirect to="/" />
      )}
    </div>
  );
}

export default ViewQuiz;
