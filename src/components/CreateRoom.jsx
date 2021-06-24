import React,{ useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { io } from 'socket.io-client'
import WaitingRoom from './WaitingRoom'
import HostRoom from './HostRoom'
import GoogleLogin from 'react-google-login'
import "react-awesome-button/dist/styles.css"
import Background from './Background'


import '../style/style.css'
import { toast } from 'react-toastify'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch';

import { socket } from './EnterCodeForm'

const list = require('badwords-list')

//globals
//https://connect-quiz-now.herokuapp.com/
//http://localhost:3001

export default function EnterCodeForm({match}) {

    var [role, setRole] = useState('')
    var [checked, setChecked] = useState(false)
    var [code, setCode] = useState('')

    useEffect(() => {
        console.log(list.array)
        console.log(match.params.code)
        if(match.params.code !== undefined || null){
            setCode(code = match.params.code)
        }

        var joined = false
        
        
        socket.on('roomcallback', (data)=>{
        
            if(data.joined == true){
                joined = true
            }
        })

        socket.on('changeName', (data)=>{
            //
        })
        socket.on('roomFull', (data)=>{
            toast.warning(data.message)
        })
        
        
        socket.on('addeduser', (data)=>{
            /*var RoomUsers = []
        
            for(var i = 0; i < data.names.length; i++){
                if(data.UserRooms[i] == undefined) return
                if(data.currentRoom == data.UserRooms[i]){
                    RoomUsers.push(data.names[i])
                }
            }*/
            //document.getElementById('userList').innerHTML = RoomUsers
            if(role !== 'host'){
                setRole('player')
                if(sessionStorage.getItem('roomJoined') !== 'true'){

                    ReactDOM.render(
                        <div>
                        <WaitingRoom room={data.currentRoom} usersInRoom={data.UsersInRoom} user={data.name}/>
                        <Background/>
                        </div>,
                        document.getElementById('root')
                    )
                    sessionStorage.setItem('roomJoined', 'true')
                }
                
            }
            
        })

        socket.on('gameAlreadyStarted', (data) => {
            toast.info(`The Game has Already Started in Room ${data.room}`)
        })


    }, [])



    const JoinRoom = ()=>{
        socket.emit('joinroom', {
        code: document.getElementById('code').value, 
        name: document.getElementById('name').value,
        profane: list.array.includes(document.getElementById('name').value)})
    }


    return (
        <div>
        <div id='navMargin2'/>
        <div style={{marginTop:'25%'}} id='mainConatainer'>
            <h1>Join Room</h1>
            <input placeholder={'Enter Your Nickname'} type="text" id="name"/>
            <br></br><input defaultValue={code} placeholder={'Enter Room Name'} type="text" id="code"/>
            <br></br><Button style={{marginTop:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{JoinRoom()}}>Join Room</Button>
        </div>
            <textarea hidden cols="40" rows="30" id="userList" placeholder="No users" readOnly></textarea>


    </div>
    )
}
