/*import React,{ useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { io } from 'socket.io-client'
import WaitingRoom from './WaitingRoom'
import HostRoom from './HostRoom'
import GoogleLogin from 'react-google-login'
import "react-awesome-button/dist/styles.css"
import Background from './Background'


import '../style/style.css'
import { toast } from 'react-toastify'

//globals
//https://connect-quiz-now.herokuapp.com/
//http://localhost:3001

import { socket } from './EnterCodeForm'

export default function EnterCodeForm() {

    var [role, setRole] = useState('')

    useEffect(() => {
        
        
        socket.on('roomcreated', (data)=>{
            setRole(role = 'host')
            
            ReactDOM.render(
                <div>
                <HostRoom 
                maxPlayers={document.getElementById('max-players').value} 
                podiumPlaces={document.getElementById('podium-places').value} 
                room={data.room} 
                gamecode={data.gamecode}/>
                <Background/>
                </div>,
                document.getElementById('root')
            )
            localStorage.setItem(JSON.parse(localStorage.getItem('user')).profileObj.googleId, true)

        })
        
        
        socket.on('roomAlreadyExists', (data)=>{
            alert('A Room With This Name Already Exists Choose Another Name')
        })

        socket.on('GeneratedCode', (data)=>{
            console.log(data)
            if(document.getElementById('roomName') == undefined) return
            document.getElementById('roomName').value = data
        })


    }, [])



    
    function CreateRoom(){
        if(localStorage.getItem(JSON.parse(localStorage.getItem('user')).profileObj.googleId)){
            toast.info('You Can Only Host One Room!')
            return
        }
        socket.emit('createroom', {
            room: document.getElementById('roomName').value,
            gamecode: document.getElementById('gameCode').value,
            host: JSON.parse(localStorage.getItem('user')).profileObj.googleId
        })
    }

    const Generatecode = () => {
        socket.emit('GenerateCode', '')
    }


    return (
        <div>
            <div id='navMargin2'/>
            <div id='mainConatainer'>
                <h1>Host Room</h1>
                <input placeholder={'Give Your Room A Name'} type="text" id="roomName"/>
                <br></br><input placeholder={'Enter Game Code'} type="text" id="gameCode"/>
                <div>
                    <label>Max Players</label><input id='max-players' type='number' min='3' max='23'/>
                    <br></br><label>Podium Places</label><input id='podium-places' type='number' min='3' max='10'/>
                </div>
                <br></br><button onClick={()=>{Generatecode()}}>Generate Name</button>
                <br></br><button onClick={()=>{CreateRoom()}}>Host Room</button>
            </div>
                <textarea hidden cols="40" rows="30" id="userList" placeholder="No users" readOnly></textarea>


        </div>
    )
}*/
