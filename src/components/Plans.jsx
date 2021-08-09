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

import Button from '@material-ui/core/Button'

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
        if(JSON.parse(localStorage.getItem('user')) === null) return
        firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}`).on('value',(snap)=>{
            if(snap.exists()){
              var data = snap.val()
              if(data.planStatus == 'inactive'){
                document.getElementById('Starter').innerHTML = 'Selected✓'
              }
              if(data.planStatus == 'canceled'){
                document.getElementById('Starter').innerHTML = 'Selected✓'
                return
              }
              setSubscribedStatus(subscribedStatus = data.plan)
              document.getElementById(data.plan).innerHTML = 'Selected✓'
              document.getElementById('Starter').innerHTML = 'View'
              setCustomerId(customerId = data.customerObj.id)
              console.log(data.customerObj.id, 'customerId')
            }
            else{
              alert('Something when Wrong')
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
        <div className='planDiv'>
            <h1 hidden>current Plan: {subscribedStatus}</h1>
            <div id='plan1'>
                <h1>
                    Starter Plan
                </h1>
                <h2>Free</h2>
                <h2>Features</h2>
                <ul>
                    <li className='features'>• Acces to The Multiplayer Flash Card Game</li>
                    <li className='features'>• Have 8 or Less People in Your Rooms</li>
                    <li className='features'>• You Can Create Quizes</li>
                </ul>
                <img alt='starter-img' height='220px' width='220px' src={StarterImg}></img>
                <div>
                    <Button 
                    id='Starter' 
                    className='sub-button' 
                    style={{marginBottom:'1vh'}} 
                    variant="contained" 
                    color="primary" 
                    size='medium'>Select</Button>
                </div>
            </div>
            <div id='plan2'>
                <h1>
                    Classroom Plan
                </h1>
                <h2>10$ per month</h2>
                <h2>Features</h2>
                <ul>
                    <li className='features'>• Acces to The Multiplayer Flash Card Game</li>
                    <li className='features'>• Have 40 or Less People in Your Rooms</li>
                    <li className='features'>• You Can Create Quizes</li>
                </ul>
                <img alt='classroom-img' height='220px' width='220px' src={TeacherImg}></img>
                <div>
                    <Button 
                    id='Classroom' 
                    className='sub-button' 
                    style={{marginBottom:'1vh'}} 
                    variant="contained" 
                    color="primary" 
                    size='medium' 
                    onClick={()=>{SubscriptionPage('classroom')}}>Select</Button>
                </div>
            </div>
            <div id='plan3'>
                <h1>
                    (Coming Soon)
                </h1>
                <h2>25$ per month</h2>
                <h2>Features</h2>
                <ul>
                    <li className='features'>feature 1</li>
                    <li className='features'>feature 2</li>
                    <li className='features'>feature 3</li>
                </ul>
                <img alt='entreprise-img' height='220px' width='220px' src={EntrepriseImg}></img>
                <div>
                    <Button 
                    className='sub-button' 
                    style={{marginBottom:'1vh'}} 
                    variant="contained" 
                    color="primary" 
                    size='medium'>Select</Button>
                </div>
            </div>
        </div>
    )
}
