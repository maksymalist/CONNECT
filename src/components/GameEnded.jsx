import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Button, Backdrop } from '@material-ui/core'

export default function GameEnded(props) {
    useEffect(() => {
        console.log(props.podium)
        return () => {
            //cleanup
        }
    }, [])
    return (
        <div id='main' style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
            <h1>Game Has Ended</h1>
            <div id='podiumContainer' style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
            <h1>Podium</h1>
            <div>
                {props.podium.map((data, index) =>(
                    <h1 key={index}>{data.player} time: {data.time} place: {data.position}</h1>
                ))
                }
            </div>
                <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{window.location = '/play'}}>Return Home</Button>
            </div>
        </div>
    )
}
