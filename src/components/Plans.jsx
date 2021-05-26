import React, {useEffect, useState} from 'react'
import TeacherImg from '../img/teacher_sub.svg'
import StarterImg from '../img/starter_sub.svg'
import EntrepriseImg from '../img/entreprise_sub.svg'

//firebase
import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";
import { toast } from 'react-toastify'
import axios from 'axios'

export default function Plans() {
    var [subscribedStatus, setSubscribedStatus] = useState("Starter")
    var [customerId, setCustomerId] =useState('')

    const SubscriptionPage = (plan)=>{
        if(subscribedStatus == "Starter"){
        window.location = `/subscription/${plan}`
        }
        else{
            toast.info('You Have Already Purchased This Plan!')
        }
    }
    useEffect(() => {
        firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}`).on('value',(snap)=>{
            if(snap.exists()){
              var data = snap.val()
              setSubscribedStatus(subscribedStatus = data.plan)
              document.getElementById(data.plan).innerHTML = 'Selected✓'
              setCustomerId(customerId = data.customerObj.id)
              console.log(data.customerObj.id, 'customerId')
            }
            else{
              alert('haram')
            }
          });
        return () => {
            //cleanup
        }
    }, [])

    const openCustomerPortal = async (event) => {

        if(customerId == undefined){
            toast.info('You Need To Buy A Plan To See This Information!')
            return
        }
    
        const res = await axios.post('https://connect-quiz-now.herokuapp.com/create-customer-portal-session', {customerId: customerId});
    
        const {redirectUrl} = res.data;
        console.log(redirectUrl)

        window.location = redirectUrl
    
    
        if (res.error) {
          // Show error to your customer (e.g., insufficient funds)
          console.log(res.error.message);
        } else {
            //
        }
    
      };

    return (
        <div>
            <h1 hidden>current Plan: {subscribedStatus}</h1>
            <div id='plan1'>
                <h1>
                    Starter Plan
                </h1>
                <h2>Free</h2>
                <h2>Features</h2>
                <ul>
                    <li className='features'>• Acces to The Multiplayer Flash Card Game</li>
                    <li className='features'>• Have 5 or Less People in Your Rooms</li>
                    <li className='features'>• You Can Create Quizes</li>
                </ul>
                <img height='220px' width='220px' src={StarterImg}></img>
                <div>
                    <button id='Starter' className='sub-button'>Select</button>
                </div>
            </div>
            <div id='plan2'>
                <h1>
                    Classroom Plan
                </h1>
                <h2>10$ per month</h2>
                <h2>Features</h2>
                <ul>
                    <li className='features'>feature 1</li>
                    <li className='features'>feature 2</li>
                    <li className='features'>feature 3</li>
                </ul>
                <img height='220px' width='220px' src={TeacherImg}></img>
                <div>
                    <button id='Classroom' className='sub-button' onClick={()=>{SubscriptionPage('classroom')}}>Select</button>
                </div>
            </div>
            <div id='plan3'>
                <h1>
                    Entreprise Plan
                </h1>
                <h2>25$ per month</h2>
                <h2>Features</h2>
                <ul>
                    <li className='features'>feature 1</li>
                    <li className='features'>feature 2</li>
                    <li className='features'>feature 3</li>
                </ul>
                <img height='220px' width='220px' src={EntrepriseImg}></img>
                <div>
                    <button className='sub-button'>Select</button>
                </div>
            </div>
            <div>
                <button style={{marginTop:'100px'}} onClick={()=>{openCustomerPortal()}}>Customer Portal</button>
            </div>
        </div>
    )
}
