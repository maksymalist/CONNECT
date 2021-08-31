import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../style/viewQuizStyles.css'

import { Divider, Typography, Button, Chip } from '@material-ui/core'

import { AccountCircle } from '@material-ui/icons'

import firebase from "firebase"
import "firebase/database";
import Placeholder from '../img/quizCoverPlaceholder.svg'

function ViewQuiz() {

    const [quiz, setQuiz] = useState({})
    const [questions, setQuestions] = useState([])
    const [questionLen, setQuestionLen] = useState(0)
    const [ansIsShown, setAnsIsShown] = useState(false)

    const { mode, code } = useParams()

    useEffect(() => {
        Object.keys(document.getElementsByClassName('view__quiz__content__question')).map((el, index) => {
            if(document.getElementsByClassName('view__quiz__content__question')[index] !== undefined)
                document.getElementsByClassName('view__quiz__content__question')[index].remove()
        })
        firebase.database().ref(`/quizes/${code}`).on('value', (snapshot) => {

            const data = snapshot.val()

            setQuiz(data)

            var questionNum = 0

            Object.keys(data).map((key, index)=>{
                console.log(key)
                if(key != 'name' && key != 'userName' && key != 'userProfilePic' && key != 'coverImg' && key != 'userID' && key != 'tags'){
                  questionNum = questionNum + 1
                }
              })
            
              setQuestionLen(questionNum)

            for (let i = 0; i < questionNum; i++) {
                setQuestions(prev => [...prev, {
                    question: data[`q${i}`].question,
                    answer: data[`q${i}`].answer,
                }])
            }
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
                    <div style={{display:'flex', alignItems:'flex-start', flexDirection:'column'}}>
                        <div style={{display:'flex', alignItems:'center'}}>
                            {   
                                quiz.userProfilePic !== undefined ?
                                <img style={{width:'30px', height:'30px', marginRight:'10px', borderRadius:'50%'}} draggable='false' src={quiz.userProfilePic} alt="quiz-img" />
                                :
                                <AccountCircle style={{width:'30px', height:'30px', marginRight:'10px', borderRadius:'50%'}} color='primary'/>
                            }
                            <h3>by {quiz.userName || 'undefined'}</h3>
                        </div>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:'100%'}}>
                            <Typography variant="h5" component='h5'>{code}</Typography>
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
            </div>
            <div className="view__quiz__content__questions">
                <div style={{display:'flex', justifyContent:'space-between', position:'sticky', top:'0', backgroundColor:'white', padding:'10px', zIndex:'1', 
                borderBottom:'1px solid #c4c4c4'}}>
                    <Typography variant="h5" component='h5'>Questions({questionLen})</Typography>
                    {
                        ansIsShown ?
                        <Button variant="contained" color="secondary" onClick={()=>handleHideAnswers()}>Hide Answers</Button>
                        :
                        <Button variant="contained" color="primary" onClick={()=>handleShowAnswers()}>Show Answers</Button>
                    }
                </div>
                {
                    questions.map((data, index) => {
                        return (
                            <div className='view__quiz__content__question' key={index}>
                                <Typography variant="h5" component='h5'>{index + 1}. {data.question}</Typography>
                                {
                                    ansIsShown ?
                                    <div style={{width:'100%'}}>
                                        <br></br>
                                        <Divider light/>
                                        <br></br>
                                        <Typography variant="h5" component='h5'>{data.answer}</Typography>
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ViewQuiz
