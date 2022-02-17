import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu, MenuItem, Badge, ClickAwayListener } from "@mui/material";

//material-ui
import MenuIcon from "@mui/icons-material/Menu";

import axios from "axios";

import logo from "../img/logo.svg";
import longLogo from "../img/connect-text.svg";

import Translations from "../translations/translations.json";

import {
  Add,
  QuestionAnswerRounded,
  FilterNoneRounded,
  TranslateSharp,
  NotificationsSharp,
} from "@mui/icons-material";

import NotificationBox from "./NotificationBox";

import { useQuery, gql } from "@apollo/client";

import { useReactPWAInstall } from "react-pwa-install";

import config from "../config.json";

const GET_NOTIFICATION_LENGTH = gql`
  query notificationNumber($userId: ID!) {
    notificationNumber(userId: $userId)
  }
`;

function Nav({ isLoggedIn, customerId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [anchorEl3, setAnchorEl3] = useState(null);

  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const [currentUsername, setCurrentUsername] = useState(null);

  const [language, setLanguage] = useState("english");

  const [notificationBoxIsOpen, setNotificationBoxIsOpen] = useState(false);

  const { loading, error, data } = useQuery(GET_NOTIFICATION_LENGTH, {
    variables: {
      userId: JSON.parse(localStorage.getItem("user"))
        ? JSON.parse(localStorage.getItem("user")).profileObj.googleId
        : null,
    },
  });

  const { pwaInstall } = useReactPWAInstall();

  const navStyle = {
    color: "white",
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user")) === null) return;
    setCurrentUsername(
      JSON.parse(localStorage.getItem("user")).profileObj.name
    );
    if (userLanguage != null) {
      setLanguage(userLanguage);
    } else {
      setLanguage("english");
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleClose3 = () => {
    setAnchorEl3(null);
  };

  const openCustomerPortal = async () => {
    if (customerId == undefined) {
      toast.info(Translations[userLanguage].alerts.buyplanseeinfo);
      return;
    }
    setAnchorEl(null);

    const res = await axios.post(
      `${config["api-server"]}/create-customer-portal-session`,
      { customerId: customerId }
    );

    const { redirectUrl } = res.data;
    console.log(redirectUrl);

    window.location = redirectUrl;

    if (res.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(res.error.message);
    } else {
      //
    }
  };

  const handlePWAClick = () => {
    pwaInstall({
      title: "Install CONNECT!",
      logo: longLogo,

      description: "Take learning to the next level.",
    }).then(() => toast.success("App installed successfully !"));
  };

  const logOut = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const selectedColors = {
    backgroundColor: "#3f51b5",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
    margin: "2px",
  };
  const regularColors = { backgroundColor: "white", color: "black" };

  const handleSetLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("connectLanguage", lang);
    window.location.reload();
  };

  const handleNotificationClose = () => {
    setNotificationBoxIsOpen(false);
  };

  return (
    <nav>
      <ul>
        {isLoggedIn ? (
          <img
            src={JSON.parse(localStorage.getItem("user")).profileObj.imageUrl}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            alt="profile-pic"
            style={{
              borderRadius: "100px",
              marginLeft: "-20px",
              margin: "5px",
            }}
            className="liright"
            height="40px"
            width="40px"
            id="profilePic"
          ></img>
        ) : null}
        {isLoggedIn ? (
          <>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              style={{
                width: "150px",
                marginTop: "30px",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              <MenuItem
                style={{
                  borderBottom: "1px solid grey",
                  width: "150px",
                  justifyContent: "center",
                }}
                onClick={handleClose}
              >
                {Translations[userLanguage].nav.profile.head}
                <br></br> {currentUsername}
              </MenuItem>
              <MenuItem onClick={() => (window.location = "/profile")}>
                {Translations[userLanguage].nav.profile.account}
              </MenuItem>
              <MenuItem onClick={openCustomerPortal}>
                {Translations[userLanguage].nav.profile.subscription}
              </MenuItem>
              <MenuItem onClick={handlePWAClick}>Install App</MenuItem>
              <MenuItem
                style={{
                  backgroundColor: "rgb(220, 0, 78)",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
                onClick={logOut}
              >
                {Translations[userLanguage].nav.profile.logout}
              </MenuItem>
            </Menu>
            <Add
              style={{
                color: "white",
                width: "30px",
                height: "30px",
                marginTop: "10px",
                marginLeft: "10px",
              }}
              className="liright nav-links"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick2}
            />
            <Menu
              id="simple-menu2"
              anchorEl={anchorEl2}
              keepMounted
              open={Boolean(anchorEl2)}
              onClose={handleClose2}
              style={{
                width: "150px",
                marginTop: "30px",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              <MenuItem
                onClick={() => {
                  window.location = "/newquiz";
                }}
              >
                <QuestionAnswerRounded
                  style={{ marginRight: "10px" }}
                  color="primary"
                />{" "}
                {Translations[userLanguage].nav.add.normal}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  window.location = "/new-multi-quiz";
                }}
              >
                <FilterNoneRounded
                  style={{ marginRight: "10px" }}
                  color="primary"
                />{" "}
                {Translations[userLanguage].nav.add.multi}
              </MenuItem>
            </Menu>
            <TranslateSharp
              style={{
                color: "white",
                width: "30px",
                height: "30px",
                marginTop: "10px",
                marginLeft: "10px",
              }}
              className="liright nav-links"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick3}
            />
            <Menu
              id="simple-menu3"
              anchorEl={anchorEl3}
              keepMounted
              open={Boolean(anchorEl3)}
              onClose={handleClose3}
              style={{
                width: "150px",
                marginTop: "30px",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              <MenuItem
                style={language === "english" ? selectedColors : regularColors}
                onClick={() => {
                  handleSetLanguage("english");
                }}
              >
                English
              </MenuItem>

              <MenuItem
                style={language === "french" ? selectedColors : regularColors}
                onClick={() => {
                  handleSetLanguage("french");
                }}
              >
                Français
              </MenuItem>
            </Menu>
            <div className="liright">
              <Badge
                badgeContent={loading ? 0 : data ? data.notificationNumber : 0}
                color="primary"
                style={{ color: "#1BB978" }}
              >
                <NotificationsSharp
                  style={{
                    color: "white",
                    width: "30px",
                    height: "30px",
                    marginTop: "10px",
                  }}
                  className="liright"
                  onClick={() => {
                    setNotificationBoxIsOpen(
                      (notificationBoxIsOpen) => !notificationBoxIsOpen
                    );
                  }}
                />
              </Badge>
              <div
                style={
                  notificationBoxIsOpen
                    ? {
                        display: "flex",
                        flexDirection: "column",
                        padding: "10px",
                        width: "350px",
                        position: "absolute",
                        top: "50px",
                        marginLeft: "-190px",
                      }
                    : null
                }
              >
                {notificationBoxIsOpen && (
                  <NotificationBox close={handleNotificationClose} />
                )}
              </div>
            </div>
          </>
        ) : null}
        {isLoggedIn ? null : (
          <Link to="/login">
            <li className="liright nav-links">
              {Translations[userLanguage].nav.login}
            </li>
          </Link>
        )}
        <img
          id="home"
          onClick={() => {
            window.location = "/";
          }}
          className="nav-links lileft"
          alt="connect-logo"
          width={46}
          height={46}
          src={logo}
          style={{
            marginLeft: "5px",
            marginTop: "1px",
          }}
        />
        <Link to="/play">
          <li className="nav-links lileft" style={{ color: "white" }}>
            {Translations[userLanguage].nav.play}
          </li>
        </Link>
        <div className="dropdown lileft nav-links">
          <button className="dropbtn">
            <MenuIcon />
          </button>
          <div className="dropdown-content">
            <a href="/play">{Translations[userLanguage].nav.dropdown.play}</a>
            <a href="/browsequizzes">
              {Translations[userLanguage].nav.dropdown.quizzes}
            </a>
            <a href="/plans">{Translations[userLanguage].nav.dropdown.plans}</a>
            <a href="/login">{Translations[userLanguage].nav.dropdown.login}</a>
          </div>
        </div>
        <Link style={navStyle} to="/browsequizzes/normal">
          <li className="nav-links lileft">
            {Translations[userLanguage].nav.quizzes}
          </li>
        </Link>
        <Link style={navStyle} to="/plans">
          <li className="nav-links lileft">
            {Translations[userLanguage].nav.plans}
          </li>
        </Link>
      </ul>
    </nav>
  );
}

export default Nav;
