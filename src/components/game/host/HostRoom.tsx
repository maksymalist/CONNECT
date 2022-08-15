//@ts-nocheck
import React, { useState, useEffect } from 'react'
import socket from '../../../socket-io'
import ReactDOM from 'react-dom'
import { toast } from 'react-toastify'
import {
  Share,
  People,
  PlayArrow,
  ExitToAppRounded,
  VolumeOffRounded,
  VolumeUpRounded,
} from '@mui/icons-material'
import GameEnded from './GameEnded'
import { motion } from 'framer-motion/dist/framer-motion'

import {
  Divider,
  Typography,
  Button,
  Slider,
  ClickAwayListener,
} from '@mui/material'

//Icons
import FirstPlaceIcon from '../../../img/PodiumIcons/firstPlace.svg'
import SecondPlaceIcon from '../../../img/PodiumIcons/secondPlace.svg'
import ThirdPlaceIcon from '../../../img/PodiumIcons/thirdPlace.svg'
import TextLogo from '../../../img/text-logo.svg'

//Material Ui
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import TimerRoundedIcon from '@mui/icons-material/TimerRounded'

import 'react-toastify/dist/ReactToastify.css'
import '../../../style/style.css'
import '../../../style/playButtonAnimation.css'
import CountDown from './CountDown'

import SharePopup from './SharePopup'

import axios from 'axios'

import config from '../../../config.json'
import useMediaQuery from '@mui/material/useMediaQuery'

import QRCode from 'react-qr-code'

import ReactHowler from 'react-howler'
import themeSong from '../../../audio/connect_theme.mp3'
import getUser from '../../../hooks/getUser'
import useTranslations from '../../../hooks/useTranslations'

const playersTime = []
let userLimit2 = 0
let finished2 = []

export default function HostRoom(props) {
  const BAD_STATUS_ARR = [
    'past_due',
    'canceled',
    'unpaid',
    'incomplete',
    'incomplete_expired',
  ]
  const user = getUser()
  var [playerPodiumMax, setPlayerPodiumMax] = useState(props.podiumPlaces)
  const [userLimit, setUserLimit] = useState(8)
  const podium = []
  var numArray = []
  var playerArr = []
  const podiumObj = {}
  var [numberOfUsers, setNumberOfUsers] = useState(0)

  const [name, setName] = useState('')

  const [isCountdown, setIsCountdown] = useState(false)
  const [sharePopupActive, setSharePopupActive] = useState(false)

  const [gameStarted, setGameStarted] = useState(false)

  const translations = useTranslations()

  const [isRoomLeft, setIsRoomLeft] = useState(false)

  const [lowestTimeState, setLowestTime] = useState({})

  const [finalPodium, setFinalPodium] = useState([])
  const [finished, setFinished] = useState(0)

  const [musicIsPlaying, setMusicIsPlaying] = useState(false)
  const [isSlider, setIsSlider] = useState(false)
  const [musicVolume, setMusicVolume] = useState(50)

  const smallScreen = useMediaQuery('(max-width:600px)')
  const bigScreen = useMediaQuery('(min-width:2500px)')

  useEffect(() => {
    document.getElementById('root').style.padding = '15px'
    setMusicIsPlaying(true)
    fetchQuiz()
    if (props.friendlyroom === true) {
      socket.emit('addFriendlyRoom', {
        room: props.room,
      })
    }
    CheckPlanStatus()
    socket.emit('joinHostRoom', {
      room: props.room,
    })
    socket.on('addeduser', (data) => {
      setNumberOfUsers(data?.UsersInRoom?.length)
      updateUserDiv(data.UsersInRoom)
      console.log(data?.UsersInRoom?.length + ' / ' + userLimit2)
      if (data?.UsersInRoom?.length >= userLimit2) {
        socket.emit('roomLimitReached', props.room)
      }
    })

    socket.on('timeBoard', (data) => {
      if (podium.includes(data.user)) {
        return
      }

      if (playersTime.includes(data.user) == true) {
        document.getElementById(
          data.user
        ).innerHTML = `${data.user} <span class="time__text" style='color:#6976EA'>${data.time}s</span>`
        document.getElementById(data.user).dataset.time = data.time
      } else {
        playersTime.push(data.user)

        let newTime = document.createElement('h1')

        newTime.innerHTML = `${data.user} <span class="time__text" style='color:#6976EA'>${data.time}s</span>`
        newTime.id = data.user
        newTime.className = 'time-box'
        newTime.dataset.time = data.time

        document.getElementById('time__div').appendChild(newTime)
      }
    })

    socket.on('roomTerminated', (data) => {
      GameOver()
    })

    socket.on('playerLeftRoom', (data) => {
      setNumberOfUsers(data.UsersInRoom.length)
      updateUserDiv(data.UsersInRoom)
    })

    socket.on('UpdatePodium', (data) => {
      if (podium.includes(data.user)) return
      podium.push(data.user)
      podiumObj[data.user] = {
        time: data.time,
        id: data.id,
      }
      handleUpdatePodium(data.user, data.time)
      //'first-place', 'second-place', 'third-place', 'other-place'
      const cloneFinished = [...finished2]

      if (finished2.includes(data) === false) {
        cloneFinished.push(data)
        finished2 = cloneFinished
        setFinished(cloneFinished)
      }

      toast.success(`${data.user} ${translations.alerts.playerfinishedgame}`, {
        autoClose: 750,
      })

      if (podium.length == playerPodiumMax) {
        toast.info(
          `${playerPodiumMax} ${translations.alerts.maxpodiumlimitreached}`
        )
      }
    })
    if (playerPodiumMax < 3) {
      setPlayerPodiumMax(3)
    }
  }, [])

  const updateUserDiv = (users) => {
    if (gameStarted) return
    if (document.getElementById('userDiv') == null) return
    document
      .getElementById('userDiv')
      .querySelectorAll('*')
      .forEach((n) => n.remove())
    users?.map((user, index) => {
      let newUser = document.createElement('div')
      newUser.id = user
      document.getElementById('userDiv').appendChild(newUser)
      ReactDOM.render(
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.08, 1] }}
          exit={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 50 }}
        >
          <h2
            className="userH1"
            onClick={() => {
              kickUser(user)
            }}
          >
            {user}
          </h2>
        </motion.div>,
        newUser
      )
    })
  }

  const handleUpdatePodium = () => {
    if (document.getElementById('podium') == null) return

    Object.keys(podiumObj).map((key, index) => {
      numArray.push(podiumObj[key].time)
    })

    numArray.sort((a, b) => {
      return a - b
    })

    Object.keys(podiumObj).map((key, index) => {
      numArray.map((time, timeIndex) => {
        if (time === podiumObj[Object.keys(podiumObj)[index]].time) {
          playerArr.push({
            player: Object.keys(podiumObj)[index],
            time: time,
            place: timeIndex + 1,
            id: podiumObj[Object.keys(podiumObj)[index]].id || '',
          })
        }
      })
    })

    document
      .getElementById('podium')
      .querySelectorAll('*')
      .forEach((n) => n.remove())

    //render header + first-place-div + second-place-div + third-place-div
    let podiumHeader = document.createElement('div')
    document.getElementById('podium').appendChild(podiumHeader)
    ReactDOM.render(
      <>
        <Typography
          variant="h3"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {translations.hostroom.podium}{' '}
          <AssessmentRoundedIcon
            color="primary"
            style={{ width: '50px', height: '50px' }}
          />
        </Typography>
        <Divider
          light
          style={{ marginTop: '10px', marginBottom: '10px', width: '100%' }}
        />
      </>,
      podiumHeader
    )

    //first-place-div
    let firstPlaceDiv = document.createElement('div')
    firstPlaceDiv.id = 'first-place-div'
    document.getElementById('podium').appendChild(firstPlaceDiv)
    //second-place-div
    let secondPlaceDiv = document.createElement('div')
    secondPlaceDiv.id = 'second-place-div'
    document.getElementById('podium').appendChild(secondPlaceDiv)
    //third-place-div
    let thirdPlaceDiv = document.createElement('div')
    thirdPlaceDiv.id = 'third-place-div'
    document.getElementById('podium').appendChild(thirdPlaceDiv)

    for (var i = 0; i < playerArr.length; i++) {
      let newPlayerTime = document.createElement('div')
      if (playerArr[i].place > 3) {
        document.getElementById('podium').appendChild(newPlayerTime)
      }

      if (playerArr[i].place === 1) {
        ReactDOM.render(
          <>
            <div className="first-place-sub-div">
              <h1
                className="first-place podium-time"
                data-position={playerArr[i].place}
                data-time={playerArr[i].time}
                data-playerid={playerArr[i].id}
                id={playerArr[i].player + '⠀'}
              >
                <img
                  width="40"
                  height="40"
                  src={FirstPlaceIcon}
                  alt="FirstPlaceIcon"
                />
                {playerArr[i].player} {translations.hostroom.time}:{' '}
                {playerArr[i].time} {translations.hostroom.place}:{' '}
                {playerArr[i].place}
              </h1>
            </div>
          </>,
          document.getElementById('first-place-div')
        )
      }
      if (playerArr[i].place === 2) {
        ReactDOM.render(
          <>
            <h1
              className="second-place podium-time"
              data-position={playerArr[i].place}
              data-time={playerArr[i].time}
              data-playerid={playerArr[i].id}
              id={playerArr[i].player + '⠀'}
            >
              <img
                width="40"
                height="40"
                src={SecondPlaceIcon}
                alt="SecondPlaceIcon"
              />
              {playerArr[i].player} {translations.hostroom.time}:{' '}
              {playerArr[i].time} {translations.hostroom.place}:{' '}
              {playerArr[i].place}
            </h1>
          </>,
          document.getElementById('second-place-div')
        )
      }
      if (playerArr[i].place === 3) {
        ReactDOM.render(
          <>
            <h1
              className="third-place podium-time"
              data-position={playerArr[i].place}
              data-time={playerArr[i].time}
              data-playerid={playerArr[i].id}
              id={playerArr[i].player + '⠀'}
            >
              <img
                width="40"
                height="40"
                src={ThirdPlaceIcon}
                alt="ThirdPlaceIcon"
              />
              {playerArr[i].player} {translations.hostroom.time}:{' '}
              {playerArr[i].time} {translations.hostroom.place}:{' '}
              {playerArr[i].place}
            </h1>
          </>,
          document.getElementById('third-place-div')
        )
      }
      if (playerArr[i].place > 3) {
        ReactDOM.render(
          <>
            <h1
              className="other-place podium-time"
              data-position={playerArr[i].place}
              data-time={playerArr[i].time}
              data-playerid={playerArr[i].id}
              id={playerArr[i].player + '⠀'}
            >
              {playerArr[i].player} {translations.hostroom.time}:{' '}
              {playerArr[i].time} {translations.hostroom.place}:{' '}
              {playerArr[i].place}
            </h1>
          </>,
          newPlayerTime
        )
      }
    }

    numArray = []
    playerArr = []
  }

  const kickUser = (user) => {
    socket.emit('kickUser', {
      room: props.room,
      user: user,
    })
  }

  const fetchQuiz = async () => {
    const res = await axios.post(`${config['api-server']}/get-quiz-all-types`, {
      quizID: props.gamecode,
    })
    const quiz = res.data

    setName(quiz?.name)
  }

  const CheckPlanStatus = async () => {
    const res = await axios.post(
      `${config['api-server']}/get-user-customer-id`,
      {
        userId: user?.profileObj?.googleId,
      }
    )

    const { plan, status } = res.data

    if (!plan) {
      plan = 'Starter'
    }

    if (BAD_STATUS_ARR.includes(status)) {
      plan = 'Starter'
    }

    if (plan === 'Enterprise') {
      if (props.maxPlayers > 300) {
        setUserLimit(300)
        userLimit2 = 300
      } else if (props.maxPlayers < 3) {
        setUserLimit(3)
        userLimit2 = 3
      } else {
        setUserLimit(props.maxPlayers)
        userLimit2 = props.maxPlayers
      }
    }

    if (plan === 'Classroom') {
      if (props.maxPlayers > 100) {
        setUserLimit(100)
        userLimit2 = 100
      } else if (props.maxPlayers < 3) {
        setUserLimit(3)
        userLimit2 = 3
      } else {
        setUserLimit(props.maxPlayers)
        userLimit2 = props.maxPlayers
      }
    }

    if (plan === 'Starter') {
      if (props.maxPlayers > 8) {
        setUserLimit(8)
        userLimit2 = 8
      } else if (props.maxPlayers < 3) {
        setUserLimit(3)
        userLimit2 = 3
      } else {
        setUserLimit(props.maxPlayers)
        userLimit2 = props.maxPlayers
      }
    }
  }

  const getLowestTime = () => {
    const times = []
    if (document.getElementsByClassName('time-box').length > 0) {
      for (
        let i = 0;
        i < document.getElementsByClassName('time-box').length;
        i++
      ) {
        const el = document.getElementsByClassName('time-box')[i]
        times.push({ player: el.id, time: el.dataset.time })
      }
      if (times.length > 0) {
        times.sort((a, b) => a.time - b.time)
        setLowestTime({ player: times[0].player, time: times[0].time })
      }
    }
  }

  const StartGame = (room) => {
    socket.emit('startGame', {
      room: room,
      gamecode: props.gamecode,
      gamemode: props.gamemode,
      maxPodium: playerPodiumMax,
    })
    setInterval(() => {
      getLowestTime()
    }, 1000)
    setGameStarted(true)
  }

  const startCountdown = () => {
    if (numberOfUsers <= 0) {
      toast.error(translations.alerts.notenoughplayers)
      return
    }
    setIsCountdown(true)
  }

  const addPoints = async (points, userId) => {
    const res = await axios.post(`${config['api-server']}/add-points`, {
      points: points,
      userId: userId,
      classId: props.classid,
    })
  }

  const createRecentGame = async () => {
    const Podium = []

    const recentGame = {
      mode: props.gamemode,
      quizId: props.gamecode,
      finalists: Podium,
      roomCode: props.room,
      classId: props.classid,
    }

    for (
      let i = 0;
      i < document.getElementsByClassName('podium-time').length;
      i++
    ) {
      Podium.push({
        time: document.getElementsByClassName('podium-time')[i].dataset.time,
        position:
          document.getElementsByClassName('podium-time')[i].dataset.position,
        player: document.getElementsByClassName('podium-time')[i].id,
        playerID:
          document.getElementsByClassName('podium-time')[i].dataset.playerid,
      })
    }

    if (props.classid !== null) {
      await axios.post(`${config['api-server']}/create-recent-game`, recentGame)

      //add points to winners
      Podium.map(async (player) => {
        if (player.position == 1) {
          const userId = player.playerID
          const res = await axios.post(`${config['api-server']}/member`, {
            userId: userId,
            classId: props.classid,
          })
          if (res.data) {
            addPoints(100, userId)
          }
        }
      })
      Podium.map(async (player) => {
        if (player.position == 2) {
          const userId = player.playerID
          const res = await axios.post(`${config['api-server']}/member`, {
            userId: userId,
            classId: props.classid,
          })
          if (res.data) {
            addPoints(50, userId)
          }
        }
      })
      Podium.map(async (player) => {
        if (player.position == 3) {
          const userId = player.playerID
          const res = await axios.post(`${config['api-server']}/member`, {
            userId: userId,
            classId: props.classid,
          })
          if (res.data) {
            addPoints(20, userId)
          }
        }
      })
    }
  }

  const GameOver = async () => {
    const Podium = []

    const res = await axios.post(`${config['api-server']}/user`, {
      userId: user?.profileObj?.googleId,
    })
    const plan = res.data?.plan
    if (plan !== null && plan !== '' && plan !== undefined) {
      if (plan !== 'Starter') {
        if (props.classid != 'null' && props.classid !== null) {
          createRecentGame()
        }
      }
    }
    for (
      var i = 0;
      i < document.getElementsByClassName('podium-time').length;
      i++
    ) {
      Podium.push({
        time: document.getElementsByClassName('podium-time')[i].dataset.time,
        position:
          document.getElementsByClassName('podium-time')[i].dataset.position,
        player: document.getElementsByClassName('podium-time')[i].id,
        playerID:
          document.getElementsByClassName('podium-time')[i].dataset.playerid,
      })
    }

    socket.emit('GameOver', {
      room: props.room,
      podium: Podium,
      googleId: user?.profileObj?.googleId,
    })
    setGameStarted(false)
    mute()
    console.log(Podium)
    setFinalPodium(Podium)
    setIsRoomLeft(true)
    localStorage.removeItem(user?.profileObj?.googleId)
  }
  const shareLink = () => {
    setSharePopupActive(!sharePopupActive)
  }

  const mute = () => {
    setMusicIsPlaying(false)
  }

  const unmute = () => {
    setMusicIsPlaying(true)
  }

  const VolumeSlider = () => (
    <div
      style={{
        backgroundColor: 'white',
        paddingTop: 8,
        paddingBottom: 8,
        paddingInline: 5,
        marginTop: 10,
        width: isSlider ? 150 : 45,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid black',
        boxShadow: '5px 5px 0 #262626',
      }}
    >
      <div
        onClick={() => setIsSlider(true)}
        style={{ marginRight: isSlider ? 12 : 0 }}
      >
        <VolumeUpRounded />
      </div>
      {isSlider ? (
        <ClickAwayListener onClickAway={() => setIsSlider(false)}>
          <Slider
            onChange={(e, value) => setMusicVolume(value)}
            value={musicVolume}
            min={0}
            max={100}
            color="secondary"
          />
        </ClickAwayListener>
      ) : null}
    </div>
  )

  const NavBar = () => (
    <>
      <nav
        style={{
          height: '60px',
          backgroundColor: 'white',
          paddingInline: '10px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div>
            <img src={TextLogo} alt="logo" draggable={false} />
          </div>

          <div>
            <Button
              variant="contained"
              size={bigScreen ? 'large' : 'medium'}
              color="action"
              style={{
                backgroundColor: '#1bb978',
                color: 'white',
                marginRight: '10px',
              }}
              onClick={() => {
                GameOver()
              }}
            >
              {translations.hostroom.finish}
            </Button>
            <Button
              variant="contained"
              size={bigScreen ? 'large' : 'medium'}
              color="secondary"
              onClick={() => {
                GameOver()
              }}
            >
              <ExitToAppRounded />
            </Button>
          </div>
        </div>
      </nav>
      <div style={{ width: '100vw', height: '100px' }} />
    </>
  )

  return (
    <div>
      {gameStarted && <NavBar />}
      <ReactHowler
        src={themeSong}
        playing={musicIsPlaying}
        loop={true}
        volume={musicVolume / 100}
      />
      {isRoomLeft ? (
        <GameEnded podium={finalPodium} maxPodiumPlayers={playerPodiumMax} />
      ) : (
        <div>
          {isCountdown ? (
            <CountDown
              start={StartGame}
              room={props.room}
              muteMusic={mute}
              unmuteMusic={unmute}
            />
          ) : null}
          {sharePopupActive ? (
            <SharePopup
              shareLink={`https://quiz-connect.netlify.app/play?code=${props.room}`}
              close={shareLink}
            />
          ) : null}
          {props.classid != 'null' && (
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              {props.classid !== null && (
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
                  <Typography variant="sub1">
                    {translations.hostroom.private}
                  </Typography>
                </div>
              )}
            </div>
          )}
          {gameStarted ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography
                variant="h2"
                style={{
                  padding: '10px',
                  border: '2px solid black',
                  boxShadow: '5px 5px 0 #262626',
                  backgroundColor: 'white',
                  marginTop: '10px',
                  textAlign: 'center',
                  width: 'fit-content',
                }}
              >
                <b>{name}</b>
              </Typography>
            </div>
          ) : (
            <div
              style={{
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <div
                style={
                  bigScreen
                    ? {
                        backgroundColor: 'white',
                        border: '2px solid #000',
                        boxShadow: '10px 10px 0 #262626',
                        padding: '10px',
                        margin: '10px',
                        paddingInline: '30px',
                        width: '600px',
                        height: '200px',
                      }
                    : {
                        backgroundColor: 'white',
                        border: '2px solid #000',
                        boxShadow: '10px 10px 0 #262626',
                        padding: '10px',
                        margin: '10px',
                        paddingInline: '30px',
                      }
                }
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="h2"
                      style={bigScreen ? { fontSize: '115px' } : {}}
                    >
                      <b>{props.room}</b>
                    </Typography>
                    <Typography
                      variant="sub1"
                      style={bigScreen ? { fontSize: '25px' } : {}}
                    >
                      {translations.hostroom.joinat}
                      <span
                        style={
                          bigScreen
                            ? {
                                fontSize: '25px',
                                color: '#6C63FF',
                                textDecoration: 'underline',
                              }
                            : {
                                color: '#6C63FF',
                                textDecoration: 'underline',
                              }
                        }
                        onClick={() =>
                          window.open('https://quiz-connect.netlify.app/play')
                        }
                      >
                        quiz-connect.netlify.app/play
                      </span>
                    </Typography>
                  </div>
                </div>
              </div>
              {smallScreen ? null : (
                <div
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid #000',
                    boxShadow: '10px 10px 0 #262626',
                    padding: '10px',
                    marginLeft: '10px',
                  }}
                >
                  <QRCode
                    value={`https://quiz-connect.netlify.app/play?code=${props.room}`}
                    size={bigScreen ? 190 : 86}
                  />
                </div>
              )}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '150px',
              }}
            >
              {!gameStarted && (
                <Button
                  style={{ width: '120px' }}
                  variant="contained"
                  color="primary"
                  size={bigScreen ? 'large' : 'medium'}
                  id="playButtonSvg"
                  onClick={() => {
                    shareLink()
                  }}
                >
                  {translations.hostroom.sharebutton}
                </Button>
              )}
              <VolumeSlider />
            </div>
            {gameStarted ? (
              <div
                style={{
                  padding: '5px',
                  border: '2px solid black',
                  boxShadow: '5px 5px 0 #262626',
                  backgroundColor: 'white',
                  marginTop: '10px',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">
                  <b>
                    {finished.length} {translations.hostroom.finished}
                  </b>
                </Typography>
              </div>
            ) : (
              <div style={{ display: 'flex' }}>
                <Button
                  onClick={() => {
                    startCountdown()
                  }}
                  variant="contained"
                  size={bigScreen ? 'large' : 'medium'}
                >
                  {translations.hostroom.startbutton}
                </Button>
                <div style={{ width: '10px', height: '10px' }} />
                <Button
                  variant="contained"
                  color="secondary"
                  size={bigScreen ? 'large' : 'medium'}
                  onClick={() => {
                    GameOver()
                  }}
                >
                  <ExitToAppRounded />
                </Button>
              </div>
            )}
          </div>
          {gameStarted ? null : (
            <h2 id="maxPlayersText">
              {numberOfUsers}/{userLimit}
            </h2>
          )}
          {gameStarted ? null : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '50px',
              }}
            >
              <svg
                width={bigScreen ? 550 : 340}
                height={bigScreen ? 300 : 90}
                viewBox="0 0 220 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 5C0 2.23858 2.23858 0 5 0H215C217.761 0 220 2.23858 220 5V51C220 53.7614 217.761 56 215 56H5C2.23857 56 0 53.7614 0 51V5Z"
                  fill="#6C63FF"
                />
                <path
                  d="M39.3735 41.4435C28.0519 50.7482 13.134 47.7943 13.0008 30.4156C12.8676 15.4985 28.5181 9.59078 37.8418 16.3355L35.0447 20.8155C31.3818 18.0586 21.259 20.5201 20.4598 30.2679C19.7272 38.8834 28.2517 44.1512 34.5119 36.8157L39.3735 41.4435ZM53.9584 43.3142C36.1768 43.8558 38.7075 11.1169 55.8897 11.1169C73.2051 11.1169 72.2062 42.7727 53.9584 43.3142ZM55.6899 36.4219C59.9522 36.5203 61.3507 28.6925 61.5505 25.0986C61.7503 21.5048 60.2186 16.4832 56.1561 16.5816C52.0937 16.6801 49.896 24.3602 50.0291 27.3141C50.2289 31.1049 51.3611 36.3234 55.6899 36.4219ZM80.6641 39.4742L71.2738 39.1788L73.5381 9.83693L79.1989 9.68924L89.3218 25.2956L92.1855 9L98.1792 10.3785L95.1824 36.668L89.1886 37.2588L79.1989 21.2586L80.6641 39.4742ZM111.232 39.4742L101.842 39.1788L104.106 9.83693L109.767 9.68924L119.89 25.2956L122.754 9L128.748 10.3785L125.751 36.668L119.757 37.2588L109.767 21.2586L111.232 39.4742ZM151.524 43.4127L133.343 43.1666L132.41 13.5785L150.192 11.8554L149.992 17.4186H139.803V26.8217L148.327 26.2802L148.793 31.8926L140.136 31.7941L139.67 38.9327L152.19 38.588L151.524 43.4127ZM160.518 25.2956C160.651 42.6742 149.197 34.6003 160.518 25.2956C151.195 18.5509 160.385 10.3785 160.518 25.2956C171.445 24 156.855 22.5386 160.518 25.2956C154.258 32.631 171.081 26.6667 160.518 25.2956ZM207 11.0185L206.4 16.8278L199.541 17.0247L200.007 41.5419L189.951 42.7727L191.816 17.2216L184.556 17.4186L184.756 12.0031L207 11.0185Z"
                  fill="white"
                />
                <rect x="155" y="13" width="24" height="33" fill="#6C63FF" />
                <path
                  d="M163.43 14.5799C167.597 12.3952 172.751 12.4789 176.847 14.8146C177.699 15.3007 178.501 15.8859 179.233 16.5568C179.996 17.1765 180.597 17.9849 181.16 18.8042C181.554 19.3856 181.903 20.0009 182.184 20.6526C182.538 21.5288 182.848 22.435 182.977 23.3829C183.2 24.6064 183.179 25.8721 182.981 27.0981C182.654 29.2183 181.672 31.1888 180.33 32.7813C179.502 33.7694 178.519 34.6034 177.46 35.2967C174.733 37.1175 171.227 37.5972 168.172 36.4856C167.283 36.1646 166.45 35.6855 165.687 35.1074C165.427 34.9065 165.186 34.6769 164.979 34.4154C165.353 34.5855 165.678 34.8483 166.021 35.0747C168.865 36.9333 172.82 36.6705 175.377 34.368C176.142 33.669 176.77 32.8069 177.243 31.8622C177.495 31.3621 177.687 30.8325 177.887 30.3081C178.235 29.0705 178.409 27.7773 178.41 26.486C178.371 25.3604 178.204 24.238 177.907 23.1565C177.279 20.9954 176.099 18.9993 174.458 17.5468C172.81 16.0567 170.755 15.1255 168.633 14.7315C167.618 14.5396 166.588 14.4533 165.558 14.443C164.846 14.445 164.141 14.5786 163.43 14.5799Z"
                  fill="white"
                />
                <path
                  d="M161.931 16.1713C164.982 14.6734 168.642 14.8212 171.654 16.3568C173.384 17.2342 174.908 18.5882 175.978 20.2837C176.668 21.3741 177.177 22.5919 177.478 23.8659C177.747 24.957 177.825 26.0871 177.862 27.2102C177.725 26.2137 177.514 25.2224 177.137 24.295C176.314 22.1934 174.695 20.4736 172.744 19.5456C170.341 18.3803 167.419 18.4827 165.116 19.8699C163.442 20.8689 162.117 22.448 161.214 24.2349C160.407 25.7948 159.931 27.5306 159.703 29.2887C159.585 30.2654 159.582 31.2554 159.644 32.2365C159.829 34.4673 160.558 36.6859 161.903 38.4307C163.048 39.9305 164.626 41.0401 166.355 41.6247C166.565 41.6976 166.777 41.775 166.965 41.9029C166.384 41.869 165.817 41.6905 165.258 41.5268C162.996 40.8079 160.944 39.4015 159.346 37.5609C157.948 35.9632 156.921 34.0132 156.333 31.9257C155.793 30.2411 155.757 28.44 155.793 26.678C155.863 26.428 155.823 26.1626 155.878 25.9093C156.045 24.5182 156.321 23.1291 156.849 21.8378C157.045 21.3588 157.235 20.8734 157.492 20.4257C158.547 18.5971 160.083 17.0577 161.931 16.1713Z"
                  fill="white"
                />
                <path
                  d="M160.774 26.9002C161.385 25.0934 162.355 23.4209 163.616 22.0439C162.777 23.6173 162.196 25.3697 162.089 27.1835C161.996 28.8022 162.255 30.4523 162.91 31.9227C163.651 33.6175 164.87 35.0763 166.389 36.0248C167.27 36.5806 168.229 37.0098 169.232 37.2394C170.061 37.4312 170.909 37.5188 171.757 37.5182C173.791 37.4472 175.817 36.8518 177.555 35.7159C180.106 34.0857 182.113 31.4296 182.857 28.3469C183.075 27.4892 183.143 26.6015 183.217 25.7202C183.637 27.2078 183.692 28.7913 183.498 30.3244C183.235 32.5283 182.411 34.6402 181.184 36.4335C179.946 38.2492 178.307 39.756 176.432 40.7864C174.163 42.0399 171.532 42.5452 168.995 42.1889C168.437 42.1269 167.879 42.0252 167.345 41.8417C165.679 41.3844 164.159 40.3943 162.955 39.0966C161.56 37.5822 160.653 35.5995 160.272 33.528C159.866 31.3247 160.06 29.0094 160.774 26.9002Z"
                  fill="white"
                />
                <rect
                  width="7.35207"
                  height="4.15191"
                  transform="matrix(0.967671 -0.252218 0.217823 0.975988 175.647 23.7998)"
                  fill="#6C63FF"
                />
                <rect
                  width="7.53597"
                  height="6.42124"
                  transform="matrix(0.999777 -0.0210936 0.0180629 0.999837 176.07 25.4424)"
                  fill="#6C63FF"
                />
                <rect
                  width="8.52517"
                  height="3.53354"
                  transform="matrix(0.967667 0.25223 -0.217834 0.975986 175.205 28.9463)"
                  fill="#6C63FF"
                />
                <rect x="41" y="9" width="28" height="38" fill="#6C63FF" />
                <path
                  d="M47.4707 14.6036C51.9637 12.3851 57.5191 12.4697 61.9348 14.8414C62.8544 15.3344 63.7172 15.9295 64.5071 16.6107C65.3305 17.2409 65.979 18.0606 66.5838 18.8935C67.0093 19.4843 67.3853 20.1085 67.687 20.7708C68.0688 21.6605 68.4025 22.5809 68.5424 23.5436C68.7829 24.7864 68.761 26.0715 68.5468 27.3171C68.1956 29.4701 67.1361 31.4714 65.689 33.089C64.7956 34.0925 63.7376 34.94 62.595 35.6431C59.6541 37.4926 55.8752 37.9798 52.5816 36.8508C51.6241 36.5241 50.725 36.0384 49.903 35.4505C49.6232 35.2463 49.3638 35.0129 49.1408 34.7475C49.5445 34.9196 49.8943 35.1865 50.2644 35.417C53.3307 37.3044 57.5934 37.0375 60.3507 34.6993C61.1756 33.989 61.8518 33.1138 62.3618 32.154C62.6329 31.6464 62.8398 31.1081 63.0555 30.5757C63.4301 29.3184 63.6181 28.0056 63.6195 26.6943C63.5773 25.5507 63.398 24.4115 63.0774 23.3132C62.4012 21.1179 61.1289 19.0919 59.3583 17.6157C57.5818 16.1017 55.3666 15.1565 53.0786 14.7568C51.9856 14.5613 50.8736 14.4738 49.7631 14.4636C48.9965 14.4665 48.2373 14.6022 47.4707 14.6036Z"
                  fill="white"
                />
                <path
                  d="M45.8543 16.2209C49.1421 14.6995 53.0886 14.8498 56.3356 16.4091C58.201 17.3003 59.8434 18.6758 60.9976 20.397C61.7409 21.5041 62.2903 22.741 62.6138 24.0348C62.9038 25.1434 62.9869 26.2913 63.0277 27.432C62.8805 26.4197 62.6532 25.4132 62.2466 24.471C61.359 22.337 59.6146 20.5895 57.5102 19.6472C54.919 18.4643 51.7697 18.5678 49.2878 19.9769C47.4837 20.9921 46.0555 22.5951 45.082 24.4097C44.2119 25.9938 43.6989 27.7573 43.4526 29.5426C43.3244 30.5345 43.3215 31.5395 43.3885 32.5358C43.5867 34.801 44.3737 37.0546 45.8237 38.8269C47.0581 40.3497 48.7588 41.4772 50.6228 42.0709C50.8501 42.1453 51.0789 42.2241 51.2815 42.3539C50.6548 42.3189 50.0442 42.138 49.4409 41.9717C47.0027 41.2409 44.7905 39.8129 43.0679 37.9444C41.561 36.3224 40.4534 34.3416 39.8195 32.2207C39.2365 30.5097 39.1972 28.6806 39.2365 26.8908C39.3123 26.637 39.2701 26.3672 39.3284 26.1105C39.5076 24.697 39.8049 23.2865 40.3747 21.9752C40.5861 21.488 40.7915 20.995 41.0684 20.5414C42.2066 18.6845 43.8622 17.1223 45.8543 16.2209Z"
                  fill="white"
                />
                <path
                  d="M44.6079 27.1162C45.2667 25.2813 46.3116 23.5834 47.6713 22.1846C46.7677 23.7818 46.1411 25.5628 46.0259 27.4036C45.9254 29.0475 46.2037 30.7234 46.9105 32.2171C47.7092 33.9383 49.0237 35.4203 50.6603 36.383C51.6105 36.9475 52.6437 37.3836 53.7251 37.617C54.6184 37.8124 55.5336 37.9014 56.4474 37.9C58.6392 37.8285 60.8238 37.2231 62.6979 36.0694C65.448 34.4138 67.6106 31.7168 68.4136 28.5851C68.6497 27.7143 68.7226 26.8128 68.8028 25.9172C69.256 27.4284 69.3143 29.0358 69.1059 30.5936C68.8217 32.8326 67.9342 34.9768 66.6109 36.7987C65.276 38.6424 63.5097 40.1725 61.4883 41.2198C59.0429 42.4932 56.2069 43.0067 53.4715 42.6449C52.8696 42.5822 52.2677 42.4786 51.6921 42.2919C49.8952 41.8281 48.2571 40.8216 46.9601 39.5045C45.4561 37.9671 44.4782 35.9527 44.0673 33.8493C43.6286 31.6103 43.837 29.259 44.6079 27.1162Z"
                  fill="white"
                />
              </svg>
            </div>
          )}
          {gameStarted ? null : (
            <div style={{ color: 'white' }} id="userDiv"></div>
          )}
          {gameStarted && (
            <div id="game-container">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '50px',
                }}
              >
                <div
                  className="lowest__time__container"
                  style={{ backgroundColor: '#fcc73e' }}
                >
                  <Typography style={{ color: 'white' }} variant="h3">
                    👑
                  </Typography>
                  <div className="lowest-time-box">
                    <Typography variant="h3">
                      {lowestTimeState.player}{' '}
                      <span
                        className="best__time__text"
                        style={{ color: '#6976EA' }}
                      >
                        {lowestTimeState.time}s
                      </span>
                    </Typography>
                  </div>
                </div>
              </div>
              <div hidden id="podium__container" className="podium__container">
                <div hidden id="podium">
                  <Typography
                    variant="h3"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {translations.hostroom.podium}{' '}
                    <AssessmentRoundedIcon
                      color="primary"
                      style={{ width: '50px', height: '50px' }}
                    />
                  </Typography>
                  <Divider
                    light
                    style={{
                      marginTop: '10px',
                      marginBottom: '10px',
                      width: '100%',
                    }}
                  />
                  <div id="first-place-div"></div>
                  <div id="second-place-div"></div>
                  <div id="third-place-div"></div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div id="time__div"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
