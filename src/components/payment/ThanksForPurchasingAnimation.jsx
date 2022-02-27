import React, { useState } from "react";
import "../../style/checkAnimation.css";
import Button from "@mui/material/Button";
import Translations from "../../translations/translations.json";
import { Typography } from "@mui/material";

export default function ThanksForPurchasingAnimation() {
  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "0x" }}>
      <div id="popUpCard">
        <div>
          <svg
            width="100px"
            height="100px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 130.2 130.2"
          >
            <circle
              className="path circle"
              fill="none"
              stroke="#73AF55"
              strokeWidth="6"
              strokeLiterlimit="10"
              cx="65.1"
              cy="65.1"
              r="62.1"
            />
            <polyline
              className="path check"
              fill="none"
              stroke="#73AF55"
              strokeWidth="6"
              strokeLinecap="round"
              strokeMiterlimit="10"
              points="100.2,40.2 51.5,88.8 29.8,67.5 "
            />
          </svg>
          <Typography variant="h4" className="success">
            {Translations[userLanguage].thanksforpurchasing.title}
          </Typography>
        </div>
        <Button
          href="/"
          style={{ marginTop: "1vh", marginBottom: "1vh" }}
          variant="contained"
          color="primary"
          size="small"
        >
          {Translations[userLanguage].thanksforpurchasing.button}
        </Button>
      </div>
    </div>
  );
}
