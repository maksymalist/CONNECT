//@ts-nocheck
import React, { useState } from "react";
import "../../style/checkAnimation.css";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import useTranslations from "../../hooks/useTranslations";
export default function ThanksForPurchasingAnimation() {
  const translations = useTranslations();
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "0x" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginTop: "100px"
        }}
      >
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
              stroke="#1bb978"
              strokeWidth="6"
              strokeLiterlimit="10"
              cx="65.1"
              cy="65.1"
              r="62.1"
            />
            <polyline
              className="path check"
              fill="none"
              stroke="#1bb978"
              strokeWidth="6"
              strokeLinecap="round"
              strokeMiterlimit="10"
              points="100.2,40.2 51.5,88.8 29.8,67.5 "
            />
          </svg>
          <Typography variant="h4" color="white" style={{ marginTop: "50px" }}>
            🎉🎉 {translations.thanksforpurchasing.title} 🎉🎉
          </Typography>
        </div>
        <Button
          href="/"
          style={{ marginTop: "50px" }}
          variant="contained"
          color="primary"
          size="large"
        >
          {translations.thanksforpurchasing.button}
        </Button>
      </div>
    </div>
  );
}
