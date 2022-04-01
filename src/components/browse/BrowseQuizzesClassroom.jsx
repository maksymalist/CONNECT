import React, { useState } from "react";

import "../../style/style.css";
import {
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  Chip,
} from "@mui/material";

import { AccountCircle } from "@mui/icons-material";

import Placeholder from "../../img/quizCoverPlaceholder.svg";

import Translations from "../../translations/translations.json";

import { useQuery, gql } from "@apollo/client";

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
    }
  }
`;

export default function BrowseQuizzes({ classID, gamemode }) {
  const [gameMode, setGameMode] = useState("normal");
  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const { loading, error, data: quizzes } = useQuery(GET_QUIZZES);
  const { loading: multisLoading, data: multis } = useQuery(GET_MULTIS);

  const QuizCard = ({ data }) => (
    <div
      className="quizCard"
      onClick={() =>
        (window.location = `/quiz/normal/${data._id}?classid=${classID}`)
      }
      style={{ overflowY: "auto", overflowX: "hidden" }}
    >
      <img
        style={{ width: "100%", height: "250px" }}
        src={data.coverImg || Placeholder}
        alt="cover-img"
      />
      <h2>{data.name}</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {data.userProfilePic == undefined ? (
          <AccountCircle style={{ marginRight: "10px" }} color="primary" />
        ) : (
          <img
            width="25px"
            height="25px"
            src={data.userProfilePic}
            alt={data.userProfilePic}
            style={{
              borderRadius: "100%",
              marginRight: "10px",
            }}
          />
        )}
        <h3>{`${Translations[userLanguage].quizzes.by} ${data.userName}`}</h3>
      </div>
      <div>
        {data.tags == undefined ? null : (
          <div>
            <br></br>
            {data.tags.map((tag, index) => {
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
      <br></br>
    </div>
  );

  const MultiCard = ({ data }) => (
    <div
      className="quizCard"
      onClick={() =>
        (window.location = `/quiz/multi/${data._id}?classid=${classID}`)
      }
      style={{ overflowY: "auto", overflowX: "hidden" }}
    >
      <img
        style={{ width: "100%", height: "250px" }}
        src={data.coverImg || Placeholder}
        alt="cover-img"
      />
      <h2>{data.name}</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {data.userProfilePic == undefined ? (
          <AccountCircle style={{ marginRight: "10px" }} color="primary" />
        ) : (
          <img
            width="25px"
            height="25px"
            src={data.userProfilePic}
            alt={data.userProfilePic}
            style={{
              borderRadius: "100%",
              marginRight: "10px",
            }}
          />
        )}
        <h3>{`${Translations[userLanguage].quizzes.by} ${data.userName}`}</h3>
      </div>
      <div>
        {data.tags == undefined ? null : (
          <div>
            <br></br>
            {data.tags.map((tag, index) => {
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
      <br></br>
    </div>
  );

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
            quizzes.allQuizzes.map((quiz, index) => {
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
            multis.allMultis.map((quiz, index) => {
              return <MultiCard key={quiz.id + index} data={quiz} />;
            })
          )
        ) : null}
      </div>
    </>
  );
}
