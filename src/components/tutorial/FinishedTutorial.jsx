import { Button, Divider, Typography } from "@mui/material";
import { useState } from "react";
import Confetti from "react-confetti";
import useTranslations from "../../hooks/useTranslations";

//icon
import DiscordIcon from "../../img/DiscordIcon.svg";

const FinishedTutorial = () => {
  const translations = useTranslations();
  return (
    <>
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#1BB978",
            color: "white",
            padding: "20px",
            border: "2px solid black",
            boxShadow: "10px 10px 0 #262626",
            margin: "15px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography variant="h4">
            <b>{translations.tutorial.tutorialcompleted.title}</b>
          </Typography>
          <br></br>
        </div>
        <div
          style={{
            margin: "15px",
            marginTop: "50px",
            maxWidth: "600px",
          }}
        >
          <br></br>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "800px",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="error"
              size="large"
              style={{
                minWidth: "250px",
                margin: "10px",
                padding: "10px",
                fontSize: "1.5rem",
              }}
              onClick={() => (window.location = "/quizzes")}
            >
              {translations.tutorial.tutorialcompleted.button1}
            </Button>
            <Button
              variant="contained"
              color="warning"
              size="large"
              style={{
                minWidth: "250px",
                margin: "10px",
                padding: "10px",
                fontSize: "1.5rem",
              }}
              onClick={() => (window.location = "/newquiz")}
            >
              {translations.tutorial.tutorialcompleted.button2}
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{
                minWidth: "250px",
                margin: "10px",
                padding: "10px",
                fontSize: "1.5rem",
              }}
              onClick={() => (window.location = "/play")}
            >
              {translations.tutorial.tutorialcompleted.button3}
            </Button>
            <Button
              variant="contained"
              color="action"
              size="large"
              style={{
                minWidth: "250px",
                margin: "10px",
                padding: "10px",
                fontSize: "1.5rem",
              }}
              startIcon={<img src={DiscordIcon} width={36} height={36} />}
              onClick={() =>
                window.open("https://discord.gg/WSBtsD66yc", "_blank")
              }
            >
              {translations.tutorial.tutorialcompleted.button4}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinishedTutorial;
