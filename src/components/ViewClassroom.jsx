import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom'
//firebase
import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";


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



export default function MemberRoom() {
    const [userLanguage, setUserLanguage] = useState(localStorage.getItem('connectLanguage') || 'english')

    const [members, setMembers] = useState([])
    const [name, setName] = useState("")
    const [banner, setBanner] = useState("")
    const [hallOfFame, setHallOfFame] = useState([])
    const [recentGames, setRecentGames] = useState({})

    const [finalists, setFinalists] = useState([])

    const { id } = useParams()



    const placeholderHallOfFame = [
        {
            name: "???",
            points: "???",
            rank: "1",
            profileImg:""
        },
        {
            name: "???",
            points: "???",
            rank: "2",
            profileImg:""
        },
        {
            name: "???",
            points: "???",
            rank: "3",
            profileImg:""
        }
    ]
    
    useEffect(() => {

          firebase.database().ref(`classes/${id}`).once('value',(snap)=>{
            if(snap.exists()){
                const data = snap.val()

                //set class attributes
                setName(data.name)
                setBanner(data.banner)


                //set members
                const members = data.members || []
                
                members.forEach(member => {
                    const memberObj = {
                        points: member.points,
                        id: member.id,
                        data: member.data
                    }
                    setMembers(prevState => [...prevState, memberObj])
                })

                //set hall of fame
                const hallOfFame = []

                members.forEach(member => {
                    const userObj = {
                        points: member.points,
                        id: member.id,
                        name: "",
                        profileImg: ""
                    }
                    firebase.database().ref(`users/${member.id}`).once('value',(snap)=>{
                        if(snap.exists()){
                            const data = snap.val()
                            userObj.name = data.UserName
                            userObj.profileImg = data.imageUrl
                            
                        }
                    });
                    hallOfFame.push(userObj)
                    hallOfFame.sort(function(a, b){return b.points-a.points})
                })

                if(hallOfFame.length === 0){
                    setHallOfFame(placeholderHallOfFame)
                }
                else{
                    setHallOfFame(hallOfFame)
                    console.log(hallOfFame)
                }

                //set recent games

                const recentGames = data.recent_games == "" || undefined ? [] : data.recent_games

                setRecentGames(recentGames)

            }
            else{
                window.location.href = "/"
            }
          });
    }, [])

    const handleSetFinalists = (finalists) => {
        setFinalists(finalists)
    }


    return (
        <div className='classroom__main__div'>
            <div className="classroom__members">
                <Typography variant='h4' className="classroom__members__title">{Translations[userLanguage].classroom.members.title}({members.length})</Typography>
                <div>
                </div>
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
                                    <img onClick={()=>window.location = `/profiles/${member.id}`} src={member.data.imageUrl || undefined} alt="member" className="classroom__members__member__img"/>
                                    <Typography style={{minWidth:'150px'}} variant='subtitle1' className="classroom__members__member__name">{member.data.UserName || undefined}</Typography>
                                    <div style={{display:'flex', width:'100%', justifyContent:'flex-end'}}>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

                <div id='classroom__dashboard' className="classroom__dashboard">
                <div style={{position:'sticky', top:'0', backgroundColor:'white', width:'100%', zIndex:'11'}}>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <Typography variant='h4' className="classroom__dashboard__title">{name}</Typography>
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
                                        <Avatar src={member.profileImg} alt="member" className="classroom__hall__of__fame__card__img"/>
                                        <Typography variant='h4' className="classroom__hall__of__fame__card__name">{member.name}</Typography>
                                        <Typography variant='h6' className="classroom__hall__of__fame__card__points">{member.points} pts</Typography>
                                    </div>
                                )
                            })
                        }
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
                                Object.keys(recentGames || []).map((key) => {
                                    const game = recentGames[key]
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
                                        const playerObject = {
                                            name: "",
                                            profileImg: null,
                                        }
                                        firebase.database().ref(`users/${finalist.playerID}`).on('value',(snap)=>{
                                            const playerData = snap.val()

                                            playerObject.name = playerData.UserName
                                            playerObject.profileImg = playerData.imageUrl
                                        })
                                        return (
                                            <div className="classroom__finalists__card" key={index}>
                                                <Avatar src={playerObject.profileImg || null} alt="member" className="classroom__finalists__card__img"/>
                                                <div style={{display:'flex', flexDirection:'column'}}>
                                                    <Typography variant='sub1' className="classroom__finalists__card__name">{playerObject.name}</Typography>
                                                    <Typography variant='sub1' className="classroom__finalists__card__name">{`" ${finalist.player}"`}</Typography>
                                                </div>
                                                {finalist.position === '1' && <img draggable='false' src={FirstPlaceIcon} alt="first-badge" className="classroom__finalist__card__rank"/>}
                                                {finalist.position === '2' && <img draggable='false' src={SecondPlaceIcon} alt="second-badge" className="classroom__finalist__card__rank"/>}
                                                {finalist.position === '3' && <img draggable='false' src={ThirdPlaceIcon} alt="third-badge" className="classroom__finalist__card__rank"/>}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}
