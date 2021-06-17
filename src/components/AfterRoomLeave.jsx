import React from 'react'
import Button from '@material-ui/core/Button'

export default function AfterRoomLeave() {
    const h1Style = {marginTop:'15vh'}
    return (
        <div>
            <h1 style={h1Style}>You Have Left the Room</h1>
            <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{window.location = '/'}}>Return Home</Button>
        </div>
    )
}
