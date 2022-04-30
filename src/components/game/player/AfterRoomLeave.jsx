import React, { useState } from "react";
import { Button } from "@mui/material";

import { useParams, useLocation } from "react-router-dom";

import Translations from "../../../translations/translations.json";

//badges
import FirstPlaceIcon from "../../../img/PodiumIcons/firstPlace.svg";
import SecondPlaceIcon from "../../../img/PodiumIcons/secondPlace.svg";
import ThirdPlaceIcon from "../../../img/PodiumIcons/thirdPlace.svg";
import OtherPlaceIcon from "../../../img/PodiumIcons/otherPlaceIcon.svg";

export default function AfterRoomLeave() {
  const { type } = useParams();
  const search = useLocation().search;
  const position = new URLSearchParams(search).get("position");

  const h1 = { color: "#fff", fontSize: "4.5rem" };
  const h2 = { color: "#fff", fontSize: "1.5rem" };
  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  return (
    <div>
      <div style={{ marginTop: "100px" }} />
      {type === "kicked" && (
        <div style={{ textAlign: "center" }}>
          <h1 style={h1}>
            <b>{Translations[userLanguage].leftroom.kicked.title}</b>
          </h1>
          <h2 style={h2}>{Translations[userLanguage].leftroom.kicked.sub}</h2>
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
          <h1 style={h1}>
            <b>{Translations[userLanguage].leftroom.ended}</b>
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
              <h1 style={h1}>
                <b>{Translations[userLanguage].leftroom.winner.title}</b>
              </h1>
              <div>
                <img
                  src={FirstPlaceIcon}
                  style={{
                    width: "100%",
                    width: "100%",
                    maxWidth: "250px",
                    minWidth: "250px",
                  }}
                />
              </div>
              <h2 style={h2}>
                {Translations[userLanguage].leftroom.winner.sub}
              </h2>
            </>
          )}
          {position === "2" && (
            <>
              <h1 style={h1}>
                <b>{Translations[userLanguage].leftroom.second.title}</b>
              </h1>
              <div>
                <img
                  src={SecondPlaceIcon}
                  style={{
                    width: "100%",
                    width: "100%",
                    maxWidth: "250px",
                    minWidth: "250px",
                  }}
                />
              </div>
              <h2 style={h2}>
                {Translations[userLanguage].leftroom.second.sub}
              </h2>
            </>
          )}
          {position === "3" && (
            <>
              <h1 style={h1}>
                <b>{Translations[userLanguage].leftroom.third.title}</b>
              </h1>
              <div>
                <img
                  src={ThirdPlaceIcon}
                  style={{
                    width: "100%",
                    width: "100%",
                    maxWidth: "250px",
                    minWidth: "250px",
                  }}
                />
              </div>
              <h2 style={h2}>
                {Translations[userLanguage].leftroom.third.sub}
              </h2>
            </>
          )}
          {position > 3 && (
            <>
              <h1 style={h1}>
                <b>
                  {Translations[userLanguage].leftroom.loser.title1}
                  {position}
                  {Translations[userLanguage].leftroom.loser.title2}
                </b>
              </h1>
              <div>
                <img
                  src={OtherPlaceIcon}
                  style={{
                    width: "100%",
                    width: "100%",
                    maxWidth: "250px",
                    minWidth: "250px",
                  }}
                />
              </div>
              <h2 style={h2}>
                {Translations[userLanguage].leftroom.loser.sub}
              </h2>
            </>
          )}
          {position === undefined && (
            <>
              <h1 style={h1}>
                <b>{Translations[userLanguage].leftroom.over.title}</b>
              </h1>
              <h2 style={h2}>{Translations[userLanguage].leftroom.over.sub}</h2>
            </>
          )}
          {position === "" && (
            <>
              <h1 style={h1}>
                <b>{Translations[userLanguage].leftroom.over.title}</b>
              </h1>
              <h2 style={h2}>{Translations[userLanguage].leftroom.over.sub}</h2>
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
          <h1 style={h1}>{Translations[userLanguage].leftroom.title}</h1>
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
