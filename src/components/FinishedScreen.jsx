import React,{ useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { socket } from './EnterCodeForm'
import ReactDOM from 'react-dom'

import firebase from "firebase"
import "firebase/database";

import '../style/style.css'

export default function FinishedScreen({match}) {
    return (
        <div id="FinishedScreenContainer">
            <h1>You Are in The Top 5</h1>
            <h2>Wait For More People To Finish</h2>
        </div>
    )
}
