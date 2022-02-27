import React, { useState, useEffect } from "react";
import socket from "../../../socket-io";
import ReactDOM from "react-dom";
import { Typography, Button, Divider, ClickAwayListener } from "@mui/material";

import GameEnded from "../host/GameEnded";

import "../../../style/style.css";

import Translations from "../../../translations/translations.json";
import { EmojiEmotionsOutlined } from "@mui/icons-material";

//globals

//const socket = io('http://localhost:3001')

export default function WaitingRoom(props) {
  var [gameStatus, setGameStatus] = useState(false);
  const [peopleInRoom, setPeopleInRoom] = useState([]);
  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    socket.emit("joinPlayerRoom", {
      room: props.room,
      name: props.user,
    });
    setPeopleInRoom(props.usersInRoom);

    socket.on("addeduser", (data) => {
      //console.log(data)
      /*var RoomUsers = []
        
            for(var i = 0; i < data.names.length; i++){
                if(data.UserRooms[i] == undefined) return
                if(data.currentRoom == data.UserRooms[i]){
                    RoomUsers.push(data.names[i])
                }
            }*/
      //document.getElementById('userList').innerHTML = data.UsersInRoom
      setPeopleInRoom(data.UsersInRoom);
      console.log(data.UsersInRoom);
      //document.getElementById('userLength').innerHTML = data.UsersInRoom.length
    });

    socket.on("gameStarted", (data) => {
      if (gameStatus == false) {
        window.location = `/${data.gamemode}/${props.room}/${data.gamecode}/${props.user}`; //multi //normal
      }
      setGameStatus((gameStatus = true));
    });
    socket.on("joinedWaitingRoom", (data) => {
      //console.log(data)
    });
    socket.on("playerLeftRoom", (data) => {
      //document.getElementById('userList').innerHTML = data.UsersInRoom
      //document.getElementById('userLength').innerHTML = data.UsersInRoom.length
      console.log(data.UsersInRoom);
      setPeopleInRoom(data.UsersInRoom);
    });

    socket.on("kicked", (data) => {
      if (props.user == data.user) {
        socket.emit("leaveRoom", {
          room: props.room,
          user: props.user,
        });
        window.location = "/roomleave/kicked";
        sessionStorage.setItem("roomJoined", "false");
      }
    });

    socket.on("EndedGame", (data) => {
      socket.emit("leaveRoom", {
        room: props.room,
        user: props.user,
      });
      window.location = "/roomleave/ended";
      sessionStorage.setItem("roomJoined", "false");
    });

    socket.on("GameIsOver", (data) => {
      socket.emit("leaveRoom", {
        room: props.room,
        user: props.user,
      });
      ReactDOM.render(
        <GameEnded podium={data} />,
        document.getElementById("root")
      );
      sessionStorage.setItem("roomJoined", "false");
    });

    socket.on("emote", (data) => {
      console.log(data);
      let emote = document.createElement("div");
      emote.innerHTML = data.emote;
      emote.className = "emote__icons";
      document.body.appendChild(emote);
      emote.style.position = "absolute";
      emote.style.top = "0";
      emote.style.left = Math.random() * 100 + "%";
      emote.style.top = Math.random() * 100 + "%";
      emote.style.fontSize = "2em";

      setTimeout(() => {
        emote.remove();
      }, 5000);
    });

    return () => {
      sessionStorage.setItem("roomJoined", "false");
    };
  }, []);

  const leaveRoom = () => {
    socket.emit("leaveRoom", {
      room: props.room,
      user: props.user,
    });
    window.location = "/roomleave/left";
    sessionStorage.setItem("roomJoined", "false");
  };
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div id="waitingRoomDiv">
        <h1 style={{ textAlign: "center" }}>
          {Translations[userLanguage].waitingroom.title}
        </h1>
        {/* <textarea id='userList' defaultValue={props.usersInRoom} readOnly></textarea> */}
        <div className="waiting__room__player__container">
          {peopleInRoom.map((person, index) => {
            return (
              <Typography
                className="waitingRoomPerson"
                variant="h2"
                key={index}
                style={{ padding: "10px", margin: "10px", fontSize: "1.5rem" }}
              >
                {person}
              </Typography>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "flex-end",
            position: "sticky",
            bottom: "0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
              flexDirection: "column",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            {isOpen ? (
              <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                <div
                  style={{
                    backgroundColor: "e0e0e0",
                    border: "1px solid lightgray",
                    borderRadius: "5px",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <Typography variant="h6">Select Emote</Typography>
                  <Divider />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      className="emote__card"
                      onClick={() => {
                        socket.emit("sendEmote", {
                          room: props.room,
                          user: props.user,
                          emote: "😀",
                        });
                      }}
                    >
                      😀
                    </div>
                    <div
                      className="emote__card"
                      onClick={() => {
                        socket.emit("sendEmote", {
                          room: props.room,
                          user: props.user,
                          emote: "😐",
                        });
                      }}
                    >
                      😐
                    </div>
                    <div
                      className="emote__card"
                      onClick={() => {
                        socket.emit("sendEmote", {
                          room: props.room,
                          user: props.user,
                          emote: "🥱",
                        });
                      }}
                    >
                      🥱
                    </div>
                    <div
                      className="emote__card"
                      onClick={() => {
                        socket.emit("sendEmote", {
                          room: props.room,
                          user: props.user,
                          emote: "😡",
                        });
                      }}
                    >
                      😡
                    </div>
                  </div>
                </div>
              </ClickAwayListener>
            ) : null}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => {
                  leaveRoom();
                }}
              >
                {Translations[userLanguage].waitingroom.leavebutton}
              </Button>
              <Button
                endIcon={<EmojiEmotionsOutlined />}
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                color={isOpen ? "secondary" : "inherit"}
              >
                emote
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* <div style={{display:'flex', placeItems:'center', color:'white', flexDirection:'column'}}>
            <h1 id='userLength'>{props.usersInRoom.length}</h1>
            <h1>Players</h1>
        </div> */}
      <div>
        <nav style={{ height: "50px", backgroundColor: "white" }}>
          <div
            style={{
              float: "left",
              color: "black",
              marginLeft: "10px",
              marginTop: "-10px",
            }}
          >
            <h2>{props.user}</h2>
          </div>
        </nav>
      </div>
    </div>
  );
}
