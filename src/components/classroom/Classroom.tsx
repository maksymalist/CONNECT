//@ts-nocheck
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

//styles
import "../../style/classroomStyles.css";
import Placeholder from "../../img/quizCoverPlaceholder.svg";

//badges
import FirstPlaceIcon from "../../img/PodiumIcons/firstPlace.svg";
import SecondPlaceIcon from "../../img/PodiumIcons/secondPlace.svg";
import ThirdPlaceIcon from "../../img/PodiumIcons/thirdPlace.svg";

//translations

//config
import config from "../../config.json";

//material-ui
import {
  Typography,
  Button,
  Divider,
  Chip,
  Avatar,
  Backdrop,
  TextField,
  ClickAwayListener,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";
import { AccountCircle, CancelRounded } from "@mui/icons-material";

//components
import BrowseQuizzes from "../browse/BrowseQuizzesClassroom";
import Analytics from "./Analytics";

//toast
import { toast } from "react-toastify";

//redux
import { useSelector } from "react-redux";

//axios
import axios from "axios";

//apollo
import { useMutation, gql, useQuery } from "@apollo/client";

//hooks
import getUser from "../../hooks/getUser";
import useTranslations from "../../hooks/useTranslations";

const ADD_MEMBER = gql`
  mutation createMember($classId: ID!, $userId: ID!, $role: String!) {
    createMember(classId: $classId, userId: $userId, role: $role)
  }
`;

const CREATE_NOTIFICATION = gql`
  mutation createNotification(
    $userId: ID!
    $type: String!
    $message: String!
    $data: String!
  ) {
    createNotification(
      userId: $userId
      type: $type
      message: $message
      data: $data
    )
  }
`;

const DELETE_MEMBER = gql`
  mutation deleteMember($classId: ID!, $userId: ID!) {
    deleteMember(classId: $classId, userId: $userId)
  }
`;

const GET_JOIN_REQUESTS = gql`
  query ($classId: ID!) {
    allJoinRequestsByClass(classId: $classId) {
      message
      _id
      user {
        name
        _id
        imageUrl
      }
    }
  }
`;

const DELETE_JOIN_REQUEST = gql`
  mutation ($classId: ID!, $userId: ID!) {
    deleteJoinRequest(classId: $classId, userId: $userId)
  }
`;

export default function MemberRoom() {
  const user = getUser();
  const plan = useSelector((state) => state.plan);
  const translations = useTranslations();
  const [isBrowseQuizzes, setIsBrowseQuizzes] = useState(false);

  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [banner, setBanner] = useState("");
  const [hallOfFame, setHallOfFame] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [memberPerformances, setMemberPerformances] = useState([]);

  const [newMembers, setNewMembers] = useState([]);

  //inputs
  const [currentMember, setCurrentMember] = useState("");

  const [finalists, setFinalists] = useState([]);

  const { id } = useParams();

  //popups
  const [isAddMemberPopup, setIsAddMemberPopup] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [inviteTab, setInviteTab] = useState(0);
  const [analyticsTab, setAnalyticsTab] = useState(false);

  //queries
  const {
    data: joinRequests,
    loading: loadingJoinRequests,
    error: JoinRequestError,
  } = useQuery(GET_JOIN_REQUESTS, {
    variables: {
      classId: id,
    },
  });

  //mutations
  const [addMemberMutation] = useMutation(ADD_MEMBER, {
    refetchQueries: [{ query: GET_JOIN_REQUESTS, variables: { classId: id } }],
  });
  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [deleteMemberMutation] = useMutation(DELETE_MEMBER);
  const [deleteJoinRequest] = useMutation(DELETE_JOIN_REQUEST, {
    refetchQueries: [{ query: GET_JOIN_REQUESTS, variables: { classId: id } }],
  });

  //prefixes
  const USERID_PREFIX = "user:";

  const handleRenderClassroom = async () => {
    const res = await axios.post(`${config["api-server"]}/get-class`, {
      id: id,
    });
    const data = res.data;

    if (data?.owner != user?.profileObj.googleId) {
      window.location.href = `/view-class/${id}`;
      return;
    }

    //set class attributes
    setName(data?.name);
    setBanner(data?.banner);

    //set members
    const members = data?.members || [];

    console.log(members);

    members?.forEach(async (member) => {
      const userObj = {
        points: member.points,
        id: member.userId,
        name: "",
        imageUrl: "",
      };

      const res = await axios.post(`${config["api-server"]}/user-no-prefix`, {
        userId: member.userId,
      });
      const data = res.data;

      userObj.name = data?.name;
      userObj.imageUrl = data?.imageUrl;

      setMembers((prevState) => [...prevState, userObj]);
    });

    //set hall of fame
    const hallOfFameData = await axios.post(
      `${config["api-server"]}/get-hall-of-fame`,
      { id: id }
    );
    setHallOfFame(hallOfFameData.data || []);

    //set recent games

    const games = await axios.post(`${config["api-server"]}/get-recent-games`, {
      classId: id,
    });

    const recentGames = games.data;

    setRecentGames(recentGames);

    //set member performances
    const memberPerformances = await axios.post(
      `${config["api-server"]}/get-members-performances`,
      {
        classId: id,
      }
    );
    console.log(memberPerformances.data);
    setMemberPerformances(memberPerformances.data);
  };

  useEffect(() => {
    handleRenderClassroom();
  }, []);

  useEffect(() => {
    if (plan === "Starter") {
      window.location.href = `/view-class/${id}`;
      return;
    }
  }, [plan]);

  const handleSetFinalists = async (finalists) => {
    const newFinalistsArr = [];
    finalists.map(async (finalist) => {
      const res = await axios.post(`${config["api-server"]}/user`, {
        userId: finalist.playerID,
      });
      const playerData = res.data;

      newFinalistsArr.push({
        name: playerData.name,
        profileImg: playerData.imageUrl,
        player: finalist.player,
        playerID: finalist.playerID,
        position: finalist.position,
        time: finalist.time,
      });

      if (newFinalistsArr.length === finalists.length) {
        setFinalists(newFinalistsArr);
      }
    });
  };

  const handleRenderGames = () => {
    setIsBrowseQuizzes(!isBrowseQuizzes);
  };

  const handleAddMember = (member) => {
    setIsAddMemberPopup(true);
  };

  const addMember = async (member) => {
    const res = await axios.post(`${config["api-server"]}/user-by-email`, {
      email: member,
    });

    console.log(res.data);

    const membersArr = [...members];

    if (!res.data) {
      toast.error(translations.alerts.thisUserDoesNotExist);
      return;
    }

    if (res.data._id === USERID_PREFIX + user?.profileObj.googleId) {
      toast.error(translations.alerts.cannotAddYourself);
      return;
    }

    if (res.data) {
      membersArr.map((member) => {
        if (member.id === res.data._id) {
          toast.error(translations.alerts.memberAlreadyExists);
          return;
        }
      });
      setNewMembers([...newMembers, { data: res.data, id: res.data._id }]);
      setCurrentMember("");
      return;
    }
  };

  const removeMember = (index, memberId) => {
    if (memberId === `user:${user?.profileObj.googleId}`) {
      toast.error(translations.alerts.cannotRemoveYourself);
      return;
    }
    const cloneMemberArr = [...members];
    cloneMemberArr.splice(index, 1);
    setMembers(cloneMemberArr);

    const notification = {
      userId: memberId.replace(/user:/g, ""),
      type: "removed_from_class",
      message: `${user?.profileObj.name} has removed you from ${name} :(`,
      data: id,
    };

    console.log(index, memberId);

    createNotification({ variables: notification });
    deleteMemberMutation({ variables: { classId: id, userId: memberId } });
  };

  const acceptMember = (classId, userId, role, name, className) => {
    const notification = {
      userId: userId.replace(/user:/g, ""),
      type: "added_to_class",
      message: `${name} has added you to ${className}!`,
      data: id,
    };

    createNotification({ variables: notification });
    addMemberMutation({
      variables: { classId: classId, userId: userId, role: role },
    });
    deleteJoinRequest({ variables: { classId: classId, userId: userId } });
    toast.success(translations.alerts.addedmember);
  };

  const declineMember = (classId, userId) => {
    deleteJoinRequest({ variables: { classId: classId, userId: userId } });
    toast.error(translations.alerts.declinedmember);
  };

  const JoinRequest = ({ data }) => {
    return (
      <div
        style={{
          width: "100%",
          margin: "10px",
          border: "2px solid black",
          padding: "10px",
        }}
      >
        <div>
          <Typography variant="h4">
            {translations.classroom.joinrequest.title}
          </Typography>
          <Divider style={{ width: "100%", margin: "20px" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar
              style={{ marginRight: "15px", width: "35px", height: "35px" }}
              src={data.user.imageUrl}
            >
              {data.user.name.charAt(0)}
            </Avatar>
            <Typography variant="h6">{data.user.name}</Typography>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Typography
              style={{ margin: "25px", alignItems: "center" }}
              variant="body1"
            >
              <i>{data.message}</i>
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                acceptMember(
                  id,
                  data.user._id,
                  "member",
                  user?.profileObj.name,
                  name
                )
              }
            >
              {translations.classroom.joinrequest.accept}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => declineMember(id, data.user._id)}
            >
              {translations.classroom.joinrequest.decline}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="classroom__main__div">
      <div className="classroom__members">
        <Typography variant="h4" className="classroom__members__title">
          {translations.classroom.members.title1}({members.length})
        </Typography>
        <div>
          <Button
            style={{ margin: "10px" }}
            variant="contained"
            color="primary"
            onClick={() => handleAddMember()}
          >
            {translations.classroom.members.add}
          </Button>
          <Button
            style={{ margin: "10px" }}
            variant="contained"
            color="secondary"
            onClick={() => setRemoveMode(!removeMode)}
          >
            {removeMode
              ? translations.classroom.members.cancel
              : translations.classroom.members.remove}
          </Button>
        </div>
        {isAddMemberPopup ? (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100vw",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "9999",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <ClickAwayListener onClickAway={() => setIsAddMemberPopup(false)}>
              <div className="classroom__addmember__div">
                <div
                  style={{
                    position: "sticky",
                    top: "0",
                    backgroundColor: "white",
                    width: "100%",
                    zIndex: "11",
                    paddingTop: "10px",
                  }}
                >
                  <Typography variant="h4">
                    {inviteTab === 0
                      ? translations.classroom.members.title2
                      : translations.classroom.members.title3}
                  </Typography>
                  <Tabs
                    value={inviteTab}
                    onChange={(event, newValue) => {
                      setInviteTab(newValue);
                    }}
                  >
                    <Tab label={translations.classroom.members.tab1} />
                    <Tab
                      label={`${translations.classroom.members.tab2} (${
                        loadingJoinRequests
                          ? "0"
                          : JoinRequestError
                          ? "0"
                          : joinRequests?.allJoinRequestsByClass.length
                      })`}
                    />
                  </Tabs>
                  <div style={{ width: "100%" }}>
                    <Divider />
                  </div>
                </div>
                <br></br>
                {inviteTab === 0 && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        height: "50px",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        label={translations.classroom.members.email}
                        variant="outlined"
                        value={`https://quiz-connect.netlify.app/join/${id}`}
                        style={{ width: "270px", margin: "10px" }}
                      />
                      <Button
                        variant="contained"
                        color="action"
                        style={{ height: "50px" }}
                        onClick={() => {
                          //copy to clipboard
                          navigator.clipboard
                            .writeText(
                              `https://quiz-connect.netlify.app/join/${id}`
                            )
                            .then(
                              function () {
                                toast.success(
                                  translations.alerts.copiedinvitation
                                );
                              },
                              function (err) {
                                toast.error(err);
                              }
                            );
                        }}
                      >
                        {translations.classroom.members.copy}
                      </Button>
                    </div>
                    <br></br>
                  </>
                )}
                {inviteTab === 1 && (
                  <div
                    style={{
                      margin: "25px",
                      display: "flex",
                      width: "100%",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {loadingJoinRequests ? (
                      <CircularProgress thickness={5} size={100} />
                    ) : JoinRequestError ? (
                      <Typography variant="h6">
                        Looks like there might be an error :(
                      </Typography>
                    ) : (
                      joinRequests?.allJoinRequestsByClass?.map((request) => {
                        return <JoinRequest data={request} />;
                      })
                    )}
                  </div>
                )}
              </div>
            </ClickAwayListener>
          </div>
        ) : null}
        <div style={{ width: "90%" }}>
          <br></br>
          <Divider light />
          <br></br>
        </div>
        <div className="classroom__member__scroll__container">
          {members.map((member, index) => {
            return (
              <div className="classroom__members__member" key={index}>
                <img
                  onClick={() =>
                    (window.location = `/profiles/${member.id.replace(
                      "user:",
                      ""
                    )}`)
                  }
                  src={member.imageUrl || undefined}
                  alt="member"
                  className="classroom__members__member__img"
                />
                <Typography
                  style={{ minWidth: "150px" }}
                  variant="subtitle1"
                  className="classroom__members__member__name"
                >
                  {member.name || undefined}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-end",
                  }}
                >
                  {removeMode && (
                    <CancelRounded
                      style={{
                        fontSize: "2rem",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => removeMember(index, member.id)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {isBrowseQuizzes ? (
        <div id="classroom__dashboard" className="classroom__dashboard">
          <div
            style={
              isAddMemberPopup
                ? {}
                : {
                    position: "sticky",
                    top: "0",
                    backgroundColor: "white",
                    width: "100%",
                    zIndex: "11",
                  }
            }
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" className="classroom__dashboard__title">
                {name}
              </Typography>
              <Button
                style={{ marginRight: "10px" }}
                variant="contained"
                color="secondary"
                onClick={handleRenderGames}
              >
                {translations.classroom.play.backbutton}
              </Button>
            </div>
          </div>
          <BrowseQuizzes classID={id} gamemode={"normal"} />
        </div>
      ) : (
        <div id="classroom__dashboard" className="classroom__dashboard">
          <div
            style={
              isAddMemberPopup
                ? {}
                : {
                    position: "sticky",
                    top: "0",
                    backgroundColor: "white",
                    width: "100%",
                    zIndex: "11",
                  }
            }
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" className="classroom__dashboard__title">
                {name}
              </Typography>
              <div>
                <Button
                  variant="contained"
                  color={analyticsTab ? "secondary" : "action"}
                  style={
                    isAddMemberPopup
                      ? {
                          marginRight: "10px",
                          zIndex: "-1",
                          margin: "20px",
                        }
                      : { marginRight: "10px", margin: "20px" }
                  }
                  onClick={() => setAnalyticsTab(!analyticsTab)}
                >
                  {analyticsTab
                    ? translations.classroom.analytics.back
                    : translations.classroom.analytics.button}
                </Button>
                <Button
                  style={
                    isAddMemberPopup
                      ? { marginRight: "10px", zIndex: "-1" }
                      : { marginRight: "10px" }
                  }
                  variant="contained"
                  color="primary"
                  onClick={handleRenderGames}
                >
                  {translations.classroom.play.playbutton}
                </Button>
              </div>
            </div>
          </div>
          {!analyticsTab ? (
            <>
              <div className="classroom__banner__div">
                <img
                  src={banner || Placeholder}
                  alt="banner"
                  className="classroom__banner"
                />
              </div>
              <div className="classroom__hall__of__fame">
                <Typography
                  variant="h3"
                  className="classroom__hall__of__fame__title"
                >
                  {translations.classroom.halloffame.title}
                </Typography>
                <div className="classroom__hall__of__fame__card__container">
                  {hallOfFame.map((member, index) => {
                    if (index >= 3) return;
                    return (
                      <div
                        className="classroom__hall__of__fame__card"
                        key={index}
                      >
                        {index + 1 === 1 && (
                          <img
                            draggable="false"
                            src={FirstPlaceIcon}
                            alt="first-badge"
                            className="classroom__hall__of__fame__card__rank"
                          />
                        )}
                        {index + 1 === 2 && (
                          <img
                            draggable="false"
                            src={SecondPlaceIcon}
                            alt="second-badge"
                            className="classroom__hall__of__fame__card__rank"
                          />
                        )}
                        {index + 1 === 3 && (
                          <img
                            draggable="false"
                            src={ThirdPlaceIcon}
                            alt="third-badge"
                            className="classroom__hall__of__fame__card__rank"
                          />
                        )}
                        <Avatar
                          src={member.imageUrl}
                          alt="member"
                          className="classroom__hall__of__fame__card__img"
                        />
                        <Typography
                          variant="h4"
                          className="classroom__hall__of__fame__card__name"
                        >
                          {member.name}
                        </Typography>
                        <Typography
                          variant="h6"
                          className="classroom__hall__of__fame__card__points"
                        >
                          {member.points} pts
                        </Typography>
                      </div>
                    );
                  })}
                  {/* <div className="classroom__reward__date__container">
                              {rewardTime !== null && rewardTime !== "" && <Typography variant='h6' className="classroom__reward__date">Next Reward is: {rewardTime}</Typography>}
                              {reward !== null && reward !== "" && <Typography variant='h6' className="classroom__reward__date">Reward: {reward}</Typography>}
                              <Button variant="contained" color="primary" className="classroom__reward__button">Set Reward</Button>
                          </div> */}
                </div>
              </div>
              <div className="classroom__recent__games">
                <div className="classroom__recent__games__games">
                  <div
                    style={{
                      position: "sticky",
                      top: "0",
                      backgroundColor: "white",
                      width: "100%",
                      zIndex: "10",
                    }}
                  >
                    <Typography
                      variant="h3"
                      className="classroom__recent__games__title"
                    >
                      {translations.classroom.recentGames.title}
                    </Typography>
                    <div style={{ width: "100%" }}>
                      <br></br>
                      <Divider light />
                      <br></br>
                    </div>
                  </div>
                  <div className="classroom__recent__games__container">
                    {recentGames.map((game) => {
                      return (
                        <div
                          className="classroom__recent__games__game"
                          onClick={() =>
                            handleSetFinalists(game.finalists || [])
                          }
                        >
                          <img
                            style={{ width: "100%", height: "250px" }}
                            src={game.coverImg || Placeholder}
                            alt="cover-img"
                          />
                          <h2>{game.name}</h2>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {game.userProfilePic == "" ? (
                              <AccountCircle
                                style={{ marginRight: "10px" }}
                                color="primary"
                              />
                            ) : (
                              <img
                                width="25px"
                                height="25px"
                                src={game.userProfilePic}
                                alt={game.userProfilePic}
                                style={{
                                  borderRadius: "100%",
                                  marginRight: "10px",
                                }}
                              />
                            )}
                            <h3>{`${translations.quizzes.by} ${
                              game.userName || "undefined"
                            }`}</h3>
                          </div>
                          <div>
                            {game.tags == "" ? null : (
                              <div>
                                <br></br>
                                {game.tags.map((tag, index) => {
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
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                            }}
                          >
                            <Typography
                              variant="h6"
                              className="classroom__recent__games__game__points"
                            >
                              {game.date}
                            </Typography>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="classroom__recent__games__finalists">
                  <div
                    style={{
                      position: "sticky",
                      top: "0",
                      backgroundColor: "white",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h3"
                      className="classroom__recent__games__title"
                    >
                      {translations.classroom.finalists.title}
                    </Typography>
                    <div style={{ width: "100%" }}>
                      <br></br>
                      <Divider light />
                      <br></br>
                    </div>
                  </div>
                  <div className="classroom__finalists">
                    {finalists.map((finalist, index) => {
                      return (
                        <div className="classroom__finalists__card" key={index}>
                          <Avatar
                            src={finalist.profileImg || null}
                            alt="member"
                            className="classroom__finalists__card__img"
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography
                              variant="sub1"
                              className="classroom__finalists__card__name"
                            >
                              {finalist.name}
                            </Typography>
                            <Typography
                              variant="sub1"
                              className="classroom__finalists__card__name"
                            >{`" ${finalist.player}"`}</Typography>
                          </div>
                          {finalist.position == 1 && (
                            <img
                              draggable="false"
                              src={FirstPlaceIcon}
                              alt="first-badge"
                              className="classroom__finalist__card__rank"
                            />
                          )}
                          {finalist.position == 2 && (
                            <img
                              draggable="false"
                              src={SecondPlaceIcon}
                              alt="second-badge"
                              className="classroom__finalist__card__rank"
                            />
                          )}
                          {finalist.position == 3 && (
                            <img
                              draggable="false"
                              src={ThirdPlaceIcon}
                              alt="third-badge"
                              className="classroom__finalist__card__rank"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Analytics
              data={memberPerformances.length > 0 ? memberPerformances : []}
              members={members.length}
            />
          )}
        </div>
      )}
    </div>
  );
}
