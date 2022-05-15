import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Button, Divider, ClickAwayListener } from "@mui/material";

import { motion } from "framer-motion/dist/framer-motion";

import "../../style/style.css";

import Translations from "../../translations/translations.json";
import { EmojiEmotionsOutlined } from "@mui/icons-material";

import { toast } from "react-toastify";
import Emotes from "../../emotes/emotes.json";

const WaitingRoom = ({ nextStep, user }) => {
  const peopleInRoom = [
    "John 💳🔗🔒",
    "Stewart 💰🎉✅",
    "Mike 😡🥇🌀",
    "Paul 🚀✨🌈",
    "Joyce ➡️👩‍🏫💰",
    "Lucy 🐳🙈",
    user,
  ];
  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );
  const [isOpen, setIsOpen] = useState(false);
  let emoteCooldown = false;

  const [emotes, setEmotes] = useState([
    {
      emoteId: "1",
    },
    {
      emoteId: "2",
    },
    {
      emoteId: "3",
    },
    {
      emoteId: "4",
    },
  ]);

  const sendEmote = (emoteSrc) => {
    if (emoteCooldown) {
      toast.info("✨ emotes have a 3s cooldown ✨"); //Translations[userLanguage].emoteCooldown
      return;
    } else {
      emoteCooldown = true;
      setTimeout(() => {
        emoteCooldown = false;
      }, 3000);
      let emote = document.createElement("img");
      const size = Math.floor(Math.random() * (100 - 50 + 1)) + 40;
      emote.src = emoteSrc;
      emote.className = "emote__icons";
      document.body.appendChild(emote);
      emote.style.position = "fixed";
      emote.style.top = "0";
      emote.style.left = Math.random() * 100 + "%";
      emote.style.top = Math.random() * 100 + "%";
      emote.style.width = `${size}px`;
      emote.style.height = `${size}px`;

      setTimeout(() => {
        emote.remove();
      }, 5000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "800px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          height: "60px",
          width: "100%",
          borderBottom: "2px solid black",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "black",
            marginLeft: "5px",
          }}
        >
          <h2>{user}</h2>
        </div>
        <div
          style={{
            marginRight: "5px",
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => nextStep()}
          >
            {Translations[userLanguage].tutorial.waitingroom.button}
          </Button>
        </div>
      </div>
      <h1
        style={{
          textAlign: "center",
          fontSize: "45px",
          marginTop: "40px",
          color: "white",
        }}
      >
        {Translations[userLanguage].waitingroom.title}
      </h1>
      <div id="waitingRoomDiv">
        <div className="waiting__room__player__container">
          {peopleInRoom?.map((person, index) => {
            return (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.08, 1] }}
                exit={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 50 }}
              >
                <Typography
                  className="waitingRoomPerson"
                  variant="h2"
                  key={index}
                  style={{
                    padding: "10px",
                    margin: "10px",
                    fontSize: "1.5rem",
                  }}
                >
                  {person}
                </Typography>
              </motion.div>
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
            marginBottom: "20px",
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
              width: "fit-content",
              padding: "10px",
              border: "2px solid black",
              boxShadow: "10px 10px 0 #262626",
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
                      justifyContent: "center",
                      flexWrap: "wrap",
                      maxWidth: "350px",
                    }}
                  >
                    {emotes.map((emote, index) => {
                      return (
                        <div
                          className="emote__card"
                          onClick={() => {
                            sendEmote(Emotes[emote.emoteId].icon);
                          }}
                        >
                          <img
                            style={{ width: "30px", height: "30px" }}
                            src={Emotes[emote.emoteId].icon}
                            alt="emote"
                          />
                        </div>
                      );
                    })}
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
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => {
                  toast.info("You are not leaving this room 😡");
                }}
              >
                {Translations[userLanguage].waitingroom.leavebutton}
              </Button>
              <Button
                endIcon={<EmojiEmotionsOutlined />}
                style={{ marginLeft: "40px" }}
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
    </div>
  );
};

export default WaitingRoom;
