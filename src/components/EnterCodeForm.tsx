import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useLocation } from 'react-router-dom'
import WaitingRoom from './game/player/WaitingRoom'
import HostRoom from './game/host/HostRoom'
import MultiHostRoom from './game/host/MultiHostRoom'
import Background from './misc/Background'
import { motion } from 'framer-motion/dist/framer-motion'

import '../style/style.css'
import { toast } from 'react-toastify'

import { Button, Typography, CircularProgress } from '@mui/material'

import axios from 'axios'

import { useMutation, gql } from '@apollo/client'

//@ts-ignore
import list from 'badwords-list'

import config from '../config.json'
import socket from '../socket-io'

import useTranslations from '../hooks/useTranslations'

//hooks
import getUser from '../hooks/getUser'

const CREATE_NOTIFICATION = gql`
  mutation createNotification(
    $userId: ID!
    $type: String!
    $message: String!
    $data: String!
  ) {
    createNotification(
      userId: $userId
      type: $type
      message: $message
      data: $data
    )
  }
`

const INCREMENT_PLAYS = gql`
  mutation ($type: String!, $visibility: String!, $id: ID!) {
    incrementPlays(type: $type, visibility: $visibility, _id: $id)
  }
`

let joined = false

let friendlyNicknamesGlobal = false
let maxPlayersGlobal = 3
let podiumPlacesGlobal = 3

type Props = {
  match: any
  location: any
}

export default function EnterCodeForm(props: Props) {
  const user = getUser()
  var [role, setRole] = useState('')
  var [code, setCode] = useState('')

  const match = props.match
  const location = props.location

  const [gameCode, setGameCode] = useState('')
  const [gameMode, setGameMode] = useState('')

  const [playMode, setPlayMode] = useState(true)

  const search = useLocation().search

  const [joinFormStep, setJoinFormStep] = useState(0)
  const [joinFormCode, setJoinFormCode] = useState('')
  const [joinFormNickname, setJoinFormNickname] = useState('')

  const translations = useTranslations()

  const [classid, setClassid] = useState('null')
  const classID = new URLSearchParams(search).get('classid')

  //mutations
  const [createNotification] = useMutation(CREATE_NOTIFICATION)
  const [incrementPlays] = useMutation(INCREMENT_PLAYS)

  //spinners
  const [spinner1, setSpinner1] = useState(false)
  const [spinner2, setSpinner2] = useState(false)

  const [hostStep, setHostStep] = useState(0)

  const [roomName, setRoomName] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(3)
  const [maxPlayerEmojis, setMaxPlayerEmojis] = useState([1, 2, 3])
  const allEmojis = [
    '😀',
    '😁',
    '😂',
    '😃',
    '😄',
    '😅',
    '😆',
    '😇',
    '😈',
    '👿',
    '😉',
    '😊',
    '😋',
    '😌',
    '😍',
    '😎',
    '😏',
    '😐',
    '😑',
    '😒',
    '😓',
    '😔',
    '😕',
    '😖',
    '😗',
    '😘',
    '😙',
    '😚',
    '😛',
    '😜',
    '😝',
    '😞',
    '😟',
    '😠',
    '😡',
    '😢',
    '😣',
    '😤',
    '😥',
    '😦',
    '😧',
    '😨',
    '😩',
    '😪',
    '😫',
    '😬',
    '😭',
    '😮',
    '😯',
    '😰',
    '😱',
    '😲',
    '😳',
    '😴',
    '😵',
    '😶',
    '😷',
  ]

  const [podiumPlaces, setPodiumPlaces] = useState(3)
  const [podiumPlacesArr, setPodiumPlacesArr] = useState([1, 2, 3])

  const [isFriendlyNicknames, setIsFriendlyNicknames] = useState(false)

  useEffect(() => {
    const Gamecode = new URLSearchParams(search).get('code')

    if (!user) {
      if (Gamecode !== null) {
        window.location = `/login?code=${Gamecode}` as any
        return
      } else {
        window.location = '/login' as any
        return
      }
    }

    if (Gamecode !== null) {
      setCode(Gamecode)
      setJoinFormCode(Gamecode)
      console.log(Gamecode)
      setPlayMode(true)
    }
    const gamecodeParam = new URLSearchParams(search).get('gamecode')
    if (gamecodeParam !== null) {
      console.log(gamecodeParam)
      setGameCode(gamecodeParam)
      setPlayMode(false)
      setClassid(classID as any)
      console.log(classID)
      Generatecode()
      const mode = new URLSearchParams(search).get('mode')
      if (mode === null) return

      if (mode === 'quiz') setGameMode('normal')
      if (mode === 'multi') setGameMode('multi')
    }

    socket.on('myroom', (data) => {
      socket.emit('adduser', {
        name: data.name,
        room: data.room,
      })
    })

    socket.on('roomcallback', (data) => {
      if (data.joined == true) {
        joined = true
        setSpinner1(false)
      } else {
        if (joined == true) return
        toast.error(translations.alerts.roomnotfound)
        setSpinner1(false)
      }
    })

    socket.on('roomcreated', async (data) => {
      setRole((role = 'host'))
      setSpinner2(false)

      var validclassId = data.classId

      if (data.gamemode === 'normal') {
        try {
          const response = await axios.post(
            `${config['api-server']}/get-quiz-all-types`,
            { quizID: data.gamecode }
          )

          const visibility = response.data.visibility

          incrementPlays({
            variables: {
              type: 'quiz',
              visibility: visibility,
              id: data.gamecode,
            },
          })
        } catch (error) {
          console.log(error)
        }

        ReactDOM.render(
          <div>
            <HostRoom
              maxPlayers={maxPlayersGlobal < 3 ? 3 : maxPlayersGlobal}
              podiumPlaces={podiumPlacesGlobal < 3 ? 3 : podiumPlacesGlobal}
              room={data.room}
              gamecode={data.gamecode}
              friendlyroom={data.friendly}
              gamemode={data.gamemode}
              classid={validclassId}
            />
            <Background />
          </div>,
          document.getElementById('root')
        )
      }
      if (data.gamemode === 'multi') {
        try {
          const response = await axios.post(
            `${config['api-server']}/get-multi-all-types`,
            { multiID: data.gamecode }
          )

          const visibility = response.data?.visibility

          incrementPlays({
            variables: {
              type: 'multi',
              visibility: visibility,
              id: data.gamecode,
            },
          })
        } catch (error) {
          console.log(error)
        }

        ReactDOM.render(
          <div>
            <MultiHostRoom
              maxPlayers={maxPlayersGlobal < 3 ? 3 : maxPlayersGlobal}
              podiumPlaces={podiumPlacesGlobal < 3 ? 3 : podiumPlacesGlobal}
              room={data.room}
              gamecode={data.gamecode}
              friendlyroom={data.friendly}
              gamemode={data.gamemode}
              classid={validclassId}
            />
            <Background />
          </div>,
          document.getElementById('root')
        )
      }
      localStorage.setItem(user?.profileObj.googleId, true as any)

      socket.emit('addHost', {
        googleId: user?.profileObj.googleId,
        room: data.room,
      })

      if (validclassId != 'null' && validclassId != null) {
        socket.emit('addPrivateRoom', {
          room: data.room,
          classId: validclassId,
          googleId: user?.profileObj.googleId,
        })

        const res = await axios.post(
          `${config['api-server']}/get-members-of-class`,
          { id: validclassId }
        )
        const members = res.data

        members?.map((member: any) => {
          const memberId = member.userId
          const notification = {
            userId: memberId.replace(/user:/g, ''),
            type: 'invitation_to_room',
            message: `${user?.profileObj.name} has invited you to play a game in room ${data.room}!`,
            data: JSON.stringify({ room: data.room, classId: validclassId }),
          }

          createNotification({ variables: notification })
        })
      }
    })

    socket.on('changeName', (data) => {
      if (sessionStorage.getItem('roomJoined') !== 'true') {
        if (role !== 'host') {
          toast.error(translations.alerts.nametaken)
        }
      }
    })
    socket.on('roomFull', (data) => {
      toast.warning(data.message)
    })

    socket.on('addeduser', (data) => {
      if (role !== 'host') {
        setRole('player')
        if (sessionStorage.getItem('roomJoined') !== 'true') {
          ReactDOM.render(
            <div>
              <WaitingRoom
                room={data.currentRoom}
                usersInRoom={data.UsersInRoom}
                user={data.name}
              />
              <Background />
            </div>,
            document.getElementById('root')
          )
          sessionStorage.setItem('roomJoined', 'true')
        }
      }
    })
    const terminateRoomPopUp = (room: any) => (
      <div>
        <h3>{translations.alerts.terminate.text1}</h3>
        <h4>{translations.alerts.terminate.text2}</h4>
        <Button
          style={{ marginBottom: '1vh' }}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            terminateRoom(room)
          }}
        >
          {translations.alerts.terminate.button}
        </Button>
      </div>
    )

    socket.on('roomAlreadyExists', (data) => {
      toast.info(translations.alerts.roomalreadyexists)
    })

    socket.on('alreadyHostRoom', (data) => {
      toast.info(terminateRoomPopUp(data), { autoClose: 10000 })
    })

    socket.on('GeneratedCode', (data) => {
      console.log(data)
      setRoomName(data)
    })

    socket.on('gameAlreadyStarted', (data) => {
      toast.info(`${translations.alerts.gamealreadystarted} ${data.room}`)
    })

    socket.on('cannotJoinPrivateRoom', (data) => {
      toast.error(translations.alerts.cannotjoinprivate)
    })
  }, [])

  useEffect(() => {
    console.log(`
      is friendly nicknames: ${friendlyNicknamesGlobal ? 'true' : 'false'}
      max players: ${maxPlayersGlobal}
      podium places: ${podiumPlacesGlobal}
    `)
  }, [isFriendlyNicknames, maxPlayers, podiumPlaces])

  const JoinRoom = async () => {
    if (sessionStorage.getItem('roomJoined') == 'true') {
      toast.info(translations.alerts.sessionexpired)
      return
    } else {
      if (joinFormNickname === '') {
        toast.error(translations.alerts.entername)
        return
      }
      if (joinFormCode === '') {
        toast.error(translations.alerts.entercode)
        return
      }
      const res = await axios.post(`${config['api-server']}/get-user-classes`, {
        userId: user?.profileObj.googleId,
      })
      const classes = res.data
      setSpinner1(true)
      socket.emit('joinroom', {
        code: joinFormCode,
        name: joinFormNickname,
        profane: list.array.includes(joinFormNickname),
        classes: classes ? classes : [],
      })
    }
  }

  const CreateRoom = async () => {
    if (roomName === '') {
      toast.error(translations.alerts.enterroomname)
      return
    }
    if (gameCode === '') {
      toast.error(translations.alerts.entergamecode)
      return
    }
    if (gameMode === '') {
      toast.error(translations.alerts.entergamemode)
      return
    }
    console.log(friendlyNicknamesGlobal)

    const res = await axios.post(`${config['api-server']}/get-class`, {
      id: classID,
    })
    console.log(res.data)

    const data = res.data

    if (data !== null) {
      const res = await axios.post(`${config['api-server']}/user`, {
        userId: user?.profileObj.googleId,
      })
      const userData = res.data
      console.log(userData)
      if (userData?.plan === 'Starter') {
        socket.emit('createroom', {
          room: roomName,
          gamecode: gameCode,
          host: user?.profileObj.googleId,
          friendly: friendlyNicknamesGlobal,
          gamemode: gameMode,
          classId: null,
        })
      }
      if (userData.plan === 'Classroom') {
        socket.emit('createroom', {
          room: roomName || '',
          gamecode: gameCode,
          host: user?.profileObj.googleId,
          friendly: friendlyNicknamesGlobal,
          gamemode: gameMode,
          classId: classID,
        })
      }
    } else {
      socket.emit('createroom', {
        room: roomName,
        gamecode: gameCode,
        host: user?.profileObj.googleId,
        friendly: friendlyNicknamesGlobal,
        gamemode: gameMode,
        classId: null,
      })
    }
    setSpinner2(true)
  }

  const Generatecode = () => {
    socket.emit('GenerateCode', '')
  }
  const terminateRoom = (room: any) => {
    socket.emit('EndGameTerminated', {
      room: room,
      googleId: user?.profileObj.googleId,
    })
    toast.success(`${translations.alerts.roomterminated} ${room}`)
  }

  return (
    <div
      id="main__container__wrapper"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {playMode ? (
        <div id="mainConatainer">
          <Typography variant="h3" style={{ margin: '30px' }}>
            <b>{translations.play.join.title}</b>
          </Typography>
          {joinFormStep === 0 && (
            <>
              <input
                value={joinFormCode}
                onChange={(event) => setJoinFormCode(event.target.value)}
                style={{ width: '100%', height: '48px' }}
                defaultValue={code}
                placeholder={translations.play.join.input}
                type="text"
                id="code"
              />
              <br></br>
              <Button
                style={{
                  marginTop: '1vh',
                  width: '100%',
                  fontSize: '1.2rem',
                  height: '48px',
                }}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  setJoinFormStep(1)
                }}
              >
                {translations.play.join.button}
              </Button>
            </>
          )}
          {joinFormStep === 1 && (
            <>
              <input
                value={joinFormNickname}
                onChange={(event) => setJoinFormNickname(event.target.value)}
                style={{ width: '100%', height: '48px' }}
                placeholder={translations.play.join.input2}
                type="text"
                id="name"
              />
              <br></br>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  style={{
                    fontSize: '1.2rem',
                    height: '48px',
                    width: '100%',
                    margin: '10px',
                  }}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    JoinRoom()
                  }}
                >
                  {spinner1 ? (
                    <CircularProgress size={24} style={{ color: 'white' }} />
                  ) : (
                    translations.play.join.button2
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  style={{
                    fontSize: '1.2rem',
                    height: '48px',
                    width: '100%',
                  }}
                  onClick={() => {
                    setJoinFormStep(0)
                  }}
                >
                  {translations.play.join.back}
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ marginTop: '120px' }}>
          {classid != 'null' && (
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              {classid !== null && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#3f51b5',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    margin: '2px',
                    padding: '10px',
                  }}
                >
                  <Typography variant="subtitle1">
                    {translations.play.host.private}
                  </Typography>
                </div>
              )}
            </div>
          )}
          {hostStep === 0 && (
            <div>
              <Typography
                variant="h2"
                style={{ marginBottom: '30px', color: 'white' }}
              >
                <b>{translations.play.host.presets.gamecode}</b>
              </Typography>
              <input
                style={{
                  width: '300px',
                  fontSize: '75px',
                  padding: '10px',
                  textAlign: 'center',
                }}
                placeholder={translations.play.host.input}
                type="text"
                id="roomName"
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
              />
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  style={{
                    fontSize: '1.2rem',
                    height: '48px',
                    width: '100%',
                    marginBottom: '100px',
                    marginTop: '50px',
                  }}
                  onClick={() => {
                    Generatecode()
                  }}
                >
                  {translations.play.host.presets.button}{' '}
                </Button>
                <div>
                  <Button
                    variant="contained"
                    color={'action' as any}
                    size="large"
                    style={{
                      color: 'white',
                      marginRight: '10px',
                    }}
                    onClick={() => {
                      setHostStep(hostStep + 1)
                    }}
                  >
                    {translations.hostroom.next}
                  </Button>
                </div>
              </div>
            </div>
          )}
          {hostStep === 1 && (
            <div>
              <Typography
                variant="h2"
                style={{ marginBottom: '30px', color: 'white' }}
              >
                <b>{translations.play.host.presets.maxplayers}</b>
              </Typography>
              <input
                style={{
                  width: '300px',
                  fontSize: '75px',
                  padding: '10px',
                  textAlign: 'center',
                }}
                id="max-players"
                type="number"
                value={maxPlayers}
                onChange={(event) => {
                  if (
                    event.target.value === null ||
                    event.target.value === '' ||
                    event.target.value === undefined
                  ) {
                    setMaxPlayers(3)
                    const array = new Array(3).fill(0)
                    console.log(array)
                    setMaxPlayerEmojis(array)
                    maxPlayersGlobal = 3
                    return
                  }
                  setMaxPlayers(parseInt(event.target.value))
                  maxPlayersGlobal = parseInt(event.target.value)
                  const array = new Array(parseInt(event.target.value)).fill(0)
                  setMaxPlayerEmojis(array)
                }}
              />
              <div
                style={{
                  margin: '30px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {maxPlayerEmojis.map((player, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        fontSize: '5rem',
                      }}
                    >
                      {
                        allEmojis[
                          index > allEmojis.length - 1
                            ? Math.floor(Math.random() * 56) + 1
                            : index
                        ]
                      }
                    </div>
                  )
                })}
              </div>
              <div style={{ marginTop: '100px' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => {
                    setHostStep(hostStep - 1)
                  }}
                >
                  {translations.play.join.back}
                </Button>
                <Button
                  variant="contained"
                  color={'action' as any}
                  size="large"
                  style={{
                    color: 'white',
                    marginLeft: '10px',
                  }}
                  onClick={() => {
                    setHostStep(hostStep + 1)
                  }}
                >
                  {translations.hostroom.next}
                </Button>
              </div>
            </div>
          )}
          {hostStep === 2 && (
            <div>
              <Typography
                variant="h2"
                style={{ marginBottom: '30px', color: 'white' }}
              >
                <b>{translations.play.host.presets.podiumplaces}</b>
              </Typography>
              <input
                style={{
                  width: '300px',
                  fontSize: '75px',
                  padding: '10px',
                  textAlign: 'center',
                }}
                onChange={(event) => {
                  if (
                    event.target.value === null ||
                    event.target.value === '' ||
                    event.target.value === undefined
                  ) {
                    setPodiumPlaces(3)
                    const array = new Array(3).fill(0)
                    console.log(array)
                    setPodiumPlacesArr(array)
                    podiumPlacesGlobal = 3
                    return
                  }
                  setPodiumPlaces(parseInt(event.target.value))
                  podiumPlacesGlobal = parseInt(event.target.value)
                  const array = new Array(parseInt(event.target.value)).fill(0)
                  setPodiumPlacesArr(array)
                }}
                id="podium-places"
                type="number"
                value={podiumPlaces}
              />
              <div
                style={{
                  margin: '30px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {podiumPlacesArr.map((player, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: '5rem',
                    }}
                  >
                    {index === 0
                      ? '🥇'
                      : index === 1
                      ? '🥈'
                      : index === 2
                      ? '🥉'
                      : '🏅'}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '100px' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => {
                    setHostStep(hostStep - 1)
                  }}
                >
                  {translations.play.join.back}
                </Button>
                <Button
                  variant="contained"
                  color={'action' as any}
                  size="large"
                  style={{
                    color: 'white',
                    marginLeft: '10px',
                  }}
                  onClick={() => {
                    setHostStep(hostStep + 1)
                  }}
                >
                  {translations.hostroom.next}
                </Button>
              </div>
            </div>
          )}
          {hostStep === 3 && (
            <div>
              <Typography
                variant="h2"
                style={{ marginBottom: '30px', color: 'white' }}
              >
                <b>{translations.play.host.presets.friendly}</b>
              </Typography>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  border: '2px solid black',
                  boxShadow: '10px 10px 0 #262626',
                  padding: '10px',
                }}
              >
                <Button
                  variant={isFriendlyNicknames ? 'contained' : 'outlined'}
                  color="success"
                  size="large"
                  style={{
                    padding: '25px',
                    fontSize: '4.5rem',
                    margin: '20px',
                  }}
                  onClick={() => {
                    setIsFriendlyNicknames(true)
                    friendlyNicknamesGlobal = true
                  }}
                >
                  {translations.play.host.presets.yes}
                </Button>
                <Button
                  variant={isFriendlyNicknames ? 'outlined' : 'contained'}
                  color="secondary"
                  size="large"
                  style={{ padding: '25px', fontSize: '4.5rem' }}
                  onClick={() => {
                    setIsFriendlyNicknames(false)
                    friendlyNicknamesGlobal = false
                  }}
                >
                  {translations.play.host.presets.no}
                </Button>
              </div>
              <div style={{ marginTop: '100px' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => {
                    setHostStep(hostStep - 1)
                  }}
                >
                  {translations.play.join.back}
                </Button>
                <Button
                  variant="contained"
                  color={'action' as any}
                  size="large"
                  style={{
                    color: 'white',
                    marginLeft: '10px',
                  }}
                  onClick={() => {
                    setHostStep(hostStep + 1)
                  }}
                >
                  {translations.hostroom.next}
                </Button>
              </div>
            </div>
          )}
          {hostStep === 4 && (
            <div>
              <Typography
                variant="h2"
                style={{ marginBottom: '100px', color: 'white' }}
              >
                <b>{translations.play.host.presets.ready}</b>
              </Typography>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  style={{
                    padding: '25px',
                    fontSize: '4.5rem',
                    margin: '20px',
                  }}
                  onClick={() => {
                    setHostStep(hostStep - 1)
                  }}
                >
                  {translations.play.join.back}
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  style={{
                    padding: '25px',
                    fontSize: '4.5rem',
                    minWidth: '484px',
                    minHeight: '176px',
                  }}
                  onClick={() => {
                    CreateRoom()
                  }}
                >
                  {spinner2 ? (
                    <CircularProgress size={72} style={{ color: 'white' }} />
                  ) : (
                    translations.play.host.presets.button2
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
