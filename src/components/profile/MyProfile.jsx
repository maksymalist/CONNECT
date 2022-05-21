import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Button,
  Tab,
  Tabs,
  Chip,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  AccountCircle,
  Lock,
  EmojiEmotionsOutlined,
} from "@mui/icons-material";

import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import "../../style/profileStyles.css";

import Placeholder from "../../img/quizCoverPlaceholder.svg";
import LockedEmote from "../../img/lockedEmote.svg";
import Emotes from "../../emotes/emotes.json";
import { useSelector } from "react-redux";

import { useQuery, gql } from "@apollo/client";

import axios from "axios";

import config from "../../config.json";
import getUser from "../../hooks/getUser";

import QuizCard from "../cards/QuizCard";
import useTranslations from "../../hooks/useTranslations";

//queries
const GET_USER_PROFILE = gql`
  query profile($userId: ID!) {
    user(id: $userId) {
      _id
      name
      email
      imageUrl
      plan
      role
    }
    getUserEmotes(userId: $userId) {
      _id
      emoteId
    }
    allMultisByUser(userId: $userId) {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
      __typename
    }
    allQuizzesByUser(userId: $userId) {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
      __typename
    }
    allPrivateMultisByUser(userId: $userId) {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
      __typename
    }
    allPrivateQuizzesByUser(userId: $userId) {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
      __typename
    }
  }
`;

function MyProfile(props) {
  const user = getUser();

  const { loading, data } = useQuery(GET_USER_PROFILE, {
    variables: {
      userId: user?.profileObj.googleId,
    },
  });

  const [value, setValue] = useState(0);

  const translations = useTranslations();

  const quizzesTab = useRef(null);

  const plan = useSelector((state) => state.plan);

  const [userClasses, setUserClasses] = useState([]);

  const [lockedEmotes, setLockedEmotes] = useState([
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getClasses();
  }, []);

  const getClasses = async () => {
    try {
      const res = await axios.post(`${config["api-server"]}/get-user-classes`, {
        userId: user?.profileObj.googleId,
      });

      if (res.data) {
        for (let i = 0; i < res.data.length; i++) {
          const resp = await axios.post(`${config["api-server"]}/get-class`, {
            id: res.data[i].classId,
          });
          setUserClasses((prev) => [...prev, resp.data]);
        }
      }
    } catch (error) {
      setUserClasses([]);
    }
  };

  const ClassCardComponent = ({ data }) => {
    const { name, banner, members, _id } = data;
    console.log(_id);
    return (
      <div
        className="profile__class__card"
        style={{
          backgroundImage: `url(${banner || Placeholder})`,
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "100%",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "25px",
          }}
        >
          <Typography
            style={{ fontWeight: "bold", color: "black" }}
            variant="h5"
          >
            {name}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <Chip
            color="primary"
            label={`${members.length} ${translations.classroom.members.title1}`}
            style={{ margin: "5px" }}
          />
        </div>
      </div>
    );
  };

  const playEmote = (src) => {
    let emote = document.createElement("img");
    const size = Math.floor(Math.random() * (100 - 50 + 1)) + 40;
    emote.src = src;
    emote.className = "emote__icons";
    document.body.appendChild(emote);
    emote.style.position = "fixed";
    emote.style.top = "0";
    emote.style.left = Math.random() * 100 + "%";
    emote.style.top = Math.random() * 100 + "%";
    emote.style.width = `${size}px`;
    emote.style.height = `${size}px`;

    setTimeout(() => {
      emote.remove();
    }, 5000);
  };

  const EmoteCardComponent = ({ emoteId }) => {
    const name = Emotes[emoteId].name;
    const icon = Emotes[emoteId].icon;
    const rarity = Emotes[emoteId].rarity;

    return (
      <div
        className="profile__emote__card"
        onClick={() => {
          playEmote(icon);
        }}
        style={
          rarity === "common"
            ? {
                border: "2px solid black",
                boxShadow: "10px 10px 0 rgb(0 0 0 / 50%)",
              }
            : rarity === "uncommon"
            ? {
                boxShadow: "10px 10px 0 rgb(27 185 120 / 50%)",
                border: "2px solid #1bb978",
              }
            : rarity === "rare"
            ? {
                boxShadow: "10px 10px 0 rgb(41 182 246 / 50%)",
                border: "2px solid #29b6f6",
              }
            : rarity === "epic"
            ? {
                boxShadow: "10px 10px 0 rgb(108 99 255 / 50%)",
                border: "2px solid #6c63ff",
              }
            : rarity === "legendary"
            ? {
                boxShadow: "10px 10px 0 rgb(242 121 1 / 50%)",
                border: "2px solid #F27901",
              }
            : null
        }
      >
        <img
          style={{ width: "150px", height: "150px" }}
          src={icon}
          alt="emote-img"
        />
        <Typography
          variant="h4"
          style={
            rarity === "common"
              ? {
                  color: "black",
                }
              : rarity === "uncommon"
              ? {
                  color: "#1bb978",
                }
              : rarity === "rare"
              ? {
                  color: "#29b6f6",
                }
              : rarity === "epic"
              ? {
                  color: "#6c63ff",
                }
              : rarity === "legendary"
              ? {
                  color: "#F27901",
                }
              : null
          }
        >
          <div style={{ width: "100%", height: "20px" }} />
          <b>{name}</b>
        </Typography>
      </div>
    );
  };

  const LockedEmoteComponent = () => {
    return (
      <div
        className="profile__emote__card"
        style={{
          boxShadow: "10px 10px 0 rgb(0 0 0 / 50%)",
          border: "2px solid black",
        }}
      >
        <img
          style={{ width: "150px", height: "150px" }}
          src={LockedEmote}
          alt="emote-img"
        />
        <Typography
          variant="h4"
          style={{
            color: "black",
          }}
        >
          <div style={{ width: "100%", height: "20px" }} />
          <b>???</b>
        </Typography>
      </div>
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-banner"></div>
      <div className="profile-wrapper">
        <div className="profile-info-bar">
          <img
            alt="user-pfp"
            src={loading ? null : data.user == null ? null : data.user.imageUrl}
            style={{
              borderRadius: "50%",
              marginTop: "-50px",
              width: "100px",
              height: "100px",
            }}
          />
          <div className="profile-info-text">
            <Typography
              style={{ fontWeight: "bold", margin: "20px" }}
              variant="h5"
            >
              {loading ? null : data.user == null ? null : data.user.name}
            </Typography>
            <Typography style={{ margin: "20px" }} variant="h6">
              {loading ? null : data.user == null ? null : data.user.email}
            </Typography>
          </div>
        </div>
        <div className="profile-chip-div">
          {data?.user?.plan === "Classroom" && (
            <Chip
              className="mui-chip"
              label={translations.profile.tags.classroom}
              color="primary"
              variant="outlined"
            />
          )}
          {data?.allQuizzesByUser?.length > 0 ? (
            <Chip
              className="mui-chip"
              label={translations.profile.tags.creator}
              color="primary"
              variant="outlined"
            />
          ) : data?.allMultiQuizzesByUser?.length > 0 ? (
            <Chip
              className="mui-chip"
              label={translations.profile.tags.creator}
              color="primary"
              variant="outlined"
            />
          ) : null}
          {data?.user?.role === "student" && (
            <Chip
              className="mui-chip"
              label={translations.profile.tags.student}
              color="primary"
              variant="outlined"
            />
          )}
          {data?.user?.role === "teacher" && (
            <Chip
              className="mui-chip"
              label={translations.profile.tags.teacher}
              color="primary"
              variant="outlined"
            />
          )}
          {data?.getUserEmotes?.length === 16 && (
            <Chip
              className="mui-chip"
              label={translations.profile.tags.collector}
              color="primary"
              variant="outlined"
            />
          )}
        </div>
        <div className="profile-tabs-slider-container">
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            <Tab label={translations.profile.quizzes.title} />
            <Tab label={translations.profile.class.title} />
            <Tab icon={<EmojiEmotionsOutlined />} />
          </Tabs>
        </div>
      </div>
      <div className="profile-tab">
        {value === 0 ? (
          <div>
            <Typography variant="h3" style={{ margin: "20px" }}>
              {translations.profile.quizzes.title}
            </Typography>
            <Divider style={{ marginLeft: "10px", marginRight: "10px" }} />
            <br></br>
            <div className="profile-tab-quizzes" ref={quizzesTab}>
              {loading ? (
                <CircularProgress
                  color="primary"
                  size={150}
                  thickness={3}
                  style={{ margin: "100px" }}
                />
              ) : data ? (
                data.allQuizzesByUser.map((data, index) => {
                  return <QuizCard key={index} data={data} />;
                })
              ) : null}
              {loading
                ? null
                : data
                ? data.allPrivateQuizzesByUser.map((data, index) => {
                    return <QuizCard key={index} data={data} isPrivate />;
                  })
                : null}
              {loading
                ? null
                : data
                ? data.allMultisByUser.map((data, index) => {
                    return <QuizCard key={index} data={data} />;
                  })
                : null}
              {loading
                ? null
                : data
                ? data.allPrivateMultisByUser.map((data, index) => {
                    return <QuizCard key={index} data={data} isPrivate />;
                  })
                : null}
            </div>
          </div>
        ) : null}
        {value === 1 ? (
          <div>
            <Typography variant="h3" style={{ margin: "20px" }}>
              {translations.profile.class.title}
            </Typography>
            <Divider style={{ marginLeft: "10px", marginRight: "10px" }} />
            <br></br>
            {plan === "Classroom" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Link to="/create-class" style={{ width: "170px" }}>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    style={{ margin: "10px" }}
                  >
                    {translations.classroom.createbutton}
                  </Button>
                </Link>
              </div>
            ) : null}
            <div className="profile__user__classes">
              {userClasses.map((myclass, index) => {
                return (
                  <Link
                    style={{ width: "auto" }}
                    to={`/class/${myclass._id}`}
                    key={index + 23}
                  >
                    <ClassCardComponent key={index} data={myclass} />
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
        {value === 2 ? (
          <div>
            <Typography variant="h3" style={{ margin: "20px" }}>
              {translations.profile.emotes.title}
            </Typography>
            <Divider style={{ marginLeft: "10px", marginRight: "10px" }} />
            <br></br>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">
                <b>{data?.getUserEmotes.length + 4}/20</b>
              </Typography>
              <EmojiEmotionsOutlined
                style={{
                  height: "35px",
                  width: "35px",
                  marginLeft: "5px",
                  marginRight: "20px",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div className="profile__tab__emotes">
                <EmoteCardComponent emoteId="1" />
                <EmoteCardComponent emoteId="2" />
                <EmoteCardComponent emoteId="3" />
                <EmoteCardComponent emoteId="4" />
                {loading ? (
                  <CircularProgress
                    color="primary"
                    size={150}
                    thickness={3}
                    style={{ margin: "100px" }}
                  />
                ) : data ? (
                  data?.getUserEmotes.map((data, index) => {
                    return (
                      <EmoteCardComponent key={index} emoteId={data.emoteId} />
                    );
                  })
                ) : null}
                {loading
                  ? null
                  : data
                  ? lockedEmotes.map((el, index) => {
                      const emote = data?.getUserEmotes[index]?.emoteId;
                      if (emote === undefined || emote === null) {
                        return <LockedEmoteComponent key={index} />;
                      } else {
                        return null;
                      }
                    })
                  : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MyProfile;
