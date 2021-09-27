import { Typography, Button, Divider, TextField, Chip, Avatar } from '@material-ui/core'
import React, { useState, useEffect, useRef } from 'react'
import UploadBox from './UploadButton'
import { v4 as uuidv4 } from 'uuid';

import firebase from "firebase"
import "firebase/database";
import { toast } from 'react-toastify';

import Translations from '../translations/translations.json'

function CreateClass() {

    const [className, setClassName] = useState("")
    const [members, setMembers] = useState([])

    //inputs
    const [currentMember, setCurrentMember] = useState("")

    const imgRef = useRef(null)

    const [userLanguage, setUserLanguage] = useState(localStorage.getItem('connectLanguage') || 'english')

    useEffect(() => {
        getPlan()
    }, [])

    const getPlan = () => {
        firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}/plan`).on('value', (snapshot) => {
            const data = snapshot.val()
            if(data === 'Starter'){
                window.location.href = '/'
            }

        })
    }

    const removeMember = (member) => {
        const cloneArr = [...members]
        const index = cloneArr.indexOf(member)
        cloneArr.splice(index, 1)
        setMembers(cloneArr)
    }

    const createClass = () => {
        const classID = uuidv4()
        let memberArr = [...members]
        if(members.length === 0){
            memberArr = ""
        }
        const classData = {
            "name": className,
            "banner": imgRef.current ? imgRef.current.src : '',
            "halloffame": "",
            "next_reward": "",
            "reward": "",
            "recent_games": "",
            "members": memberArr,
            "owner": JSON.parse(localStorage.getItem('user')).profileObj.googleId,
            "id": classID
        }

        /*create class*/
        firebase.database().ref(`classes/${classID}`).set(classData)

        /*notify owner*/
        const notification = {
            "type": "class_created",
            "class": classID,
            "read": false,
            "date": new Date().toLocaleString(),
            "message": `You have succesfully created ${classData.name}!`
        }

        firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}/classes`).push({"id":classID})
        firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}/notifications`).push(notification)

        /*notify members*/

        const membersArr = [...members]

        membersArr.map((member) => {
            const memberID = member.id
            const notification = {
                "type": "added_to_class",
                "classid": classID,
                "read": false,
                "date": new Date().toLocaleString(),
                "message": `${JSON.parse(localStorage.getItem('user')).profileObj.name} has added you to ${classData.name}!`
            }

            firebase.database().ref(`users/${memberID}/classes`).push({"id":classID})
            firebase.database().ref(`users/${memberID}/notifications`).push(notification)
        })

        window.location.href = `/class/${classID}`

    }

    const addMember = (member) => {
        firebase.database().ref(`users`).on('value', (snapshot) => {
            const data = snapshot.val()
            const users = Object.keys(data)

            for(let i = 0; i < users.length; i++){
                const memberID = member
                const userId = users[i]
                if(data[users[i]].email === member || data[users[i]].email === memberID.split('.').join('')){
                    for(let i = 0; i < [...members].length; i++){
                        if([...members][i].id === userId){
                            toast.error(Translations[userLanguage].alerts.memberAlreadyExists)
                            return
                        }
                        else{
                            console.log([...members][i].id + " " + memberID)
                        }
                    }
                    setMembers([...members, {"data": data[users[i]], "id": users[i], "points": 0}])
                    setCurrentMember('')
                    return
                }
            }
            toast.error(Translations[userLanguage].alerts.thisUserDoesNotExist)

        })
    }

    return (
        <div>
            <div style={{marginTop:'100px'}}>
                <div style={{display:'flex', alignItems:'center', flexDirection:'column', backgroundColor:'white', margin:'10px', border:'2px solid black', boxShadow:'10px 10px 0 #262626'}}>
                    <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                    <Typography variant="h2" gutterBottom><b>{Translations[userLanguage].createclass.title}</b></Typography>
                        <br></br>
                        <Divider style={{width:'90vw'}} light/>
                        <br></br>
                        <Typography variant="h5" style={{margin:'10px'}}>{Translations[userLanguage].createclass.steps.step1}</Typography>
                        <input value={className} onChange={(e)=>setClassName(e.target.value)} className='userInput' style={{width:'100%', maxWidth:'320px', border:'2px solid black', boxShadow:'10px 10px 0 #262626', height:'50px'}} type='text' placeholder={Translations[userLanguage].createclass.steps.input1}></input>
                    </div>
                    <div>
                        <Typography variant="h5" style={{marginTop:'100px'}}>{Translations[userLanguage].createclass.steps.step2}</Typography>
                        <UploadBox imgRef={imgRef}/>
                    </div>
                        <div style={{backgroundColor:'white', padding:'15px', border:'2px solid black', boxShadow:'10px 10px 0 #262626', width:'80vw', maxWidth:'600px', marginTop:'50px', marginBottom:'100px'}}>
                            <Typography variant="h3">{Translations[userLanguage].createclass.steps.members}</Typography>
                            <br></br>
                            <Divider light/>
                            <br></br>
                            <TextField variant="outlined" size='small' label={Translations[userLanguage].createclass.steps.memberinput} helperText={<span style={{color:'black'}}>{members.length} {Translations[userLanguage].createclass.steps.members}</span>} onChange={(e)=>{setCurrentMember(e.target.value)}} value={currentMember}/>
                            <Button variant="contained" size='medium' color="primary" onClick={()=>{addMember(currentMember)}}>{Translations[userLanguage].createclass.steps.addbutton}</Button>
                            <br></br>
                            {
                                members.map((member, index) => {
                                    return (
                                        <Chip 
                                            style={{marginTop:'10px', margin:'2px'}} 
                                            key={member.data.email+index} 
                                            id={member.data.UserName+index} 
                                            label={member.data.UserName} 
                                            onDelete={()=>removeMember(member)} color="primary"
                                            avatar={   
                                                member.data.imageUrl === undefined ?
                                                <Avatar alt={member.data.UserName}>{member.data.UserName.charAt(0)}</Avatar>
                                                    :   
                                                <Avatar alt='user-pfp' src={member.data.imageUrl}/>
                                            }
                                        />
                                    )
                                })
                            }
                        </div>
                    <div>
                        <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='large' onClick={()=>{createClass()}}>{Translations[userLanguage].createclass.steps.createclassbutton}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateClass
