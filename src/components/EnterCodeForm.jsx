import React,{ useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'
import WaitingRoom from './WaitingRoom'
import HostRoom from './HostRoom'
import Background from './Background'

import '../style/style.css'
import { toast } from 'react-toastify'

import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InputLabel, FormControl, Typography } from '@material-ui/core'

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CasinoRoundedIcon from '@material-ui/icons/CasinoRounded';

import firebase from "firebase"
import "firebase/database";

import { QuestionAnswerRounded, FilterNoneRounded, LockSharp } from '@material-ui/icons';

import Translations from '../translations/translations.json'

const list = require('badwords-list')


//globals
//https://connect-quiz-now.herokuapp.com/
//http://localhost:3001
//good one https://connect-now-backend.herokuapp.com/

export const socket = io('http://localhost:3001', {transports: ['websocket', 'polling', 'flashsocket']});

export default function EnterCodeForm({match, location}) {
    //const classes = useStyles();

    var [role, setRole] = useState('')
    const [checked, setChecked] = React.useState(false);
    var [code, setCode] = useState('')

    const [gameCode, setGameCode] = useState('')
    const [gameMode, setGameMode] = useState('')

    const [playMode, setPlayMode] = useState(true)

    const maxPlayers = useRef(null)
    const podiumPlaces = useRef(null)

    const search = useLocation().search; 

    const [joinFormStep, setJoinFormStep] = useState(0)
    const [joinFormCode,  setJoinFormCode] = useState("")
    const [joinFormNickname, setJoinFormNickname] = useState("")

    const [userLanguage, setUserLanguage] = useState(localStorage.getItem('connectLanguage') || 'english')

    const [classid, setClassid] = useState("null")
    const classID = new URLSearchParams(search).get('classid')

    const classes = []


    useEffect(() => {
        console.log(getClasses())
        const Gamecode = new URLSearchParams(search).get('code');
        if(Gamecode !== null){
            setCode(Gamecode)
            setJoinFormCode(Gamecode)
            console.log(Gamecode)
            setPlayMode(true)
        }
        const gamecodeParam = new URLSearchParams(search).get('gamecode');
        if(gamecodeParam !== null){
            console.log(gamecodeParam)
            setGameCode(gamecodeParam)
            setPlayMode(false)
            setClassid(classID)
            console.log(classID)
            Generatecode()
            firebase.database().ref(`/quizes/${gamecodeParam}`).on('value', (snapshot) => {
                if(snapshot.val() !== null){
                    setGameMode('normal')
                }
            })
            firebase.database().ref(`/multiQuizzes/${gamecodeParam}`).on('value', (snapshot) => {
                if(snapshot.val() !== null){
                    setGameMode('multi')
                }
            })

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
            console.log(data)
        })
        
        socket.on('roomcreated', (data)=>{
            setRole(role = 'host')

            var validclassId = data.classId
            
            console.log(data.friendly +'checked uit')
            console.log('values below')
            if(maxPlayers.current == null || podiumPlaces.current == null) return
            console.log(maxPlayers.current.value)
            console.log(podiumPlaces.current.value)
            ReactDOM.render(
                <div>
                <HostRoom 
                    maxPlayers={maxPlayers.current.value} 
                    podiumPlaces={podiumPlaces.current.value} 
                    room={data.room} 
                    gamecode={data.gamecode}
                    friendlyroom={data.friendly}
                    gamemode={data.gamemode}
                    classid={validclassId}
                    />
                <Background/>
                </div>,
                document.getElementById('root')
            )
            localStorage.setItem(JSON.parse(localStorage.getItem('user')).profileObj.googleId, true)

            socket.emit('addHost', {
                googleId: JSON.parse(localStorage.getItem('user')).profileObj.googleId,
                room: data.room
            })

            if(validclassId != "null" && validclassId != null){
                socket.emit('addPrivateRoom', {
                    room: data.room,
                    classId: validclassId,
                    googleId: JSON.parse(localStorage.getItem('user')).profileObj.googleId
                })

                firebase.database().ref(`classes/${validclassId}/members`).once('value', (snapshot) => {
                    if(snapshot.val() !== null){
                        const members = snapshot.val() || []

                        members.map((member) => {
                            const memberID = member.id
                            const notification = {
                                "type": "invitation_to_room",
                                "classid": validclassId,
                                "room": data.room,
                                "read": false,
                                "date": new Date().toLocaleString(),
                                "message": `${JSON.parse(localStorage.getItem('user')).profileObj.name} has invited you to play a game in room ${data.room}!`
                            }
                            firebase.database().ref(`users/${memberID}/notifications`).push(notification)
                        })
                        
                    }
                })
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
        const terminateRoomPopUp = (room) => (
            <div>
                <h3>{Translations[userLanguage].alerts.terminate.text1}</h3>
                <h4>{Translations[userLanguage].alerts.terminate.text2}</h4>
                <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{terminateRoom(room)}}>{Translations[userLanguage].alerts.terminate.button}</Button>
            </div>
        )

        socket.on('roomAlreadyExists', (data)=>{
            toast.info(Translations[userLanguage].alerts.roomalreadyexists)
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
            toast.info(`${Translations[userLanguage].alerts.gamealreadystarted} ${data.room}`)
        })

        socket.on('cannotJoinPrivateRoom', (data) => {
            toast.error(Translations[userLanguage].alerts.cannotjoinprivate)
        })


    }, [])

    const getClasses = () => {
        const classes = []
        firebase.database().ref(`/users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}/classes`).on('value', (snapshot) => {
            if(snapshot.exists()){
                const data = snapshot.val()

                const keys = Object.keys(data)

                console.log(keys)

                for(let i = 0; i < keys.length; i++){
                    const key = keys[i]
                    const currentClassId = data[key].id
                    if(currentClassId !== null){
                        classes.push(currentClassId)
                    }
                }
            }
        })
        return classes
    }



    const JoinRoom = ()=>{
        if(joinFormNickname === ""){ 
            toast.error(Translations[userLanguage].alerts.entername)
            return
        }
        if(joinFormCode === ""){ 
            toast.error(Translations[userLanguage].alerts.entercode)
            return
        }
        socket.emit('joinroom', {
            code: joinFormCode, 
            name: joinFormNickname,
            profane: list.array.includes(joinFormNickname),
            classes: getClasses()
        })
    }

    
    function CreateRoom(){
        if(document.getElementById('roomName').value === undefined){
            toast.error(Translations[userLanguage].alerts.enterroomname)
            return
        }
        if(gameCode === ''){
            toast.error(Translations[userLanguage].alerts.entergamecode)
            return
        }
        if(gameMode === ''){
            toast.error(Translations[userLanguage].alerts.entergamemode)
            return
        }
        console.log(checked)

        firebase.database().ref(`/classes/${classID}`).on('value', (snapshot) => {
            if(snapshot.exists()){
                const snapData = snapshot.val()

                firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}/plan`).on('value',(snap)=>{
                    if(snap.val() !== null){
                       if(snap.val() === 'Starter'){
                        socket.emit('createroom', {
                            room: document.getElementById('roomName').value,
                            gamecode: gameCode,
                            host: JSON.parse(localStorage.getItem('user')).profileObj.googleId,
                            friendly: checked,
                            gamemode: gameMode,
                            classId: null
                        })
                       }
                       if(snap.val() === 'Classroom'){
                        socket.emit('createroom', {
                            room: document.getElementById('roomName').value || "",
                            gamecode: gameCode,
                            host: JSON.parse(localStorage.getItem('user')).profileObj.googleId,
                            friendly: checked,
                            gamemode: gameMode,
                            classId: snapData.id,
                        })
                       }
        
                    }
                })

            }
            else{
                socket.emit('createroom', {
                    room: document.getElementById('roomName').value,
                    gamecode: gameCode,
                    host: JSON.parse(localStorage.getItem('user')).profileObj.googleId,
                    friendly: checked,
                    gamemode: gameMode,
                    classId: null
                })
            }
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
        toast.success(`${Translations[userLanguage].alerts.roomterminated} ${room}`)
    }

    
    const toggleChecked = () => {
        setChecked((prev) => !prev);
      };

    
    const changeGamemode = (event) => {
        event.preventDefault();
        setGameMode(event.target.value);
    }


    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div id='navMargin2'/>
            {
                playMode?
                        <div id='mainConatainer'>
                            <h1>{Translations[userLanguage].play.join.title}</h1>
                            {
                                joinFormStep === 0 &&
                                <>
                                    <input value={joinFormCode} onChange={(event) => setJoinFormCode(event.target.value)} style={{width:'100%', height:'48px'}} defaultValue={code} placeholder={Translations[userLanguage].play.join.input} type="text" id="code"/>
                                    <br></br><Button style={{marginTop:'1vh', width:'100%', fontSize:'1.2rem', height:'48px'}} variant="contained" color="primary" size='small' onClick={()=>{setJoinFormStep(1)}}>{Translations[userLanguage].play.join.button}</Button>
                                </>
                            }
                            {
                                joinFormStep === 1 &&
                                <>
                                    <input value={joinFormNickname} onChange={(event) => setJoinFormNickname(event.target.value)} style={{width:'100%', height:'48px'}} placeholder={'Enter Your Nickname'} type="text" id="name"/>
                                    <br></br><Button style={{marginTop:'1vh', width:'100%', fontSize:'1.2rem', height:'48px'}} variant="contained" color="primary" size='small' onClick={()=>{JoinRoom()}}>{Translations[userLanguage].play.join.button2}</Button>
                                </>
                            }
                        </div>
                        :
                        <div id='subConatainer'>
                        {
                            classid != "null" &&
                            <div style={{display:'flex', alignItems:'flex-start'}}>
                                {
                                    classid !== null &&
                                    <div style={{display:'flex', alignItems:'center', backgroundColor:'#3f51b5', color:'white', fontWeight:'bold', borderRadius:'5px', margin:'2px', padding:'10px'}}>
                                        <Typography variant="sub1">{Translations[userLanguage].play.host.private}</Typography>
                                    </div>
                                }
                            </div>
                        }
                        <h1>{Translations[userLanguage].play.host.title}</h1>
                        <h2>{Translations[userLanguage].play.host.roomcode}</h2>
                        <input className='host-input' placeholder={Translations[userLanguage].play.host.input} type="text" id="roomName"/>
                        <input hidden value={gameCode} onChange={(event) => setGameCode(event.target.value)} style={{marginLeft:'8px'}} className='host-input' placeholder={Translations[userLanguage].play.host.input2} type="text" id="gameCode"/>
                            {gameCode != '' ?
                                null
                                : <InfoOutlinedIcon onClick={()=>{window.location = '/browsequizzes/normal'}} style={{marginBottom:'-8px', marginRight:'-15px', position:'relative', left:'-30px'}} color='primary'/>
                            }
                            <div>
                                <h2>{Translations[userLanguage].play.host.presets.title}</h2>
                                <label>{Translations[userLanguage].play.host.presets.maxplayers} </label><input ref={maxPlayers} id='max-players' type='number' min='0' max='40'/>
                                <br></br><label>{Translations[userLanguage].play.host.presets.podiumplaces} </label><input ref={podiumPlaces} id='podium-places' type='number' min='3' max='10'/>
                                <br></br>
                                    <div>
                                        <label>{Translations[userLanguage].play.host.presets.friendly}</label>
                                        <Switch 
                                            size="small" 
                                            checked={checked} 
                                            onChange={()=>{toggleChecked()}}
                                            color="primary" 
                                            name="checked" 
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </div>
                            </div>
                            <br></br><Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{Generatecode()}}>{Translations[userLanguage].play.host.presets.button} <CasinoRoundedIcon style={{marginLeft:'10px'}}/></Button>
                            <br></br><Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{CreateRoom()}}>{Translations[userLanguage].play.host.presets.button2}</Button>
                        </div>
            }
        </div>
    )
}
