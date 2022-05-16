import React, { useState } from "react";
import { Button } from "@mui/material";

import { useParams, useLocation } from "react-router-dom";

//badges
import FirstPlaceIcon from "../../../img/PodiumIcons/firstPlace.svg";
import SecondPlaceIcon from "../../../img/PodiumIcons/secondPlace.svg";
import ThirdPlaceIcon from "../../../img/PodiumIcons/thirdPlace.svg";
import OtherPlaceIcon from "../../../img/PodiumIcons/otherPlaceIcon.svg";
import useTranslations from "../../../hooks/useTranslations";

export default function AfterRoomLeave() {
  const { type } = useParams();
  const search = useLocation().search;
  const position = new URLSearchParams(search).get("position");

  const h1 = { color: "#fff", fontSize: "4.5rem" };
  const h2 = { color: "#fff", fontSize: "1.5rem" };
  const translations = useTranslations();

  return (
    <div>
      <div style={{ marginTop: "100px" }} />
      {type === "kicked" && (
        <div style={{ textAlign: "center" }}>
          <h1 style={h1}>
            <b>{translations.leftroom.kicked.title}</b>
          </h1>
          <h2 style={h2}>{translations.leftroom.kicked.sub}</h2>
          <Button
            style={{ marginBottom: "1vh" }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              window.location = "/play";
            }}
          >
            {translations.leftroom.button}
          </Button>
        </div>
      )}
      {type === "ended" && (
        <div style={{ textAlign: "center" }}>
          <h1 style={h1}>
            <b>{translations.leftroom.ended}</b>
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
            {translations.leftroom.button}
          </Button>
        </div>
      )}
      {type === "gameover" && (
        <div style={{ textAlign: "center" }}>
          {position === "1" && (
            <>
              <h1 style={h1}>
                <b>{translations.leftroom.winner.title}</b>
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
              <h2 style={h2}>{translations.leftroom.winner.sub}</h2>
            </>
          )}
          {position === "2" && (
            <>
              <h1 style={h1}>
                <b>{translations.leftroom.second.title}</b>
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
              <h2 style={h2}>{translations.leftroom.second.sub}</h2>
            </>
          )}
          {position === "3" && (
            <>
              <h1 style={h1}>
                <b>{translations.leftroom.third.title}</b>
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
              <h2 style={h2}>{translations.leftroom.third.sub}</h2>
            </>
          )}
          {position > 3 && (
            <>
              <h1 style={h1}>
                <b>
                  {translations.leftroom.loser.title1}
                  {position}
                  {translations.leftroom.loser.title2}
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
              <h2 style={h2}>{translations.leftroom.loser.sub}</h2>
            </>
          )}
          {position === undefined && (
            <>
              <h1 style={h1}>
                <b>{translations.leftroom.over.title}</b>
              </h1>
              <h2 style={h2}>{translations.leftroom.over.sub}</h2>
            </>
          )}
          {position === "" && (
            <>
              <h1 style={h1}>
                <b>{translations.leftroom.over.title}</b>
              </h1>
              <h2 style={h2}>{translations.leftroom.over.sub}</h2>
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
            {translations.leftroom.button}
          </Button>
        </div>
      )}
      {type === "left" && (
        <div style={{ textAlign: "center" }}>
          <h1 style={h1}>{translations.leftroom.title}</h1>
          <Button
            style={{ marginBottom: "1vh" }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              window.location = "/play";
            }}
          >
            {translations.leftroom.button}
          </Button>
        </div>
      )}
    </div>
  );
}
