import React, { useState } from 'react'
import GoogleLogin from 'react-google-login'
import { toast } from 'react-toastify';

//style
import '../../style/loginStyles.css'

//firebase
import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";

//imgs
import logo from '../../img/logo.svg'

import Translations from '../../translations/translations.json'
import { useMutation, gql } from '@apollo/client';
import axios from 'axios';

function Login() {

  //mutations
  const CREATE_USER = gql`
    mutation createUser($id: ID!, $name: String!, $email: String!, $imageUrl: String!, $plan: String) {
      createUser(id: $id, name: $name, email: $email, imageUrl: $imageUrl, plan: $plan)
    }
  `

  //queries
  const GET_USER = gql`
    query($id: ID!) {
      user(id: $id) {
        _id
      }
    }
  `

  const [userLanguage, setUserLanguage] = useState(localStorage.getItem('connectLanguage') || 'english')
  const [createUser] = useMutation(CREATE_USER);
  
      const responseGoogle = async (response)=>{
        localStorage.setItem('user', JSON.stringify(response))
        const res = await axios.post('http://localhost:3001/user', { userId: response.profileObj.googleId })
        if(res.data){
          window.location.reload()
          window.location.href = '/play'
        }
        else{
          createUser({ variables: { name: response.profileObj.name, email: response.profileObj.email, id: response.profileObj.googleId, imageUrl: response.profileObj.imageUrl, plan: "Starter"} })
          window.location.reload()
          window.location.href = '/play'
        }
      }
    return (
        <div className='login-main-container'>
            <div className='login-component-container'>
                <img id='home' onClick={()=>{window.location = '/'}} className="nav-links lileft" alt="connect-logo" width={250} height={250} src={logo}/>
                <br></br>
                <h2>{Translations[userLanguage].login.title}</h2>
                <GoogleLogin
                    clientId='701696427912-ajmlkcj3hpo46q5fokhtn5mmeib0m3be.apps.googleusercontent.com'
                    buttonText={Translations[userLanguage].login.googlebutton}
                    onSuccess={responseGoogle}
                    onFailure={()=>{console.log(Error)}}
                    cookiePolicy={'single_host_origin'}
                    style={{backgroundColor: '#e0e0e0'}}
                />
              </div>
        </div>
    )
}

export default Login
