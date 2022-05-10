import React, { useEffect, useState } from "react";
import PodiumAnimation from "./PodiumAnimation";
import Translations from "../../../translations/translations.json";
import { Button, Typography } from "@mui/material";

export default function GameEnded(props) {
  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );
  useEffect(() => {
    console.log(props.podium);
    return () => {
      //cleanup
    };
  }, []);
  return (
    <div
      id="main"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3" style={{ color: "white", marginBottom: "50px" }}>
        <b>{Translations[userLanguage].gameended.title}</b>
      </Typography>
      <PodiumAnimation
        maxPodiumPlayers={props.maxPodiumPlayers}
        podium={props.podium}
      />
    </div>
  );
}
