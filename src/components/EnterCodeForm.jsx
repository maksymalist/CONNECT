import React,{ useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { io } from 'socket.io-client'
import WaitingRoom from './WaitingRoom'
import HostRoom from './HostRoom'
import "react-awesome-button/dist/styles.css"
import Background from './Background'

import '../style/style.css'
import { toast } from 'react-toastify'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch';

const list = require('badwords-list')

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));


//globals
//https://connect-quiz-now.herokuapp.com/
//http://localhost:3001
//https://connect-now-backend.herokuapp.com/

export const socket = io('https://connect-now-backend.herokuapp.com/', {transports: ['websocket', 'polling', 'flashsocket']});

export default function EnterCodeForm({match, location}) {
    //const classes = useStyles();

    var [role, setRole] = useState('')
    var [checked, setChecked] = useState(false)
    var [code, setCode] = useState('')

    useEffect(() => {
        console.log(list.array)
        console.log(match)
        console.log(location)
        if(location.search !== ""){
            setCode(code = location.search.replace('?code=',''))
            document.getElementById("subConatainer").hidden = true
        }

        var joined = false
        
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
                <div>
                <HostRoom 
                maxPlayers={document.getElementById('max-players').value} 
                podiumPlaces={document.getElementById('podium-places').value} 
                room={data.room} 
                gamecode={data.gamecode}
                friendly={checked}/>
                <Background/>
                </div>,
                document.getElementById('root')
            )
            localStorage.setItem(JSON.parse(localStorage.getItem('user')).profileObj.googleId, true)

            socket.emit('addHost', {
                googleId: JSON.parse(localStorage.getItem('user')).profileObj.googleId,
                room: data.room
            })

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
        const terminateRoomPopUp = (room) => (
            <div>
                <h3>You are Already Hosting a Room</h3>
                <h4>Do you Want to Terminate that Room?</h4>
                <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{terminateRoom(room)}}>Terminate</Button>
            </div>
        )

        socket.on('roomAlreadyExists', (data)=>{
            alert('A Room With This Name Already Exists Choose Another Name')
        })

        socket.on('alreadyHostRoom', (data)=>{
            toast.info(terminateRoomPopUp(data), {autoClose: 10000})
        })

        socket.on('GeneratedCode', (data)=>{
            console.log(data)
            if(document.getElementById('roomName') == undefined) return
            document.getElementById('roomName').value = data
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

    
    function CreateRoom(){
        socket.emit('createroom', {
            room: document.getElementById('roomName').value,
            gamecode: document.getElementById('gameCode').value,
            host: JSON.parse(localStorage.getItem('user')).profileObj.googleId
        })
    }

    const Generatecode = () => {
        socket.emit('GenerateCode', '')
    }
    const terminateRoom = (room) => {
        socket.emit('EndGameTerminated',{
            room: room,
            googleId: JSON.parse(localStorage.getItem('user')).profileObj.googleId
        })
        toast.success(`Room: ${room} has succesfuly been terminated!`)
    }

    
      const handleChange = () => {
        if(checked == false){
            setChecked(checked = true);
            return
        }
        if(checked == true){
            setChecked(checked = false);
            return
        }
      };


    return (
        <div>
            <div id='navMargin2'/>
            <div id='mainConatainer'>
                <h1>Join Room</h1>
                <input placeholder={'Enter Your Nickname'} type="text" id="name"/>
                <br></br><input defaultValue={code} placeholder={'Enter Room Name'} type="text" id="code"/>
                <br></br><Button style={{marginTop:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{JoinRoom()}}>Join Room</Button>
            </div>
            <div id='subConatainer'>
            <h1>Host Room</h1>
                <input placeholder={'Give Your Room A Name'} type="text" id="roomName"/>
                <br></br><input placeholder={'Enter Game Code'} type="text" id="gameCode"/>
                <div>
                    <h1 style={{fontSize:'25px'}}>Presets</h1><br></br>
                    <label>Max Players </label><input id='max-players' type='number' min='0' max='40'/>
                    <br></br><label>Podium Places </label><input id='podium-places' type='number' min='3' max='10'/>
                    <br></br>
                        <div>
                            <label>Friendly Nicknames</label>
                            <Switch 
                            checked={checked} 
                            onChange={()=>{handleChange()}} 
                            color="primary" 
                            name="checked" 
                            inputProps={{ 'aria-label': 'primary checkbox' }}/>
                        </div>
                </div>
                <br></br><Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{Generatecode()}}>Generate Name</Button>
                <br></br><Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{CreateRoom()}}>Host Room</Button>
            </div>
                <textarea hidden cols="40" rows="30" id="userList" placeholder="No users" readOnly></textarea>


        </div>
    )
}
