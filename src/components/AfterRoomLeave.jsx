import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'

import Translations from '../translations/translations.json'


export default function AfterRoomLeave(props) {
    const h1Style = {marginTop:'15vh', color: '#fff'}

    return (
        <div>
            <h1 style={h1Style}>{Translations[localStorage.getItem('connectLanguage')].leftroom.title}</h1>
            <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{window.location = '/play'}}>{Translations[localStorage.getItem('connectLanguage')].leftroom.button}</Button>
        </div>
    )
}
