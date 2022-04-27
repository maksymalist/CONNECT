import React from "react";
import { motion } from "framer-motion/dist/framer-motion";
import Confetti from "react-confetti";
import "../../../style/podiumAnimation.css";

function PodiumAnimation({ podium, maxPodiumPlayers }) {
  // const podium = [
  //   {
  //     player: "John Doe 💳🔗🔒",
  //     position: "1",
  //     time: "10s",
  //   },
  //   {
  //     player: "Smith 💰🎉✅",
  //     position: "2",
  //     time: "11s",
  //   },
  //   {
  //     player: "Mike 😡🥇🌀",
  //     position: "3",
  //     time: "13s",
  //   },
  //   {
  //     player: "Price 🚀✨🌈",
  //     position: "4",
  //     time: "15s",
  //   },
  //   {
  //     player: "Joyce ➡️👩‍🏫💰",
  //     position: "5",
  //     time: "16s",
  //   },
  //   {
  //     player: "Claire 🐳🙈",
  //     position: "6",
  //     time: "17s",
  //   },
  //   {
  //     player: "Derek 🐶🍏🍎",
  //     position: "7",
  //     time: "18s",
  //   },
  //   {
  //     player: "James Bond 💣💣💣",
  //     position: "8",
  //     time: "177s",
  //   },
  //   {
  //     player: "Tony Stark 💰🏁",
  //     position: "9",
  //     time: "178s",
  //   },
  //   {
  //     player: "Ethan Hunt 📈🤪",
  //     position: "10",
  //     time: "179s",
  //   },
  //   {
  //     player: "John Wick ✏️😵",
  //     position: "11",
  //     time: "180s",
  //   },
  //   {
  //     player: "Jason Bourne 🔪🔪",
  //     position: "12",
  //     time: "182s",
  //   },
  // ];

  // const maxPodiumPlayers = 10;

  const FirstPlace = ({ name }) => {
    return (
      <motion.div
        initial={{ height: 60 }}
        animate={{ height: 450 }}
        exit={{ height: 60 }}
        transition={{ duration: 2, delay: 5, type: "spring", stiffness: 50 }}
        onAnimationComplete={() => {
          document.getElementById("podium__confetti").style.visibility =
            "visible";
        }}
      >
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0, delay: 5 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{
                rotate: [0, 12, -12, 12, -12, 12, -12, 12, -12, 12, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 4, delay: 6 }}
            >
              <h1
                style={{
                  color: "white",
                  width: "200px",
                  textAlign: "center",
                  zIndex: "10",
                }}
              >
                {name}
              </h1>
            </motion.div>
          </motion.div>
          <div
            style={{
              backgroundColor: "#FCC73E",
              padding: "5px",
              width: "200px",
              marginLeft: "10px",
              borderRadius: "5px",
              height: "450px",
            }}
          >
            <h1
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              1st 🥇
            </h1>
          </div>
        </div>
      </motion.div>
    );
  };

  const SecondPlace = ({ name }) => {
    return (
      <motion.div
        initial={{ height: 60 }}
        animate={{ height: 350 }}
        exit={{ height: 60 }}
        transition={{ duration: 2, delay: 2, type: "spring" }}
      >
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0, delay: 3 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{
                rotate: [0, 12, -12, 12, -12, 12, -12, 12, -12, 12, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 4, delay: 6 }}
            >
              <h1
                style={{
                  color: "white",
                  width: "200px",
                  textAlign: "center",
                  zIndex: "10",
                }}
              >
                {name}
              </h1>
            </motion.div>
          </motion.div>
          <div
            style={{
              backgroundColor: "#2D93F0",
              padding: "5px",
              width: "200px",
              marginLeft: "10px",
              borderRadius: "5px",
              height: "350px",
            }}
          >
            <h1
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              2nd 🥈
            </h1>
          </div>
        </div>
      </motion.div>
    );
  };

  const ThirdPlace = ({ name }) => {
    return (
      <motion.div
        initial={{ height: 60 }}
        animate={{ height: 300 }}
        exit={{ height: 60 }}
        transition={{ duration: 2 }}
      >
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0, delay: 2 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{
                rotate: [0, 12, -12, 12, -12, 12, -12, 12, -12, 12, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 4, delay: 6 }}
            >
              <h1
                style={{
                  color: "white",
                  width: "200px",
                  textAlign: "center",
                  zIndex: "10",
                }}
              >
                {name}
              </h1>
            </motion.div>
          </motion.div>
          <div
            style={{
              backgroundColor: "#CE3EE5",
              padding: "5px",
              width: "200px",
              marginLeft: "10px",
              borderRadius: "5px",
              height: "300px",
            }}
          >
            <h1
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              3rd 🥉
            </h1>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ visibility: "hidden" }}
        id="podium__confetti"
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            width: "100%",
            justifyContent: "center",
            height: "650px",
            overflow: "hidden",
          }}
        >
          {podium.map((podiumPlayer, index) => {
            if (podiumPlayer?.position === "2") {
              return (
                <SecondPlace
                  key={index}
                  name={podiumPlayer?.player.replace("⠀", "")}
                />
              );
            }
          })}
          {podium.map((podiumPlayer, index) => {
            if (podiumPlayer?.position === "1") {
              return (
                <FirstPlace
                  key={index}
                  name={podiumPlayer?.player.replace("⠀", "")}
                />
              );
            }
          })}
          {podium.map((podiumPlayer, index) => {
            if (podiumPlayer?.position === "3") {
              return (
                <ThirdPlace
                  key={index}
                  name={podiumPlayer?.player.replace("⠀", "")}
                />
              );
            }
          })}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, delay: 5.5, type: "easeInOut" }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {podium.map((place, index) => {
              if (
                place.position > 3 &&
                parseInt(maxPodiumPlayers) >= place?.position
              ) {
                return (
                  <div key={index} className="other-place">
                    {place?.position}th place {place?.player.replace("⠀", "")}
                  </div>
                );
              }
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default PodiumAnimation;
