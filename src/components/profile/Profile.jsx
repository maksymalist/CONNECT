import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Button,
  Tab,
  Tabs,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  AccountCircle,
  Lock,
  EmojiEmotionsOutlined,
} from "@mui/icons-material";

import { toast } from "react-toastify";
import axios from "axios";

import { Link } from "react-router-dom";

import "../../style/profileStyles.css";

import Placeholder from "../../img/quizCoverPlaceholder.svg";
import LockedEmote from "../../img/lockedEmote.svg";

import Translations from "../../translations/translations.json";

import { useQuery, gql } from "@apollo/client";

import config from "../../config.json";
import Emotes from "../../emotes/emotes.json";
import getUser from "../../hooks/getUser";

//queries
const GET_USER_PROFILE = gql`
  query getUserProfile($id: ID!) {
    user(id: $id) {
      _id
      name
      email
      imageUrl
      plan
    }
  }
`;
const GET_USER_QUIZZES = gql`
  query ($userId: ID!) {
    allQuizzesByUser(userId: $userId) {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
    }
  }
`;

const GET_USER_MULTIS = gql`
  query allMultisByUser($userId: ID!) {
    allMultisByUser(userId: $userId) {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
    }
  }
`;
const GET_USER_PRIVATE_QUIZZES = gql`
  query allPrivateQuizzesByUser($userId: ID!) {
    allPrivateQuizzesByUser(userId: $userId) {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
    }
  }
`;

const GET_USER_PRIVATE_MULTIS = gql`
  query allPrivateMultisByUser($userId: ID!) {
    allPrivateMultisByUser(userId: $userId) {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
    }
  }
`;

const GET_USER_EMOTES = gql`
  query ($userId: ID!) {
    getUserEmotes(userId: $userId) {
      _id
      emoteId
    }
  }
`;

function Profile() {
  const { id } = useParams();
  const user = getUser();

  const { loading, data } = useQuery(GET_USER_PROFILE, {
    variables: {
      id: id,
    },
  });

  const { loading: loadingQuizzes, data: quizzes } = useQuery(
    GET_USER_QUIZZES,
    {
      variables: {
        userId: id,
      },
    }
  );

  const { loading: loadingMultis, data: multis } = useQuery(GET_USER_MULTIS, {
    variables: {
      userId: id,
    },
  });

  const { loading: loadingPrivateQuizzes, data: privateQuizzes } = useQuery(
    GET_USER_PRIVATE_QUIZZES,
    {
      variables: {
        userId: id,
      },
    }
  );

  const { loading: loadingPrivateMultis, data: privateMultis } = useQuery(
    GET_USER_PRIVATE_MULTIS,
    {
      variables: {
        userId: id,
      },
    }
  );

  const { loading: loadingEmotes, data: emotes } = useQuery(GET_USER_EMOTES, {
    variables: {
      userId: id,
    },
  });

  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const [value, setValue] = useState(0);

  const [userClasses, setUserClasses] = useState([]);

  const quizzesTab = useRef(null);

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
    if (id == user?.profileObj.googleId) {
      window.location = "/profile";
      return;
    }
    getClasses();
  }, []);

  const handleQuizClick = (key, type, isPrivate) => {
    if (isPrivate) {
      if (type === "Quiz") {
        window.location = `/quiz/normal/private/${key}`;
      }
      if (type === "Multi") {
        window.location = `/quiz/multi/private/${key}`;
      }
    } else {
      if (type === "Quiz") {
        window.location = `/quiz/normal/${key}`;
      }
      if (type === "Multi") {
        window.location = `/quiz/multi/${key}`;
      }
    }
  };

  const getClasses = async () => {
    const res = await axios.post(`${config["api-server"]}/get-user-classes`, {
      userId: id,
    });

    console.log(res.data);
    if (res.data) {
      setUserClasses(res.data || []);
    }
  };

  const ClassCardComponent = ({ data }) => {
    const { name, banner, owner, _id } = data;
    console.log(_id);
    return (
      <div className="profile__class__card">
        <Typography
          style={{ fontWeight: "bold", margin: "20px", color: "black" }}
          variant="h5"
        >
          {name}
        </Typography>
        <img
          style={{ width: "100%", height: "300px" }}
          src={banner || Placeholder}
          alt="banner-img"
        />
      </div>
    );
  };

  const QuizCardComponent = ({ data, isPrivate }) => (
    <div
      onClick={() => {
        handleQuizClick(data._id, data.__typename, isPrivate);
      }}
      className="quizCard"
      style={{ overflowY: "auto", overflowX: "hidden", maxWidth: "300px" }}
    >
      {isPrivate ? (
        <Lock
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: "10",
          }}
          color="primary"
        />
      ) : null}
      <img
        style={{ width: "100%", height: "300px" }}
        src={data.coverImg || Placeholder}
        alt="cover-img"
      />
      <h2>{data.name}</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {data.userProfilePic == undefined ? (
          <AccountCircle style={{ marginRight: "10px" }} color="primary" />
        ) : (
          <img
            width="25px"
            height="25px"
            src={data.userProfilePic}
            alt={data.userProfilePic}
            style={{
              borderRadius: "100%",
              marginRight: "10px",
            }}
          />
        )}
        <h3>{`${Translations[userLanguage].profile.quizzes.by} ${data.userName}`}</h3>
      </div>
      {/* <Button variant='contained' size='small' color='primary' style={{margin:'10px'}}>Edit</Button> */}
      <div>
        {data.tags == undefined ? null : (
          <div>
            <br></br>
            {data.tags.map((tag, index) => {
              return (
                <Chip
                  style={{ margin: "5px" }}
                  key={tag + index}
                  label={"#" + tag}
                  color="primary"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

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
              label={Translations[userLanguage].profile.tags.classroom}
              color="primary"
              variant="outlined"
            />
          )}
          {quizzes?.allQuizzesByUser?.length > 0 ? (
            <Chip
              className="mui-chip"
              label={Translations[userLanguage].profile.tags.creator}
              color="primary"
              variant="outlined"
            />
          ) : multis?.allMultiQuizzesByUser?.length > 0 ? (
            <Chip
              className="mui-chip"
              label={Translations[userLanguage].profile.tags.creator}
              color="primary"
              variant="outlined"
            />
          ) : null}
        </div>
        <div className="profile-tabs-slider-container">
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            <Tab label={Translations[userLanguage].profile.quizzes.title} />
            <Tab label={Translations[userLanguage].profile.class.title} />
            <Tab icon={<EmojiEmotionsOutlined />} />
          </Tabs>
        </div>
      </div>
      <div className="profile-tab">
        {value === 0 ? (
          <div>
            <Typography variant="h3" style={{ margin: "20px" }}>
              {Translations[userLanguage].profile.quizzes.title}
            </Typography>
            <div className="profile-tab-quizzes" ref={quizzesTab}>
              {loadingQuizzes ? (
                <CircularProgress
                  color="primary"
                  size={150}
                  thickness={3}
                  style={{ margin: "100px" }}
                />
              ) : quizzes ? (
                quizzes.allQuizzesByUser.map((data, index) => {
                  return <QuizCardComponent key={index} data={data} />;
                })
              ) : null}
              {loadingPrivateQuizzes
                ? null
                : privateQuizzes
                ? privateQuizzes.allPrivateQuizzesByUser.map((data, index) => {
                    return (
                      <QuizCardComponent key={index} data={data} isPrivate />
                    );
                  })
                : null}
              {loadingMultis
                ? null
                : multis
                ? multis.allMultisByUser.map((data, index) => {
                    return <QuizCardComponent key={index} data={data} />;
                  })
                : null}
              {loadingPrivateMultis
                ? null
                : privateMultis
                ? privateMultis.allPrivateMultisByUser.map((data, index) => {
                    return (
                      <QuizCardComponent key={index} data={data} isPrivate />
                    );
                  })
                : null}
            </div>
          </div>
        ) : null}
        {value === 1 ? (
          <div>
            <Typography variant="h3" style={{ margin: "20px" }}>
              {Translations[userLanguage].profile.class.title}
            </Typography>
            <Divider style={{ marginLeft: "10px", marginRight: "10px" }} />
            <br></br>
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
              {Translations[userLanguage].profile.emotes.title}
            </Typography>
            <Divider style={{ marginLeft: "10px", marginRight: "10px" }} />
            <br></br>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">
                <b>{emotes?.getUserEmotes.length + 4}/20</b>
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
                {loadingEmotes ? (
                  <h1>loading...</h1>
                ) : emotes ? (
                  emotes?.getUserEmotes.map((data, index) => {
                    return (
                      <EmoteCardComponent key={index} emoteId={data.emoteId} />
                    );
                  })
                ) : null}
                {lockedEmotes.map((data, index) => {
                  const emote = emotes?.getUserEmotes[index]?.emoteId;
                  if (emote === undefined || emote === null) {
                    return <LockedEmoteComponent key={index} />;
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Profile;
