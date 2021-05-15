import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

export default function GameEnded(props) {
    useEffect(() => {
        console.log(props.podium)
        return () => {
            //cleanup
        }
    }, [])
    return (
        <div id={'main'}>
            <h1>Game Has Ended</h1>
            <div id='podiumContainer'>
            <h1>Podium</h1>
            <h1>{props.podium.map((player, index) =>(
                <h1>{`#${index += 1} player:${player}`}</h1>
            ))
            }</h1>
            </div>
        </div>
    )
}
