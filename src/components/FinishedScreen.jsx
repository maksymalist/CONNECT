import React,{ useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { socket } from './EnterCodeForm'
import ReactDOM from 'react-dom'

import firebase from "firebase"
import "firebase/database";

//material ui
import { CircularProgress } from '@material-ui/core'

import '../style/style.css'


export default function FinishedScreen({ match, user }) {
    return (
        <div style={{height:'100vh', width:'100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
            <h1 style={{color:'white'}}>You're done!</h1>
            <h2 style={{color:'white', textAlign:'center'}}>Wait For More People To Finish</h2>
            <CircularProgress size={150} thickness={3} style={{color:'white', margin:'100px'}}/>
            <div>
                <nav style={{height:'50px'}}>
                    <div style={{float:'left', color:'white', marginLeft:'10px', marginTop:'-10px'}}>
                        <h2>{user}</h2>
                    </div>
                </nav>
            </div>
        </div>
    )
}
