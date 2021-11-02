import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'


//styles
import '../style/classroomStyles.css'
import Placeholder from '../img/quizCoverPlaceholder.svg'

//badges
import FirstPlaceIcon from '../img/PodiumIcons/firstPlace.svg'
import SecondPlaceIcon from '../img/PodiumIcons/secondPlace.svg'
import ThirdPlaceIcon from '../img/PodiumIcons/thirdPlace.svg'

//translations
import Translations from '../translations/translations.json'

//material-ui
import { Typography, Button, Divider, Chip, Avatar, Backdrop, TextField } from '@material-ui/core';
import { AccountCircle, CancelRounded } from '@material-ui/icons';

//components
import BrowseQuizzes from './BrowseQuizzesClassroom'

//toast
import { toast } from 'react-toastify';


//redux
import { useSelector} from 'react-redux'

//axios
import axios from 'axios'

//apollo
import { useMutation, gql } from '@apollo/client'

const ADD_MEMBER = gql`
    mutation createMember($classId: ID!, $userId: ID!, $role: String!) {
        createMember(classId: $classId, userId: $userId, role: $role)
    }
`

const CREATE_NOTIFICATION = gql`
    mutation createNotification($userId: ID!, $type: String!, $message: String!, $data: String!) {
        createNotification(userId: $userId, type: $type, message: $message, data: $data)
    }
`

const DELETE_MEMBER = gql`
    mutation deleteMember($classId: ID!, $userId: ID!) {
        deleteMember(classId: $classId, userId: $userId)
    }
`
    


export default function MemberRoom() {
    const plan = useSelector(state => state.plan)
    const [userLanguage, setUserLanguage] = useState(localStorage.getItem('connectLanguage') || 'english')

    const [isBrowseQuizzes, setIsBrowseQuizzes] = useState(false)

    const [members, setMembers] = useState([])
    const [name, setName] = useState("")
    const [banner, setBanner] = useState("")
    const [hallOfFame, setHallOfFame] = useState([])
    const [recentGames, setRecentGames] = useState([])

    const [newMembers, setNewMembers] = useState([])

    //inputs
    const [currentMember, setCurrentMember] = useState("")

    const [finalists, setFinalists] = useState([])

    const { id } = useParams()

    //popups
    const [isAddMemberPopup, setIsAddMemberPopup] = useState(false)
    const [removeMode, setRemoveMode] = useState(false)

    //mutations
    const [addMemberMutation] = useMutation(ADD_MEMBER)
    const [createNotification] = useMutation(CREATE_NOTIFICATION)
    const [deleteMemberMutation] = useMutation(DELETE_MEMBER)

    //prefixes
    const USERID_PREFIX = 'user:'


    const handleRenderClassroom = async () => {
        const res = await axios.post('http://localhost:3001/get-class', { id: id })
        const data = res.data
    
         if(data.owner != JSON.parse(localStorage.getItem('user')).profileObj.googleId){
             //window.location.href = `/view-class/${id}`
             //return
         }
    
         //set class attributes
         setName(data.name)
         setBanner(data.banner)
    
    
         //set members
         const members = data.members || []

         console.log(members)
    
    
         members.forEach( async (member) => {

             const userObj = {
                 points: member.points,
                 id: member.userId,
                 name: "",
                 imageUrl: ""
             }
    
             const res = await axios.post('http://localhost:3001/user-no-prefix', { userId: member.userId })
             const data = res.data
    
             userObj.name = data.name
             userObj.imageUrl = data.imageUrl
             
             setMembers(prevState => [...prevState, userObj])
         })

         //set hall of fame
         const hallOfFameData = await axios.post('http://localhost:3001/get-hall-of-fame', { id: id })
         setHallOfFame(hallOfFameData.data)
    
         //set recent games
    
         const games = await axios.post('http://localhost:3001/get-recent-games', { classId: id })

         const recentGames = games.data
    
         setRecentGames(recentGames)
     }

    
    useEffect(() => {
        handleRenderClassroom()
    }, [])

    useEffect(() => {
        if(plan === null){
            window.location.href = `/view-class/${id}`
            return
        }
        if(plan === 'Starter'){
            window.location.href = `/view-class/${id}`
            return
        }
    }, [plan])

    const handleSetFinalists = async (finalists) => {
        const newFinalistsArr = []
        finalists.map( async (finalist) => {
            const res = await axios.post('http://localhost:3001/user', { userId: finalist.playerID })
            const playerData = res.data

            newFinalistsArr.push({
                name: playerData.name,
                profileImg: playerData.imageUrl,
                player: finalist.player,
                playerID: finalist.playerID,
                position: finalist.position,
                time: finalist.time
            })

            if(newFinalistsArr.length === finalists.length){
                setFinalists(newFinalistsArr)
            }
        })
    }

    const handleRenderGames = () => {
        setIsBrowseQuizzes(!isBrowseQuizzes)
    }

    const handleAddMember = (member) => {
        setIsAddMemberPopup(true)
    }

    const addMember = async (member) => {

        const res = await axios.post('http://localhost:3001/user-by-email', {email: member})

        console.log(res.data)

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
            setNewMembers([...newMembers, {"data": res.data, "id": res.data._id}])
            setCurrentMember('')
            return
        }
    
    }

    const handleAddMemberComfirm = () => {

        const membersArr = [...newMembers]

        membersArr.map((member) => {

            const memberId = member.data._id

            const notification = {
                userId: memberId.replace(/user:/g, ""),
                type: "added_to_class",
                message: `${JSON.parse(localStorage.getItem('user')).profileObj.name} has added you to ${name}!`,
                data: id
            }

            const memberData = {
                classId: id,
                userId: memberId,
                role: "member"
            }

            addMemberMutation({ variables: memberData })
            createNotification({ variables: notification })
        })
        window.location.reload()
    }

    const removeNewMember = (member) => {
        const cloneArr = [...newMembers]
        const index = cloneArr.indexOf(member)
        cloneArr.splice(index, 1)
        console.log(member)
        console.log(cloneArr)
        setNewMembers(cloneArr)
    }

    const removeMember = (index, memberId) => {
        if(memberId === `user:${JSON.parse(localStorage.getItem('user')).profileObj.googleId}`){
            toast.error(Translations[userLanguage].alerts.cannotRemoveYourself)
            return
        }
        const cloneMemberArr = [...members]
        cloneMemberArr.splice(index, 1)
        setMembers(cloneMemberArr)


        const notification = {
            userId: memberId.replace(/user:/g, ""),
            type: "removed_from_class",
            message: `${JSON.parse(localStorage.getItem('user')).profileObj.name} has removed you from ${name} :(`,
            data: id
        }

        console.log(index, memberId)

        createNotification({ variables: notification })
        deleteMemberMutation({ variables: { classId: id, userId: memberId } })
    }



    return (
        <div className='classroom__main__div'>
            <div className="classroom__members">
                <Typography variant='h4' className="classroom__members__title">{Translations[userLanguage].classroom.members.title}({members.length})</Typography>
                <div>
                <Button style={{margin:'10px'}} variant='contained' color='primary' onClick={()=>handleAddMember()}>{Translations[userLanguage].classroom.members.add}</Button>
                <Button style={{margin:'10px'}} variant='contained' color='secondary' onClick={()=>setRemoveMode(!removeMode)}>{removeMode ? Translations[userLanguage].classroom.members.cancel : Translations[userLanguage].classroom.members.remove}</Button>
                </div>
                {
                    isAddMemberPopup ?
                    <div style={{position:'fixed', top:'0', left:'0', width:'100vw', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <div className="classroom__addmember__div">
                        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <Typography variant='h4' className="classroom__addmember__title">{Translations[userLanguage].classroom.addmember.title}</Typography>
                            <CancelRounded style={{fontSize: '2rem', color: 'red', cursor: 'pointer'}} onClick={()=>setIsAddMemberPopup(false)}/>
                        </div>
                        <br></br>
                            <Divider light/>
                        <br></br>
                            <div>
                                <TextField variant="outlined" size='small' label={Translations[userLanguage].classroom.addmember.input} helperText={<span style={{color:'black'}}>{newMembers.length} {Translations[userLanguage].classroom.addmember.members}</span>} onChange={(e)=>{setCurrentMember(e.target.value)}} value={currentMember}/>
                                <Button variant="contained" size='medium' color="primary" onClick={()=>{addMember(currentMember)}}>{Translations[userLanguage].classroom.addmember.button}</Button>
                            </div>
                        <br></br>
                        <div style={{width:'100%', display:"flex", alignItems:'center', justifyContent:'center', flexWrap:'wrap'}}>
                            {
                                newMembers.map((member, index) => {
                                    return (
                                        <Chip 
                                            style={{marginTop:'10px', margin:'2px'}} 
                                            key={member.data.email+index} 
                                            id={member.data.name+index} 
                                            label={member.data.name} 
                                            onDelete={()=>removeNewMember(member)} color="primary"
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
                        <div style={{width:'95%', display:'flex', justifyContent:'flex-end', marginTop:'100px'}}>
                            <Button variant="contained" size='medium' color="primary" onClick={()=>{handleAddMemberComfirm()}}>{Translations[userLanguage].classroom.addmember.confirm}</Button>
                        </div>
                    </div>
                    </div>
                :
                null
                }
                <div style={{width:'90%'}}>
                    <br></br>
                    <Divider light/>
                    <br></br>
                </div>
                <div className="classroom__member__scroll__container">
                    {
                        members.map((member, index) => {
                            return (
                                <div className="classroom__members__member" key={index}>
                                    <img onClick={()=>window.location = `/profiles/${member.id.replace("user:", "")}`} src={member.imageUrl || undefined} alt="member" className="classroom__members__member__img"/>
                                    <Typography style={{minWidth:'150px'}} variant='subtitle1' className="classroom__members__member__name">{member.name || undefined}</Typography>
                                    <div style={{display:'flex', width:'100%', justifyContent:'flex-end'}}>
                                    {
                                        removeMode &&
                                        <CancelRounded style={{fontSize: '2rem', color: 'red', cursor: 'pointer'}} onClick={()=>removeMember(index, member.id)}/>
                                    }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {
                isBrowseQuizzes ?
                <div id='classroom__dashboard' className="classroom__dashboard">
                <div style={{position:'sticky', top:'0', backgroundColor:'white', width:'100%', zIndex:'11'}}>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <Typography variant='h4' className="classroom__dashboard__title">{name}</Typography>
                        <Button style={{marginRight:'10px'}} variant='contained' color='secondary' onClick={handleRenderGames}>{Translations[userLanguage].classroom.play.backbutton}</Button>  
                    </div>
                    <div style={{width:'100%'}}>
                        <br></br>
                        <Divider light/>
                    </div>
                </div>
                    <BrowseQuizzes classID={id} gamemode={"normal"}/>
                </div>
                :
                <div id='classroom__dashboard' className="classroom__dashboard">
                <div style={{position:'sticky', top:'0', backgroundColor:'white', width:'100%', zIndex:'11'}}>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <Typography variant='h4' className="classroom__dashboard__title">{name}</Typography>
                        <Button style={{marginRight:'10px'}} variant='contained' color='primary' onClick={handleRenderGames}>{Translations[userLanguage].classroom.play.playbutton}</Button>  
                    </div>
                    <div style={{width:'100%'}}>
                    <br></br>
                    <Divider light/>
                </div>
                </div>
                <div className="classroom__banner__div">
                    <img src={banner || Placeholder} alt="banner" className="classroom__banner"/>
                </div>
                <div className="classroom__hall__of__fame">
                    <Typography variant='h3' className="classroom__hall__of__fame__title">{Translations[userLanguage].classroom.halloffame.title}</Typography>
                    <div className="classroom__hall__of__fame__card__container">
                        {
                            hallOfFame.map((member, index) => {
                                if(index >= 3) return
                                return (
                                    <div className="classroom__hall__of__fame__card" key={index}>
                                        {(index + 1) === 1 && <img draggable='false' src={FirstPlaceIcon} alt="first-badge" className="classroom__hall__of__fame__card__rank"/>}
                                        {(index + 1) === 2 && <img draggable='false' src={SecondPlaceIcon} alt="second-badge" className="classroom__hall__of__fame__card__rank"/>}
                                        {(index + 1) === 3 && <img draggable='false' src={ThirdPlaceIcon} alt="third-badge" className="classroom__hall__of__fame__card__rank"/>}
                                        <Avatar src={member.imageUrl} alt="member" className="classroom__hall__of__fame__card__img"/>
                                        <Typography variant='h4' className="classroom__hall__of__fame__card__name">{member.name}</Typography>
                                        <Typography variant='h6' className="classroom__hall__of__fame__card__points">{member.points} pts</Typography>
                                    </div>
                                )
                            })
                        }
                        {/* <div className="classroom__reward__date__container">
                            {rewardTime !== null && rewardTime !== "" && <Typography variant='h6' className="classroom__reward__date">Next Reward is: {rewardTime}</Typography>}
                            {reward !== null && reward !== "" && <Typography variant='h6' className="classroom__reward__date">Reward: {reward}</Typography>}
                            <Button variant="contained" color="primary" className="classroom__reward__button">Set Reward</Button>
                        </div> */}
                    </div>
                    
                </div>
                <div className="classroom__recent__games">
                        <div className="classroom__recent__games__games">
                        <div style={{position:'sticky', top:'0', backgroundColor:'white', width:'100%', zIndex: "10"}}>
                            <Typography variant='h3' className="classroom__recent__games__title">{Translations[userLanguage].classroom.recentGames.title}</Typography>
                            <div style={{width:'100%'}}>
                                <br></br>
                                <Divider light/>
                                <br></br>
                            </div>
                        </div>
                        <div className="classroom__recent__games__container">
                            {
                                recentGames.map((game) => {
                                    return (
                                        <div className='classroom__recent__games__game' onClick={()=>handleSetFinalists(game.finalists || [])}>
                                        <img style={{width:'100%', height:'250px'}} src={game.coverImg || Placeholder} alt='cover-img'/>
                                        <h2>{game.name}</h2>
                                        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                             {
                                                game.userProfilePic == "" ?
                                                <AccountCircle style={{marginRight:'10px'}} color='primary'/>
                                                :
                                                <img 
                                                    width='25px' 
                                                    height='25px' 
                                                    src={game.userProfilePic} 
                                                    alt={game.userProfilePic}
                                                    style={{
                                                        borderRadius:'100%',
                                                        marginRight:'10px'
                                                    }}
                                                />                       
                                             }
                                            <h3>{`${Translations[userLanguage].quizzes.by} ${game.userName || "undefined"}`}</h3>
                                        </div>
                                        <div>
                                            {
                                                game.tags == "" ?
                                                null
                                                :
                                                <div>
                                                    <br></br>
                                                    {
                                                        game.tags.map((tag,index)=>{
                                                            return <Chip style={{margin:'5px'}} key={tag+index} label={tag} color="primary" />
                                                        })
                                                    }
                                                </div>
                                            }
                                        </div>
                                        <div style={{display:'flex', alignItems:'flex-start'}}>
                                            <Typography variant='h6' className="classroom__recent__games__game__points">{game.date}</Typography>
                                        </div>
                                    </div>
                                    )
                                })
                            }
                        </div>
                        </div>
                        <div className="classroom__recent__games__finalists">
                        <div style={{position:'sticky', top:'0', backgroundColor:'white', width:'100%'}}>
                            <Typography variant='h3' className="classroom__recent__games__title">{Translations[userLanguage].classroom.finalists.title}</Typography>
                            <div style={{width:'100%'}}>
                                <br></br>
                                <Divider light/>
                                <br></br>
                            </div>
                            </div>
                            <div className="classroom__finalists">
                                {
                                    finalists.map((finalist,index) => {
                                        return (
                                            <div className="classroom__finalists__card" key={index}>
                                                <Avatar src={finalist.profileImg || null} alt="member" className="classroom__finalists__card__img"/>
                                                <div style={{display:'flex', flexDirection:'column'}}>
                                                    <Typography variant='sub1' className="classroom__finalists__card__name">{finalist.name}</Typography>
                                                    <Typography variant='sub1' className="classroom__finalists__card__name">{`" ${finalist.player}"`}</Typography>
                                                </div>
                                                {finalist.position == 1 && <img draggable='false' src={FirstPlaceIcon} alt="first-badge" className="classroom__finalist__card__rank"/>}
                                                {finalist.position == 2 && <img draggable='false' src={SecondPlaceIcon} alt="second-badge" className="classroom__finalist__card__rank"/>}
                                                {finalist.position == 3 && <img draggable='false' src={ThirdPlaceIcon} alt="third-badge" className="classroom__finalist__card__rank"/>}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
            </div>
            }
        </div>
    )
}