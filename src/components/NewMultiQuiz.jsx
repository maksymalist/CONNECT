import React,{ useState, useEffect, useRef } from 'react'
import '../style/NewQuizStyle.css'

import { Chip, TextField, Button, Typography, Divider } from '@material-ui/core';

import firebase from "firebase"
import "firebase/database";
import { toast } from 'react-toastify'
import { AddCircleRounded, DeleteRounded } from '@material-ui/icons'
import UploadButton from './UploadButton';

function NewMultiQuiz() {
    const [subjects, setSubjects] = useState([]);
    const [subjectIndex, setSubjectIndex] = useState(0);
    const [questions, setQuestions] = useState([]);

    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [tagNumber, setTagNumber] = useState(0);

    const quizObj = {}
    var subjectArr = []

    //
    const quizName = useRef(null)

    useEffect(() => {
        toast.info("Please make sure each answer is different or the quiz will not work!")
    }, [])

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
        for(let i = 0; i < document.getElementsByClassName('userInput').length; i++){
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

    const getTags = () => {
        const newTagArr = []
        tags.map((tag) => {
            newTagArr.push(tag)
        })
        return newTagArr
    }

    const setQuizObj = () => {
        if(JSON.parse(localStorage.getItem('user')) == null) {
            window.location = '/login'
            toast.error("Please login to create a quiz!")
            return
        }
        quizObj.name = quizName.current.value
        quizObj.userName = JSON.parse(localStorage.getItem('user')).profileObj.name
        quizObj.userProfilePic = JSON.parse(localStorage.getItem('user')).profileObj.imageUrl
        quizObj.userID = JSON.parse(localStorage.getItem('user')).profileObj.googleId
        quizObj.coverImg = document.getElementById('coverImg').src
        quizObj.tags = getTags()

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


    const AddTag = (tag) => {
        if(tag === '') return
        if(tagNumber >= 5) return
        setTags([...tags, tag])
        setCurrentTag('')
        setTagNumber(tagNumber+1)
    }

    const handleDelete = (id, name) => {
        const newTags = []
        tags.map((tag) => {
            newTags.push(tag)
        })
        newTags.splice(name, 1)
        setTags(newTags)
        setTagNumber(newTags.length)

    };
    
    return (
        <div style={{marginTop:'100px'}}>
        <div style={{display:'flex', alignItems:'center', flexDirection:'column', backgroundColor:'white', margin:'10px', border:'2px solid black', boxShadow:'10px 10px 0 #262626'}}>
            <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                <Typography variant="h2" style={{margin:'10px'}}><b>Create a Multi Quiz</b></Typography>
                <br></br>
                    <Divider style={{width:'90vw'}} light/>
                <br></br>
                <Typography variant="h5" style={{margin:'10px'}}>1. Give your quiz a title</Typography>
                <input ref={quizName} className='userInput' id={'quizName'} type='text' placeholder="Give your quiz a cool name"></input>
            </div>
            <div style={{width:'100%', display:'flex', alignItems:'center', flexDirection:'column', marginTop:'100px'}}>
                <Typography variant="h5" style={{margin:'10px'}}>2. Upload your cover Image</Typography>
                <UploadButton/>
            </div>
            <Typography variant="h5" style={{margin:'10px', marginTop:'100px'}}>3. Give your quiz some tags</Typography>
            <div style={{backgroundColor:'white', padding:'15px', border:'2px solid black', boxShadow:'10px 10px 0 #262626', width:'80vw', maxWidth:'600px', marginTop:'50px'}}>
                <Typography variant="h3">Tags</Typography>
                <br></br>
                <Divider light/>
                <br></br>
                <TextField variant="outlined" size='small' label="Tag Name" helperText={<span style={{color:'black'}}>{5-tagNumber} tags Left</span>} onChange={(e)=>{setCurrentTag(e.target.value)}} value={currentTag}/>
                <Button variant="contained" size='medium' color="primary" onClick={()=>{AddTag(currentTag)}}>Add Tag</Button>
                <br></br>
                {
                    tags.map((tag, index) => (
                        <Chip style={{marginTop:'10px'}} key={tag+index} id={tag+index} label={tag} onDelete={()=>handleDelete(tag+index, tag)} color="primary" />
                    ))
                }
            </div>
            <Typography variant="h5" style={{margin:'10px', marginTop:'100px'}}>4. Come up with some interesting questions</Typography>
            <div className='cardContainer2-sub' id='cardContainer2-sub' style={{margin:'1%', marginTop:'100px'}}>
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