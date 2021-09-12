import React, { useEffect, useState } from 'react'
import PodiumAnimation from './PodiumAnimation'
import { Button, Backdrop } from '@material-ui/core'
import Translations from '../translations/translations.json'

export default function GameEnded(props) {
    const [userLanguage, setUserLanguage] = useState(localStorage.getItem('connectLanguage') || 'english')
    useEffect(() => {
        console.log(props.podium)
        return () => {
            //cleanup
        }
    }, [])
    return (
        <div id='main' style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
            <h1 style={{color:"white"}}>{Translations[userLanguage].gameended.title}</h1>
            <PodiumAnimation maxPodiumPlayers={props.maxPodiumPlayers} podium={props.podium}/>
        </div>
    )
}
