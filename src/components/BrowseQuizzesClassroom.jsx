import React,{ useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { io } from 'socket.io-client'

import firebase from "firebase"
import "firebase/database";


import '../style/style.css'
import Button from '@material-ui/core/Button'
import { CircularProgress, Chip } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InputLabel, FormControl } from '@material-ui/core'

import { QuestionAnswerRounded, FilterNoneRounded, FileCopyRounded, AccountCircle } from '@material-ui/icons';

import { toast } from 'react-toastify';

import Placeholder from '../img/quizCoverPlaceholder.svg'

import Translations from '../translations/translations.json'

//components

export default function BrowseQuizes({ classID, gamemode }) {

    const [gameMode, setGameMode] = useState("")
    const [userLanguage, setUserLanguage] = useState(localStorage.getItem('connectLanguage') || 'english')

    useEffect(() => {
        if(classID != null){
            console.log(classID)
            setGameMode(gamemode)
            console.log(gamemode)
            if(gamemode === 'multi'){
                GetMulti()
            }
            if(gamemode === 'normal'){
                GetQuizes()
            }
        }
    }, [])

    //styles
    const newQuizStyle = {backgroundColor:'white', borderRadius:'25px'}

    const GetQuizes = () => {

        console.log('normal')
        ReactDOM.render(null, document.getElementById('feed'))
        var db = firebase.database().ref('quizes/')

        
        // Attach an asynchronous callback to read the data at our posts reference
        db.on("value", function(snapshot) {
          var data = snapshot.val();
          var keys = Object.keys(data);
          keys.map((key, index)=>{
            var k = keys[index]

            let newQuiz = document.createElement('div')
            newQuiz.id = `newQuiz${index}`
            newQuiz.className = 'newQuiz'
            document.getElementById('feed').appendChild(newQuiz)

            ReactDOM.render(
                <div onClick={()=>window.location = `/quiz/normal/${k}?classid=${classID}`} style={{overflowY:'auto', overflowX:'hidden'}}>
                    <img style={{width:'100%', height:'250px'}} src={data[k].coverImg || Placeholder} alt='cover-img'/>
                    <h2>{data[k].name}</h2>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                         {
                            data[k].userProfilePic == undefined ?
                            <AccountCircle style={{marginRight:'10px'}} color='primary'/>
                            :
                            <img 
                                width='25px' 
                                height='25px' 
                                src={data[k].userProfilePic} 
                                alt={data[k].userProfilePic}
                                style={{
                                    borderRadius:'100%',
                                    marginRight:'10px'
                                }}
                            />                       
                         }
                        <h3>{`${Translations[userLanguage].quizzes.by} ${data[k].userName}`}</h3>
                    </div>
                    <div>
                        {
                            data[k].tags == undefined ?
                            null
                            :
                            <div>
                                <br></br>
                                {
                                    data[k].tags.map((tag,index)=>{
                                        return <Chip style={{margin:'5px'}} key={tag+index} label={tag} color="primary" />
                                    })
                                }
                            </div>
                        }
                    </div>
                    <br></br>
                </div>,
                document.getElementById(`newQuiz${index}`)
            )
            // document.getElementById('loading').setAttribute('hidden', 'true')
          })
          
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    }

    const GetMulti = () => {

        console.log('multi')
        ReactDOM.render(null, document.getElementById('feed'))
        var db = firebase.database().ref('multiQuizzes/')
        
        // Attach an asynchronous callback to read the data at our posts reference
        db.on("value", function(snapshot) {
          var data = snapshot.val();
          var keys = Object.keys(data);
          keys.map((key, index)=>{
            var k = keys[index]

            let newQuiz = document.createElement('div')
            newQuiz.id = `newQuiz${index}`
            newQuiz.className = 'newQuiz'
            document.getElementById('feed').appendChild(newQuiz)

            ReactDOM.render(
                <div onClick={()=>window.location = `/quiz/multi/${k}?classid=${classID}`} style={{overflowY:'auto', overflowX:'hidden'}}>
                    <img style={{width:'100%', height:'250px'}} src={data[k].coverImg || Placeholder} alt='cover-img'/>
                    <h2>{data[k].name}</h2>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                        {
                            data[k].userProfilePic == undefined ?
                            <AccountCircle style={{marginRight:'10px'}} color='primary'/>
                            :
                            <img 
                                width='25px' 
                                height='25px' 
                                src={data[k].userProfilePic} 
                                alt={data[k].userProfilePic}
                                style={{
                                    borderRadius:'100%',
                                    marginRight:'10px'
                                }}
                            />                       
                         }
                        <h3>{`${Translations[userLanguage].quizzes.by} ${data[k].userName}`}</h3>
                    </div>
                    <div>
                        {
                            data[k].tags == undefined ?
                            null
                            :
                            <div>
                                <br></br>
                                {
                                    data[k].tags.map((tag,index)=>{
                                        return <Chip style={{margin:'5px'}} key={tag+index} label={tag} color="primary" />
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>,
                document.getElementById(`newQuiz${index}`)
            )
            // document.getElementById('loading').setAttribute('hidden', 'true')
          })
          
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    }


    const changeGamemode = (event) => {
        event.preventDefault();
        setGameMode(event.target.value);
        if(event.target.value === 'normal'){
            if(classID != null){
                GetQuizes()
            }
        }
        if(event.target.value === 'multi'){
            if(classID != null){
                GetMulti()
            }
        }
    }
//console.log(Object.keys(data[k].steps[Object.keys(data[k].steps)[i]]))


    return (
        <>  
        <div style={{width:'100%', display:'flex', justifyContent:'flex-start',backgroundColor:'white', alignItems:'center', border:'2px solid black', boxShadow:'10px 10px 0 #262626', padding:'10px'}}>
            <h1 style={{fontSize:'1.5rem', marginRight:'20px'}}>{Translations[userLanguage].quizzes.bar.title}</h1>
            <FormControl variant='outlined'>
                <InputLabel id="demo-simple-select-outlined-label">{Translations[userLanguage].quizzes.bar.gamemode.title}</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={gameMode}
                        onChange={changeGamemode}
                        label="GameMode"
                        style={{width:'180px', height:'40px'}}
                        required
                        >
                        <MenuItem value='normal'><QuestionAnswerRounded color='primary'/>⠀{Translations[userLanguage].quizzes.bar.gamemode.normal}</MenuItem>
                        <MenuItem value='multi'><FilterNoneRounded color='primary'/>⠀{Translations[userLanguage].quizzes.bar.gamemode.multi}</MenuItem>
                    </Select>
            </FormControl>
        </div>
        <div style={{marginTop:'100px'}} id='feed'>
            <div style={{display:'flex', alignItems:'center'}}>
                <h1 id='loading'><span style={{color:"white"}}>Loading</span>⠀<CircularProgress size={40} style={{color:'white'}} /></h1>
            </div>
        </div>
        </>
    )
}