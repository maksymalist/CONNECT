import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../style/viewQuizStyles.css'

import { Divider, Typography, Button, Chip } from '@material-ui/core'

import { AccountCircle } from '@material-ui/icons'

import firebase from "firebase"
import "firebase/database";

import Placeholder from '../img/quizCoverPlaceholder.svg'

import Translations from '../translations/translations.json'

function ViewMultiQuiz() {

    const [quiz, setQuiz] = useState([])
    const [ansIsShown, setAnsIsShown] = useState(false)

    const [numberOfSteps, setnumberOfSteps] = useState(0)

    const [steps, setSteps] = useState([])

    const { mode, code } = useParams()

    useEffect(() => {
        Object.keys(document.getElementsByClassName('view__quiz__content__question')).map((el, index) => {
            if(document.getElementsByClassName('view__quiz__content__question')[index] !== undefined)
                document.getElementsByClassName('view__quiz__content__question')[index].remove()
        })
        firebase.database().ref(`/multiQuizzes/${code}`).on('value', (snapshot) => {

            const data = snapshot.val()

            console.log(data)

            setQuiz(data)

            Object.keys(data.steps).map((step, index)=>{
                setSteps(prevState => [...prevState, {
                    step: step,
                    questions: data.steps[step],
                }])
            })

            const len = Object.keys(data.steps).length
            setnumberOfSteps(len)



        })
    }, [])

    const handleShowAnswers = () => {
        setAnsIsShown(true)
    }

    const handleHideAnswers = () => {
        setAnsIsShown(false)
    }

    const StartButton = ({ code }) => (
        <svg style={{position:'unset'}} onClick={()=>{window.location = `/play?gamecode=${code}`}} id='playButtonSvg' width="69" height="100" viewBox="0 0 69 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="triangles" clip-path="url(#clip0)">
            <g id="darkGroup">
                <path id="dark2" opacity="0.75" d="M44 48.268C45.3333 49.0378 45.3333 50.9622 44 51.732L9.5 71.6506C8.16666 72.4204 6.5 71.4582 6.5 69.9186L6.5 30.0814C6.5 28.5418 8.16667 27.5796 9.5 28.3494L44 48.268Z" fill="#1BB978"/>
                <path id="dark1" opacity="0.75" d="M66 48.268C67.3333 49.0378 67.3333 50.9622 66 51.732L31.5 71.6506C30.1667 72.4204 28.5 71.4582 28.5 69.9186L28.5 30.0814C28.5 28.5418 30.1667 27.5796 31.5 28.3494L66 48.268Z" fill="#1BB978"/>
            </g>
            <g id="lightGroup">
                <path id="light1" opacity="0.75" d="M44 48.268C45.3333 49.0378 45.3333 50.9622 44 51.732L9.5 71.6506C8.16666 72.4204 6.5 71.4582 6.5 69.9186L6.5 30.0814C6.5 28.5418 8.16667 27.5796 9.5 28.3494L44 48.268Z" fill="#6ED69A"/>
            </g>
        </g>
        <defs>
            <clipPath id="clip0">
            <rect width="69" height="100" fill="white"/>
            </clipPath>
        </defs>
        </svg>
    )

    return (
        <div className='view__quiz__flex'>
            <div className="view__quiz__content">
                {
                    quiz.coverImg !== undefined ?
                    <img style={{width:'100%', height:'400px'}} src={quiz.coverImg} alt="quiz" className="view__quiz__image" />
                    :
                    <img style={{width:'100%', height:'400px'}} src={Placeholder} alt="quiz" className="view__quiz__image" />
                }
                <div style={{float:'left', padding:'10px'}}>
                    <Typography variant="h4" component='h4'>{quiz.name}</Typography>
                    <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                        <br></br><StartButton code={code} />
                    </div>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'flex-start'}}>
                        {   
                            quiz.userProfilePic !== undefined ?
                            <img style={{width:'30px', height:'30px', marginRight:'10px', borderRadius:'50%'}} draggable='false' src={quiz.userProfilePic} alt="quiz-img" />
                            :
                            <AccountCircle style={{width:'30px', height:'30px', marginRight:'10px', borderRadius:'50%'}} color='primary'/>
                        }
                        <h3>{Translations[localStorage.getItem('connectLanguage')].multiquiz.by} {quiz.userName || 'undefined'}</h3>
                    </div>
                        <div>
                            {
                                quiz.tags == undefined ?
                                null
                                :
                                <div>
                                    <br></br>
                                    {
                                        quiz.tags.map((tag,index)=>{
                                            return <Chip style={{margin:'5px'}} key={tag+index} label={tag} color="primary" />
                                        })
                                    }
                                </div>
                            }
                        </div>
                </div>
            </div>
            <div className="view__quiz__content__questions">
                <div style={{display:'flex', justifyContent:'space-between', position:'sticky', top:'0', backgroundColor:'white', padding:'10px', zIndex:'1', 
                borderBottom:'1px solid #c4c4c4'}}>
                    <Typography variant="h5" component='h5'>{Translations[localStorage.getItem('connectLanguage')].multiquiz.steps}({numberOfSteps})</Typography>
                    {
                        ansIsShown ?
                        <Button variant="contained" color="secondary" onClick={()=>handleHideAnswers()}>{Translations[localStorage.getItem('connectLanguage')].multiquiz.hideanswers}</Button>
                        :
                        <Button variant="contained" color="primary" onClick={()=>handleShowAnswers()}>{Translations[localStorage.getItem('connectLanguage')].multiquiz.showanswers}</Button>
                    }
                </div>
                {
                    steps.map((step, index) => {
                        console.log(step)
                        return (
                            <div key={index}>
                                <Typography variant="h4" component='h4'>{step.step}</Typography>
                                {
                                    Object.keys(step.questions).map((question, index) => {
                                        return (
                                            <div key={index} className='view__quiz__content__question'>
                                                <Typography variant="h6" component='h6'>{step.questions[question].question}</Typography>
                                                {
                                                    ansIsShown ?
                                                    <div style={{width:'100%'}}>
                                                        <br></br>
                                                        <Divider light/>
                                                        <br></br>
                                                        <Typography variant="h6" component='h6'>{step.questions[question].answer}</Typography>
                                                    </div>
                                                    :
                                                    null
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ViewMultiQuiz