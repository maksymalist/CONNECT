import React,{ useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { socket } from './EnterCodeForm'
import ReactDOM from 'react-dom'

import firebase from "firebase"
import "firebase/database";

import FinishedScreen from './FinishedScreen'
import GameEnded from './GameEnded'

import '../style/style.css'
import { toast } from 'react-toastify'

import { Typography } from '@material-ui/core'

import Translations from '../translations/translations.json'

export default function GameRoom({match}) {
    var [time, updateTime] = useState(0)
    var [selected, setSelected] = useState([])
    var [name, setName] = useState('')
    const cards = []

    var CurrentRoom = match.params.room
    var GameOver = false
    var gameLeft = false
    var secondTimer = 0

    var quiz2
    const cardsLen = []

    const [userLanguage, setUserLanguage] = useState(localStorage.getItem('connectLanguage') || 'english')

    const getQuiz = async () => {
        const eventref = firebase.database().ref(`quizes/${match.params.gameid}`);
        const snapshot = await eventref.once('value');
        quiz2 = snapshot.val();
        setName(name = quiz2.name)
        console.log(Object.keys(snapshot.val()).length - 1)
        Object.keys(snapshot.val()).map((key, index)=>{
            console.log(key)
            if(key != 'name' && key != 'userName' && key != 'userProfilePic' && key != 'coverImg' && key != 'userID' && key != 'tags'){
              cardsLen.push(key)
            }
          })
        setCardsFunction(cardsLen.length)
    }


    const UpdateTimeFunction = () => {
        if(GameOver == false){
        updateTime(prev => time = Math.round((prev += 0.1) * 10) / 10)
        secondTimer++
        if(secondTimer === 10){
            secondTimer = 0
            socket.emit('time', {
                time: time,
                room: CurrentRoom,
                user: match.params.user
            })
        }
    }
    }

    const setCardsFunction = (numCards) => {
        for(var i = 0; i < numCards; i++){
            console.log(i + '/' + numCards + '/' + cardsLen)
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
                <div className='card quest-card' id={item} onClick={()=>{CardClick(item, ans, item, i)}}>{item}</div>
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
                <div className='card ans-card' id={ans} onClick={()=>{CardClick(item, ans, ans, (i + 10))}}>{ans}</div>
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
                    GameOver = true
                    socket.emit('PlayerFinsihed', {
                        room: match.params.room,
                        user: match.params.user,
                        time: time,
                        id: JSON.parse(localStorage.getItem('user')).profileObj.googleId
                    })
                    document.getElementById('popUp').removeAttribute('hidden')
                    document.getElementById('gameContent').remove()
                    ReactDOM.render(
                        <FinishedScreen user={match.params.user}/>,
                        document.getElementById('popUp')

                    )
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
        getQuiz()
        setInterval(()=>{ 
            UpdateTimeFunction()    
        }, 100);

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
            toast.success(`${data} ${Translations[userLanguage].alerts.playerfinishedgame}`)
        })

        socket.on('EndedGame', (data)=>{
            if(gameLeft) return
            socket.emit('leaveRoom', {
                room: match.params.room,
                user: match.params.user
            })
            GameOver = true
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
            GameOver = true
            socket.emit('leaveRoom', {
                room: match.params.room,
                user: match.params.user
            })
            sessionStorage.setItem('roomJoined', 'false')
        }
    }, [])


    return (
        <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}}>
            <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}} id='gameContent'>
                <div>
                    <Typography variant='h2' style={{marginTop:'100px',color:'white'}}>{name}</Typography>
                    <Typography variant='h3' style={{marginTop:'10px',color:'white'}}>{time}</Typography>
                </div>
                <div>
                <div style={{marginTop:'50px'}} id='cardContainer'></div>
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
    )
}