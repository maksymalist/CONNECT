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
            //document.getElementById('userLength').innerHTML = data.UsersInRoom.length
            
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
            //document.getElementById('userLength').innerHTML = data.UsersInRoom.length
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
        <div id='waitingRoomDiv'>
            <h1 style={{marginTop:'100px'}}>Waiting Room</h1>
            <h2>Players:</h2>
            <textarea id='userList' defaultValue={props.usersInRoom} readOnly></textarea>
            <div>
                <Button style={{marginBottom:'1vh', alignSelf:'left'}} variant="contained" color="secondary" size='large' onClick={()=>{leaveRoom()}}>Leave Room</Button>
            </div>
        </div>
        {/* <div style={{display:'flex', placeItems:'center', color:'white', flexDirection:'column'}}>
            <h1 id='userLength'>{props.usersInRoom.length}</h1>
            <h1>Players</h1>
        </div> */}
        <div>
            <nav style={{height:'50px'}}>
                <div style={{float:'left', color:'white', marginLeft:'10px', marginTop:'-10px'}}>
                    <h2>{props.user}</h2>
                </div>
            </nav>
        </div>
        </div>
    )
}
