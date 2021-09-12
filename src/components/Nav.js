import '../App.css';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Menu, MenuItem, InputLabel, FormControl, Select } from '@material-ui/core';

//material-ui
import MenuIcon from '@material-ui/icons/Menu';

import axios from 'axios';

import logo from '../img/logo.svg'

//firebase
import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";

import Translations from '../translations/translations.json'

import { Add, QuestionAnswerRounded, FilterNoneRounded, TranslateSharp } from '@material-ui/icons'

export var ActiveUser = null
export var profilePic = null



function Nav({ isLoggedIn, customerId, plan }) {

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [anchorEl3, setAnchorEl3] = useState(null);

    const [currentUsername, setCurrentUsername] = useState(null);

    const [language, setLanguage] = useState('english');

    const navStyle = {
        color: "white"
    }
    function updateUsers(email, googleId, userName){
      firebase.database().ref(`users/${googleId}`).set({
        UserName: userName,
        email: email,
        planStatus: 'inactive',
        planDuration: 0,
        plan: 'Starter',
        clientSecret: 0,
        customerObj: 0,
        subscriptionObj: 0

  
      })
    }

    useEffect(() => {
      console.log(JSON.stringify(Translations))
      if(JSON.parse(localStorage.getItem('user')) === null) return
      setCurrentUsername(JSON.parse(localStorage.getItem('user')).profileObj.name)
      if(localStorage.getItem('connectLanguage') != null){
        setLanguage(localStorage.getItem('connectLanguage'))
      }
      else{
        setLanguage('english')
      }
    }, [])


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleClose3 = () => {
    setAnchorEl3(null);
  };

  const openCustomerPortal = async () => {

    if(customerId == undefined){
        toast.info(Translations[localStorage.getItem('connectLanguage')].alerts.buyplanseeinfo)
        return
    }
    setAnchorEl(null);

    const res = await axios.post('https://connect-now-backend.herokuapp.com/create-customer-portal-session', {customerId: customerId});

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

  const logOut = () => {
    localStorage.removeItem('user')
    window.location.reload()
  }

  const selectedColors = {backgroundColor:'#3f51b5', color:'white', fontWeight:'bold', borderRadius:'5px', margin:'2px'}
  const regularColors = {backgroundColor:'white', color:'black'}

  const handleSetLanguage = (lang) =>{
    setLanguage(lang)
    localStorage.setItem('connectLanguage', lang)
    window.location.reload()
  }

  return (
    <nav>
        <ul>
            <img 
              hidden 
              aria-controls="simple-menu" 
              aria-haspopup="true" 
              onClick={handleClick} 
              alt="profile-pic" 
              style={{
                borderRadius:'100px', 
                marginLeft:'-20px',
                margin:'5px',
              }} 
              className='liright' 
              height='40px' 
              width='40px' 
              id='profilePic'>
            </img>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              style={{width:'150px', marginTop:'30px', padding:'5px', display:'flex', alignItems:'center', marginRight:'10px'}}
            >
              <MenuItem style={{borderBottom:'1px solid grey', width:'150px'}} onClick={handleClose}>{Translations[localStorage.getItem('connectLanguage')].nav.profile.head}<br></br> {currentUsername}</MenuItem>
              <MenuItem onClick={()=>window.location = '/profile'}>{Translations[localStorage.getItem('connectLanguage')].nav.profile.account}</MenuItem>
              {
                plan === 'Classroom' && <MenuItem onClick={()=>window.location = '/classroom'}>{Translations[localStorage.getItem('connectLanguage')].nav.profile.class}</MenuItem>
              }
              <MenuItem onClick={openCustomerPortal}>{Translations[localStorage.getItem('connectLanguage')].nav.profile.subscription}</MenuItem>
              <MenuItem style={{backgroundColor:'rgb(220, 0, 78)', color:'white', fontWeight:'bold', borderRadius:'5px'}} onClick={logOut}>{Translations[localStorage.getItem('connectLanguage')].nav.profile.logout}</MenuItem>
            </Menu>
            <Add 
              style={{color:'white', width:'30px', height:'30px', marginTop:'10px', marginLeft:'10px'}} 
              className="liright nav-links" 
              aria-controls="simple-menu" 
              aria-haspopup="true" 
              onClick={handleClick2} 
            />
            <Menu
              id="simple-menu2"
              anchorEl={anchorEl2}
              keepMounted
              open={Boolean(anchorEl2)}
              onClose={handleClose2}
              style={{width:'150px', marginTop:'30px', padding:'5px', display:'flex', alignItems:'center', marginRight:'10px'}}
            >
              <MenuItem onClick={()=>{window.location = '/newquiz'}}><QuestionAnswerRounded style={{marginRight:'10px'}} color='primary'/> {Translations[localStorage.getItem('connectLanguage')].nav.add.normal}</MenuItem>
              <MenuItem onClick={()=>{window.location = '/new-multi-quiz'}}><FilterNoneRounded style={{marginRight:'10px'}} color='primary'/> {Translations[localStorage.getItem('connectLanguage')].nav.add.multi}</MenuItem>
            </Menu>
            <TranslateSharp 
              style={{color:'white', width:'30px', height:'30px', marginTop:'10px', marginLeft:'10px'}} 
              className="liright nav-links" 
              aria-controls="simple-menu" 
              aria-haspopup="true" 
              onClick={handleClick3}  
            />
            <Menu
              id="simple-menu3"
              anchorEl={anchorEl3}
              keepMounted
              open={Boolean(anchorEl3)}
              onClose={handleClose3}
              style={{width:'150px', marginTop:'30px', padding:'5px', display:'flex', alignItems:'center', marginRight:'10px'}}
            >
              <MenuItem style={
                language === 'english' ?
                selectedColors
                :
                regularColors
              }
              onClick={()=>{handleSetLanguage('english')}}>English</MenuItem>

              <MenuItem style={
                language === 'french' ?
                selectedColors
                :
                regularColors
              } 
              onClick={()=>{handleSetLanguage('french')}}>Français</MenuItem>
            </Menu>

            {isLoggedIn ?
              null
              :
              <Link to='/login'>
                <li className="liright nav-links">{Translations[localStorage.getItem('connectLanguage')].nav.login}</li>
              </Link>
            }
            <img id='home' onClick={()=>{window.location = '/'}} className="nav-links lileft" alt="connect-logo" width={50} height={50} src={logo}/>
            <Link to='/play'>
            <li className="nav-links lileft">{Translations[localStorage.getItem('connectLanguage')].nav.play}</li>
            </Link>
            <div className="dropdown lileft nav-links">
              <button className="dropbtn"><MenuIcon /></button>
                <div className="dropdown-content">
                  <a href="/play">{Translations[localStorage.getItem('connectLanguage')].nav.dropdown.play}</a>
                  <a href="/browsequizzes/normal">{Translations[localStorage.getItem('connectLanguage')].nav.dropdown.quizzes}</a>
                  <a href="/plans">{Translations[localStorage.getItem('connectLanguage')].nav.dropdown.plans}</a>
                  <a href="/login">{Translations[localStorage.getItem('connectLanguage')].nav.dropdown.login}</a>
                </div>
            </div>
            <Link style={navStyle} to='/browsequizzes/normal'>
              <li className="nav-links lileft">{Translations[localStorage.getItem('connectLanguage')].nav.quizzes}</li>
            </Link>
            <Link style={navStyle} to='/plans'>
              <li className="nav-links lileft">{Translations[localStorage.getItem('connectLanguage')].nav.plans}</li>
            </Link>
        </ul>
    </nav>

  );
}

export default Nav;