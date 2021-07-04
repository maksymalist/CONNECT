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

    const getQuiz = async () => {
        const eventref = firebase.database().ref(`quizes/${match.params.gameid}`);
        const snapshot = await eventref.once('value');
        quiz2 = snapshot.val();
        setName(name = quiz2.name)
        setCardsFunction()
    }


    const UpdateTimeFunction = () => {
        if(GameOver == false){
        updateTime(time = Math.round((time += 0.1) * 10) / 10)
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

    const setCardsFunction = () => {
        for(var i = 0; i < 6; i++){
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
    const randomNum = [0,1,2,3,4,5].sort( () => .5 - Math.random() )
    const GetCards = () => {
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
        const randomNum2 = [0,1,2,3,4,5].sort( () => .5 - Math.random() )
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
                    updateTime(time += 5)
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
                        time: time
                    })
                    document.getElementById('popUp').removeAttribute('hidden')
                    ReactDOM.render(
                        <FinishedScreen/>,
                        document.getElementById('popUp')

                    )
                    document.getElementById('time').setAttribute('hidden', 'true')
                }
            }
            else{
                updateTime(time += 5)
            }






            memory = []
            setSelected(selected = [])
        }

        const cardsRando = ()=>{
            const children = document.getElementById('cardContainer').childNodes

            children.forEach((child)=>{
                //
            })
        }
        cardsRando()


        
    }

    useEffect(() => {
        getQuiz()
        setInterval(()=>{ 
            UpdateTimeFunction()    
        }, 100);

        socket.on('joinedGameRoom', (data)=>{
            toast.success(data)
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
                <GameEnded podium={data}/>,
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
    function shuffle(elems) {
 
        var allElems = (function(){
        var ret = [], l = elems.length;
        while (l--) { ret[ret.length] = elems[l]; }
        return ret;
        })();
     
        var shuffled = (function(){
            var l = allElems.length, ret = [];
            while (l--) {
                var random = Math.floor(Math.random() * allElems.length),
                    randEl = allElems[random].cloneNode(true);
                allElems.splice(random, 1);
                ret[ret.length] = randEl;
            }
            return ret; 
        })(), l = elems.length;
     
        while (l--) {
            elems[l].parentNode.insertBefore(shuffled[l], elems[l].nextSibling);
            elems[l].parentNode.removeChild(elems[l]);
        }
     
    }


    return (
        <div>
            <div>
                <h1> </h1>
                <h1 id='title' style={{marginTop:'10vh'}}>{name}</h1>
                <h1 id='time' style={{marginBottom:'10vh'}}>{time}</h1>
            </div>
            <div>
            <div style={{marginTop:'10vh'}} id='cardContainer'></div>
                <div hidden id='popUp'></div>
                <h1 hidden>{JSON.stringify(selected)}</h1>
            </div>
        </div>
    )
}
