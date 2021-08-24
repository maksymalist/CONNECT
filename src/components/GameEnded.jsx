import React, { useEffect } from 'react'
import PodiumAnimation from './PodiumAnimation'
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
            <h1 style={{color:"white"}}>Game Has Ended</h1>
            <PodiumAnimation maxPodiumPlayers={props.maxPodiumPlayers} podium={props.podium}/>
        </div>
    )
}
