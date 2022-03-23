import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import { Typography } from "@mui/material";
import Spline from "@splinetool/react-spline";
import { useLocation } from "react-router-dom";

//style
import "../../style/loginStyles.css";

//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

//imgs
import logo from "../../img/logo-filled.svg";

import Translations from "../../translations/translations.json";
import { useMutation, gql } from "@apollo/client";
import axios from "axios";

import config from "../../config.json";

//mutations
const CREATE_USER = gql`
  mutation createUser(
    $id: ID!
    $name: String!
    $email: String!
    $imageUrl: String!
    $plan: String
  ) {
    createUser(
      id: $id
      name: $name
      email: $email
      imageUrl: $imageUrl
      plan: $plan
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

  const responseGoogle = async (response) => {
    localStorage.setItem("user", JSON.stringify(response));
    const res = await axios.post(`${config["api-server"]}/user`, {
      userId: response.profileObj.googleId,
    });
    if (res.data) {
      if (Gamecode) {
        window.location.reload();
        window.location.href = `/play?code=${Gamecode}`;
      } else {
        window.location.reload();
        window.location.href = "/play";
      }
    } else {
      createUser({
        variables: {
          name: response.profileObj.name,
          email: response.profileObj.email,
          id: response.profileObj.googleId,
          imageUrl: response.profileObj.imageUrl,
          plan: "Starter",
        },
      });
      window.location.reload();
      window.location.href = "/play";
    }
  };
  return (
    <div className="login-main-container">
      <div className="login-component-container">
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
      </div>
    </div>
  );
}

export default Login;
