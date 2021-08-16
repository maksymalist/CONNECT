import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'


export default function AfterRoomLeave(props) {
    const h1Style = {marginTop:'15vh', color: '#fff'}

    return (
        <div>
            <h1 style={h1Style}>You Have Left the Room</h1>
            <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{window.location = '/play'}}>Return Home</Button>
        </div>
    )
}
