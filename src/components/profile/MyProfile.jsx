import React, { useState, useEffect, useRef } from 'react'
import { Typography, Button, Tab, Tabs, Chip, Divider} from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'

import firebase from "firebase"
import "firebase/database";

import { toast } from 'react-toastify'

import '../../style/profileStyles.css'

import Placeholder from '../../img/quizCoverPlaceholder.svg'
import Translations from '../../translations/translations.json'

function MyProfile() {

    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [userImage, setUserImage] = useState('')

    const [userQuizzes, setUserQuizzes] = useState([])

    const [value, setValue] = useState(0);

    const [userLanguage, setUserLanguage] = useState(localStorage.getItem('connectLanguage') || 'english')

    const quizzesTab = useRef(null)

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(() => {
        setUserEmail(JSON.parse(localStorage.getItem('user')).profileObj.email)
        setUserName(JSON.parse(localStorage.getItem('user')).profileObj.name)
        setUserImage(JSON.parse(localStorage.getItem('user')).profileObj.imageUrl)
        getMyQuizzes()
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
                if( data[key].userID == JSON.parse(localStorage.getItem('user')).profileObj.googleId) {
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
                if( data[key].userID == JSON.parse(localStorage.getItem('user')).profileObj.googleId) {
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
                    <img alt='user-pfp' src={userImage} style={{borderRadius:'50%', marginTop:'-50px', width:'100px', height:'100px'}}/>
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
                        <Tab label={Translations[userLanguage].profile.quizzes.title} />
                        <Tab label={Translations[userLanguage].profile.saved.title} />
                        <Tab label={Translations[userLanguage].profile.class.title} />
                    </Tabs>
                </div>
            </div>
            <div className="profile-tab">
                {
                    value === 0?
                    <div>
                        <h1>{Translations[userLanguage].profile.quizzes.title}</h1>
                        <Divider style={{marginLeft:'10px', marginRight:'10px'}}/>
                        <br></br>
                        <div className="profile-tab-quizzes" ref={quizzesTab}>
                                {
                                    userQuizzes.map((data, index) => {
                                        return (
                                                <div onClick={()=>{handleQuizClick(data.key)}} className='newQuiz' style={{overflowY:'auto', overflowX:'hidden', maxWidth:'300px'}}>
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
                                                    <h3>{`${Translations[userLanguage].profile.quizzes.by} ${data.quiz.userName}`}</h3>
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
                    <div>
                        <h1>{Translations[userLanguage].profile.saved.title}</h1>
                         <Divider style={{marginLeft:'10px', marginRight:'10px'}}/>
                        <br></br>
                    </div>:
                    null
                }
                {
                    value === 2 ?
                    <div>
                        <h1>{Translations[userLanguage].profile.class.title}</h1>
                        <Divider style={{marginLeft:'10px', marginRight:'10px'}}/>
                        <br></br>
                    </div>:
                    null
                }
            </div>
        </div>
    )
}

export default MyProfile
