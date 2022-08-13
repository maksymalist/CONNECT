//@ts-nocheck
import {
  Button,
  Chip,
  Divider,
  TextareaAutosize,
  Typography,
  useMediaQuery,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

//apollo
import { useMutation, gql, useQuery } from '@apollo/client'

//img
import RequestSent from '../../img/RequestSent.svg'
import getUser from '../../hooks/getUser'
import useTranslations from '../../hooks/useTranslations'

const GET_CLASS = gql`
  query ($classroomId: ID!) {
    classroom(id: $classroomId) {
      name
      banner
      members {
        _id
      }
    }
  }
`

const CREATE_JOIN_REQUEST = gql`
  mutation (
    $userId: ID!
    $classId: ID!
    $message: String!
    $name: String!
    $imageUrl: String!
  ) {
    createJoinRequest(
      userId: $userId
      classId: $classId
      message: $message
      name: $name
      imageUrl: $imageUrl
    )
  }
`

const JoinClass = () => {
  const isSmall = useMediaQuery('(max-width:600px)')

  const { classId } = useParams()

  const { loading, error, data } = useQuery(GET_CLASS, {
    variables: {
      classroomId: classId,
    },
  })

  const [createJoinRequest] = useMutation(CREATE_JOIN_REQUEST)

  const [step, setStep] = useState(0)
  const user = getUser()
  const translations = useTranslations()

  const [message, setMessage] = useState(
    translations.joinclass.messageplaceholder
  )

  const sendJoinRequest = async (message) => {
    console.log(message)
    createJoinRequest({
      variables: {
        classId: classId,
        message: message,
        userId: 'user:' + user?.profileObj?.googleId,
        name: user?.profileObj?.name,
        imageUrl: user?.profileObj?.imageUrl,
      },
    })
    setStep(2)
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        marginTop: '100px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {step === 0 && (
        <div
          style={
            isSmall
              ? {
                  backgroundColor: 'white',
                  border: '2px solid black',
                  boxShadow: '10px 10px 0 #262626',
                  maxWidth: '800px',
                  width: '100%',
                  height: 'auto',
                }
              : {
                  backgroundColor: 'white',
                  border: '2px solid black',
                  boxShadow: '10px 10px 0 #262626',
                  maxWidth: '800px',
                  width: '100%',
                  maxHeight: '500px',
                }
          }
        >
          <div
            style={
              isSmall
                ? { display: 'flex', flexDirection: 'column' }
                : { display: 'flex', flexDirection: 'row' }
            }
          >
            <div
              style={
                isSmall
                  ? {
                      padding: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      textAlign: 'center',
                    }
                  : {
                      flex: '50',
                      padding: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      textAlign: 'center',
                    }
              }
            >
              <br></br>
              <div>
                <Typography variant="h5">
                  {translations.joinclass.title}
                </Typography>
              </div>
              <div>
                <Typography variant="h3">
                  <b style={{ color: '#6c63ff' }}>
                    {loading
                      ? 'loading...'
                      : error
                      ? ''
                      : data?.classroom?.name}
                  </b>
                </Typography>
              </div>
              <br></br>
              <div>
                <Chip
                  label={
                    loading
                      ? '0'
                      : error
                      ? '0'
                      : data?.classroom?.members?.length +
                        ' ' +
                        translations.joinclass.members
                  }
                  variant="outlined"
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: '100px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Button
                    variant="contained"
                    color="action"
                    size="large"
                    style={{ paddingLeft: '30px', paddingRight: '30px' }}
                    onClick={() => setStep(1)}
                  >
                    {translations.joinclass.button1}
                  </Button>
                  <Link to="/">
                    <Button variant="text" color="secondary" size="large">
                      {translations.joinclass.button2}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div
              style={
                isSmall
                  ? {
                      height: '500px',
                      backgroundSize: 'cover',
                      backgroundImage: `url(${
                        loading ? '' : error ? '' : data?.classroom?.banner
                      })`,
                    }
                  : {
                      flex: '50',
                      height: '500px',
                      backgroundSize: 'cover',
                      backgroundImage: `url(${
                        loading ? '' : error ? '' : data?.classroom?.banner
                      })`,
                    }
              }
            ></div>
          </div>
        </div>
      )}
      {step === 1 && (
        <div
          style={{
            backgroundColor: 'white',
            border: '2px solid black',
            boxShadow: '10px 10px 0 #262626',
            maxWidth: '600px',
            width: '100%',
            height: 'fit-content',
            padding: '20px',
            margin: '20px',
          }}
        >
          <Typography variant="h3" style={{ textAlign: 'center' }}>
            {translations.joinclass.message}
          </Typography>
          <br></br>
          <Divider />
          <br></br>
          <TextareaAutosize
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '600px',
              minHeight: '300px',
              maxHeight: '500px',
              resize: 'vertical',
            }}
          />
          <div
            style={{ display: 'flex', flexDirection: 'column', margin: '30px' }}
          >
            <Button
              variant="contained"
              color="action"
              size="large"
              style={{ paddingLeft: '30px', paddingRight: '30px' }}
              onClick={() => sendJoinRequest(message)}
            >
              {translations.joinclass.button1}
            </Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div
          style={{
            backgroundColor: 'white',
            border: '2px solid black',
            boxShadow: '10px 10px 0 #262626',
            maxWidth: '600px',
            width: '100%',
            height: 'fit-content',
            padding: '20px',
            margin: '20px',
          }}
        >
          <Typography variant="h3" style={{ textAlign: 'center' }}>
            {translations.joinclass.requestsent}
          </Typography>
          <div>
            <img
              src={RequestSent}
              alt="Request Sent"
              style={{
                width: '300px',
                height: 'auto',
                margin: '50px',
              }}
            />
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => (window.location = '/')}
            >
              {translations.joinclass.button3}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default JoinClass
