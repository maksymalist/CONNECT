import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";

import firebase from "firebase/app";

import Home from "./components/Home";
import EnterCodeForm from "./components/EnterCodeForm";
import GameRoom from "./components/game/player/GameRoom";
import MultiGameRoom from "./components/game/player/MultiGameRoom";
import Nav from "./components/nav/Nav.jsx";
import NewQuiz from "./components/creation-system/NewQuiz";
import BrowseQuizzes from "./components/browse/BrowseQuizzes";
import AfterRoomLeave from "./components/game/player/AfterRoomLeave";
import GameEnded from "./components/game/host/GameEnded";
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
import Login from "./components/auth/Login";
import NewMultiQuiz from "./components/creation-system/NewMultiQuiz";
import MyProfile from "./components/profile/MyProfile";
import ViewQuiz from "./components/view/ViewQuiz";
import ViewMultiQuiz from "./components/view/ViewMultiQuiz";
import CreateClass from "./components/creation-system/CreateClass";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setStarter, setClassroom, setEntreprise } from "./actions/Plan";
import { setIsLoggedIn, setIsLoggedOut } from "./actions/IsLogged";

//apollo
import { useMutation, gql } from "@apollo/client";
import config from "./config.json";

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

function App() {
  const [customerId, setCustomerId] = useState(null);

  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);
  const [updateUserSubscription] = useMutation(UPDATE_USER_SUBSCRIPTION);

  const isLoggedIn = useSelector((state) => state.isLogged);

  const dispatch = useDispatch();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user")) !== null) {
      console.log(JSON.parse(localStorage.getItem("user")).profileObj);
      dispatch(setIsLoggedIn());

      updateUserProfile({
        variables: {
          name: JSON.parse(localStorage.getItem("user")).profileObj.name,
          email: JSON.parse(localStorage.getItem("user")).profileObj.email,
          id: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
          imageUrl: JSON.parse(localStorage.getItem("user")).profileObj
            .imageUrl,
        },
      });

      axios
        .post(`${config["api-server"]}/get-user-subscription-id`, {
          userId: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
        })
        .then((res) => {
          if (res.data !== null && res.data !== undefined) {
            const subObj = JSON.parse(res.data);
            fetchCustomerData(JSON.parse(subObj).id);
            console.log(JSON.parse(subObj).id);
          } else {
            dispatch(setStarter());
          }
        });
    } else {
      dispatch(setIsLoggedOut());
      if (window.location.pathname == "/login") return;
      // const ToastContent = () => (
      //   <div className="toast-content">
      //     <h3>You Have To Login If You Want To Use CONNECT!</h3>
      //     <Button variant='contained' color='primary' onClick={()=>{window.location = '/login'}}>Login</Button>
      //   </div>
      // )
      // toast.info(<ToastContent/>)
      window.location.href = "/login";
      return;
    }
    return () => {
      //cleanup
    };
  }, []);

  const fetchCustomerData = async (id) => {
    const res = await axios.post(`${config["api-server"]}/get-customer-data`, {
      subId: id,
    });

    let plan = "";
    if (
      JSON.parse(res.data.subscriptionDetails).plan.id ==
        "price_1JMwC7BqTzgw1Au76sejuZu4" &&
      JSON.parse(res.data.subscriptionDetails).status == "active"
    ) {
      plan = "Classroom";
      dispatch(setClassroom());
    }
    if (JSON.parse(res.data.subscriptionDetails).status == "canceled") {
      plan = "Starter";
      dispatch(setStarter());
    }
    if (JSON.parse(res.data.subscriptionDetails).status == "inactive") {
      plan = "Starter";
      dispatch(setStarter());
    }

    setCustomerId(JSON.parse(res.data.subscriptionDetails).customer);
    console.log(JSON.parse(res.data.subscriptionDetails));
    updateUserSubscription({
      variables: {
        id: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
        subscriptionDetails: JSON.stringify(res.data.subscriptionDetails),
        plan: plan,
      },
    });
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
          <Route path="/newquiz" component={NewQuiz} />
          <Route path="/new-multi-quiz" component={NewMultiQuiz} />
          <Route path="/browsequizzes" component={BrowseQuizzes} />
          <Route path="/roomleave/:type" component={AfterRoomLeave} />
          <Route path="/gamefinsihed/:room/:user" component={GameEnded} />
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
        </Switch>
      </div>
    </Router>
  );
}
export default App;
