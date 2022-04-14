import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import { Typography } from "@mui/material";
import Spline from "@splinetool/react-spline";
import { useLocation } from "react-router-dom";

//style
import "../../style/loginStyles.css";
import Translations from "../../translations/translations.json";
import { useMutation, gql } from "@apollo/client";
import axios from "axios";

import config from "../../config.json";

//role imgs
import teacher from "../../img/Login/teacher_role.svg";
import student from "../../img/Login/student_role.svg";

//mutations
const CREATE_USER = gql`
  mutation createUser(
    $id: ID!
    $name: String!
    $email: String!
    $imageUrl: String!
    $plan: String!
    $role: String!
  ) {
    createUser(
      id: $id
      name: $name
      email: $email
      imageUrl: $imageUrl
      plan: $plan
      role: $role
    )
  }
`;

function Login() {
  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );
  const [createUser] = useMutation(CREATE_USER);

  const search = useLocation().search;

  const Gamecode = new URLSearchParams(search).get("code");
  const Secret = new URLSearchParams(search).get("secret");
  const EmoteId = new URLSearchParams(search).get("emoteId");

  const [step, setStep] = useState(0);

  const [userObj, setUserObj] = useState({});

  const responseGoogle = async (response) => {
    try {
      const res = await axios.post(`${config["api-server"]}/user`, {
        userId: response.profileObj.googleId,
      });
      if (res.data) {
        if (Gamecode) {
          localStorage.setItem("user", JSON.stringify(response));
          window.location.reload();
          window.location = `/play?code=${Gamecode}`;
        } else if (Secret && EmoteId) {
          localStorage.setItem("user", JSON.stringify(response));
          window.location.reload();
          window.location = `/claim-emote?secret=${Secret}&emoteId=${EmoteId}`;
        } else {
          localStorage.setItem("user", JSON.stringify(response));
          window.location.reload();
          window.location = "/play";
        }
      } else {
        setStep(1);
        setUserObj(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRole = (role, response) => {
    createUser({
      variables: {
        name: response.profileObj.name,
        email: response.profileObj.email,
        id: response.profileObj.googleId,
        imageUrl: response.profileObj.imageUrl,
        plan: "Starter",
        role: role,
      },
    });
    if (Gamecode) {
      localStorage.setItem("user", JSON.stringify(response));
      window.location.reload();
      window.location = `/play?code=${Gamecode}`;
    } else if (Secret && EmoteId) {
      localStorage.setItem("user", JSON.stringify(response));
      window.location.reload();
      window.location = `/claim-emote?secret=${Secret}&emoteId=${EmoteId}`;
    } else {
      localStorage.setItem("user", JSON.stringify(response));
      window.location.reload();
      window.location = "/play";
    }
  };

  return (
    <div className="login-main-container">
      {step === 0 && (
        <div className="login-component-container">
          <br></br>
          <Typography variant="h3" className="login-title">
            <b style={{ color: "#6C63FF" }}>
              {Translations[userLanguage].login.title}
            </b>
          </Typography>
          <br></br>
          <br></br>
          <Typography variant="h6" className="login-title">
            <b style={{ fontStyle: "italic" }}>
              {Translations[userLanguage].login.title2}
            </b>
          </Typography>
          <br></br>
          <div
            style={{ width: "250px", height: "250px", marginBottom: "40px" }}
          >
            <Spline scene="https://draft.spline.design/x-auyQbM97sLc0dD/scene.spline" />
          </div>
          <GoogleLogin
            clientId="701696427912-ajmlkcj3hpo46q5fokhtn5mmeib0m3be.apps.googleusercontent.com"
            buttonText={Translations[userLanguage].login.googlebutton}
            onSuccess={responseGoogle}
            onFailure={() => {
              console.log(Error);
            }}
            cookiePolicy={"single_host_origin"}
            style={{ backgroundColor: "#e0e0e0" }}
            className="google-login-button"
            type="large"
          />
        </div>
      )}
      {step === 1 && (
        <div className="login-component-container-blank">
          <Typography
            variant="h3"
            className="login-title"
            style={{ color: "white" }}
          >
            <b>{Translations[userLanguage].login.role.title}</b>
          </Typography>
          <div style={{ width: "100%", height: "100px" }} />
          <div className="role__img__wrapper">
            <div className="role__img__card">
              <Typography variant="h4" className="login-title">
                <b>{Translations[userLanguage].login.role.teacher}</b>
              </Typography>
              <img
                src={teacher}
                alt="teacher"
                className="login-role-img"
                onClick={() => {
                  handleRole("teacher", userObj);
                }}
              />
            </div>
            <div className="role__img__card">
              <Typography variant="h4" className="login-title">
                <b>{Translations[userLanguage].login.role.student}</b>
              </Typography>
              <img
                src={student}
                alt="student"
                className="login-role-img"
                onClick={() => {
                  handleRole("student", userObj);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
