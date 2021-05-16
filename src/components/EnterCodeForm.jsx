import React,{ useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { io } from 'socket.io-client'
import WaitingRoom from './WaitingRoom'
import HostRoom from './HostRoom'


import '../style/style.css'

//globals
//

export const socket = io('https://champion-connect.herokuapp.com/', {transports: ['websocket', 'polling', 'flashsocket']});

export default function EnterCodeForm() {

    var [role, setRole] = useState('')

    useEffect(() => {

        var joined = false

        var joinbutton = document.getElementById('joinbutton')
        
        socket.on('myroom', (data)=>{
            socket.emit('adduser', {
                name: data.name,
                room: data.room
            })
        })
        
        socket.on('roomcallback', (data)=>{
        
            if(data.joined == true){
                joined = true
            }
        })
        
        socket.on('roomcreated', (data)=>{
            setRole(role = 'host')
            
            ReactDOM.render(
                <HostRoom room={data.room} gamecode={data.gamecode}/>,
                document.getElementById('root')
            )

        })

        socket.on('changeName', (data)=>{
            //
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
                
                        <WaitingRoom room={data.currentRoom} usersInRoom={data.UsersInRoom} user={data.name}/>,
                        document.getElementById('root')
                    )
                    sessionStorage.setItem('roomJoined', 'true')
                }
                
            }
            
        })
        socket.on('roomAlreadyExists', (data)=>{
            alert('A Room With This Name Already Exists Choose Another Name')
        })


    }, [])


    const JoinRoom = ()=>{
        socket.emit('joinroom', {
        code: document.getElementById('code').value, 
        name: document.getElementById('name').value})
    }

    
    function CreateRoom(){
        socket.emit('createroom', {
            room: document.getElementById('roomName').value,
            gamecode: document.getElementById('gameCode').value
        })
    }


    return (
        <div>
            <div id='mainConatainer'>
                <h1>Enter Code</h1>
                <input placeholder={'Enter Name'} type="text" id="name"/>
                <br></br><input placeholder={'Enter Room Code'} type="text" id="code"/>
                <br></br><button id="joinbutton" onClick={()=>{JoinRoom()}}>Join Room</button>
            </div>
            <div id='subConatainer'>
                <h1>Create Room</h1>
                <input placeholder={'Enter Room Name'} type="text" id="roomName"/>
                <br></br><input placeholder={'Enter Game Code'} type="text" id="gameCode"/>
                <br></br><button onClick={()=>{CreateRoom()}}>Create Room</button>
            </div>
                <textarea hidden cols="40" rows="30" id="userList" placeholder="No users" readOnly></textarea>


        </div>
    )
}
