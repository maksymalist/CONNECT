import React,{ useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { socket } from './EnterCodeForm'
import ReactDOM from 'react-dom'
import { ToastContainer, toast } from 'react-toastify';

import Button from '@material-ui/core/Button'

import GameEnded from './GameEnded'

//firebase
import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";


import 'react-toastify/dist/ReactToastify.css';
import '../style/style.css'

//globals

//const socket = io('http://localhost:3001')
const playersTime = []

export default function HostRoom(props) {

    const [podiumPlayers, setPodiumPLayers] = useState([])
    const [podiumPlayerTimes, setpodiumPlayerTimes] = useState([])
    var [playerPodiumMax, setPlayerPodiumMax] = useState(props.podiumPlaces)
    var [isActive, setIsActive] = useState("inactive")
    var [userLimit, setUserLimit] = useState(8)
    const podium = []
    var [numberOfUsers, setNumberOfUsers] = useState(0)

    const [playerTimes, setPlayerTimes] = useState([])
    var gameStarted = false

    useEffect(() => {
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
        if(props.friendly){
            socket.emit('addFriendlyRoom', {
                room: props.room
            })
        }

        socket.on('roomAdd', (data)=>{
            //console.log(data)
        })
        socket.on('yes', (data)=>{
            //console.log(data)
        })

        socket.on('timeBoard', (data)=>{

            if(playersTime.includes(data.user) == true){

                document.getElementById(data.user).innerHTML = `User: ${data.user} Time: ${data.time}`
            }
            else{
                playersTime.push(data.user)
    
                let newTime = document.createElement('h1')
    
                newTime.innerHTML = `User: ${data.user} Time: ${data.time}`
                newTime.id = data.user
    
                document.getElementById('times').appendChild(newTime)
            }


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
            podium.push(data.user)
            setpodiumPlayerTimes(podiumPlayerTimes => [...podiumPlayerTimes, data.time])
            setPodiumPLayers(podiumPlayers =>[...podiumPlayers, data.user])
            document.getElementById(data.user).innerHTML = `User: ${data.user} Time: ${data.time}`

            toast.success(`${data.user} Has Finished Their Quiz!`)

            if(podium.length == playerPodiumMax){
                toast.success(`${playerPodiumMax} Players Have Finished Their Quiz You Might Want To End The Game!`)
            }
        })
        if(playerPodiumMax < 3){
            setPlayerPodiumMax(3)
        }

        return () => {
            socket.emit('terminateRoom', props.room)
            socket.emit('EndGame', {
                room: props.room
            })
            window.location = '/roomleave'
            localStorage.removeItem(JSON.parse(localStorage.getItem('user')).profileObj.googleId);
        }


    }, [])

    useEffect(() => {
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
            gamecode: props.gamecode

        })
        gameStarted = true
        document.getElementById('userDiv').remove()
    }
    const EndGame = () => {
        socket.emit('EndGame', {
            room: props.room
        })
        gameStarted = false
        window.location = '/roomleave'
        localStorage.removeItem(JSON.parse(localStorage.getItem('user')).profileObj.googleId);
    }
    const GameOver = () => {
        const Podium = []
        podiumPlayers.map((player, index) =>{
            Podium.push(`User: ${player} Time: ${podiumPlayerTimes[index]}`)
        })
        console.log(Podium)

        socket.emit('GameOver', {
            room: props.room,
            podium: Podium
        })
        gameStarted = false
        window.location = '/roomleave'
        localStorage.removeItem(JSON.parse(localStorage.getItem('user')).profileObj.googleId);
    }

    const playerTimesStyle = {backgroundColor:'white', borderRadius:'25px', height:'600px', width:'100%', maxWidth:'75vw'}
    const playerPodiumStyle = {backgroundColor:'white', borderRadius:'25px', height:'600px', width:'auto', maxWidth:'50vw'}

    return (
        <div>
            <h1>{props.room}</h1>
            <h2>Max Users: {numberOfUsers}/{userLimit}</h2>
            <h2 hidden id={'userList'}></h2>
            <h1>Players</h1>
            <div id='userDiv'>
            </div>
            <div id="times">
                <h1>Player Times</h1>
            </div>
            <div id='podium'>
                <h1>Podium</h1>
                {podiumPlayers.map((player, index) =>(
                <h1 key={player}>{player} time:{podiumPlayerTimes[index]}</h1>
            )
            )}</div>
            <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{StartGame(props.room)}}>Start Game</Button>
            <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{EndGame()}}>End Game</Button>
            <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{GameOver()}}>Game Over</Button>
        </div>
    )
}