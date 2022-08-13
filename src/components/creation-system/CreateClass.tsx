//@ts-nocheck
import {
  Typography,
  Button,
  Divider,
  TextField,
  Chip,
  Avatar,
} from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'
import UploadBox from '../misc/UploadButton'
import { v4 as uuidv4 } from 'uuid'

import 'firebase/database'
import { toast } from 'react-toastify'

import axios from 'axios'

import config from '../../config.json'

//redux
import { useSelector } from 'react-redux'

import { useMutation, gql } from '@apollo/client'

//hooks
import getUser from '../../hooks/getUser'
import useTranslations from '../../hooks/useTranslations'

const CREATE_CLASS = gql`
  mutation createClassroom(
    $_id: ID!
    $name: String!
    $banner: String!
    $owner: ID!
  ) {
    createClassroom(_id: $_id, name: $name, banner: $banner, owner: $owner)
  }
`

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
`

const CREATE_MEMBER_OWNER = gql`
  mutation createMember($classId: ID!, $userId: ID!, $role: String!) {
    createMember(classId: $classId, userId: $userId, role: $role)
  }
`
const CREATE_MEMBER = gql`
  mutation createMember($classId: ID!, $userId: ID!, $role: String!) {
    createMember(classId: $classId, userId: $userId, role: $role)
  }
`

const CLASSROOM_PREFIX = 'class:'
const USERID_PREFIX = 'user:'

function CreateClass() {
  const user = getUser()
  const [className, setClassName] = useState('')
  const [members, setMembers] = useState([])

  const plan = useSelector((state) => state.plan)

  //inputs
  const [currentMember, setCurrentMember] = useState('')

  const imgRef = useRef(null)
  const [imgSrc, setImgSrc] = useState('')

  const translations = useTranslations()

  const [createClassMutation] = useMutation(CREATE_CLASS)
  const [createNotificationMutation] = useMutation(CREATE_NOTIFICATION)

  const [createMemberOwnerMutation] = useMutation(CREATE_MEMBER_OWNER)

  useEffect(() => {
    if (plan === 'Starter') {
      window.location.href = '/'
    }
  }, [])

  const createClass = () => {
    const classID = CLASSROOM_PREFIX + uuidv4()
    const classData = {
      _id: classID,
      name: className || '',
      banner: imgSrc || '',
      owner: user?.profileObj?.googleId,
    }

    /*create class*/
    createClassMutation({ variables: classData })

    /*notify owner*/
    const notification = {
      userId: user?.profileObj?.googleId,
      type: 'class_created',
      message: `You have succesfully created ${classData.name}!`,
      data: classID,
    }

    const ownerData = {
      classId: classID,
      userId: 'user:' + user?.profileObj?.googleId,
      role: 'owner',
    }

    createNotificationMutation({ variables: notification })
    createMemberOwnerMutation({ variables: ownerData })

    /*notify members*/

    window.location = `/class/${classID}`
  }

  return (
    <div>
      <div style={{ marginTop: '100px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            backgroundColor: 'white',
            margin: '10px',
            border: '2px solid black',
            boxShadow: '10px 10px 0 #262626',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h2" gutterBottom>
              <b>{translations.createclass.title}</b>
            </Typography>
            <br></br>
            <Divider style={{ width: '90vw' }} light />
            <br></br>
            <Typography variant="h5" style={{ margin: '10px' }}>
              {translations.createclass.steps.step1}
            </Typography>
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="userInput quizName"
              type="text"
              placeholder={translations.createclass.steps.input1}
            ></input>
          </div>
          <div>
            <Typography variant="h5" style={{ marginTop: '100px' }}>
              {translations.createclass.steps.step2}
            </Typography>
            <UploadBox setImg={setImgSrc} />
          </div>
          <div>
            <Button
              style={{ margin: '50px' }}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                createClass()
              }}
            >
              {translations.createclass.steps.createclassbutton}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateClass
