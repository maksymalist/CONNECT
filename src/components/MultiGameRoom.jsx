import React, { useState, useEffect } from 'react';
import { socket } from './EnterCodeForm'
import ReactDOM from 'react-dom'

import firebase from "firebase"
import "firebase/database";

import FinishedScreen from './FinishedScreen'
import GameEnded from './GameEnded'

import '../style/style.css'
import { toast } from 'react-toastify'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import CountDown from './CountDown'

function MultiGameRoom({match}) {
    const [activeStep, setActiveStep] = useState(0);

    const [steps, setSteps] = useState([]);

    var [maxSteps, setMaxSteps] = useState();

    var [time, updateTime] = useState(0)
    var [selected, setSelected] = useState([])
    var [name, setName] = useState('')
    var cards = []

    var CurrentRoom = match.params.room
    var [GameOver, setGameOver] = useState(false)
    var gameLeft = false
    var secondTimer = 0

    var quiz2
    var cardsLen = []

    var [emitted, setEmitted] = useState(false)
    
    const getQuiz = async (currentQuiz) => {
        quiz2 = currentQuiz
        setName('Quiz About Stuff') //name = quiz2.name
        console.log(Object.keys(quiz2).length - 1)
        Object.keys(quiz2).map((key, index)=>{
            console.log(key)
            if(key != 'name' && key != 'userName' && key != 'userProfilePic' && key != 'coverImg' && key != 'userID' && key != 'tags'){
              cardsLen.push(key)
            }
          })
        setCardsFunction(cardsLen.length)
    }


    const UpdateTimeFunction = () => {
        if(GameOver === true) return
        updateTime(prev => time = Math.round((prev += 0.1) * 10) / 10)
        secondTimer++
        console.log(secondTimer)
        if(secondTimer === 10){
            secondTimer = 0
            socket.emit('time', {
                time: time,
                room: CurrentRoom,
                user: match.params.user
            })
        }
    }

    const setCardsFunction = (numCards) => {
        for(var i = 0; i < numCards; i++){
            cards.push({
                question: quiz2[`q${i}`].question,
                ans: quiz2[`q${i}`].answer
            })
        }
        console.log(randomArrayShuffle(cards))
        GetCards()

    }
    function randomArrayShuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
    

    var elements = 0
    const numberOfCardsArr = []
    var randomNum = [] //[0,1,2,3,4,5].sort( () => .5 - Math.random() )
    const GetCards = () => {
        cards.map((card, i) => {
            numberOfCardsArr.push(i)
        })
        randomNum = numberOfCardsArr.sort( () => .5 - Math.random() )
        for(var i = 0; i < cards.length; i++){
            let newCard = document.createElement('div')
            let newCard2 = document.createElement('div')
            const item = cards[randomNum[i]].question
            const ans = cards[randomNum[i]].ans
            newCard.id = 'cardDiv'
            document.getElementById('cardContainer').appendChild(newCard)

            ReactDOM.render(
                <>
                <div className='card' id={item} onClick={()=>{CardClick(item, ans, item, i)}}>{item}</div>
                </>,
                newCard
            )

 

        }
        const randomNum2 =  numberOfCardsArr.sort( () => .5 - Math.random() )
        for(var i = 0; i < cards.length; i++){
            let newCard2 = document.createElement('div')
            const item = cards[randomNum2[i]].question
            const ans = cards[randomNum2[i]].ans
            newCard2.id = 'cardDiv2'
            document.getElementById('cardContainer').appendChild(newCard2)

            ReactDOM.render(
                <>
                <div className='card' id={ans} onClick={()=>{CardClick(item, ans, ans, (i + 10))}}>{ans}</div>
                </>,
                newCard2
            )

            
            elements += 2
 

        }
    }
    var memory = []
    function CardClick(ques, ans, id, index){
        setSelected(selected =>[...selected, {
            question: ques,
            ans: ans
        }])
        document.getElementById(id).style = 'box-shadow: 0px 0px 5px royalblue;'

        memory.push({
            question: ques,
            ans: ans,
            index: index
        })

        if(memory.length == 2){

            for(var i = 0; i < document.getElementsByClassName('card').length; i++){
                document.getElementById(document.getElementsByClassName('card')[i].id).style = 'box-shadow: 0px 0px 0px royalblue;'
            }
            if(memory[0].question == memory[1].question){
                if(memory[0].index == memory[1].index){
                    updateTime(prev => time = prev += 5)
                    memory = []
                    setSelected(selected = [])
                    return
                }
            
                console.log(memory[0].question, memory[1].ans)
                document.getElementById(memory[0].question).remove()
                document.getElementById(memory[1].ans).remove()

                elements -= 2

                if(elements == 0){
                    setActiveStep(activeStep + 1)
                }
            }
            else{
                updateTime(prev => time = prev += 5)
            }






            memory = []
            setSelected(selected = [])
        }


        
    }

    useEffect(() => {
        if(steps.length <= 0) return
        if(activeStep === maxSteps){
            setGameOver(true)
            setGameOver(true)

            if(emitted === false){
                socket.emit('PlayerFinsihed', {
                    room: match.params.room,
                    user: match.params.user,
                    time: time
                })
                setEmitted(true)
            }
            document.getElementById('popUp').removeAttribute('hidden')
            document.getElementById('gameContent').hidden = true
            ReactDOM.render(
                <FinishedScreen user={match.params.user}/>,
                document.getElementById('popUp')

            )
            document.getElementById('time').setAttribute('hidden', 'true')
            document.getElementById('stepRef').hidden = true
        }
        document.getElementById('cardContainer').innerHTML = ''
        elements = 0
        cards = []
        cardsLen = []
        steps.map((step, index) => {
            if(index == activeStep) {
                firebase.database().ref(`multiQuizzes/${match.params.gameid}`).on('value', (snapshot) => {
                    console.log(snapshot.val())
                return(
                    getQuiz(snapshot.val().steps[step])
                )
                })
            }
        })
        return () => {
            // cleanup
        }
    }, [activeStep, steps])

    const startTime = () => {
        setInterval(()=>{
            UpdateTimeFunction()    
        }, 100)
    }

    useEffect(() => {
        firebase.database().ref(`multiQuizzes/${match.params.gameid}`).on('value', (snapshot) => {
            console.log(snapshot.val())
        
            const stepArr = []
            console.log(Object.keys(snapshot.val().steps))
            Object.keys(snapshot.val().steps).map((step, index) => {
                console.log(step)

                stepArr.push(step)
            })
            console.log(stepArr)
            console.log(stepArr.length)
            setSteps(prev => prev = stepArr)
            setMaxSteps(stepArr.length)
            startTime()
        })

        document.querySelector('nav').hidden = true

        socket.on('joinedGameRoom', (data)=>{
            console.log(data)
        })
        socket.emit('joinGame', {
            room: match.params.room,
            user: match.params.user
        })

        socket.on('timeBoard', (data)=>{
            //console.log(data.time, data.user)
        })
        socket.on('PlayerFinished2', (data)=>{
            toast.success(`${data} has finished their game!`)
        })

        socket.on('EndedGame', (data)=>{
            if(gameLeft) return
            socket.emit('leaveRoom', {
                room: match.params.room,
                user: match.params.user
            })
            setGameOver(true)
            window.location = '/roomleave'
            sessionStorage.setItem('roomJoined', 'false')
        })
        socket.on('GameIsOver', (data)=>{
            gameLeft = true
            socket.emit('leaveRoom', {
                room: match.params.room,
                user: match.params.user
            })
            ReactDOM.render(
                <GameEnded podium={data} maxPodiumPlayers={match.params.maxpodium}/>,
                document.getElementById('root')
            )
            sessionStorage.setItem('roomJoined', 'false')
        })
        return () => {
            setGameOver(true)
            socket.emit('leaveRoom', {
                room: match.params.room,
                user: match.params.user
            })
            sessionStorage.setItem('roomJoined', 'false')
        }
    }, [])


    return (
        <div>
            <div>
            <div id='gameContent'>
                <div>
                    <h1> </h1>
                    <h1 id='title' style={{marginTop:'10vh', color:'white'}}>{name}</h1>
                    <h2 id='title' style={{marginTop:'1vh', color:'white'}}>{steps[activeStep]}</h2>
                    <h1 id='time' style={{color:'white', bottom:'0'}}>{time}</h1>
                </div>
                <div style={{display:'flex', alignItems:'center', width:'100%', justifyContent:'center'}}>
                <Stepper id='stepRef' style={{width:'100%', maxWidth:'400px', margin:'20px', border:'2px solid black', boxShadow:'10px 10px 0 #262626'}} activeStep={activeStep}>
                    {steps.map((step, index) => {
                        return (
                            <Step key={index}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        )
                    })}
                </Stepper>
            </div>
                <div style={{display:'flex', alignItems:'center', width:'100%', justifyContent:'center'}}>
                <div style={{marginTop:'0', position:'unset', transform:'none', marginBottom:'100px'}} id='cardContainer'></div>
                    <h1 hidden>{JSON.stringify(selected)}</h1>
                </div>
            </div>
            <div>
                <nav style={{height:'50px'}}>
                    <div style={{float:'left', color:'white', marginLeft:'10px', marginTop:'-10px'}}>
                        <h2>{match.params.user}</h2>
                    </div>
                </nav>
            </div>
            <div hidden style={{width:'100%', height:'100vh', zIndex:'500'}} id='popUp'></div>
        </div>
        </div>
    )
}

export default MultiGameRoom
