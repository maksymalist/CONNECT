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

const stripePromise = loadStripe('pk_live_51JMw6pBqTzgw1Au7Y06gQdURUJrgclwkr0hpdfIvGoKd9sLugfqbnBe6lC5d6bF6fdnlbxgutmmH0933EqR3cii000BXjkHPZD');





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
