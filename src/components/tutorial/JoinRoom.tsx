//@ts-nocheck
import { useState } from "react";
import { Typography, Button, CircularProgress } from "@mui/material";
import HostExample from "../../img/Tutorial/HostExample.svg";
import { toast } from "react-toastify";
import useTranslations from "../../hooks/useTranslations";
const JoinRoom = ({ nextStep, setUser }) => {
  const [joinFormStep, setJoinFormStep] = useState(0);
  const translations = useTranslations();
  const [joinFormCode, setJoinFormCode] = useState("");
  const [joinFormNickname, setJoinFormNickname] = useState("");
  const [spinner1, setSpinner1] = useState(false);
  const [spinner2, setSpinner2] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {joinFormStep === 0 && (
        <div>
          <img
            src={HostExample}
            alt="Host Example"
            style={{
              height: "100%",
              width: "100%",
              maxWidth: "500px",
              margin: "20px"
            }}
          />
        </div>
      )}
      <div>
        <div
          style={{
            opacity: "1",
            backgroundColor: "white",
            borderRadius: "5px",
            marginBottom: "5px"
          }}
        >
          {joinFormStep === 0 && (
            <Typography sx={{ p: 2 }}>{translations.play.join.tip}</Typography>
          )}
          {joinFormStep === 1 && (
            <Typography sx={{ p: 2 }}>{translations.play.join.tip2}</Typography>
          )}
        </div>
        <div
          style={{
            height: "auto",
            backgroundColor: "white",
            minWidth: "250px",
            boxShadow: "10px 10px 0 #262626",
            zIndex: 1,
            border: "2px solid black",
            padding: "15px",
            width: "100vw",
            maxWidth: "450px"
          }}
        >
          <Typography variant="h3" style={{ margin: "30px" }}>
            <b>{translations.play.join.title}</b>
          </Typography>
          {joinFormStep === 0 && (
            <>
              <input
                value={joinFormCode}
                onChange={event => setJoinFormCode(event.target.value)}
                style={{ width: "100%", height: "48px" }}
                placeholder={translations.play.join.input}
                type="text"
                id="code"
              />
              <br />
              <Button
                style={{
                  marginTop: "1vh",
                  width: "100%",
                  fontSize: "1.2rem",
                  height: "48px"
                }}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  if (joinFormCode !== "123-456") {
                    toast.info(
                      <div>
                        <Typography variant="h5">
                          <b>{translations.alerts.hint.title}</b>
                        </Typography>
                        <Typography variant="h6">
                          {translations.alerts.hint.text}
                        </Typography>
                      </div>
                    );
                    return;
                  }
                  setJoinFormStep(1);
                }}
              >
                {translations.play.join.button}
              </Button>
            </>
          )}
          {joinFormStep === 1 && (
            <>
              <input
                value={joinFormNickname}
                onChange={event => setJoinFormNickname(event.target.value)}
                style={{ width: "100%", height: "48px" }}
                placeholder={translations.play.join.input2}
                type="text"
                id="name"
              />
              <br />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Button
                  style={{
                    fontSize: "1.2rem",
                    height: "48px",
                    width: "100%",
                    margin: "10px"
                  }}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    nextStep();
                    setUser(joinFormNickname);
                  }}
                >
                  {spinner1 ? (
                    <CircularProgress size={24} style={{ color: "white" }} />
                  ) : (
                    translations.play.join.button2
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default JoinRoom;
