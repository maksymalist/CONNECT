import React from 'react'

export default function AfterRoomLeave() {
    const h1Style = {marginTop:'5vh'}
    return (
        <div>
            <h1 style={h1Style}>You Have Left the Room</h1>
            <button onClick={()=>{window.location = '/'}}>Return Home</button>
        </div>
    )
}
