//@ts-nocheck
import React, { useEffect, useState } from "react";
import PodiumAnimation from "./PodiumAnimation";
import { Button, Typography } from "@mui/material";
import useTranslations from "../../../hooks/useTranslations";
export default function GameEnded(props) {
  const translations = useTranslations();
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
        flexDirection: "column"
      }}
    >
      <Typography variant="h3" style={{ color: "white", marginBottom: "50px" }}>
        <b>{translations.gameended.title}</b>
      </Typography>
      <PodiumAnimation
        maxPodiumPlayers={props.maxPodiumPlayers}
        podium={props.podium}
      />
    </div>
  );
}
