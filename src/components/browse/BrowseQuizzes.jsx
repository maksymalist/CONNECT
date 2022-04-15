import React, { useState } from "react";

import "../../style/style.css";
import {
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  Chip,
  Button,
} from "@mui/material";

import Translations from "../../translations/translations.json";

import { useQuery, gql } from "@apollo/client";

import QuizCard from "../cards/QuizCard";

const GET_QUIZZES = gql`
  query allQuizzes {
    allQuizzes {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
      __typename
    }
  }
`;

const GET_MULTIS = gql`
  query allMultis {
    allMultis {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
      __typename
    }
  }
`;

export default function BrowseQuizzes() {
  const [gameMode, setGameMode] = useState("normal");
  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const { loading, error, data: quizzes } = useQuery(GET_QUIZZES);
  const { loading: multisLoading, data: multis } = useQuery(GET_MULTIS);

  const changeGamemode = (event) => {
    event.preventDefault();
    setGameMode(event.target.value);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          backgroundColor: "white",
          alignItems: "center",
          border: "2px solid black",
          boxShadow: "10px 10px 0 #262626",
          padding: "10px",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", marginRight: "20px" }}>
          {Translations[userLanguage].quizzes.bar.title}
        </h1>
        <FormControl variant="outlined">
          <InputLabel id="demo-simple-select-outlined-label">
            {Translations[userLanguage].quizzes.bar.gamemode.title}
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={gameMode}
            onChange={changeGamemode}
            label="GameMode"
            style={{ width: "180px", height: "40px" }}
            required
          >
            <MenuItem value="normal">
              ⚡️ {Translations[userLanguage].quizzes.bar.gamemode.normal}
            </MenuItem>
            <MenuItem value="multi">
              🥳 {Translations[userLanguage].quizzes.bar.gamemode.multi}
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ marginTop: "100px" }} id="feed">
        {gameMode === "normal" ? (
          loading ? (
            <CircularProgress
              size={150}
              thickness={3}
              style={{ margin: "100px", color: "white" }}
            />
          ) : (
            quizzes?.allQuizzes?.map((quiz, index) => {
              return <QuizCard key={quiz.id + index} data={quiz} />;
            })
          )
        ) : null}
        {gameMode === "multi" ? (
          multisLoading ? (
            <CircularProgress
              size={150}
              thickness={3}
              style={{ margin: "100px", color: "white" }}
            />
          ) : (
            multis?.allMultis?.map((quiz, index) => {
              return <QuizCard key={quiz.id + index} data={quiz} />;
            })
          )
        ) : null}
      </div>
    </>
  );
}
