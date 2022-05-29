//@ts-nocheck
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Menu,
  MenuItem,
  Badge,
  ClickAwayListener,
  useMediaQuery,
  Button,
} from "@mui/material";

//material-ui
import MenuIcon from "@mui/icons-material/Menu";

import axios from "axios";

import logo from "../../img/logo.svg";
import longLogo from "../../img/connect-text.svg";
import "../../style/nav.css";

import { Add, TranslateSharp, NotificationsSharp } from "@mui/icons-material";

import NotificationBox from "./NotificationBox";

import { useQuery, gql } from "@apollo/client";

import config from "../../config.json";
import getUser from "../../hooks/getUser";
import useTranslations from "../../hooks/useTranslations";
import useLanguage from "../../hooks/useLanguage";

const GET_NOTIFICATION_LENGTH = gql`
  query notificationNumber($userId: ID!) {
    notificationNumber(userId: $userId)
  }
`;

function Nav({ isLoggedIn, customerId }) {
  const user = getUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [anchorEl3, setAnchorEl3] = useState(null);

  const translations = useTranslations();

  const [currentUsername, setCurrentUsername] = useState(null);

  const [language, setLanguage] = useState("english");
  const defaultLanguage = useLanguage();

  const [notificationBoxIsOpen, setNotificationBoxIsOpen] = useState(false);

  const { loading, error, data } = useQuery(GET_NOTIFICATION_LENGTH, {
    variables: {
      userId: user ? user?.profileObj.googleId : null,
    },
  });

  const mediumScreen = useMediaQuery("(max-width:960px)");
  const smallScreen = useMediaQuery("(max-width:520px)");

  useEffect(() => {
    if (user === null) return;
    setCurrentUsername(user?.profileObj.name);
    setLanguage(defaultLanguage);
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
      toast.info(translations.alerts.buyplanseeinfo);
      return;
    }
    setAnchorEl(null);

    const res = await axios.post(
      `${config["api-server"]}/create-customer-portal-session`,
      { customerId: customerId }
    );

    const { redirectUrl } = res.data;

    if (redirectUrl === null) {
      toast.info(translations.alerts.buyplanseeinfo);
      return;
    }

    window.location = redirectUrl;

    if (res.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(res.error.message);
    } else {
      //
    }
  };

  const logOut = () => {
    localStorage.removeItem("user");
    window.location = "/login";
  };

  const selectedColors = {
    backgroundColor: "#6c63ff",
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
    <nav
      style={
        mediumScreen
          ? !isLoggedIn
            ? { display: "flex", justifyContent: "center" }
            : {}
          : {}
      }
      id="main-nav"
    >
      <div className="nav-left-section">
        <img
          id="home"
          onClick={() => {
            window.location = "/";
          }}
          alt="connect-logo"
          src={smallScreen ? (!isLoggedIn ? longLogo : logo) : longLogo}
          style={{
            marginLeft: mediumScreen ? "10px" : "70px",
            height: "50px",
            width: smallScreen ? (!isLoggedIn ? "auto" : "50px") : "auto",
          }}
        />
        {mediumScreen ? (
          <div className="dropdown">
            <button className="dropbtn">
              <MenuIcon />
            </button>
            <div className="dropdown-content">
              <a href="/play">{translations.nav.dropdown.play}</a>
              <a href="/quizzes">{translations.nav.dropdown.quizzes}</a>
              <a href="/plans">{translations.nav.dropdown.plans}</a>
              <a href="/login">{translations.nav.dropdown.login}</a>
            </div>
          </div>
        ) : (
          <div className="nav-left-links">
            <Link className="nav-left-link" to="/play">
              {translations.nav.play}
            </Link>
            <Link className="nav-left-link" to="/quizzes">
              {translations.nav.quizzes}
            </Link>
            <Link className="nav-left-link" to="/plans">
              {translations.nav.plans}
            </Link>
          </div>
        )}
      </div>
      <div className="nav-right-section">
        <div
          className="nav-right-icons"
          style={!isLoggedIn ? { width: "0" } : {}}
        >
          {isLoggedIn ? (
            <>
              <Add
                style={{
                  width: "30px",
                  height: "30px",
                }}
                className="nav-right-icon"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick2}
              />
              <TranslateSharp
                style={{
                  width: "30px",
                  height: "30px",
                }}
                className="nav-right-icon"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick3}
              />
              <div>
                <Badge
                  badgeContent={
                    loading ? 0 : data ? data.notificationNumber : 0
                  }
                  color="success"
                >
                  <NotificationsSharp
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                    className="nav-right-icon"
                    onClick={() => {
                      setNotificationBoxIsOpen(
                        (notificationBoxIsOpen) => !notificationBoxIsOpen
                      );
                    }}
                  />
                </Badge>
              </div>
            </>
          ) : null}
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
              ⚡️ {translations.nav.add.normal}
            </MenuItem>
            <MenuItem
              onClick={() => {
                window.location = "/new-multi-quiz";
              }}
            >
              🥳 {translations.nav.add.multi}
            </MenuItem>
          </Menu>
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
        {!isLoggedIn ? (
          !mediumScreen && (
            <Link className="nav-right-links-login" to="/login">
              <Button variant="contained" color="action">
                {translations.nav.login}
              </Button>
            </Link>
          )
        ) : (
          <>
            <img
              src={user?.profileObj.imageUrl}
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
            />
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
                {translations.nav.profile.head}
                <br></br> {currentUsername}
              </MenuItem>
              <MenuItem onClick={() => (window.location = "/profile")}>
                {translations.nav.profile.account}
              </MenuItem>
              <MenuItem onClick={openCustomerPortal}>
                {translations.nav.profile.subscription}
              </MenuItem>
              <MenuItem
                style={{
                  backgroundColor: "rgb(220, 0, 78)",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
                onClick={logOut}
              >
                {translations.nav.profile.logout}
              </MenuItem>
            </Menu>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;

/*            <div className="dropdown">
          <button className="dropbtn">
            <MenuIcon />
          </button>
          <div className="dropdown-content">
            <a href="/play">{translations.nav.dropdown.play}</a>
            <a href="/quizzes">
              {translations.nav.dropdown.quizzes}
            </a>
            <a href="/plans">{translations.nav.dropdown.plans}</a>
            <a href="/login">{translations.nav.dropdown.login}</a>
          </div>
        </div> */
