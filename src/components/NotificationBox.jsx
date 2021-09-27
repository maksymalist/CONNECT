import React, { useState, useEffect } from 'react'
import '../style/notificationStyles.css'

import firebase from "firebase/app"
import "firebase/database";

import { Typography, Button, Divider } from '@material-ui/core'

import Translations from '../translations/translations.json'

function NotificationBox() {

    const [notifications, setNotifications] = useState([])

    const [userLanguage, setUserLanguage] = useState(localStorage.getItem('connectLanguage') || 'english')

    useEffect(() => {
        getNotifications()
    },[])

    const getNotifications = () => {
        firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}/notifications`).on('value',(snap)=>{
            if(snap.val() == undefined) return
            const notificationsSnap = snap.val()
            const keys = Object.keys(notificationsSnap)

            const notificationsArr = []

            for(let i = 0; i < keys.length; i++){
                console.log(notificationsSnap[keys[i]])
                notificationsArr.push(notificationsSnap[keys[i]])
            }
            setNotifications(notificationsArr)

            console.log(notificationsArr)
        })
    }

    const NotificationCard = ({message}) => (
        <div className="notification__card">
            <Typography variant="h6" className="notification__card__title">{message}</Typography>
        </div>
    )

    const NotificationJoinCard = ({message, code}) => (
        <div className="notification__card">
            <Typography variant="h6" className="notification__card__title">{message}</Typography>
            <Button variant="contained" color="primary" className="notification__card__button" onClick={()=>window.location = `/play?code=${code}`}>Join</Button>
        </div>
    )

    const clearNotifications = () => {
        firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}/notifications`).set({})
        setNotifications([])
    }

    return (
        <div className='notification__box'>
            <div className='notification__header'>
                <Typography variant='h6' className='notification__title'><b>{Translations[userLanguage].notifications.title}</b></Typography>
                <div style={{width:'90%'}}>
                    <Divider light/>
                </div>
            </div>
            <div className='notification__scroll__section'>
                {notifications.map((notification, index) => {
                    if(notification.type === 'class_created') {
                        return <NotificationCard message={notification.message}/>
                    }
                    if(notification.type === 'added_to_class') {
                        return <NotificationCard message={notification.message}/>
                    }
                    if(notification.type === 'removed_from_class') {
                        return <NotificationCard message={notification.message}/>
                    }
                    if(notification.type === 'invitation_to_room') {
                        return <NotificationJoinCard code={notification.room} message={notification.message}/>
                    }
                })}
            </div>
            <div>
                <Button style={{margin:'10px'}} variant="contained" color="secondary" className="notification__card__button" onClick={()=>clearNotifications()}>{Translations[userLanguage].notifications.clear}</Button>
            </div>
        </div>
    )
}

export default NotificationBox

