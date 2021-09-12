import React, {useEffect, useState} from 'react'
import TeacherImg from '../../img/teacher_sub.svg'
import StarterImg from '../../img/starter_sub.svg'
import EntrepriseImg from '../../img/entreprise_sub.svg'

//firebase
import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";
import { toast } from 'react-toastify'
import axios from 'axios'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { CheckRounded } from '@material-ui/icons'
import Translations from '../../translations/translations.json'

export default function Plans() {
    var [subscribedStatus, setSubscribedStatus] = useState("Starter")
    var [customerId, setCustomerId] =useState('')

    const SubscriptionPage = (plan)=>{
        if(subscribedStatus == "Starter"){
        window.location = `/subscription/${plan}`
        }
        else{
            toast.info(Translations[localStorage.getItem('connectLanguage')].alerts.alreadyhaveplan)
        }
    }
    useEffect(() => {
        if(JSON.parse(localStorage.getItem('user')) === null) return
        firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}`).on('value',(snap)=>{
            if(snap.exists()){
              var data = snap.val()
              if(data.planStatus == 'inactive'){
                document.getElementById('Starter').innerHTML = Translations[localStorage.getItem('connectLanguage')].plans.classroom.buttonsubscribed
                return
              }
              if(data.planStatus == 'canceled'){
                document.getElementById('Starter').innerHTML = Translations[localStorage.getItem('connectLanguage')].plans.classroom.buttonsubscribed
                return
              }
              setSubscribedStatus(subscribedStatus = data.plan)
              document.getElementById(data.plan).innerHTML = Translations[localStorage.getItem('connectLanguage')].plans.classroom.buttonsubscribed
              document.getElementById('Starter').innerHTML = Translations[localStorage.getItem('connectLanguage')].plans.starter.button
              setCustomerId(customerId = data.customerObj.id)
              console.log(data.customerObj.id, 'customerId')
            }
            else{
              toast.error(Translations[localStorage.getItem('connectLanguage')].alerts.error)
            }
          });
        return () => {
            //cleanup
        }
    }, [])

    const openCustomerPortal = async (event) => {

        if(customerId == undefined){
            toast.info(Translations[localStorage.getItem('connectLanguage')].alerts.buyplanseeinfo)
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
                    {Translations[localStorage.getItem('connectLanguage')].plans.starter.title}
                </h1>
                <h2>{Translations[localStorage.getItem('connectLanguage')].plans.starter.price}</h2>
                <h2>{Translations[localStorage.getItem('connectLanguage')].plans.starter.features.title}</h2>
                <div style={{display:'flex', flexDirection:'column', textAlign:'start', height:'270px', overflowY:'auto'}}>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.starter.features.feature1}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.starter.features.feature2}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.starter.features.feature3}</Typography>
                </div>
                <img alt='starter-img' height='220px' width='220px' src={StarterImg}></img>
                <div>
                    <Button 
                    id='Starter' 
                    className='sub-button' 
                    style={{marginBottom:'1vh'}} 
                    variant="contained" 
                    color="primary" 
                    size='medium'>{Translations[localStorage.getItem('connectLanguage')].plans.starter.button}</Button>
                </div>
            </div>
            <div id='plan2'>
                <h1>
                    {Translations[localStorage.getItem('connectLanguage')].plans.classroom.title}
                </h1>
                <h2>{Translations[localStorage.getItem('connectLanguage')].plans.classroom.price}</h2>
                <h2>{Translations[localStorage.getItem('connectLanguage')].plans.classroom.features.title}</h2>
                <div style={{display:'flex', flexDirection:'column', textAlign:'start', height:'270px', overflowY:'auto'}}>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.classroom.features.feature1}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.classroom.features.feature2}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.classroom.features.feature3}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.classroom.features.feature4}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.classroom.features.feature5}</Typography>
                </div>
                <img alt='classroom-img' height='220px' width='220px' src={TeacherImg}></img>
                <div>
                    <Button 
                    id='Classroom' 
                    className='sub-button' 
                    style={{marginBottom:'1vh'}} 
                    variant="contained" 
                    color="primary" 
                    size='medium' 
                    onClick={()=>{SubscriptionPage('classroom')}}>{Translations[localStorage.getItem('connectLanguage')].plans.classroom.button}</Button>
                </div>
            </div>
            <div id='plan3'>
                <h1>
                    {Translations[localStorage.getItem('connectLanguage')].plans.entreprise.title}
                </h1>
                <h2>{Translations[localStorage.getItem('connectLanguage')].plans.entreprise.price}</h2>
                <h2>{Translations[localStorage.getItem('connectLanguage')].plans.entreprise.features.title}</h2>
                <div style={{display:'flex', flexDirection:'column', textAlign:'start', height:'270px', overflowY:'auto'}}>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.entreprise.features.feature1}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.entreprise.features.feature2}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.entreprise.features.feature3}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.entreprise.features.feature4}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[localStorage.getItem('connectLanguage')].plans.entreprise.features.feature5}</Typography>
                </div>
                <img alt='entreprise-img' height='220px' width='220px' src={EntrepriseImg}></img>
                <div>
                    <Button 
                    className='sub-button' 
                    style={{marginBottom:'1vh'}} 
                    variant="contained" 
                    color="primary" 
                    size='medium'>{Translations[localStorage.getItem('connectLanguage')].plans.entreprise.button}</Button>
                </div>
            </div>
        </div>
    )
}
