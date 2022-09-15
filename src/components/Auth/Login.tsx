import React, { useState } from 'react'
import GoogleLogin from 'react-google-login'
import { Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
//style
import '../../style/loginStyles.css'
import { useMutation, gql } from '@apollo/client'
import axios from 'axios'
import config from '../../config.json'
//role imgs
import LoginArt from '../../img/Login/loginArt.svg'
import teacher from '../../img/Login/teacher_role.svg'
import student from '../../img/Login/student_role.svg'
import useTranslations from '../../hooks/useTranslations'
//mutations
const CREATE_USER = gql`
  mutation createUser(
    $id: ID!
    $name: String!
    $email: String!
    $imageUrl: String!
    $plan: String!
    $role: String!
  ) {
    createUser(
      id: $id
      name: $name
      email: $email
      imageUrl: $imageUrl
      plan: $plan
      role: $role
    )
  }
`
function Login() {
  const translations = useTranslations()
  const [createUser] = useMutation(CREATE_USER)
  const search = useLocation().search
  const Gamecode = new URLSearchParams(search).get('code')
  const Secret = new URLSearchParams(search).get('secret')
  const EmoteId = new URLSearchParams(search).get('emoteId')
  const [step, setStep] = useState(0)
  const [userObj, setUserObj] = useState({})
  const responseGoogle = async (response: any) => {
    try {
      const res = await axios.post(`${config['api-server']}/user`, {
        userId: response.profileObj.googleId,
      })
      if (res.data) {
        if (Gamecode) {
          localStorage.setItem('user', JSON.stringify(response))
          window.location.reload()
          window.location = `/play?code=${Gamecode}` as any
        } else if (Secret && EmoteId) {
          localStorage.setItem('user', JSON.stringify(response))
          window.location.reload()
          window.location =
            `/claim-emote?secret=${Secret}&emoteId=${EmoteId}` as any
        } else {
          localStorage.setItem('user', JSON.stringify(response))
          window.location.reload()
          window.location.href = '/play'
        }
      } else {
        setStep(1)
        setUserObj(response)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleRole = (role: any, response: any) => {
    createUser({
      variables: {
        name: response.profileObj.name,
        email: response.profileObj.email,
        id: response.profileObj.googleId,
        imageUrl: response.profileObj.imageUrl,
        plan: 'Starter',
        role: role,
      },
    })
    if (Gamecode) {
      localStorage.setItem('user', JSON.stringify(response))
      window.location.reload()
      window.location = `/play?code=${Gamecode}` as any
    } else if (Secret && EmoteId) {
      localStorage.setItem('user', JSON.stringify(response))
      window.location.reload()
      window.location =
        `/claim-emote?secret=${Secret}&emoteId=${EmoteId}` as any
    } else {
      localStorage.setItem('user', JSON.stringify(response))
      window.location.reload()
      window.location.href = '/tutorial'
    }
  }
  return (
    <div className="login-main-container">
      {step === 0 && (
        <div className="login-component-container">
          <br />
          <Typography variant="h3" className="login-title">
            <b style={{ color: '#6C63FF' }}>{translations.login.title}</b>
          </Typography>
          <br />
          <br />
          <Typography variant="h6" className="login-title">
            <b style={{ fontStyle: 'italic' }}>{translations.login.title2}</b>
          </Typography>
          <br />
          <div style={{ width: '100%', height: 'auto', marginBottom: '40px' }}>
            <img
              src={LoginArt}
              alt="login-art"
              style={{
                width: '95%',
                height: '300px',
              }}
            />
          </div>
          <GoogleLogin
            clientId="701696427912-ajmlkcj3hpo46q5fokhtn5mmeib0m3be.apps.googleusercontent.com"
            buttonText={translations.login.googlebutton}
            onSuccess={responseGoogle}
            onFailure={(error) => {
              console.log(error)
              if (error.error === 'popup_closed_by_user') {
                return
              }
              window.location = '/no-local-storage' as any
            }}
            cookiePolicy={'single_host_origin'}
            style={{ backgroundColor: '#e0e0e0' }}
            className="google-login-button"
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSey6V_tD3Sp4YDE9Q-PY5nuMFv6s5Q7_2BPfbFDXQ2CjoTfkg/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'underline',
                color: '#6c63ff',
              }}
            >
              {translations.login.reportissue}
            </a>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="login-component-container-blank">
          <Typography
            variant="h3"
            className="login-title"
            style={{ color: 'white' }}
          >
            <b>{translations.login.role.title}</b>
          </Typography>
          <div style={{ width: '100%', height: '100px' }} />
          <div className="role__img__wrapper">
            <div className="role__img__card">
              <Typography variant="h4" className="login-title">
                <b>{translations.login.role.teacher}</b>
              </Typography>
              <img
                src={teacher}
                alt="teacher"
                className="login-role-img"
                onClick={() => {
                  handleRole('teacher', userObj)
                }}
              />
            </div>
            <div className="role__img__card">
              <Typography variant="h4" className="login-title">
                <b>{translations.login.role.student}</b>
              </Typography>
              <img
                src={student}
                alt="student"
                className="login-role-img"
                onClick={() => {
                  handleRole('student', userObj)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Login
