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
          window.location.href = `/play?code=${Gamecode}`;
        } else {
          localStorage.setItem("user", JSON.stringify(response));
          window.location.reload();
          window.location.href = "/play";
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
    localStorage.setItem("user", JSON.stringify(response));
    window.location.reload();
    window.location.href = "/play";
  };

  return (
    <div className="login-main-container">
      <div className="login-component-container">
        {step === 0 && (
          <>
            <div style={{ width: "250px", height: "250px" }}>
              <Spline scene="https://draft.spline.design/x-auyQbM97sLc0dD/scene.spline" />
            </div>
            <br></br>
            <Typography variant="h4" className="login-title">
              <b>{Translations[userLanguage].login.title}</b>
            </Typography>
            <br></br>
            <GoogleLogin
              clientId="701696427912-ajmlkcj3hpo46q5fokhtn5mmeib0m3be.apps.googleusercontent.com"
              buttonText={Translations[userLanguage].login.googlebutton}
              onSuccess={responseGoogle}
              onFailure={() => {
                console.log(Error);
              }}
              cookiePolicy={"single_host_origin"}
              style={{ backgroundColor: "#e0e0e0" }}
            />
          </>
        )}
        {step === 1 && (
          <div>
            <Typography variant="h3" className="login-title">
              <b>Select your role 👩‍🏫/🧑‍🎓</b>
            </Typography>
            <br></br>
            <div className="role__img__wrapper">
              <div className="role__img__card">
                <Typography variant="h4" className="login-title">
                  <b>Teacher</b>
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
                  <b>Student</b>
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
    </div>
  );
}

export default Login;
