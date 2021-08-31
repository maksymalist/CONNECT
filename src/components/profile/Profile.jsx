import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Button, Tab, Tabs, Chip, Avatar } from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'

import firebase from "firebase"
import "firebase/database";

import { toast } from 'react-toastify'
import axios from 'axios'

import '../../style/profileStyles.css'

import Placeholder from '../../img/quizCoverPlaceholder.svg'

function Profile() {

    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [userImage, setUserImage] = useState('')

    const [userQuizzes, setUserQuizzes] = useState([])

    const [value, setValue] = useState(0);

    const quizzesTab = useRef(null)

    const { id } = useParams()
    const [userId, setUserId] = useState(id)

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(() => {
        if(id === JSON.parse(localStorage.getItem('user')).profileObj.googleId){
            window.location = '/profile'
            return
        }
        firebase.database().ref(`users/${id}`).on('value', (snapshot) => {
            const data = snapshot.val()
            if(data === undefined) return

            console.log(data)
            getMyQuizzes()
            setUserEmail(data.email)
            setUserName(data.UserName)
            if(data.googleObj !== undefined) {
                setUserImage(data.googleObj.profileObj.imageUrl)
                return
            }
            else {
                setUserImage(undefined)
            }
            if(data.imageUrl !== undefined) {
                setUserImage(data.imageUrl)
                return
            }
            else {
                setUserImage(undefined)
            }
        })
    }, [])

    const getMyQuizzes = () => {
        if(quizzesTab.current !== null) {
            quizzesTab.current.innerHTML = ''
        }
        
        firebase.database().ref('quizes').on('value', (snapshot) => {
            console.log(snapshot.val())
            const data = snapshot.val()
            const keys = Object.keys(data)

            keys.map((key) => {
                console.log(data[key])
                if( data[key].userID === id ) {
                    setUserQuizzes(prev => [...prev, {
                        key: key,
                        quiz: data[key],
                    }])
                }
            })
            userQuizzes.map((quiz)=>{
                console.log(quiz)
            })
        })
        firebase.database().ref('multiQuizzes').on('value', (snapshot) => {
            console.log(snapshot.val())
            const data = snapshot.val()
            const keys = Object.keys(data)

            keys.map((key) => {
                console.log(data[key])
                if( data[key].userID === id) {
                    setUserQuizzes(prev => [...prev, {
                        key: key,
                        quiz: data[key],
                    }])
                }
            })
            userQuizzes.map((quiz)=>{
                console.log(quiz)
            })
        })
    }

    const handleQuizClick = (key) => {
        firebase.database().ref(`multiQuizzes/${key}`).on('value', (snapshot) => {
            if(snapshot.exists()) {
                window.location.href = `/quiz/multi/${key}`
                return
            }
        })
        firebase.database().ref(`quizes/${key}`).on('value', (snapshot) => {
            if(snapshot.exists()) {
                window.location.href = `/quiz/normal/${key}`
                return
            }
        })
    }

    return (
        <div className="profile-container">
            <div className='profile-banner'></div>
            <div className='profile-wrapper'>
                <div className='profile-info-bar'>
                    {   
                        userImage === undefined ?
                        <Avatar style={{borderRadius:'50%', marginTop:'-50px', width:'100px', height:'100px', fontSize:'50px', backgroundColor:'#6976EA'}} alt={userName}>{userName.charAt(0)}</Avatar>
                            :   
                        <img alt='user-pfp' src={userImage} style={{borderRadius:'50%', marginTop:'-50px', width:'100px', height:'100px'}}/>
                    }
                    <div className="profile-info-text">
                        <Typography style={{fontWeight:'bold', margin:'20px'}} variant='h5'>{userName}</Typography>
                        <Typography style={{margin:'20px'}} variant='h6'>{userEmail}</Typography>
                    </div>
                </div>
                <div className='profile-tabs-slider-container'>
                    <Tabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                        aria-label="disabled tabs example"
                    >
                        <Tab label="Quizzes" />
                        <Tab label="Saved" />
                        <Tab label="Recents" />
                    </Tabs>
                </div>
            </div>
            <div className="profile-tab">
                {
                    value === 0?
                    <div>
                        <h1>Quizzes</h1>
                        <div className="profile-tab-quizzes" ref={quizzesTab}>
                                {
                                    userQuizzes.map((data, index) => {
                                        return (
                                                <div onClick={()=>{handleQuizClick(data.key)}} className='newQuiz' style={{overflowY:'auto', overflowX:'hidden'}}>
                                                <img style={{width:'100%', height:'300px'}} src={data.quiz.coverImg || Placeholder} alt='cover-img'/>
                                                <h2>{data.quiz.name}</h2>
                                                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                                    {
                                                        data.quiz.userProfilePic == undefined ?
                                                        <AccountCircle style={{marginRight:'10px'}} color='primary'/>
                                                        :
                                                        <img 
                                                            width='25px' 
                                                            height='25px' 
                                                            src={data.quiz.userProfilePic} 
                                                            alt={data.quiz.userProfilePic}
                                                            style={{
                                                                borderRadius:'100%',
                                                                marginRight:'10px'
                                                            }}
                                                        />                       
                                                    }
                                                    <h3>{`by ${data.quiz.userName}`}</h3>
                                                </div>
                                                {/* <Button variant='contained' size='small' color='primary' style={{margin:'10px'}}>Edit</Button> */}
                                                <div>
                                                    {
                                                        data.quiz.tags == undefined ?
                                                        null
                                                        :
                                                        <div>
                                                            <br></br>
                                                            {
                                                                data.quiz.tags.map((tag,index)=>{
                                                                    return <Chip style={{margin:'5px'}} key={tag+index} label={tag} color="primary" />
                                                                })
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                                </div>
                                        )
                                    })
                                }
                        </div>
                    </div>
                    :
                    null
                }
                {
                    value === 1?
                    <h1>Saved</h1>:
                    null
                }
                {
                    value === 2 ?
                    <h1>Recents</h1>:
                    null
                }
            </div>
        </div>
    )
}

export default Profile