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
import { AccountCircle, Lock } from "@mui/icons-material";

import { toast } from "react-toastify";
import axios from "axios";

import { Link } from "react-router-dom";

import "../../style/profileStyles.css";

import Placeholder from "../../img/quizCoverPlaceholder.svg";

import Translations from "../../translations/translations.json";

import { useQuery, gql } from "@apollo/client";

import config from "../../config.json";

//queries
const GET_USER_PROFILE = gql`
  query getUserProfile($id: ID!) {
    user(id: $id) {
      _id
      name
      email
      imageUrl
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

function Profile() {
  const { id } = useParams();

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

  const [userLanguage, setUserLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const [value, setValue] = useState(0);

  const [userClasses, setUserClasses] = useState([]);

  const quizzesTab = useRef(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (id == JSON.parse(localStorage.getItem("user")).profileObj.googleId) {
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
      setUserClasses(res.data);
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
                  label={tag}
                  color="primary"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

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
            <Tab label={Translations[userLanguage].profile.saved.title} />
            <Tab label={Translations[userLanguage].profile.class.title} />
          </Tabs>
        </div>
      </div>
      <div className="profile-tab">
        {value === 0 ? (
          <div>
            <h1>{Translations[userLanguage].profile.quizzes.title}</h1>
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
          <h1>{Translations[userLanguage].profile.saved.title}</h1>
        ) : null}
        {value === 2 ? (
          <div>
            <h1>{Translations[userLanguage].profile.class.title}</h1>
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
      </div>
    </div>
  );
}

export default Profile;
