//@ts-nocheck
import { Typography } from "@mui/material";
import { useState } from "react";
import useTranslations from "../../../hooks/useTranslations";
function PositionScreen({ position, player }) {
  const translations = useTranslations();
  return (
    <div>
      {position === 0 && (
        <div
          style={{
            display: "flex",
            width: "100vw",
            justifyContent: "flex-end"
          }}
        >
          <div
            style={{
              marginRight: "20px",
              marginTop: "20px",
              backgroundColor: position === 0 ? "rgb(220, 0, 78)" : "#1bb978",
              borderRadius: "5px",
              padding: "10px"
            }}
          >
            <Typography variant="sub1" style={{ color: "white" }}>
              <b>+ 25s</b>
            </Typography>
          </div>
        </div>
      )}
      <Typography variant="h2" style={{ color: "white", marginTop: "100px", marginBottom: "50px" }}>
        <b>{position === 0 ? translations.positionscreen.ohno : translations.positionscreen.wow}</b>
      </Typography>
      <Typography variant="h3" style={{ color: "white" }}>
        <b>
          {position === 0
            ? translations.positionscreen.notfinished
            : position === 1
              ? translations.positionscreen.yougot1st
              : position === 2
                ? translations.positionscreen.yougot2nd
                : position === 3
                  ? translations.positionscreen.yougot3rd
                  : `${translations.positionscreen.yougotother1} ${position}${
                      translations.positionscreen.yougotother2
                    }`}
        </b>
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginTop: "50px"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            className="lowest__time__container"
            style={{
              backgroundColor:
                position === 0
                  ? "rgb(220, 0, 78)"
                  : position === 1
                    ? "#FCC73E"
                    : position === 2 ? "#1594DB" : position === 3 ? "#CE3EE5" : `rgb(108, 99, 255)`
            }}
          >
            <Typography style={{ color: "white" }} variant="h3">
              {position === 0
                ? "👎😐"
                : position === 1 ? "👑" : position === 2 ? "🥈" : position === 3 ? "🥉" : `🏅`}
            </Typography>
            <div className="lowest-time-box">
              <Typography variant="h3">{player}</Typography>
            </div>
          </div>
          <div>
            <Typography variant="h3" style={{ color: "white", marginTop: "50px" }}>
              <b>{position === 0 ? translations.positionscreen.dobetter : translations.positionscreen.keepitup}</b>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PositionScreen;
