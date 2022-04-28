import React, { useEffect, useState } from "react";
import PodiumAnimation from "./PodiumAnimation";
import Translations from "../../../translations/translations.json";
import { Button } from "@mui/material";

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
      <h1 style={{ color: "white" }}>
        {Translations[userLanguage].gameended.title}
      </h1>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => (window.location = "/")}
        >
          {Translations[userLanguage].finishedscreen.return}
        </Button>
      </div>
      <PodiumAnimation
        maxPodiumPlayers={props.maxPodiumPlayers}
        podium={props.podium}
      />
    </div>
  );
}
