import React,{ useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { socket } from './EnterCodeForm'
import ReactDOM from 'react-dom'
import { ToastContainer, toast } from 'react-toastify';
import { Share, People } from '@material-ui/icons'

import Button from '@material-ui/core/Button'

import GameEnded from './GameEnded'

//firebase
import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";

//Icons
import FirstPlaceIcon from '../img/PodiumIcons/firstPlace.svg'
import SecondPlaceIcon from '../img/PodiumIcons/secondPlace.svg'
import ThirdPlaceIcon from '../img/PodiumIcons/thirdPlace.svg'

//Material Ui
import AssessmentRoundedIcon from '@material-ui/icons/AssessmentRounded';
import TimerRoundedIcon from '@material-ui/icons/TimerRounded';


import 'react-toastify/dist/ReactToastify.css';
import '../style/style.css'
import '../style/playButtonAnimation.css'


//globals

//const socket = io('http://localhost:3001')
const playersTime = []

export default function HostRoom(props) {

    var [podiumPlayers, setPodiumPLayers] = useState([])
    var [podiumPlayerTimes, setpodiumPlayerTimes] = useState([])
    var [playerPodiumMax, setPlayerPodiumMax] = useState(props.podiumPlaces)
    var [isActive, setIsActive] = useState("inactive")
    var [userLimit, setUserLimit] = useState(8)
    const podium = []
    var numArray = []
    var playerArr = []
    const podiumObj = {}
    const [sortedPodium, setSortedPodium] = useState([])
    var podiumClasses = ['first-place', 'second-place', 'third-place', 'other-place']
    var [currentPlace, setCurrentPlace] = useState(0)
    var [numberOfUsers, setNumberOfUsers] = useState(0)

    const [playerTimes, setPlayerTimes] = useState([])
    var gameStarted = false

    useEffect(() => {
        console.log(props.friendlyroom)
        if(props.friendlyroom === true){
            console.log('added firendly')
            socket.emit('addFriendlyRoom', {
                room: props.room
            })
        }
        CheckPlanStatus()
        socket.emit('joinHostRoom', {
            room: props.room
        })
        socket.on('addeduser', (data)=>{
            console.log(data)
            var RoomUsers = []
        
            for(var i = 0; i < data.names.length; i++){
                if(data.UserRooms[i] == undefined) return
                if(data.currentRoom == data.UserRooms[i]){
                    RoomUsers.push(data.names[i])
                }
            }
            document.getElementById('userList').innerHTML = data.UsersInRoom
            setNumberOfUsers(numberOfUsers = numberOfUsers += 1)
            updateUserDiv(data.UsersInRoom)
            if(numberOfUsers >= userLimit){
                socket.emit('roomLimitReached', props.room)
            }
            
        })

        socket.on('roomAdd', (data)=>{
            //console.log(data)
        })
        socket.on('yes', (data)=>{
            //console.log(data)
        })

        socket.on('timeBoard', (data)=>{
            console.log(data)

            if(podium.includes(data.user)){
                console.log('in here')
                return
            }

            if(playersTime.includes(data.user) == true){

                document.getElementById(data.user).innerHTML = `${data.user} Time: ${data.time}`
            }
            else{
                playersTime.push(data.user)
    
                let newTime = document.createElement('h1')
    
                newTime.innerHTML = `${data.user} Time: ${data.time}`
                newTime.id = data.user
    
                document.getElementById('times').appendChild(newTime)
            }


        })

        socket.on('roomTerminated', (data) =>{
            EndGame()
        })

        socket.on('playerLeftRoom', (data)=>{
            document.getElementById('userList').innerHTML = data.UsersInRoom
            setNumberOfUsers(numberOfUsers = data.UsersInRoom.length)
            updateUserDiv(data.UsersInRoom)
        })

        socket.on('EndGame', (data)=>{
            window.location = '/roomleave'
            localStorage.removeItem(JSON.parse(localStorage.getItem('user')).profileObj.googleId);
        })

        socket.on('UpdatePodium', (data)=>{
            console.log('up pod')
            if(podium.includes(data.user)) return
            podium.push(data.user)
            podiumObj[data.user] = {
                time: data.time
            }
            handleUpdatePodium(data.user, data.time)
            setpodiumPlayerTimes(podiumPlayerTimes => [...podiumPlayerTimes, data.time])
            setPodiumPLayers(podiumPlayers =>[...podiumPlayers, data.user])
              //'first-place', 'second-place', 'third-place', 'other-place'
            setCurrentPlace(currentPlace++)

            toast.success(`${data.user} Has Finished Their Quiz!`)

            if(podium.length == playerPodiumMax){
                toast.success(`${playerPodiumMax} Players Have Finished Their Quiz You Might Want To End The Game!`)
            }
        })
        if(playerPodiumMax < 3){
            setPlayerPodiumMax(3)
        }

        return () => {
           /* socket.emit('terminateRoom', props.room)
            socket.emit('EndGame', {
                room: props.room
            })
            window.location = '/roomleave'
            localStorage.removeItem(JSON.parse(localStorage.getItem('user')).profileObj.googleId);
            */
        }


    }, [])

    useEffect(() => {
        if(document.getElementById('userDiv') == null) return
        if(numberOfUsers > 0){
            let newUser = document.createElement('div')
            newUser.id = ''
            newUser.innerHTML =''
            document.getElementById('userDiv').appendChild(newUser)
        }
        
        return () => {
            //cleanup
        }
    }, [numberOfUsers])

    const updateUserDiv = (users) => {
        if(gameStarted) return
        if(document.getElementById('userDiv') == null) return
        document.getElementById('userDiv').querySelectorAll('*').forEach(n => n.remove());
        users.map((user, index)=>{
            let newUser = document.createElement('div')
            newUser.id = user
            document.getElementById('userDiv').appendChild(newUser)
            ReactDOM.render(
                <div>
                    <h1 className='userH1' onClick={()=>{kickUser(user)}}>{user}</h1>
                </div>,
                newUser
            )
        })
    }

    const handleUpdatePodium = () => {
        if(document.getElementById('podium') == null) return

        Object.keys(podiumObj).map((key, index) =>{
            numArray.push(podiumObj[key].time)
        })
        
        numArray.sort((a, b) => {
        return a - b;
        });
        
        
        Object.keys(podiumObj).map((key, index) =>{
            console.log(podiumObj[Object.keys(podiumObj)[index]].time, 'time')
            numArray.map((time, timeIndex) => {
          console.log(time)
              if(time === podiumObj[Object.keys(podiumObj)[index]].time){
                playerArr.push({
                player: Object.keys(podiumObj)[index], 
                time: time,
                place: (timeIndex + 1)
              })
            }
          })
        })
        
        console.log(playerArr)
        document.getElementById('podium').querySelectorAll('*').forEach(n => n.remove());
        
        //render header + first-place-div + second-place-div + third-place-div
        let podiumHeader = document.createElement('div')
        document.getElementById('podium').appendChild(podiumHeader)
        ReactDOM.render(
            <h1 style={{borderBottom: '4px solid'}}>Podium<AssessmentRoundedIcon style={{width:"50px", height:"50px"}}/></h1>,
            podiumHeader
        )

        //first-place-div
        let firstPlaceDiv = document.createElement('div')
        firstPlaceDiv.id = 'first-place-div'
        document.getElementById('podium').appendChild(firstPlaceDiv)
        //second-place-div
        let secondPlaceDiv = document.createElement('div')
        secondPlaceDiv.id = 'second-place-div'
        document.getElementById('podium').appendChild(secondPlaceDiv)
        //third-place-div
        let thirdPlaceDiv = document.createElement('div')
        thirdPlaceDiv.id = 'third-place-div'
        document.getElementById('podium').appendChild(thirdPlaceDiv)

        for(var i = 0; i < playerArr.length; i++){
            let newPlayerTime = document.createElement('div')
            if(playerArr[i].place > 3){
                document.getElementById('podium').appendChild(newPlayerTime)
            }

            if(playerArr[i].place === 1){
                ReactDOM.render(
                    <>
                        <h1 
                            className='first-place podium-time' 
                            data-position={playerArr[i].place} 
                            data-time={playerArr[i].time} 
                            id={playerArr[i].player+0}><img width='40' height='40' src={FirstPlaceIcon} alt='FirstPlaceIcon'/>{playerArr[i].player} Time: {playerArr[i].time} Place: {playerArr[i].place}
                        </h1>
                    </>,
                    document.getElementById('first-place-div')
                )
            }
            if(playerArr[i].place === 2){
                ReactDOM.render(
                    <>
                        <h1 
                            className='second-place podium-time' 
                            data-position={playerArr[i].place} 
                            data-time={playerArr[i].time} 
                            id={playerArr[i].player+0}><img width='40' height='40' src={SecondPlaceIcon} alt='SecondPlaceIcon'/>{playerArr[i].player} Time: {playerArr[i].time} Place: {playerArr[i].place}
                        </h1>
                    </>,
                    document.getElementById('second-place-div')
                )
            }
            if(playerArr[i].place === 3){
                ReactDOM.render(
                    <>
                        <h1 
                            className='third-place podium-time' 
                            data-position={playerArr[i].place} 
                            data-time={playerArr[i].time} 
                            id={playerArr[i].player+0}><img width='40' height='40' src={ThirdPlaceIcon} alt='ThirdPlaceIcon'/>{playerArr[i].player} Time: {playerArr[i].time} Place: {playerArr[i].place}
                        </h1>
                    </>,
                    document.getElementById('third-place-div')
                )
            }
            if(playerArr[i].place > 3){
                ReactDOM.render(
                    <>
                        <h1
                            className='other-place podium-time' 
                            data-position={playerArr[i].place}
                            data-time={playerArr[i].time} 
                            id={playerArr[i].player+0}>{playerArr[i].player} Time: {playerArr[i].time} Place: {playerArr[i].place}
                        </h1>
                    </>,
                    newPlayerTime
                )
            }
        }

        numArray = []
        playerArr = []
    }

    const kickUser = (user) => {
        socket.emit('kickUser', {
            room: props.room,
            user: user
        })
    }

    const CheckPlanStatus = () =>{
        firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}/planStatus`).on('value',(snap)=>{
            if(snap.exists()){
              var planStatus = snap.val()
              setIsActive(isActive = planStatus)
              if(isActive == "active"){
                setUserLimit(userLimit = 40)
                if(props.maxPlayers > 40){
                    setUserLimit(userLimit = 40)
                }
                else{
                    setUserLimit(userLimit = props.maxPlayers)
                }
                if(props.maxPlayers < 3){
                    setUserLimit(userLimit = 3)
                }
                  
              }
              else{
                setUserLimit(userLimit = 8)
                if(props.maxPlayers > 8){
                    setUserLimit(userLimit = 8)
                }
                else{
                    setUserLimit(userLimit = props.maxPlayers)
                }
                if(props.maxPlayers < 3){
                    setUserLimit(userLimit = 3)
                }
              }
            }
          });
    }


    const StartGame = (room)=>{
        socket.emit('startGame', {
            room: room,
            gamecode: props.gamecode,
            gamemode: props.gamemode,
            maxPodium: playerPodiumMax,

        })
        gameStarted = true
        document.getElementById('playButtonSvg').style.visibility = 'hidden'
        document.getElementById('closeButtonSvg').style.visibility = 'visible'
        if(document.getElementById('userDiv') === null) return
        document.getElementById('userDiv').remove()

        document.getElementById('game-container').style.visibility = 'visible'
    }
    const EndGame = () => {
        socket.emit('EndGame', {
            room: props.room,
            googleId: JSON.parse(localStorage.getItem('user')).profileObj.googleId
        })
        gameStarted = false
        window.location = '/roomleave'
        localStorage.removeItem(JSON.parse(localStorage.getItem('user')).profileObj.googleId);
    }
    const GameOver = () => {
        const Podium = []
        // playerArr.map((data, index) =>{
        //     Podium.push(`User: ${data.player} Time: ${data.time}`)
        // })
        // console.log(Podium)
        for(var i = 0; i < document.getElementsByClassName('podium-time').length; i++){
            Podium.push({
                time: document.getElementsByClassName('podium-time')[i].dataset.time,
                position: document.getElementsByClassName('podium-time')[i].dataset.position,
                player: document.getElementsByClassName('podium-time')[i].id
            })
            console.log(document.getElementsByClassName('podium-time')[i].innerHTML)
        }

        socket.emit('GameOver', {
            room: props.room,
            podium: Podium,
            googleId: JSON.parse(localStorage.getItem('user')).profileObj.googleId
        })
        gameStarted = false
        window.location = '/roomleave'
        localStorage.removeItem(JSON.parse(localStorage.getItem('user')).profileObj.googleId);
    }
    const shareLink = () => {
        var text = `https://quiz-connect.netlify.app/play?code=${props.room}`;
        navigator.clipboard.writeText(text).then(function() {
          toast.success('Copied the Invitation Link!');
        }, function(err) {
          toast.error('Could not copy text: ', err);
        });
    }

    const playerTimesStyle = {backgroundColor:'white', borderRadius:'25px', height:'600px', width:'100%', maxWidth:'75vw'}
    const playerPodiumStyle = {backgroundColor:'white', borderRadius:'25px', height:'600px', width:'auto', maxWidth:'50vw'}

    return (
        <div>
            <h1 style={{color:'white'}}>{props.room}</h1>
            <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='medium' onClick={()=>{shareLink()}}><People/>⠀Share</Button>
            <h2 style={{color:'white'}}>Max Users: {numberOfUsers}/{userLimit}</h2>
            <h2 hidden id='userList'></h2>
            <h1 style={{color:'white'}}>Players</h1>
            <div style={{color:'white'}} id='userDiv'>
            </div>
            <div id='game-container' style={{visibility:'hidden'}}>
                <div id='podium'>
                    <h1 style={{borderBottom: '4px solid'}}>Podium <AssessmentRoundedIcon style={{width:"50px", height:"50px"}}/></h1>
                    <div id='first-place-div'></div>
                    <div id='second-place-div'></div>
                    <div id='third-place-div'></div>
                </div>
                <div id="times">
                    <h1 style={{textAlign:'center', borderBottom: '4px solid'}}>Player Times<TimerRoundedIcon style={{width:"50px", height:"50px"}}/></h1>
                </div>
            </div>

            <svg onClick={()=>{StartGame(props.room)}} id='playButtonSvg' width="69" height="100" viewBox="0 0 69 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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

            <svg style={{visibility:'hidden'}} onClick={()=>{GameOver()}} id='closeButtonSvg' width="55" height="55" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect id='darkBar' x="53.8581" y="1" width="11" height="75" rx="2" transform="rotate(45.8985 53.8581 1)" fill="#C70047"/>
                <rect id='lightBar' x="0.351059" y="8.41962" width="11" height="75" rx="2" transform="rotate(-45 0.351059 8.41962)" fill="#FF0000"/>
            </svg>

            {/* Button style={{marginBottom:'1vh'}} id='gameOverButton' variant="contained" color="secondary" size='medium' onClick={()=>{GameOver()}}>End</Button> */}
            {/* <Button style={{marginBottom:'1vh'}} id='share' variant="contained" color="secondary" size='medium' onClick={()=>{shareLink()}}>Share  <Share/></Button> */}
        </div>
    )
}