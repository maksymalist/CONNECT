import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";

import Translations from "../translations/translations.json";

export default function AfterRoomLeave(props) {
  const h1Style = { marginTop: "15vh", color: "#fff" };
  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={h1Style}>{Translations[userLanguage].leftroom.title}</h1>
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
  );
}
