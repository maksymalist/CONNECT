import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import React, {useEffect, useState} from 'react'


import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";

import Home from './components/Home'
import EnterCodeForm from './components/EnterCodeForm'
import GameRoom from './components/GameRoom'
import MultiGameRoom from './components/MultiGameRoom'
import Nav from './components/Nav'
import NewQuiz from './components/NewQuiz'
import BrowseQuizes from './components/BrowseQuizes'
import AfterRoomLeave from './components/AfterRoomLeave'
import GameEnded from './components/GameEnded'
import StripeSubscriptions from './components/payment/StripeSubscriptions'
import Plans from './components/payment/Plans'
import MemberRoom from './components/MemberRoom'
import Background from './components/Background'
import Profile from './components/profile/Profile';



import { toast } from 'react-toastify';
import axios from 'axios';
import Login from './components/Auth/Login';
import NewMultiQuiz from './components/NewMultiQuiz';
import PodiumAnimation from './components/PodiumAnimation';
import { Button } from '@material-ui/core';
import MyProfile from './components/profile/MyProfile';
import ViewQuiz from './components/ViewQuiz';
import ViewMultiQuiz from './components/ViewMultiQuiz';
import SharePopup from './components/SharePopup';


const firebaseConfig = {
  apiKey: "AIzaSyAuhaVNdwDaivPThUZ6wxYKCkvs0tEDRNs",
  authDomain: "livequiz-20442.firebaseapp.com",
  projectId: "livequiz-20442",
  storageBucket: "livequiz-20442.appspot.com",
  messagingSenderId: "1096465541426",
  appId: "1:1096465541426:web:fed06729c47b7cd3160f2b",
  measurementId: "G-7TZ8J1DMSJ"
};

const instance = firebase.initializeApp(firebaseConfig);

export const getFirebase = () => {
  if (typeof window !== "undefined") {
    return instance;
  }

  return null;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    if(JSON.parse(localStorage.getItem('user')) !== null){
      console.log(JSON.parse(localStorage.getItem('user')).profileObj)
      setIsLoggedIn(true);
      document.getElementById('profilePic').removeAttribute('hidden')
      document.getElementById('profilePic').src = JSON.parse(localStorage.getItem('user')).profileObj.imageUrl

      firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}/subscriptionObj/id`).on('value',(snap)=>{
        if(snap.exists()){
          const id = snap.val()
          fetchCustomerData(id)
        }
      });
    }
    else{
      if(window.location.pathname == '/login') return
      const ToastContent = () => (
        <div className="toast-content">
          <h3>You Have To Login If You Want To Use CONNECT!</h3>
          <Button variant='contained' color='primary' onClick={()=>{window.location = '/login'}}>Login</Button>
        </div>
      )
      toast.info(<ToastContent/>)
      return
    }
    window.onbeforeunload = function() {
      localStorage.removeItem(JSON.parse(localStorage.getItem('user')).profileObj.googleId);
    }
    return () => {
      //cleanup
    }
  }, [])

  const fetchCustomerData = async (id)=>{
    const res = await axios.post('https://connect-now-backend.herokuapp.com/get-customer-data', {subId: id});
    var plan = ''
    if(JSON.parse(res.data.subscriptionDetails).status == 'canceled'){
      plan = 'Starter'
    }
    if(JSON.parse(res.data.subscriptionDetails).status == 'active'){
      plan = 'Classroom'
    }
    else{
      plan = 'Starter'
    }

    setCustomerId(JSON.parse(res.data.subscriptionDetails).customer)
    console.log(JSON.parse(res.data.subscriptionDetails))
    firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}`).update({
      UserName: `${JSON.parse(localStorage.getItem('user')).profileObj.givenName} ${JSON.parse(localStorage.getItem('user')).profileObj.familyName}`,
      email: JSON.parse(localStorage.getItem('user')).profileObj.email,
      subscriptionObj: JSON.parse(res.data.subscriptionDetails),
      planAtive: JSON.parse(res.data.subscriptionDetails).status,
      planStatus: JSON.parse(res.data.subscriptionDetails).status,
      plan: plan,
      imageUrl: JSON.parse(localStorage.getItem('user')).profileObj.imageUrl


    }) 
  }

  return (
      <Router>
    <div className="App">
      <Nav isLoggedIn={isLoggedIn} customerId={customerId}/>
      <div style={{margin:'0 !important'}} id='navMargin'/>
      <Background/>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/play' component={EnterCodeForm}/>
        <Route path='/normal/:room/:gameid/:user/:maxpodium' component={GameRoom}/>
        <Route path='/multi/:room/:gameid/:user/:maxpodium' component={MultiGameRoom}/>
        <Route path='/newquiz' component={NewQuiz}/>
        <Route path='/new-multi-quiz' component={NewMultiQuiz}/>
        <Route path='/browsequizzes/:gamemode' component={BrowseQuizes}/>
        <Route path='/roomleave' component={AfterRoomLeave}/>
        <Route path='/gamefinsihed/:room/:user' component={GameEnded}/>
        <Route path='/plans' component={Plans}/>
        <Route path='/subscription/:plan' component={StripeSubscriptions}/>
        <Route path='/login' component={Login}/>
        <Route path='/profile' component={MyProfile}/>
        <Route path='/profiles/:id' component={Profile}/>
        <Route path='/quiz/normal/:code' component={ViewQuiz}/>
        <Route path='/quiz/multi/:code' component={ViewMultiQuiz}/>
      </Switch>
    </div>
  </Router>
  );
}
export default App;
