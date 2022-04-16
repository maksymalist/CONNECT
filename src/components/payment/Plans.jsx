import React, { useEffect, useState } from "react";
import TeacherImg from "../../img/teacher_sub.svg";
import StarterImg from "../../img/starter_sub.svg";
import EntrepriseImg from "../../img/entreprise_sub.svg";

import { toast } from "react-toastify";

import { Button, Typography, Chip, Divider } from "@mui/material";

import { CheckRounded } from "@mui/icons-material";
import Translations from "../../translations/translations.json";

import { useSelector } from "react-redux";
import getUser from "../../hooks/getUser";

import banner from "../../img/plansBanner.svg";
import Wave from "../../img/WhiteBigStripe.svg";

export default function Plans() {
  const user = getUser();
  const plan = useSelector((state) => state.plan);
  // eslint-disable-next-line
  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const selectClassroomPlan = () => {
    if (plan == "Starter") {
      window.location = `/subscription/classroom`;
    } else {
      toast.info(Translations[userLanguage].alerts.alreadyhaveplan);
    }
  };
  useEffect(() => {
    if (user == null) return;
    document.getElementById("root").style.padding = "0px";

    return () => {
      document.getElementById("root").style.padding = "10px";
    };
  }, []);

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "auto",
          minHeight: "350px",
          display: "flex",
          backgroundColor: "white",
          padding: "10px",
          justifyContent: "space-evenly",
        }}
      >
        <div>
          <div>
            <Typography
              variant="h3"
              style={{
                marginBottom: "20px",
                marginTop: "50px",
                fontWeight: "bold",
                textAlign: "left",
                maxWidth: "600px",
              }}
            >
              <Typography
                variant="h3"
                style={{
                  fontWeight: "bold",
                  color: "#6c63ff",
                  marginBottom: "15px",
                }}
              >
                {Translations[userLanguage].plans.title1}
              </Typography>
              {Translations[userLanguage].plans.title2}
            </Typography>
          </div>
          <div></div>
        </div>
        <div>
          <img
            src={banner}
            alt="banner"
            style={{
              maxWidth: "400px",
              maxHeight: "400px",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
      <img
        src={Wave}
        alt="wave"
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      <div className="planDiv">
        <div id="plan1">
          <Typography
            variant="h3"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            <b>{Translations[userLanguage].plans.starter.title}</b>
          </Typography>
          <Divider />
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <img
              alt="starter-img"
              height="220px"
              width="220px"
              src={StarterImg}
            />
          </div>
          <Typography variant="h5" color="#4F5251">
            {Translations[userLanguage].plans.starter.at} <br></br>{" "}
            <span style={{ color: "#6c63ff", fontSize: "1.8em" }}>
              {Translations[userLanguage].plans.starter.price}
            </span>
            <br></br>
            {Translations[userLanguage].plans.starter.permonth}
          </Typography>
          <br></br>
          <Typography variant="sub1" color="#4F5251">
            {Translations[userLanguage].plans.starter.sub}
          </Typography>
          <br></br>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "30px",
            }}
          >
            <Button
              className="sub-button"
              style={{ paddingLeft: "35px", paddingRight: "35px" }}
              variant={plan == "Starter" ? "outlined" : "contained"}
              color="action"
              size="large"
              onClick={() => {
                plan == "Starter"
                  ? toast.info(
                      Translations[userLanguage].alerts.alreadyhaveplan
                    )
                  : toast.info(Translations[userLanguage].alerts.betterplan);
              }}
            >
              {plan === "Starter"
                ? Translations[userLanguage].plans.classroom.buttonsubscribed
                : Translations[userLanguage].plans.classroom.button}
            </Button>
          </div>
          <div>
            <Typography variant="subtitle1" className="features">
              {"✅ "}
              {Translations[userLanguage].plans.starter.features.feature1}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {"✅ "}
              {Translations[userLanguage].plans.starter.features.feature2}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {"✅ "}
              {Translations[userLanguage].plans.starter.features.feature3}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {"✅ "}
              {Translations[userLanguage].plans.starter.features.feature4}
            </Typography>
          </div>
        </div>
        <div>
          <div id="plan2">
            <div
              style={{
                width: "fit-content",
                backgroundColor: "#1bb978",
                padding: "10px",
                marginTop: "-50px",
                borderRadius: "50px",
                marginLeft: "55px",
              }}
            >
              <Typography variant="h6" style={{ color: "white" }}>
                {Translations[userLanguage].plans.classroom.bestvalue}
              </Typography>
            </div>
            <Typography
              variant="h3"
              style={{ marginTop: "20px", marginBottom: "20px" }}
            >
              <b>{Translations[userLanguage].plans.classroom.title}</b>
            </Typography>
            <Divider />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <img
                alt="classroom-img"
                height="220px"
                width="220px"
                src={TeacherImg}
              />
            </div>
            <Typography variant="h5" color="#4F5251">
              {Translations[userLanguage].plans.classroom.at} <br></br>{" "}
              <span style={{ color: "#6c63ff", fontSize: "1.8em" }}>
                {Translations[userLanguage].plans.classroom.price}
              </span>
              <br></br>
              {Translations[userLanguage].plans.classroom.permonth}
            </Typography>
            <br></br>
            <Typography variant="sub1" color="#4F5251">
              {Translations[userLanguage].plans.classroom.sub}
            </Typography>
            <br></br>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "30px",
              }}
            >
              <Button
                id="Classroom"
                className="sub-button"
                style={{ paddingLeft: "35px", paddingRight: "35px" }}
                variant={plan === "Classroom" ? "outlined" : "contained"}
                color="action"
                size="large"
                onClick={() => selectClassroomPlan()}
              >
                {plan === "Classroom"
                  ? Translations[userLanguage].plans.classroom.buttonsubscribed
                  : Translations[userLanguage].plans.classroom.button}
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "start",
              }}
            >
              <Typography variant="subtitle1" className="features">
                {"✅ "}
                {Translations[userLanguage].plans.classroom.features.feature1}
              </Typography>
              <Typography variant="subtitle1" className="features">
                {"✅ "}
                {Translations[userLanguage].plans.classroom.features.feature2}
              </Typography>
              <Typography variant="subtitle1" className="features">
                {"✅ "}
                {Translations[userLanguage].plans.classroom.features.feature3}
              </Typography>
              <Typography variant="subtitle1" className="features">
                {"✅ "}
                {Translations[userLanguage].plans.classroom.features.feature4}
              </Typography>
              <Typography variant="subtitle1" className="features">
                {"✅ "}
                {Translations[userLanguage].plans.classroom.features.feature5}
              </Typography>
              <Typography variant="subtitle1" className="features">
                {"✅ "}
                {Translations[userLanguage].plans.classroom.features.feature6}
              </Typography>
              <Typography variant="subtitle1" className="features">
                {"✅ "}
                {Translations[userLanguage].plans.classroom.features.feature7}
              </Typography>
            </div>
          </div>
        </div>
        <div id="plan3">
          <Typography
            variant="h3"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            <b>{Translations[userLanguage].plans.entreprise.title}</b>
          </Typography>
          <Divider />
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <img
              alt="entreprise-img"
              height="220px"
              width="220px"
              src={EntrepriseImg}
            />
          </div>

          <Typography variant="h5" color="#4F5251">
            {Translations[userLanguage].plans.entreprise.at} <br></br>{" "}
            <span style={{ color: "#6c63ff", fontSize: "1.8em" }}>
              {Translations[userLanguage].plans.entreprise.price}
            </span>
            <br></br>
            {Translations[userLanguage].plans.entreprise.permonth}
          </Typography>
          <br></br>

          <Typography variant="sub1" color="#4F5251">
            {Translations[userLanguage].plans.entreprise.sub}
          </Typography>
          <br></br>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "30px",
            }}
          >
            <Button
              className="sub-button"
              style={{ paddingLeft: "35px", paddingRight: "35px" }}
              variant={plan === "Entreprise" ? "outlined" : "contained"}
              color="action"
              size="large"
            >
              {plan === "Entreprise"
                ? Translations[userLanguage].plans.entreprise.buttonsubscribed
                : Translations[userLanguage].plans.entreprise.button}
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "start",
            }}
          >
            <Typography variant="subtitle1" className="features">
              {"✅ "}
              {Translations[userLanguage].plans.entreprise.features.feature1}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {"✅ "}
              {Translations[userLanguage].plans.entreprise.features.feature2}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {"✅ "}
              {Translations[userLanguage].plans.entreprise.features.feature3}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {"✅ "}
              {Translations[userLanguage].plans.entreprise.features.feature4}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {"✅ "}
              {Translations[userLanguage].plans.entreprise.features.feature5}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {"✅ "}
              {Translations[userLanguage].plans.entreprise.features.feature6}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {"✅ "}
              {Translations[userLanguage].plans.entreprise.features.feature7}
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
}
