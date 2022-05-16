import { useState } from "react";
import { Typography, Button } from "@mui/material";
import useTranslations from "../../../hooks/useTranslations";

const FinishedSceen = ({ time }) => {
  const translations = useTranslations();
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          height: "600px",
          padding: "20px",
          maxWidth: "550px",
          width: "100%",
          margin: "20px",
          color: "white",
        }}
      >
        <div>
          <Typography variant="h1" style={{ marginBottom: "30px" }}>
            🎉
          </Typography>
          <h1 style={{ marginBottom: "30px" }}>
            {translations.finishedscreen.WOW}
          </h1>
          <h2>
            {translations.finishedscreen.sub2}
            {time}s !!! 🥳
          </h2>
        </div>

        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = "/")}
          >
            {translations.finishedscreen.return}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinishedSceen;
