import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../style/viewQuizStyles.css";

import { Divider, Typography, Button, Chip } from "@mui/material";

import Placeholder from "../../img/quizCoverPlaceholder.svg";

import Translations from "../../translations/translations.json";

import { useLocation } from "react-router-dom";

import { useQuery, gql } from "@apollo/client";

import { CircularProgress } from "@mui/material";

const GET_QUIZ_DETAILS = gql`
  query multi($id: ID!) {
    multi(id: $id) {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
      steps
    }
  }
`;

function ViewMultiQuiz() {
  const [ansIsShown, setAnsIsShown] = useState(false);

  const { mode, code } = useParams();

  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const search = useLocation().search;

  const classid = new URLSearchParams(search).get("classid");

  const { loading, error, data } = useQuery(GET_QUIZ_DETAILS, {
    variables: { id: code },
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

  return (
    <div>
      {loading ? (
        <CircularProgress
          size={150}
          thickness={3}
          style={{ color: "white", margin: "100px" }}
        />
      ) : (
        <div className="view__quiz__flex">
          <div className="view__quiz__content">
            <img
              style={{ width: "100%", height: "400px" }}
              src={data.multi.coverImg || Placeholder}
              alt="quiz"
              className="view__quiz__image"
            />
            <div style={{ textAlign: "left", padding: "10px" }}>
              <Typography variant="h4" component="h4">
                {data.multi.name}
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
                      window.location = `/play?gamecode=${code}&classid=${classid}&mode=multi`;
                    }}
                  >
                    {Translations[userLanguage].multiquiz.play}
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    style={{ marginLeft: "20px" }}
                    onClick={() => {
                      window.location = `/practice/multi/${code}`;
                    }}
                  >
                    {Translations[userLanguage].multiquiz.practice}
                  </Button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <img
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "10px",
                    borderRadius: "50%",
                  }}
                  draggable="false"
                  src={data.multi.userProfilePic}
                  alt="quiz-img"
                />
                <h3>
                  {Translations[userLanguage].multiquiz.by}{" "}
                  {data.multi.userName || "undefined"}
                </h3>
              </div>
              <div>
                {data.multi.tags == undefined ? null : (
                  <div>
                    <br></br>
                    {data.multi.tags.map((tag, index) => {
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
                {Translations[userLanguage].multiquiz.steps}(
                {Object.keys(JSON.parse(data.multi.steps)).length})
              </Typography>
              {ansIsShown ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleHideAnswers()}
                >
                  {Translations[userLanguage].multiquiz.hideanswers}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleShowAnswers()}
                >
                  {Translations[userLanguage].multiquiz.showanswers}
                </Button>
              )}
            </div>
            {Object.keys(JSON.parse(data.multi.steps)).map((step, index) => {
              const questions = JSON.parse(data.multi.steps)[step];
              return (
                <div key={index}>
                  <Typography variant="h4" component="h4">
                    {step}
                  </Typography>
                  {Object.keys(questions).map((question, index) => {
                    return (
                      <div
                        key={index}
                        className="view__quiz__content__question"
                      >
                        <Typography variant="h6" component="h6">
                          {index + 1}. {questions[question].question}
                        </Typography>
                        {ansIsShown ? (
                          <div style={{ width: "100%" }}>
                            <br></br>
                            <Divider light />
                            <br></br>
                            <Typography variant="h6" component="h6">
                              {questions[question].answer}
                            </Typography>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewMultiQuiz;
