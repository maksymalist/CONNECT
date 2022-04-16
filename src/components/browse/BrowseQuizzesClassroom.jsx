import React, { useState } from "react";

import "../../style/style.css";
import {
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";

import TagIcon from "@mui/icons-material/Tag";

import Placeholder from "../../img/quizCoverPlaceholder.svg";

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

export default function BrowseQuizzes({ classID, gamemode }) {
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

  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState([]);

  return (
    <>
      <div
        style={{
          width: "95%",
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
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
        <FormControl variant="outlined" style={{ marginLeft: "10px" }}>
          <TextField
            variant="outlined"
            label="Tag Search"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TagIcon style={{ color: "c4c4c4", opacity: "90%" }} />
                </InputAdornment>
              ),
            }}
            value={currentTag}
            onChange={(e) => {
              setCurrentTag(e.target.value);
            }}
          />
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setTags([
              ...tags,
              {
                tag: currentTag,
                seed: Math.floor(Math.random() * (3 + 1)),
              },
            ]);
            setCurrentTag("");
          }}
        >
          {Translations[userLanguage].quizzes.bar.add}
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag.tag}
            className="mui-chip"
            onDelete={() => {
              setTags(tags.filter((t) => t.tag !== tag.tag));
            }}
            color="primary"
            style={{
              backgroundColor: ["#FCC73E", "#1594DB", "#1BB978", "#DC014E"][
                tag.seed
              ],
              color: "white",
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: "30px" }} id="feed">
        {gameMode === "normal" ? (
          loading ? (
            <CircularProgress
              size={150}
              thickness={3}
              style={{ margin: "100px", color: "white" }}
            />
          ) : (
            quizzes.allQuizzes.map((quiz, index) => {
              return <QuizCard key={quiz.id + index} data={quiz} tags={tags} />;
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
              return <QuizCard key={quiz.id + index} data={quiz} tags={tags} />;
            })
          )
        ) : null}
      </div>
    </>
  );
}
