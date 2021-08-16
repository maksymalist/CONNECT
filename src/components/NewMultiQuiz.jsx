import React,{ useState, useEffect, useRef } from 'react'
import '../style/NewQuizStyle.css'

import Button from '@material-ui/core/Button'

import firebase from "firebase"
import "firebase/database";
import { toast } from 'react-toastify'
import { AddCircleRounded, DeleteRounded } from '@material-ui/icons'

function NewMultiQuiz() {
    const [subjects, setSubjects] = useState([]);
    const [subjectIndex, setSubjectIndex] = useState(0);
    const [questions, setQuestions] = useState([]);

    const quizObj = {}
    var subjectArr = []

    //
    const quizName = useRef(null)

    const Submit = () => {
        for(var i = 0; i < document.getElementsByClassName('userInput').length; i++){
            console.log('userIn')
            if(document.getElementsByClassName('userInput')[i].value == ""){
                toast.error('A field has been left empty!')
                return
            }
        }
        console.log(document.getElementsByClassName('subject-container'))
        if(document.getElementsByClassName('subject-container').length == 0){
            toast.error('You need at least 1 subject!')
            return
        }
        firebase.database().ref(`multiQuizzes/`).push(quizObj)
        toast.success('Quiz Created!')
        for(var i = 0; i < document.getElementsByClassName('userInput').length; i++){
            document.getElementsByClassName('userInput')[i].value = ""
        }

        
    }
    

    const Card = ({questionNumber, subIndex}) => (
        <div className='card2' id={`question${questionNumber}card`}>
            <h1>Question {questionNumber}</h1>
            <input className={`questions userInput subQuest${subIndex}card${questionNumber}`} id={`question${questionNumber}idx${subIndex}`} type='text' placeholder={'Question'}/>
            <br></br><input className={`answers userInput subAns${subIndex}card${questionNumber}`} id={`answer${questionNumber}idx${subIndex}`} type='text' placeholder={'Answer'} />
        </div>
    )


    const Subject = ({name, cards, index}) => (
        <div className='subject-container'>
            <input defaultValue={name} className='subject-name' type='text' placeholder='Subject Name' />
            <div className='cardContainer2' style={{margin:'1%'}}>
                {cards.map(card => <Card key={card} subIndex={index} questionNumber={card} />)}
                <div onClick={()=>{AddQuestion(index, (cards.length+1))}} className='card2-2' style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <AddCircleRounded style={{width:'75px', height:'75px'}} color='primary'/>
                </div>
            </div>
        </div>
    )

    const AddQuestion = (subjectIndex, questionNum) => {
        setQuestions([...questions, {question: questionNum, subject: subjectIndex}])
    }

    const AddSubject = () => {
        setSubjects([...subjects,{
            subject: `My cool subject name ${subjectIndex}`,
            subjectIndex: subjectIndex,
        }])
        setQuestions([...questions, 
            {question: '1',subject: subjectIndex},
            {question: '2',subject: subjectIndex},
            {question: '3',subject: subjectIndex},
            {question: '4',subject: subjectIndex},
            {question: '5',subject: subjectIndex},
            {question: '6',subject: subjectIndex},
        ])
        subjectArr.push({
            subject: `My cool subject name ${subjectIndex}`,
            subjectIndex: subjectIndex,
        })
        console.log(subjectArr)
        setSubjectIndex(subjectIndex+1)
    }

    var questions2 = []
    var questionsCount = 0

    const getCards = (subjectIndex2) => {
        questions2 = []
        questions.map((question) => {
            if(question.subject === subjectIndex2){
                questions2.push(question.question)

            }
        })
        return questions2
    }

    const setQuizObj = () => {
        quizObj.name = quizName.current.value
        quizObj.userName = JSON.parse(localStorage.getItem('user')).profileObj.name
        quizObj.userProfilePic = JSON.parse(localStorage.getItem('user')).profileObj.imageUrl
        var stepObj = {}

        for(var subIndex = 0; subIndex < document.getElementsByClassName('subject-name').length; subIndex++){ 
            console.log(document.getElementsByClassName('subject-name')[subIndex].value, subIndex)

            stepObj[document.getElementsByClassName('subject-name')[subIndex].value] = {}

            for(var i = 0; i < getCards(subIndex).length; i++){
                console.log('card' + getCards(subIndex)[i])
                console.log(document.getElementById(`question${getCards(subIndex)[i]}idx${subIndex}`))
                console.log(document.getElementById(`answer${getCards(subIndex)[i]}idx${subIndex}`))
                stepObj[document.getElementsByClassName('subject-name')[subIndex].value][`q${i}`] = {
                    question: document.getElementById(`question${getCards(subIndex)[i]}idx${subIndex}`).value,
                    answer: document.getElementById(`answer${getCards(subIndex)[i]}idx${subIndex}`).value,
                }

            }

        }
        console.log(stepObj)
        quizObj.steps = stepObj
        console.log(quizObj)
        Submit()

    }
    
    return (
        <div style={{marginTop:'100px'}}>
        <div style={{backgroundColor:'white', borderRadius:'25px', display:'flex', alignItems:'center', flexDirection:'column'}}>
            <div>
                <input ref={quizName} className='userInput' id={'quizName'} type='text' placeholder="Give your quiz a cool name"></input>
            </div>
            <div className='cardContainer2-sub' id='cardContainer2-sub' style={{margin:'1%'}}>
                {
                    subjects.map((subject, index) => {
                        return(
                            <Subject key={index} name={subject.subject} index={subject.subjectIndex} cards={getCards(subject.subjectIndex)}/>
                        )
                    })
                }
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:'100%'}}>
                    <div onClick={()=>{AddSubject()}} className='card2-2-subject' style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <AddCircleRounded style={{width:'75px', height:'75px'}} color='primary'/>
                    </div>
                </div>
            </div>
            <div>
                <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='large' onClick={()=>{setQuizObj()}}>Submit</Button>
            </div>
        </div>
    </div>
    )
}

export default NewMultiQuiz

/*
                <div onClick={()=>{AddQuestion()}} className='card2-2' style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <AddCircleRounded style={{width:'75px', height:'75px'}} color='primary'/>
                </div>*/