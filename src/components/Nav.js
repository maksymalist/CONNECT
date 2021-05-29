import '../App.css';
import React, {useState, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom'
import ReactDOM from 'react-dom'
import GoogleLogin from 'react-google-login'
import { toast } from 'react-toastify';
import { Popover } from '@headlessui/react'

import logo from '../img/logoo.PNG'

//firebase
import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";

export var ActiveUser = null
export var profilePic = null



function Nav() {

    const navStyle = {
        color: "white"
    }
    function updateUsers(email, googleId, userName){
      firebase.database().ref(`users/${googleId}`).set({
        UserName: userName,
        email: email,
        planStatus: 'inactive',
        planDuration: 0,
        plan: 'Starter',
        clientSecret: 0,
        customerObj: 0,
        googleObj: JSON.parse(localStorage.getItem('user')),
        subscriptionObj: 0

  
      })
    }



    const responseGoogle = (response)=>{
      console.log(response)
      ActiveUser = `Active User: ${response.profileObj.givenName} ${response.profileObj.familyName}` 
      toast.success(ActiveUser)
      localStorage.setItem('user', JSON.stringify(response))

      document.getElementById('profilePic').removeAttribute('hidden')
      document.getElementById('profilePic').src = JSON.parse(localStorage.getItem('user')).profileObj.imageUrl

      firebase.database().ref(`users/${response.profileObj.googleId}`).on('value',(snap)=>{
        if(snap.exists()){
          window.location.reload()
        }
        else{
          updateUsers(response.profileObj.email.replace('.', ''), response.profileObj.googleId, `${response.profileObj.givenName} ${response.profileObj.familyName}`)
          window.location.reload()
        }
      });

      
  }

  return (
    <nav>
        <ul>
            <img hidden style={{borderRadius:'100px', marginTop:'3px'}} className='liright' height='40px' width='40px' id='profilePic'></img>
            <div style={{marginBottom:'3px'}} id='googleLogin'>
            <GoogleLogin
            clientId='701696427912-ajmlkcj3hpo46q5fokhtn5mmeib0m3be.apps.googleusercontent.com'
            buttonText='Login'
            onSuccess={responseGoogle}
            onFailure={()=>{console.log(Error)}}
            cookiePolicy={'single_host_origin'}
            className='liright-google'
            
            />
            </div>
            <Link to='/'>
            <img id='home' className="nav-links lileft" width={50} height={50} src={logo}></img><li className="nav-links lileft">Home</li>
            </Link>
            <div class="dropdown">
              <button class="dropbtn">Menu ▼</button>
                <div class="dropdown-content">
                  <a href="/newquiz">NEW QUIZ</a>
                  <a href="/browsequizes">QUIZES</a>
                  <a href="/plans">PLANS</a>
                </div>
            </div>
            <Link style={navStyle} to='/newquiz'>
              <li className="nav-links lileft">New Quiz</li>
            </Link>
            <Link style={navStyle} to='/browsequizes'>
              <li className="nav-links lileft">Browse Existing Quizes</li>
            </Link>
            <Link style={navStyle} to='/plans'>
              <li className="nav-links lileft">plans</li>
            </Link>
        </ul>
    </nav>

  );
}

export default Nav;

