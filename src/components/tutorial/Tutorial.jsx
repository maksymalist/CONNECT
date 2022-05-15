import { useState, useEffect } from "react";
import Stepper from "./Stepper";

import HostExample from "../../img/Tutorial/HostExample.svg";
import JoinRoom from "./JoinRoom";
import WaitingRoom from "./WaitingRoom";
import { Button, Typography } from "@mui/material";
import Game from "./Game";
import FinishedTutorial from "./FinishedTutorial";

import Translations from "../../translations/translations.json";

const Tutorial = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState("");

  const [modal, setModal] = useState(true);
  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  useEffect(() => {
    document.getElementById("main-nav").remove();
  }, []);

  const JoinSection = () => {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <img
            src={HostExample}
            alt="Host Example"
            style={{
              height: "100%",
              width: "100%",
              maxWidth: "500px",
              margin: "20px",
            }}
          />
        </div>
        <div>
          <JoinRoom nextStep={() => setActiveStep(1)} setUser={setUser} />
        </div>
      </div>
    );
  };

  const WaitingRoomSection = () => {
    return (
      <div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "right",
            marginBottom: "10px",
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => setActiveStep(2)}
          >
            {Translations[userLanguage].tutorial.waitingroom.button}
          </Button>
        </div>
        <WaitingRoom nextStep={() => setActiveStep(2)} user={user} />
      </div>
    );
  };

  const WelcomeModal = () => {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            border: "2px solid black",
            borderRadius: "5px",
            padding: "25px",
            margin: "15px",
            boxShadow: "10px 10px 0 #262626",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">
            <b>{Translations[userLanguage].tutorial.welcome.title}</b>
          </Typography>
          <br></br>
          <Typography variant="subtitle1" style={{ maxWidth: "450px" }}>
            {Translations[userLanguage].tutorial.welcome.sub}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{
              marginTop: "20px",
              width: "100%",
            }}
            onClick={() => setModal(false)}
          >
            {Translations[userLanguage].tutorial.welcome.button}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        marginTop: "120px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {modal && <WelcomeModal />}
      <Typography variant="h2" color="white">
        <b>{Translations[userLanguage].tutorial.title}</b>
      </Typography>
      <Stepper activeStep={activeStep} />
      {activeStep === 0 && <JoinSection />}
      {activeStep === 1 && <WaitingRoomSection />}
      {activeStep === 2 && (
        <Game
          nickname={user}
          nextSection={() => {
            setActiveStep(3);
          }}
        />
      )}
      {activeStep === 3 && <FinishedTutorial />}
    </div>
  );
};

export default Tutorial;
