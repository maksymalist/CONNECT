import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../style/viewQuizStyles.css'

import { Divider, Typography, Button } from '@material-ui/core'

import { AccountCircle } from '@material-ui/icons'

import firebase from "firebase"
import "firebase/database";

import Placeholder from '../img/quizCoverPlaceholder.svg'

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
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                        {   
                            quiz.userProfilePic !== undefined ?
                            <img style={{width:'30px', height:'30px', marginRight:'10px', borderRadius:'50%'}} draggable='false' src={quiz.userProfilePic} alt="quiz-img" />
                            :
                            <AccountCircle style={{width:'30px', height:'30px', marginRight:'10px', borderRadius:'50%'}} color='primary'/>
                        }
                        <h3>by {quiz.userName || 'undefined'}</h3>
                    </div>
                </div>
            </div>
            <div className="view__quiz__content__questions">
                <div style={{display:'flex', justifyContent:'space-between', position:'sticky', top:'0', backgroundColor:'white', padding:'10px', zIndex:'1', 
                borderBottom:'1px solid #c4c4c4'}}>
                    <Typography variant="h5" component='h5'>Steps({numberOfSteps})</Typography>
                    {
                        ansIsShown ?
                        <Button variant="contained" color="secondary" onClick={()=>handleHideAnswers()}>Hide Answers</Button>
                        :
                        <Button variant="contained" color="primary" onClick={()=>handleShowAnswers()}>Show Answers</Button>
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