import { io } from "socket.io-client";
import config from "./config.json";
//https://connect-quiz-now.herokuapp.com/
//http://localhost:3001
//good one https://connect-now-backend.herokuapp.com/
//https://connect-backend-2.herokuapp.com/
//the one https://connect-socket-io.herokuapp.com/
//the one one https://quiz-connect-socketio.herokuapp.com/

const socket = io(config["socket-server"], {
  transports: ["websocket", "polling", "flashsocket"],
});

export default socket;
