//@ts-nocheck
import React, { useState } from 'react'
import '../../style/notificationStyles.css'

import {
  Typography,
  Button,
  Divider,
  CircularProgress,
  ClickAwayListener,
  Avatar,
} from '@mui/material'

import { useQuery, useMutation, gql } from '@apollo/client'
import getUser from '../../hooks/getUser'
import useTranslations from '../../hooks/useTranslations'
import { Link } from 'react-router-dom'

const GET_NOTIFICATIONS = gql`
  query allNotificationsByUser($userId: ID!) {
    allNotificationsByUser(userId: $userId) {
      _id
      userId
      type
      message
      data
    }
  }
`

const CLEAR_NOTIFICATIONS = gql`
  mutation clearNotifications($userId: ID!) {
    clearNotifications(userId: $userId)
  }
`

function NotificationBox({ close }) {
  const user = getUser()
  const translations = useTranslations()

  const { loading, error, data } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      userId: user?.profileObj?.googleId,
    },
  })

  const [clearNotifications] = useMutation(CLEAR_NOTIFICATIONS, {
    variables: {
      userId: user?.profileObj?.googleId,
    },
  })

  const NotificationCard = ({ message }) => (
    <div className="notification__card">
      <Typography variant="h6" className="notification__card__title">
        {message}
      </Typography>
    </div>
  )

  const NotificationJoinCard = ({ message, code }) => (
    <div className="notification__card">
      <Typography variant="h6" className="notification__card__title">
        {message}
      </Typography>

      <Link to={`/play?code=${code}`}>
        <Button
          variant="contained"
          color="primary"
          className="notification__card__button"
        >
          {translations.notifications.join}
        </Button>
      </Link>
    </div>
  )

  const NotificationJoinRequestCard = ({ data }) => {
    const userData = JSON.parse(data.data)

    return (
      <div className="notification__card">
        <Typography variant="h6" className="notification__card__title">
          {data.message}:
        </Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Avatar
            style={{ marginRight: '15px', width: '35px', height: '35px' }}
            src={userData.imageUrl}
          >
            {userData.name.charAt(0)}
          </Avatar>
          <Typography variant="h6">{userData.name}</Typography>
        </div>
      </div>
    )
  }

  const handleClearNotifications = () => {
    clearNotifications()
    window.location.reload()
  }

  return (
    <ClickAwayListener onClickAway={close}>
      <div className="notification__box">
        <div className="notification__header">
          <Typography variant="h6" className="notification__title">
            <b>{translations.notifications.title}</b>
          </Typography>
          <div style={{ width: '90%' }}>
            <Divider light />
          </div>
        </div>
        <div className="notification__scroll__section">
          {loading ? (
            <CircularProgress />
          ) : (
            data.allNotificationsByUser.map((notification) => {
              if (notification.type === 'class_created') {
                return <NotificationCard message={notification.message} />
              }
              if (notification.type === 'added_to_class') {
                return <NotificationCard message={notification.message} />
              }
              if (notification.type === 'removed_from_class') {
                return <NotificationCard message={notification.message} />
              }
              if (notification.type === 'join_request') {
                return <NotificationJoinRequestCard data={notification} />
              }
              if (notification.type === 'invitation_to_room') {
                return (
                  <NotificationJoinCard
                    code={JSON.parse(notification.data).room}
                    message={notification.message}
                  />
                )
              }
            })
          )}
        </div>
        <div>
          <Button
            style={{ margin: '10px' }}
            variant="contained"
            color="secondary"
            className="notification__card__button"
            onClick={() => handleClearNotifications()}
          >
            {translations.notifications.clear}
          </Button>
        </div>
      </div>
    </ClickAwayListener>
  )
}

export default NotificationBox
