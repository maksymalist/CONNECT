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

import { useSelector } from 'react-redux'

export default function Plans() {
    const plan = useSelector(state => state.plan)
    // eslint-disable-next-line
    const [userLanguage] = useState(localStorage.getItem('connectLanguage') || 'english')

    const selectClassroomPlan = ()=>{
        if(plan == "Starter"){
            window.location = `/subscription/classroom`
        }
        else{
            toast.info(Translations[userLanguage].alerts.alreadyhaveplan)
        }
    }
    useEffect(() => {
        if(JSON.parse(localStorage.getItem('user')) == null) return
    }, [])

    return (
        <div className='planDiv'>
            <div id='plan1'>
                <h1>
                    {Translations[userLanguage].plans.starter.title}
                </h1>
                <h2>{Translations[userLanguage].plans.starter.price}</h2>
                <h2>{Translations[userLanguage].plans.starter.features.title}</h2>
                <div style={{display:'flex', flexDirection:'column', textAlign:'start', height:'270px', overflowY:'auto'}}>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.starter.features.feature1}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.starter.features.feature2}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.starter.features.feature3}</Typography>
                </div>
                <img alt='starter-img' height='220px' width='220px' src={StarterImg}></img>
                <div>
                    <Button 
                    id='Starter' 
                    className='sub-button' 
                    style={{marginBottom:'1vh'}} 
                    variant="contained" 
                    color="primary" 
                    size='medium'>{plan === 'Starter' ? Translations[userLanguage].plans.starter.buttonsubscribed : Translations[userLanguage].plans.starter.button}</Button>
                </div>
            </div>
            <div id='plan2'>
                <h1>
                    {Translations[userLanguage].plans.classroom.title}
                </h1>
                <h2>{Translations[userLanguage].plans.classroom.price}</h2>
                <h2>{Translations[userLanguage].plans.classroom.features.title}</h2>
                <div style={{display:'flex', flexDirection:'column', textAlign:'start', height:'270px', overflowY:'auto'}}>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.classroom.features.feature1}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.classroom.features.feature2}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.classroom.features.feature3}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.classroom.features.feature4}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.classroom.features.feature5}</Typography>
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
                    onClick={()=>selectClassroomPlan()}>{plan === 'Classroom' ? Translations[userLanguage].plans.classroom.buttonsubscribed : Translations[userLanguage].plans.classroom.button}</Button>
                </div>
            </div>
            <div id='plan3'>
                <h1>
                    {Translations[userLanguage].plans.entreprise.title}
                </h1>
                <h2>{Translations[userLanguage].plans.entreprise.price}</h2>
                <h2>{Translations[userLanguage].plans.entreprise.features.title}</h2>
                <div style={{display:'flex', flexDirection:'column', textAlign:'start', height:'270px', overflowY:'auto'}}>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.entreprise.features.feature1}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.entreprise.features.feature2}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.entreprise.features.feature3}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.entreprise.features.feature4}</Typography>
                    <Typography variant='subtitle1' className='features'><CheckRounded style={{color:'#1a7f37'}}/>⠀{Translations[userLanguage].plans.entreprise.features.feature5}</Typography>
                </div>
                <img alt='entreprise-img' height='220px' width='220px' src={EntrepriseImg}></img>
                <div>
                    <Button 
                    className='sub-button' 
                    style={{marginBottom:'1vh'}} 
                    variant="contained" 
                    color="primary" 
                    size='medium'>{plan === 'Entreprise' ? Translations[userLanguage].plans.entreprise.buttonsubscribed : Translations[userLanguage].plans.entreprise.button}</Button>
                </div>
            </div>
        </div>
    )
}
