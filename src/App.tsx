import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import firebase from "firebase/app";

import Home from "./components/Home";
import EnterCodeForm from "./components/EnterCodeForm";
import GameRoom from "./components/game/player/GameRoom";
import MultiGameRoom from "./components/game/player/MultiGameRoom";
import Nav from "./components/nav/Nav";
import NewQuiz from "./components/creation-system/NewQuiz";
import BrowseQuizzes from "./components/browse/BrowseQuizzes";
import AfterRoomLeave from "./components/game/player/AfterRoomLeave";
import StripeSubscriptions from "./components/payment/StripeSubscriptions";
import Plans from "./components/payment/Plans";
import Background from "./components/misc/Background";
import Profile from "./components/profile/Profile";
import Classroom from "./components/classroom/Classroom";
import ViewClassroom from "./components/view/ViewClassroom";
import ViewMultiPrivate from "./components/view/ViewMultiPrivate";
import ViewQuizPrivate from "./components/view/ViewQuizPrivate";

import { toast } from "react-toastify";
import axios from "axios";
import Login from "./components/Auth/Login";
import NewMultiQuiz from "./components/creation-system/NewMultiQuiz";
import MyProfile from "./components/profile/MyProfile";
import ViewQuiz from "./components/view/ViewQuiz";
import ViewMultiQuiz from "./components/view/ViewMultiQuiz";
import CreateClass from "./components/creation-system/CreateClass";
import QuizPractice from "./components/game/practice/QuizPractice";
import MultiPractice from "./components/game/practice/MultiPractice";
import ClaimEmote from "./components/misc/ClaimEmote";
import Bubble from "./components/charts/Bubble";
//redux
import { useDispatch, useSelector } from "react-redux";
import { setStarter, setClassroom, setEntreprise } from "./actions/Plan";
import { setIsLoggedIn, setIsLoggedOut } from "./actions/IsLogged";

//apollo
import { useMutation, gql } from "@apollo/client";
import config from "./config.json";
import "firebase/storage";

//hooks
import getUser from "./hooks/getUser";
import NoLocalStorage from "./components/NoLocalStorage";
import Tutorial from "./components/tutorial/Tutorial";
import JoinClass from "./components/classroom/JoinClass";

const firebaseConfig = {
  apiKey: "AIzaSyAuhaVNdwDaivPThUZ6wxYKCkvs0tEDRNs",
  authDomain: "livequiz-20442.firebaseapp.com",
  projectId: "livequiz-20442",
  storageBucket: "livequiz-20442.appspot.com",
  messagingSenderId: "1096465541426",
  appId: "1:1096465541426:web:fed06729c47b7cd3160f2b",
  measurementId: "G-7TZ8J1DMSJ",
};

const instance = firebase.initializeApp(firebaseConfig);

export const getFirebase = () => {
  if (typeof window !== "undefined") {
    return instance;
  }

  return null;
};

const UPDATE_USER_PROFILE = gql`
  mutation updateUserProfile(
    $id: ID!
    $name: String!
    $email: String!
    $imageUrl: String!
  ) {
    updateUserProfile(id: $id, name: $name, email: $email, imageUrl: $imageUrl)
  }
`;

const UPDATE_USER_SUBSCRIPTION = gql`
  mutation updateUserSubscription(
    $id: ID!
    $subscriptionDetails: String!
    $plan: String!
  ) {
    updateUserSubscription(
      id: $id
      subscriptionDetails: $subscriptionDetails
      plan: $plan
    )
  }
`;

toast.configure({
  autoClose: 5000,
  draggable: true,
});

type ReduxStore = {
  isLogged: boolean;
  plan: boolean;
};

function App() {
  const user = getUser();
  const [customerId, setCustomerId] = useState(null);

  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);
  const [updateUserSubscription] = useMutation(UPDATE_USER_SUBSCRIPTION);

  const isLoggedIn = useSelector((state: ReduxStore) => state.isLogged);

  const dispatch = useDispatch();

  const BAD_STATUS_ARR = [
    "past_due",
    "canceled",
    "unpaid",
    "incomplete",
    "incomplete_expired",
    "trialing",
  ];

  useEffect(() => {
    if (user !== null && user !== undefined && user !== "") {
      dispatch(setIsLoggedIn());

      updateUserProfile({
        variables: {
          name: user?.profileObj.name,
          email: user?.profileObj.email,
          id: user?.profileObj.googleId,
          imageUrl: user?.profileObj.imageUrl,
        },
      });

      axios
        .post(`${config["api-server"]}/get-user-subscription-id`, {
          userId: user?.profileObj.googleId,
        })
        .then((res) => {
          if (res.data !== null && res.data !== undefined) {
            const subObj = JSON.parse(res.data);
            fetchCustomerData(subObj?.id || null);
          } else {
            dispatch(setStarter());
          }
        })
        .catch((err) => {
          dispatch(setStarter());
        });
    } else {
      dispatch(setIsLoggedOut());
      if (window.location.pathname == "/login") return;
      if (window.location.pathname == "/play") return;
      if (window.location.pathname == "/claim-emote") return;
      if (window.location.pathname == "/no-local-storage") return;
      window.location = "/login" as any;
    }
    return () => {
      //cleanup
    };
  }, []);

  const fetchCustomerData = async (id: string) => {
    if (id === null) {
      dispatch(setStarter());
      return;
    }
    try {
      const res = await axios.post(
        `${config["api-server"]}/get-customer-data`,
        {
          subId: id,
        }
      );
      if (res.data == null || res.data == undefined) {
        dispatch(setStarter());
        return;
      }
      let plan = "Starter";
      if (
        JSON.parse(res?.data?.subscriptionDetails)?.plan?.id ==
          "price_1L3rXSBqTzgw1Au7uf9cyg2r" &&
        JSON.parse(res?.data?.subscriptionDetails)?.status == "active"
      ) {
        plan = "Classroom";
        dispatch(setClassroom());
      } else if (
        BAD_STATUS_ARR.includes(
          JSON.parse(res?.data?.subscriptionDetails)?.status
        )
      ) {
        plan = "Starter";
        dispatch(setStarter());
      } else {
        plan = "Starter";
        dispatch(setStarter());
      }

      setCustomerId(JSON.parse(res?.data?.subscriptionDetails)?.customer);
      updateUserSubscription({
        variables: {
          id: user?.profileObj.googleId,
          subscriptionDetails: res?.data?.subscriptionDetails,
          plan: plan,
        },
      });
    } catch (err) {
      dispatch(setStarter());
    }
  };

  return (
    <Router>
      <div id="App" className="App">
        <Nav isLoggedIn={isLoggedIn} customerId={customerId} />
        <div style={{ margin: "0 !important" }} id="navMargin" />
        <Background />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/play" component={EnterCodeForm} />
          <Route path="/normal/:room/:gameid/:user" component={GameRoom} />
          <Route path="/multi/:room/:gameid/:user" component={MultiGameRoom} />
          <Route path="/practice/normal/:gameid" component={QuizPractice} />
          <Route path="/practice/multi/:gameid" component={MultiPractice} />
          <Route path="/newquiz" component={NewQuiz} />
          <Route path="/new-multi-quiz" component={NewMultiQuiz} />
          <Route path="/quizzes" component={BrowseQuizzes} />
          <Route path="/roomleave/:type" component={AfterRoomLeave} />
          <Route path="/plans" component={Plans} />
          <Route path="/subscription/:plan" component={StripeSubscriptions} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={MyProfile} />
          <Route path="/profiles/:id" component={Profile} />
          <Route exact path="/quiz/normal/:code" component={ViewQuiz} />
          <Route exact path="/quiz/multi/:code" component={ViewMultiQuiz} />
          <Route
            path="/quiz/normal/private/:code"
            component={ViewQuizPrivate}
          />
          <Route
            path="/quiz/multi/private/:code"
            component={ViewMultiPrivate}
          />
          <Route path="/class/:id" component={Classroom} />
          <Route path="/view-class/:id" component={ViewClassroom} />
          <Route path="/create-class" component={CreateClass} />
          <Route path="/claim-emote" component={ClaimEmote} />
          <Route path="/no-local-storage" component={NoLocalStorage} />
          <Route path="/tutorial" component={Tutorial} />
          <Route path="/join/:classId" component={JoinClass} />
          <Route path="/bub" component={Bubble} />
        </Switch>
      </div>
    </Router>
  );
}
export default App;
