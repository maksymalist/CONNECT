import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";


import EnterCodeForm from './components/EnterCodeForm'
import HostRoom from './components/HostRoom'
import WaitingRoom from './components/WaitingRoom'
import GameRoom from './components/GameRoom'
import Nav from './components/Nav'
import NewQuiz from './components/NewQuiz'
import BrowseQuizes from './components/BrowseQuizes'
import AfterRoomLeave from './components/AfterRoomLeave'
import GameEnded from './components/GameEnded'

const firebaseConfig = {
  apiKey: "AIzaSyAuhaVNdwDaivPThUZ6wxYKCkvs0tEDRNs",
  authDomain: "livequiz-20442.firebaseapp.com",
  projectId: "livequiz-20442",
  storageBucket: "livequiz-20442.appspot.com",
  messagingSenderId: "1096465541426",
  appId: "1:1096465541426:web:fed06729c47b7cd3160f2b",
  measurementId: "G-7TZ8J1DMSJ"
};

firebase.initializeApp(firebaseConfig);

function App() {
  return (
      <Router>
    <div className="App">
      <Nav/>
      <Switch>
        <Route exact path='/' component={EnterCodeForm}/>
        <Route path='/gameroom/:room/:gameid/:user' component={GameRoom}/>
        <Route path='/newquiz' component={NewQuiz}/>
        <Route path='/browsequizes' component={BrowseQuizes}/>
        <Route path='/roomleave' component={AfterRoomLeave}/>
        <Route path='/gamefinsihed/:room/:user' component={GameEnded}/>
      </Switch>
    </div>
  </Router>
  );
}

export default App;
