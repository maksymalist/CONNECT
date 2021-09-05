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
import CountDown from './CountDown';


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

    const [isCountdown, setIsCountdown] = useState(false)

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

    // useEffect(() => {
    //     if(document.getElementById('userDiv') == null) return
    //     if(numberOfUsers > 0){
    //         let newUser = document.createElement('div')
    //         newUser.id = ''
    //         newUser.innerHTML =''
    //         document.getElementById('userDiv').appendChild(newUser)
    //     }
        
    //     return () => {
    //         //cleanup
    //     }
    // }, [numberOfUsers])

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
                    <h2 className='userH1' onClick={()=>{kickUser(user)}}>{user}</h2>
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
                            id={playerArr[i].player+"⠀"}><img width='40' height='40' src={FirstPlaceIcon} alt='FirstPlaceIcon'/>{playerArr[i].player} Time: {playerArr[i].time} Place: {playerArr[i].place}
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
                            id={playerArr[i].player+"⠀"}><img width='40' height='40' src={SecondPlaceIcon} alt='SecondPlaceIcon'/>{playerArr[i].player} Time: {playerArr[i].time} Place: {playerArr[i].place}
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
                            id={playerArr[i].player+"⠀"}><img width='40' height='40' src={ThirdPlaceIcon} alt='ThirdPlaceIcon'/>{playerArr[i].player} Time: {playerArr[i].time} Place: {playerArr[i].place}
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
                            id={playerArr[i].player+"⠀"}>{playerArr[i].player} Time: {playerArr[i].time} Place: {playerArr[i].place}
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
        document.getElementById('maxPlayersText').remove()
        document.getElementById('connectText').remove()

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
            {
                isCountdown ?
                <CountDown start={StartGame} room={props.room}/>
                :
                null
            }
            <h1 style={{color:'white'}}>{props.room}</h1>
            <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='medium' onClick={()=>{shareLink()}}><People/>⠀Share</Button>
            <h2 style={{color:'white'}} id='maxPlayersText'>Max Users: {numberOfUsers}/{userLimit}</h2>
            <h2 hidden id='userList'></h2>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:'50px'}}>
                <svg id='connectText' width="340" height="90" viewBox="0 0 340 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 5C0 2.23858 2.23858 0 5 0H335C337.761 0 340 2.23858 340 5V84.4737C340 87.2351 337.761 89.4737 335 89.4737H5C2.23858 89.4737 0 87.2351 0 84.4737V5Z" fill="#6C63FF"/>
                    <path d="M85.0702 69.9543C60.1881 70.7168 63.7294 24.62 87.7728 24.62C112.003 24.62 110.605 69.1918 85.0702 69.9543ZM87.4932 60.2497C93.4575 60.3884 95.4145 49.3667 95.694 44.3064C95.9736 39.2462 93.8302 32.1757 88.1455 32.3143C82.4609 32.453 79.3856 43.2667 79.5719 47.4258C79.8515 52.7633 81.4358 60.1111 87.4932 60.2497ZM122.44 64.5475L109.3 64.1316L112.468 22.8177L120.39 22.6097L134.555 44.5837L138.562 21.6393L146.949 23.5802L142.756 60.5963L134.368 61.4281L120.39 38.8996L122.44 64.5475ZM165.215 64.5475L152.075 64.1316L155.243 22.8177L163.165 22.6097L177.33 44.5837L181.337 21.6393L189.724 23.5802L185.531 60.5963L177.143 61.4281L163.165 38.8996L165.215 64.5475ZM221.596 70.093L196.154 69.7464L194.85 28.0859L219.732 25.6597L219.452 33.4927H205.194V46.7326L217.122 45.9701L217.775 53.8724L205.66 53.7338L205.008 63.785L222.528 63.2998L221.596 70.093ZM264.557 67.3202C248.714 80.4214 227.839 76.2623 227.653 51.7929C227.467 30.7893 249.367 22.4711 262.413 31.9677L258.499 38.2757C253.374 34.3939 239.209 37.8598 238.09 51.5849C237.065 63.7157 248.994 71.1328 257.754 60.8043L264.557 67.3202ZM299.224 24.4813L298.385 32.6609L288.787 32.9382L289.439 67.4589L275.367 69.1918L277.976 33.2155L267.819 33.4927L268.098 25.8677L299.224 24.4813ZM305.841 52.2088V12.9744L319.074 12.2812L312.737 52.0008L305.841 52.2088ZM308.077 67.3202C301.554 67.3202 301.833 57.6849 308.73 57.6849C315.533 57.6849 318.887 67.3202 308.077 67.3202Z" fill="white"/>
                    <path d="M58.7665 60.9058C63.8091 62.3473 64.3484 66.3862 54.8564 72.3045C49.6152 75.5723 43.2216 77.9872 37.521 77.0212C31.8205 76.0551 26.7525 72.9248 23.1805 68.1635C19.6085 63.4022 17.7536 57.3046 17.9317 50.9095C18.1099 44.5145 20.3101 38.2177 24.1575 33.0921C28.0049 27.9666 33.2615 24.3293 39.0315 22.8001C44.8015 21.2709 51.1081 20.8902 55.4027 25.0165C58.7665 27.8308 60.0929 32.0078 60.0929 32.0078L47.0362 42.0759L36.6012 42.0759L36.6012 60.9058C46.0924 62.721 53.7238 59.4643 58.7665 60.9058Z" fill="white"/>
                    <path d="M48.2502 52.1915C55.2081 61.4342 41.5958 62.6329 36.8785 61.4342C32.1612 60.2355 29.6042 54.1539 31.1673 47.8506C32.7304 41.5473 37.8217 37.4092 42.539 38.608C47.2563 39.8067 49.8133 45.8882 48.2502 52.1915Z" fill="#6C63FF"/>
                    <path d="M42.9473 41.5103C48.4611 41.5103 47.2724 43.0163 50.1052 40.3516V45.6147H43.6808L42.9473 41.5103Z" fill="#6C63FF"/>
                    <path d="M45.1458 40.3516C45.1458 40.3516 46.714 42.3667 49.9263 40.9463L51.8947 45.6147H44.7368L45.1458 40.3516Z" fill="#6C63FF"/>
                    <path d="M58.3355 27.5923C55.1701 21.2553 66.7662 27.6167 66.7662 27.6167L66.6937 34.2739L56.2197 34.8898C56.2197 34.8898 61.5008 33.9293 58.3355 27.5923Z" fill="#6C63FF"/>
                </svg>
            </div>
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

            <svg onClick={()=>{setIsCountdown(true)}} id='playButtonSvg' width="69" height="100" viewBox="0 0 69 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        
        </div>
    )
}