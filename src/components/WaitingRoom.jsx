import React,{ useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { socket } from './EnterCodeForm'
import loading from '../img/loading.gif'
import ReactDOM from 'react-dom'
import Button from '@material-ui/core/Button'

import GameEnded from './GameEnded'

import '../style/style.css'

//globals

//const socket = io('http://localhost:3001')

export default function WaitingRoom(props) {

    var [gameStatus, setGameStatus] = useState(false)

    useEffect(() => {
        socket.emit('joinPlayerRoom', {
            room: props.room
        })

        socket.on('addeduser', (data)=>{
            //console.log(data)
            /*var RoomUsers = []
        
            for(var i = 0; i < data.names.length; i++){
                if(data.UserRooms[i] == undefined) return
                if(data.currentRoom == data.UserRooms[i]){
                    RoomUsers.push(data.names[i])
                }
            }*/
            document.getElementById('userList').innerHTML = data.UsersInRoom
            
        })

        socket.on('gameStarted', (data)=>{
            if(gameStatus == false){
                window.location = `/gameroom/${props.room}/${data.gamecode}/${props.user}`
            }
            setGameStatus(gameStatus = true)

        })
        socket.on('joinedWaitingRoom', (data)=>{
            //console.log(data)
        })
        socket.on('playerLeftRoom', (data)=>{
            document.getElementById('userList').innerHTML = data.UsersInRoom
            console.log(data.UsersInRoom)
        })

        socket.on('kicked', (data)=>{
            if(props.user == data.user){
                socket.emit('leaveRoom', {
                    room: props.room,
                    user: props.user
                })
                window.location = '/roomleave'
                sessionStorage.setItem('roomJoined', 'false')
            }
        })

        socket.on('EndedGame', (data)=>{
            socket.emit('leaveRoom', {
                room: props.room,
                user: props.user
            })
            window.location = '/roomleave'
            sessionStorage.setItem('roomJoined', 'false')

        })

        socket.on('GameIsOver', (data)=>{
            socket.emit('leaveRoom', {
                room: props.room,
                user: props.user
            })
            ReactDOM.render(
                <div>
                <GameEnded podium={data}/>
                <button onClick={()=>{window.location = '/'}}>Return Home</button>
                </div>,
                document.getElementById('root')
            )
            sessionStorage.setItem('roomJoined', 'false')
        })

        return () => {
            //cleanup
        }
    }, [])
    
    const leaveRoom = () => {
        socket.emit('leaveRoom', {
            room: props.room,
            user: props.user
        })
        window.location = '/roomleave'
        sessionStorage.setItem('roomJoined', 'false')
    }

    return (
        <div>
            <h1>Waiting Room<img  style={{backgroundColor:'white', borderRadius:'150px'}} alt='load-animation' src={loading}/></h1>
            <h2>Room:{props.room}</h2>
            <h2>User:{props.user}</h2>
            <textarea id={'userList'} defaultValue={props.usersInRoom} readOnly></textarea>
            <div>
                <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{leaveRoom()}}>Leave Room</Button>
            </div>
        </div>
    )
}
