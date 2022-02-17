import React, { useState } from "react";

//material ui
import { CircularProgress } from "@mui/material";

import "../style/style.css";
import Translations from "../translations/translations.json";

export default function FinishedScreen({ match, user }) {
  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1 style={{ color: "white", fontWeight: "bold" }}>
        {Translations[userLanguage].finishedscreen.title}
      </h1>
      <h2 style={{ color: "white", textAlign: "center" }}>
        {Translations[userLanguage].finishedscreen.sub}
      </h2>
      <CircularProgress
        size={150}
        thickness={3}
        style={{ color: "white", margin: "100px" }}
      />
      <div>
        <nav style={{ height: "50px", backgroundColor: "white" }}>
          <div
            style={{
              float: "left",
              color: "black",
              marginLeft: "10px",
              marginTop: "-10px",
            }}
          >
            <h2>{user}</h2>
          </div>
        </nav>
      </div>
    </div>
  );
}
