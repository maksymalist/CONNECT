import React, { useState } from "react";
import { Button } from "@mui/material";

import { useParams, useLocation } from "react-router-dom";

import Translations from "../../../translations/translations.json";

export default function AfterRoomLeave() {
  const { type } = useParams();
  const search = useLocation().search;
  const position = new URLSearchParams(search).get("position");

  const white = { color: "#fff" };
  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  return (
    <div>
      <div style={{ marginTop: "100px" }} />
      {type === "kicked" && (
        <div style={{ textAlign: "center" }}>
          <h1 style={white}>
            <b>You have been kicked</b>
          </h1>
          <h2 style={white}>WHAT HAVE YOU DONE???</h2>
          <Button
            style={{ marginBottom: "1vh" }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              window.location = "/play";
            }}
          >
            {Translations[userLanguage].leftroom.button}
          </Button>
        </div>
      )}
      {type === "ended" && (
        <div style={{ textAlign: "center" }}>
          <h1 style={white}>
            <b>Your host has ended the game :(</b>
          </h1>
          <Button
            style={{ marginBottom: "1vh" }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              window.location = "/play";
            }}
          >
            {Translations[userLanguage].leftroom.button}
          </Button>
        </div>
      )}
      {type === "gameover" && (
        <div style={{ textAlign: "center" }}>
          {position === "1" && (
            <>
              <h1 style={white}>
                <b>You won the game!</b>
              </h1>
              <h2 style={white}>Cheers!</h2>
            </>
          )}
          {position === "2" && (
            <>
              <h1 style={white}>
                <b>You got second place</b>
              </h1>
              <h2 style={white}>Better luck next time!</h2>
            </>
          )}
          {position === "3" && (
            <>
              <h1 style={white}>
                <b>You got third place</b>
              </h1>
              <h2 style={white}>Better luck next time!</h2>
            </>
          )}
          {position > 3 && (
            <>
              <h1 style={white}>
                <b>You got {position}th place</b>
              </h1>
              <h2 style={white}>Better luck next time!</h2>
            </>
          )}
          {position === undefined && (
            <>
              <h1 style={white}>
                <b>The game is over</b>
              </h1>
              <h2 style={white}>Better luck next time!</h2>
            </>
          )}
          {position === "" && (
            <>
              <h1 style={white}>
                <b>The game is over</b>
              </h1>
              <h2 style={white}>Better luck next time!</h2>
            </>
          )}
          <Button
            style={{ marginBottom: "1vh" }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              window.location = "/play";
            }}
          >
            {Translations[userLanguage].leftroom.button}
          </Button>
        </div>
      )}
      {type === "left" && (
        <div style={{ textAlign: "center" }}>
          <h1 style={white}>{Translations[userLanguage].leftroom.title}</h1>
          <Button
            style={{ marginBottom: "1vh" }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              window.location = "/play";
            }}
          >
            {Translations[userLanguage].leftroom.button}
          </Button>
        </div>
      )}
    </div>
  );
}
