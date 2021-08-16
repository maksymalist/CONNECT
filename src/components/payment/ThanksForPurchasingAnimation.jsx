import React from 'react'
import '../../style/checkAnimation.css';
import Button from '@material-ui/core/Button'

export default function ThanksForPurchasingAnimation() {
    return (
        <div style={{display:'flex', justifyContent:'center', marginTop:'0x'}}>
        <div id='popUpCard'>
            <svg width="100px" height='100px' version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle className="path circle" fill="none" stroke="#73AF55" strokeWidth="6" strokeLiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
            <polyline className="path check" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
            </svg>
            <p className="success">Purchase Successful!</p>
            <Button href='/' style={{marginTop:'1vh', marginBottom:'1vh'}} variant="contained" color="primary" size='small'>Continue</Button>
        </div>
        </div>
    )
}
