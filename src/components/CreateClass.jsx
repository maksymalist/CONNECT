import { Typography, Button, Divider, TextField, Chip, Avatar } from '@material-ui/core'
import React, { useState, useEffect, useRef } from 'react'
import UploadBox from './UploadButton'
import { v4 as uuidv4 } from 'uuid';

import firebase from "firebase"
import "firebase/database";
import { toast } from 'react-toastify';

import Translations from '../translations/translations.json'

import axios from 'axios';

import { useMutation, gql } from '@apollo/client'

const CREATE_CLASS = gql`
    mutation createClassroom($_id: ID!, $name: String!, $banner: String!, $owner: ID!) {
        createClassroom(_id: $_id, name: $name, banner: $banner, owner: $owner)
    }        
`

const CREATE_NOTIFICATION = gql`
    mutation createNotification($userId: ID!, $type: String!, $message: String!, $data: String!) {
        createNotification(userId: $userId, type: $type, message: $message, data: $data)
    }
`

const CREATE_MEMBER_OWNER = gql`
    mutation createMember($classId: ID!, $userId: ID!, $role: String!) {
        createMember(classId: $classId, userId: $userId, role: $role)
    }
`
const CREATE_MEMBER = gql`
    mutation createMember($classId: ID!, $userId: ID!, $role: String!) {
        createMember(classId: $classId, userId: $userId, role: $role)
    }
`

const CLASSROOM_PREFIX = 'class:'
const USERID_PREFIX = 'user:'

function CreateClass() {

    const [className, setClassName] = useState("")
    const [members, setMembers] = useState([])

    //inputs
    const [currentMember, setCurrentMember] = useState("")

    const imgRef = useRef(null)

    const [userLanguage] = useState(localStorage.getItem('connectLanguage') || 'english')

    const [createClassMutation] = useMutation(CREATE_CLASS)
    const [createNotificationMutation] = useMutation(CREATE_NOTIFICATION)

    const [createMemberOwnerMutation] = useMutation(CREATE_MEMBER_OWNER)
    const [createMemberMutation] = useMutation(CREATE_MEMBER)

    useEffect(() => {
        getPlan()
    }, [])

    const getPlan = async () => {
        const res = await axios.post('http://localhost:3001/user', {userId: JSON.parse(localStorage.getItem('user')).profileObj.googleId})
        if(!res.data) return
        if(res.data.plan === 'Starter'){
            window.location.href = '/'
        }
    }

    const removeMember = (member) => {
        const cloneArr = [...members]
        const index = cloneArr.indexOf(member)
        cloneArr.splice(index, 1)
        setMembers(cloneArr)
    }

    const createClass = () => {
        const classID = CLASSROOM_PREFIX+uuidv4()
        const classData = {
            _id: classID,
            name: className || '',
            banner: imgRef.current ? imgRef.current.src : '',
            owner: JSON.parse(localStorage.getItem('user')).profileObj.googleId,
        }

        /*create class*/
        createClassMutation({ variables: classData })

        /*notify owner*/
        const notification = {
            userId: JSON.parse(localStorage.getItem('user')).profileObj.googleId,
            type: "class_created",
            message: `You have succesfully created ${classData.name}!`,
            data: classID
        }

        const ownerData = {
            classId: classID,
            userId: JSON.parse(localStorage.getItem('user')).profileObj.googleId,
            role: "owner"
        }

        createNotificationMutation({ variables: notification })
        createMemberOwnerMutation({ variables: ownerData })

        /*notify members*/

        const membersArr = [...members]

        membersArr.map((member) => {
            const memberID = member.id
            const notification = {
                userId: memberID,
                type: "added_to_class",
                message: `${JSON.parse(localStorage.getItem('user')).profileObj.name} has added you to ${classData.name}!`,
                data: classID
            }

            const memberData = {
                classId: classID,
                userId: memberID,
                role: "member"
            }

            createNotificationMutation({ variables: notification })
            createMemberMutation({ variables: memberData })
        })

        window.location.href = `/class/${classID}`

    }

    const addMember = async (member) => {

        const res = await axios.post('http://localhost:3001/user-by-email', {email: member})

        const membersArr = [...members]

        if(!res.data){
            toast.error(Translations[userLanguage].alerts.thisUserDoesNotExist)
            return
        }

        if(res.data._id === USERID_PREFIX+JSON.parse(localStorage.getItem('user')).profileObj.googleId){
            toast.error(Translations[userLanguage].alerts.cannotAddYourself)
            return
        }

        if(res.data){

            membersArr.map((member) => {
                if(member.id === res.data._id){
                    toast.error(Translations[userLanguage].alerts.memberAlreadyExists)
                    return
                }
            })
            setMembers([...members, {"data": res.data, "id": res.data._id}])
            setCurrentMember('')
            return
        }
    
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
                                            id={member.data.name+index} 
                                            label={member.data.name} 
                                            onDelete={()=>removeMember(member)} color="primary"
                                            avatar={   
                                                member.data.imageUrl === undefined ?
                                                <Avatar alt={member.data.name}>{member.data.name.charAt(0)}</Avatar>
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
