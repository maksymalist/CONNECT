import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import GoogleLogin from 'react-google-login'


import '../style/style.css'

import HomePage from './HomePage';
// Stripe
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
// Styles

//firebase
import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";

const stripePromise = loadStripe('pk_test_51Isp9eLjpdOyivM3wMonqnjVW7RqSkp9mBmcfCoUMK3Ruq9rbPBZsrc7PTG5DOKywHRjEBLKUJ1PyP64MbNNhbah00LVvg7hRr');





export default function StripeSubscriptions() {
    useEffect(() => {
        firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}`).on('value',(snap)=>{
            if(snap.exists()){
              var data = snap.val()
                if(data.plan == 'Classroom'){
                }
            }
            else{
            }
          });
        return () => {
            //cleanup
        }
    }, [])

    return (
        <div id='paymentIntent' className='center-div'>
            <div>
            <Elements stripe={stripePromise}>
                <HomePage />
            </Elements>
            </div>

        </div>
    )
}
