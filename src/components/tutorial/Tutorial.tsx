//@ts-nocheck
import { useState, useEffect } from "react";
import Stepper from "./Stepper";
import HostExample from "../../img/Tutorial/HostExample.svg";
import JoinRoom from "./JoinRoom";
import WaitingRoom from "./WaitingRoom";
import { Button, Typography } from "@mui/material";
import Game from "./Game";
import FinishedTutorial from "./FinishedTutorial";
import useTranslations from "../../hooks/useTranslations";
const Tutorial = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState("");
  const [modal, setModal] = useState(true);
  const translations = useTranslations();
  useEffect(() => {
    document.getElementById("main-nav").remove();
  }, []);
  const JoinSection = () => {
    return (
      <div>
        <JoinRoom nextStep={() => setActiveStep(1)} setUser={setUser} />
      </div>
    );
  };
  const WaitingRoomSection = () => {
    return (
      <div>
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
          zIndex: 9999
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
            alignItems: "center"
          }}
        >
          <Typography variant="h4">
            <b>{translations.tutorial.welcome.title}</b>
          </Typography>
          <br />
          <Typography variant="subtitle1" style={{ maxWidth: "450px" }}>
            {translations.tutorial.welcome.sub}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{
              marginTop: "20px",
              width: "100%"
            }}
            onClick={() => setModal(false)}
          >
            {translations.tutorial.welcome.button}
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
        width: "100%"
      }}
    >
      {modal && <WelcomeModal />}
      <Typography variant="h2" color="white">
        <b>{translations.tutorial.title}</b>
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
