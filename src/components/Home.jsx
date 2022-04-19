import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";

import HomePageImage from "../img/HomePageImg.svg";

import HIW_IMG_1 from "../img/HIW_Image_1.svg";
import HIW_IMG_2 from "../img/HIW_Image_2.svg";
import HIW_IMG_3 from "../img/HIW_Image_3.svg";

import Connected from "../img/connected.svg";
import Teacher from "../img/teacher.svg";
import Books from "../img/books.svg";

import Translations from "../translations/translations.json";

import "../style/home.css";

import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Divider,
} from "@mui/material";

//hooks
import getUser from "../hooks/getUser";

export default function HomePage() {
  const user = getUser();

  useEffect(() => {
    if (user == null) window.location = "/login";
    document.getElementById("root").style.padding = "0px";
    return () => {
      document.getElementById("root").style.padding = "10px";
    };
  }, []);

  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const [hostActiveStep, setHostActiveStep] = useState(0);
  const [joinActiveStep, setJoinActiveStep] = useState(0);
  const [playActiveStep, setPlayActiveStep] = useState(0);

  return (
    <>
      <div>
        <div className="home-page-section-1">
          <div className="home-page-section-1-content">
            <div className="home-page-section-1-content-top">
              <div className="home-page-section-1-content-top-text">
                <Typography variant="h2" className="gradient-text">
                  {Translations[userLanguage].home.sub1}
                </Typography>
              </div>
              <div className="home-page-section-1-content-top-text-2">
                <Typography variant="h3" className="black-text">
                  {Translations[userLanguage].home.sub2}
                </Typography>
              </div>
              <div className="home-page-section-1-content-top-button-container">
                <Button
                  variant="contained"
                  style={{ marginRight: "10px" }}
                  color="primary"
                  className="home-page-section-1-content-top-button"
                  onClick={() => {
                    window.location = "/play";
                  }}
                >
                  {Translations[userLanguage].home.buttonText}
                </Button>
                <Button
                  variant="outlined"
                  color="action"
                  className="home-page-section-1-content-top-button"
                  onClick={() => {
                    window.location = "/plans";
                  }}
                >
                  {Translations[userLanguage].home.buttonText2}
                </Button>
              </div>
            </div>
            <div className="home-page-section-1-content-bottom">
              <Spline scene="https://draft.spline.design/MFlI6uokYUIVuqtN/scene.spline" />
            </div>
          </div>
        </div>
        <div className="home-page-section-2">
          <div className="home-page-section-2-content">
            <div className="home-page-section-2-header">
              <Typography
                variant="h3"
                className="white-text home-page-section-2-header-text"
              >
                {Translations[userLanguage].home.about.title}
              </Typography>
              <div className="home-page-section-2-header-line" />
            </div>
            <div className="home-page-section-2-content-cards">
              <div className="home-page-section-2-content-card">
                <img
                  src={Connected}
                  className="home-page-section-2-content-card-image"
                />
                <Typography
                  variant="h6"
                  className="white-text home-page-section-2-content-card-text"
                >
                  {Translations[userLanguage].home.about.sub}
                </Typography>
              </div>
              <div className="home-page-section-2-content-card">
                <img
                  src={Teacher}
                  className="home-page-section-2-content-card-image"
                />
                <Typography
                  variant="h6"
                  className="white-text home-page-section-2-content-card-text"
                >
                  {Translations[userLanguage].home.about.sub2}
                </Typography>
              </div>
              <div className="home-page-section-2-content-card">
                <img
                  src={Books}
                  className="home-page-section-2-content-card-image"
                />
                <Typography
                  variant="h6"
                  className="white-text home-page-section-2-content-card-text"
                >
                  {Translations[userLanguage].home.about.sub3}
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="home-page-section-3">
          <div className="home-page-section-3-content">
            <div className="home-page-section-3-header">
              <Typography
                variant="h3"
                className="black-text home-page-section-3-header-text"
              >
                {Translations[userLanguage].home.howitworks.title}
              </Typography>
              <div className="home-page-section-3-header-line" />
            </div>
          </div>
          <div className="home-page-section-3-card-wrapper">
            <div className="home-page-section-3-card-wrapper-section">
              <div className="home-page-section-3-card-wrapper-section-card">
                <div className="home-page-section-3-card-wrapper-section-card-header">
                  <Typography
                    variant="h4"
                    className="black-text home-page-section-3-card-wrapper-section-card-header-text"
                  >
                    {Translations[userLanguage].home.howitworks.join.title}
                  </Typography>
                  <div className="home-page-section-3-card-wrapper-section-card-header-line" />
                </div>
                <div className="home-page-section-3-card-wrapper-section-card-content">
                  <Stepper
                    style={{
                      width: "100%",
                      maxWidth: "320px",
                      margin: "20px",
                      overflow: "hidden",
                      height: "100px",
                    }}
                    activeStep={joinActiveStep}
                  >
                    <Step>
                      <StepLabel></StepLabel>
                    </Step>
                    <Step>
                      <StepLabel></StepLabel>
                    </Step>
                    <Step>
                      <StepLabel></StepLabel>
                    </Step>
                  </Stepper>
                  {joinActiveStep === 0 && (
                    <Typography variant="h5" style={{ margin: "25px" }}>
                      {Translations[userLanguage].home.howitworks.join.step1}
                    </Typography>
                  )}
                  {joinActiveStep === 1 && (
                    <Typography variant="h5" style={{ margin: "25px" }}>
                      {Translations[userLanguage].home.howitworks.join.step2}
                    </Typography>
                  )}
                  {joinActiveStep === 2 && (
                    <Typography variant="h5" style={{ margin: "25px" }}>
                      {Translations[userLanguage].home.howitworks.join.step3}
                    </Typography>
                  )}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      style={{ margin: "10px" }}
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={
                        joinActiveStep > 0
                          ? () => {
                              setJoinActiveStep((prev) => prev - 1);
                            }
                          : null
                      }
                    >
                      {Translations[userLanguage].home.howitworks.join.back}
                    </Button>
                    <Button
                      style={{ margin: "10px" }}
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={
                        joinActiveStep < 2
                          ? () => {
                              setJoinActiveStep((prev) => prev + 1);
                            }
                          : null
                      }
                    >
                      {Translations[userLanguage].home.howitworks.join.next}
                    </Button>
                  </div>
                </div>
              </div>
              <img
                src={HIW_IMG_1}
                className="home-page-section-3-card-wrapper-section-image"
              />
            </div>
            <div className="home-page-section-3-card-wrapper-section">
              <img
                src={HIW_IMG_2}
                className="home-page-section-3-card-wrapper-section-image"
              />
              <div className="home-page-section-3-card-wrapper-section-card">
                <div className="home-page-section-3-card-wrapper-section-card-header">
                  <Typography
                    variant="h4"
                    className="black-text home-page-section-3-card-wrapper-section-card-header-text"
                  >
                    {Translations[userLanguage].home.howitworks.host.title}
                  </Typography>
                  <div className="home-page-section-3-card-wrapper-section-card-header-line" />
                </div>
                <div className="home-page-section-3-card-wrapper-section-card-content">
                  <Stepper
                    id="stepRef"
                    style={{
                      width: "100%",
                      maxWidth: "320px",
                      margin: "20px",
                      overflow: "hidden",
                      height: "100px",
                    }}
                    activeStep={hostActiveStep}
                  >
                    <Step>
                      <StepLabel></StepLabel>
                    </Step>
                    <Step>
                      <StepLabel></StepLabel>
                    </Step>
                    <Step>
                      <StepLabel></StepLabel>
                    </Step>
                    <Step>
                      <StepLabel></StepLabel>
                    </Step>
                    <Step>
                      <StepLabel></StepLabel>
                    </Step>
                    <Step>
                      <StepLabel></StepLabel>
                    </Step>
                  </Stepper>
                  {hostActiveStep === 0 && (
                    <Typography variant="h5" style={{ margin: "25px" }}>
                      {Translations[userLanguage].home.howitworks.host.step1}
                    </Typography>
                  )}
                  {hostActiveStep === 1 && (
                    <Typography variant="h5" style={{ margin: "25px" }}>
                      {Translations[userLanguage].home.howitworks.host.step2}
                    </Typography>
                  )}
                  {hostActiveStep === 2 && (
                    <Typography variant="h5" style={{ margin: "25px" }}>
                      {Translations[userLanguage].home.howitworks.host.step3}
                    </Typography>
                  )}
                  {hostActiveStep === 3 && (
                    <Typography variant="h5" style={{ margin: "25px" }}>
                      {Translations[userLanguage].home.howitworks.host.step4}
                    </Typography>
                  )}
                  {hostActiveStep === 4 && (
                    <Typography variant="h5" style={{ margin: "25px" }}>
                      {Translations[userLanguage].home.howitworks.host.step5}
                    </Typography>
                  )}
                  {hostActiveStep === 5 && (
                    <Typography variant="h5" style={{ margin: "25px" }}>
                      {Translations[userLanguage].home.howitworks.host.step6}
                    </Typography>
                  )}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      style={{ margin: "10px" }}
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={
                        hostActiveStep > 0
                          ? () => {
                              setHostActiveStep(hostActiveStep - 1);
                            }
                          : null
                      }
                    >
                      {Translations[userLanguage].home.howitworks.host.back}
                    </Button>
                    <Button
                      style={{ margin: "10px" }}
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={
                        hostActiveStep < 5
                          ? () => {
                              setHostActiveStep(hostActiveStep + 1);
                            }
                          : null
                      }
                    >
                      {Translations[userLanguage].home.howitworks.host.next}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="home-page-section-3-card-wrapper-section">
              <div className="home-page-section-3-card-wrapper-section-card">
                <div className="home-page-section-3-card-wrapper-section-card-header">
                  <Typography
                    variant="h4"
                    className="black-text home-page-section-3-card-wrapper-section-card-header-text"
                  >
                    {Translations[userLanguage].home.howitworks.play.title}
                  </Typography>
                  <div className="home-page-section-3-card-wrapper-section-card-header-line" />
                </div>
                <div className="home-page-section-3-card-wrapper-section-card-content">
                  <Stepper
                    id="stepRef"
                    style={{
                      width: "100%",
                      maxWidth: "320px",
                      margin: "20px",
                      overflow: "hidden",
                      height: "100px",
                    }}
                    activeStep={playActiveStep}
                  >
                    <Step>
                      <StepLabel></StepLabel>
                    </Step>
                    <Step>
                      <StepLabel></StepLabel>
                    </Step>
                    <Step>
                      <StepLabel></StepLabel>
                    </Step>
                  </Stepper>
                  {playActiveStep === 0 && (
                    <Typography variant="h5">
                      {Translations[userLanguage].home.howitworks.play.step1}
                    </Typography>
                  )}
                  {playActiveStep === 1 && (
                    <Typography variant="h5">
                      {Translations[userLanguage].home.howitworks.play.step2}
                    </Typography>
                  )}
                  {playActiveStep === 2 && (
                    <Typography variant="h5">
                      {Translations[userLanguage].home.howitworks.play.step3}
                    </Typography>
                  )}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      style={{ margin: "10px" }}
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={
                        playActiveStep > 0
                          ? () => {
                              setPlayActiveStep((prev) => prev - 1);
                            }
                          : null
                      }
                    >
                      {Translations[userLanguage].home.howitworks.play.back}
                    </Button>
                    <Button
                      style={{ margin: "10px" }}
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={
                        playActiveStep < 2
                          ? () => {
                              setPlayActiveStep((prev) => prev + 1);
                            }
                          : null
                      }
                    >
                      {Translations[userLanguage].home.howitworks.play.next}
                    </Button>
                  </div>
                </div>
              </div>
              <img
                src={HIW_IMG_3}
                className="home-page-section-3-card-wrapper-section-image"
              />
            </div>
          </div>
        </div>
        <footer>
          <a
            href="https://github.com/John8790909/CONNECT/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            © 2022 CONNECT! – All Rights Reserved
          </a>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSey6V_tD3Sp4YDE9Q-PY5nuMFv6s5Q7_2BPfbFDXQ2CjoTfkg/viewform?usp=sf_link"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "underline",
              color: "#6c63ff",
            }}
          >
            ✨Report Issue✨
          </a>
        </footer>
      </div>
    </>
  );
}
