import React,{ useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { socket } from './EnterCodeForm'
import ReactDOM from 'react-dom'
import { Typography, Button } from '@material-ui/core'

import GameEnded from './GameEnded'

import '../style/style.css'

import Translations from '../translations/translations.json'

//globals

//const socket = io('http://localhost:3001')

export default function WaitingRoom(props) {

    var [gameStatus, setGameStatus] = useState(false)
    const [peopleInRoom, setPeopleInRoom] = useState([])

    useEffect(() => {
        socket.emit('joinPlayerRoom', {
            room: props.room
        })
        setPeopleInRoom(props.usersInRoom)

        socket.on('addeduser', (data)=>{
            //console.log(data)
            /*var RoomUsers = []
        
            for(var i = 0; i < data.names.length; i++){
                if(data.UserRooms[i] == undefined) return
                if(data.currentRoom == data.UserRooms[i]){
                    RoomUsers.push(data.names[i])
                }
            }*/
            //document.getElementById('userList').innerHTML = data.UsersInRoom
            setPeopleInRoom(data.UsersInRoom)
            console.log(data.UsersInRoom)
            //document.getElementById('userLength').innerHTML = data.UsersInRoom.length
            
        })

        socket.on('gameStarted', (data)=>{
            if(gameStatus == false){
                window.location = `/${data.gamemode}/${props.room}/${data.gamecode}/${props.user}/${data.maxPodium}` //multi //normal
            }
            setGameStatus(gameStatus = true)

        })
        socket.on('joinedWaitingRoom', (data)=>{
            //console.log(data)
        })
        socket.on('playerLeftRoom', (data)=>{
            //document.getElementById('userList').innerHTML = data.UsersInRoom
            //document.getElementById('userLength').innerHTML = data.UsersInRoom.length
            console.log(data.UsersInRoom)
            setPeopleInRoom(data.UsersInRoom)
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
            <h1 style={{marginTop:'100px'}}>{Translations[localStorage.getItem('connectLanguage')].waitingroom.title}</h1>
            {/* <textarea id='userList' defaultValue={props.usersInRoom} readOnly></textarea> */}
            <div style={{width:'90%', display:'flex', flexWrap:'wrap', justifyContent:'center', padding:'100px'}}>
                {
                    peopleInRoom.map((person, index)=>{
                        return <Typography className='waitingRoomPerson' variant='h2' key={index} style={{padding:'10px', margin:'10px', fontSize:'1.5rem'}}>{person}</Typography>
                    })
                }
            </div>
            <div>
                <Button style={{marginBottom:'1vh', alignSelf:'left'}} variant="contained" color="secondary" size='large' onClick={()=>{leaveRoom()}}>{Translations[localStorage.getItem('connectLanguage')].waitingroom.leavebutton}</Button>
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
