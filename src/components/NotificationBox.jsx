import React, { useState, useEffect } from "react";
import "../style/notificationStyles.css";

import firebase from "firebase/app";
import "firebase/database";

import { Typography, Button, Divider, CircularProgress } from "@mui/material";

import Translations from "../translations/translations.json";

import { useQuery, useMutation, gql } from "@apollo/client";

const GET_NOTIFICATIONS = gql`
  query allNotificationsByUser($userId: ID!) {
    allNotificationsByUser(userId: $userId) {
      _id
      userId
      type
      message
      data
    }
  }
`;

const CLEAR_NOTIFICATIONS = gql`
  mutation clearNotifications($userId: ID!) {
    clearNotifications(userId: $userId)
  }
`;

function NotificationBox() {
  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const { loading, error, data } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      userId: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
    },
  });

  const [clearNotifications] = useMutation(CLEAR_NOTIFICATIONS, {
    variables: {
      userId: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
    },
  });

  const NotificationCard = ({ message }) => (
    <div className="notification__card">
      <Typography variant="h6" className="notification__card__title">
        {message}
      </Typography>
    </div>
  );

  const NotificationJoinCard = ({ message, code }) => (
    <div className="notification__card">
      <Typography variant="h6" className="notification__card__title">
        {message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className="notification__card__button"
        onClick={() => (window.location = `/play?code=${code}`)}
      >
        Join
      </Button>
    </div>
  );

  const handleClearNotifications = () => {
    clearNotifications();
    window.location.reload();
  };

  return (
    <div className="notification__box">
      <div className="notification__header">
        <Typography variant="h6" className="notification__title">
          <b>{Translations[userLanguage].notifications.title}</b>
        </Typography>
        <div style={{ width: "90%" }}>
          <Divider light />
        </div>
      </div>
      <div className="notification__scroll__section">
        {loading ? (
          <CircularProgress />
        ) : (
          data.allNotificationsByUser.map((notification) => {
            if (notification.type === "class_created") {
              return <NotificationCard message={notification.message} />;
            }
            if (notification.type === "added_to_class") {
              return <NotificationCard message={notification.message} />;
            }
            if (notification.type === "removed_from_class") {
              return <NotificationCard message={notification.message} />;
            }
            if (notification.type === "invitation_to_room") {
              return (
                <NotificationJoinCard
                  code={JSON.parse(notification.data).room}
                  message={notification.message}
                />
              );
            }
          })
        )}
      </div>
      <div>
        <Button
          style={{ margin: "10px" }}
          variant="contained"
          color="secondary"
          className="notification__card__button"
          onClick={() => handleClearNotifications()}
        >
          {Translations[userLanguage].notifications.clear}
        </Button>
      </div>
    </div>
  );
}

export default NotificationBox;
