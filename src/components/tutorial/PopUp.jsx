import { useState, useEffect } from "react";
import { Typography, Button, Divider } from "@mui/material";
import Translations from "../../translations/translations.json";

const PopUp = ({ startGame }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selected, setSelected] = useState([]);

  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  useEffect(() => {
    if (selected.length <= 0) return;

    if (selected.length === 2) {
      for (let i = 0; i < selected.length; i++) {
        const count = selected.filter((item) => item == selected[i]).length;

        if (count === 2) {
          setSelected([]);
          return;
        }

        if (activeStep === 2) {
          setActiveStep(3);
          setSelected([]);
          return;
        }

        if (activeStep === 3) {
          startGame();
          return;
        }
      }
    }
  }, [selected]);

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
          padding: "15px",
          margin: "15px",
          boxShadow: "10px 10px 0 #262626",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {activeStep === 0 && (
          <div>
            <Typography variant="h4">
              {Translations[userLanguage].tutorial.popup.step1.title}
            </Typography>
            <br></br>
            <Divider />
            <br></br>
            <div
              style={{
                padding: "5px",
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <div
                className="card quest-card"
                style={{ width: "200px", height: "200px" }}
              >
                {Translations[userLanguage].tutorial.popup.step1.card}
              </div>
            </div>
            <br></br>
            <div
              style={{
                padding: "5px",
                display: "flex",
                width: "100%",
                justifyContent: "right",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setActiveStep(1)}
              >
                {Translations[userLanguage].tutorial.popup.next}
              </Button>
            </div>
          </div>
        )}
        {activeStep === 1 && (
          <div>
            <Typography variant="h4">
              {Translations[userLanguage].tutorial.popup.step2.title}
            </Typography>
            <br></br>
            <Divider />
            <br></br>
            <div
              style={{
                padding: "5px",
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <div
                className="card ans-card"
                style={{ width: "200px", height: "200px" }}
              >
                {Translations[userLanguage].tutorial.popup.step2.card}
              </div>
            </div>
            <br></br>
            <div
              style={{
                padding: "5px",
                display: "flex",
                width: "100%",
                justifyContent: "right",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setActiveStep(2)}
              >
                {Translations[userLanguage].tutorial.popup.next}
              </Button>
            </div>
          </div>
        )}
        {activeStep === 2 && (
          <div>
            <Typography variant="h4">
              {Translations[userLanguage].tutorial.popup.step3.title}
            </Typography>
            <br></br>
            <Divider />
            <br></br>
            <div
              style={{
                padding: "5px",
                display: "flex",
                width: "100%",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                className="card quest-card"
                style={
                  selected.includes("quest-card")
                    ? {
                        width: "200px",
                        height: "200px",
                        color: "#1594DB",
                        fontWeight: "bold",
                        transform: "scale(1.05)",
                        border: "4px solid #1594DB",
                      }
                    : { width: "200px", height: "200px" }
                }
                onClick={() => {
                  setSelected([...selected, "quest-card"]);
                }}
              >
                {Translations[userLanguage].tutorial.popup.step3.card1}
              </div>
              <div
                className="card ans-card"
                style={
                  selected.includes("ans-card")
                    ? {
                        width: "200px",
                        height: "200px",
                        color: "#1594DB",
                        fontWeight: "bold",
                        transform: "scale(1.05)",
                        border: "4px solid #1594DB",
                      }
                    : { width: "200px", height: "200px" }
                }
                onClick={() => {
                  setSelected([...selected, "ans-card"]);
                }}
              >
                {Translations[userLanguage].tutorial.popup.step3.card2}
              </div>
            </div>
          </div>
        )}
        {activeStep === 3 && (
          <div>
            <Typography variant="h4">
              {Translations[userLanguage].tutorial.popup.step4.title}
            </Typography>
            <br></br>
            <Typography variant="sub1">
              <i>{Translations[userLanguage].tutorial.popup.step4.sub}</i>
            </Typography>
            <br></br>
            <Divider />
            <br></br>
            <div
              style={{
                padding: "5px",
                display: "flex",
                width: "100%",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                className="card quest-card"
                style={
                  selected.includes("quest-card")
                    ? {
                        width: "200px",
                        height: "200px",
                        color: "#1594DB",
                        fontWeight: "bold",
                        transform: "scale(1.05)",
                        border: "4px solid #1594DB",
                      }
                    : { width: "200px", height: "200px" }
                }
                onClick={() => {
                  setSelected([...selected, "quest-card"]);
                }}
              >
                <div style={{ maxWidth: "50px" }}>1+1</div>
              </div>
              <div
                className="card ans-card"
                style={
                  selected.includes("ans-card")
                    ? {
                        width: "200px",
                        height: "200px",
                        color: "#1594DB",
                        fontWeight: "bold",
                        transform: "scale(1.05)",
                        border: "4px solid #1594DB",
                      }
                    : { width: "200px", height: "200px" }
                }
                onClick={() => {
                  setSelected([...selected, "ans-card"]);
                }}
              >
                <div style={{ maxWidth: "50px" }}>3</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopUp;
