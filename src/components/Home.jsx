import React, { useEffect} from 'react'
import { Button } from '@material-ui/core'
import { Star, School, Group, PartyMode } from '@material-ui/icons'
import HomePageImage from '../img/HomePageImage1.svg'
import BigStripe from '../img/BigStripe.svg'
import Footer from 'rc-footer';
import 'rc-footer/assets/index.css'
import zIndex from '@material-ui/core/styles/zIndex'
import Logo from '../img/logo.svg'


export default function HomePage() {
    useEffect(() => {
        document.getElementById('root').style.padding = '0px'
        return () => {
            document.getElementById('root').style.padding = '10px'
        }
    }, [])
    return (
        <>
        <div>
        <div id='homePageDivPurple' className='homePageDivPurple'>
            <br></br>
            <br></br>
            <h1 className='homepage-text'>CONNECT!</h1>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div id='homePageDivWhite' className='homePageDivWhite'>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <h2 className='homepage-text-medium'>Take learning to the <br/> next level.</h2>
            <br /><br /><br /><br /><br /><br /><br />
            <h3 className='homepage-text-small'>CONNECT! helps you learn fast <br /> and together.</h3>
            <br /><br /><br /><br /><br />
            <Button style={{zIndex:'2'}} id='button-start' variant="contained" color="primary" size='large' onClick={()=>{window.location = '/play'}}>Start Learning ➞</Button>
            <br></br><br></br><br></br><br></br>
            <img src={HomePageImage} className='imgDiv' id='home-page-img' alt='home-page-img'/>

            </div>
        </div>
        <div className="newdiv2">
            <h1 className='aboutText' style={{color:'white', zIndex:'230'}}>About</h1>
            <div className='aboutText' style={{color:'white', zIndex:'230'}}>
                <p className='aboutText' style={{color:'white', zIndex:'230'}}>CONNECT!’s goal is to make class learning easier and more fun for students and teachers from all around the world.</p>
                <p className='aboutText' style={{color:'white', zIndex:'230'}}>For us, learning is the key to forging a better future and it is our priority to make learning more accesible and more engaging for everyone, everywhere.</p>
            </div>
            <div id='aboutContainer'>
                <div className='about-card'>
                    <School color='primary' style={{width:'100px', height:'100px'}}/>
                    <h3>Learning</h3>
                    <Star color='primary'/><Star color='primary'/><Star color='primary'/><Star color='primary'/><Star color='primary'/>
                </div>
                <div className='about-card'>
                <Group color='primary' style={{width:'100px', height:'100px'}}/>
                    <h3>Collaboration</h3>
                    <Star color='primary'/><Star color='primary'/><Star color='primary'/><Star color='primary'/><Star color='primary'/>
                </div>
                <div className='about-card'>
                    <span style={{fontSize:'72px'}}>🎉</span>
                    <h3>Fun</h3>
                    <Star color='primary'/><Star color='primary'/><Star color='primary'/><Star color='primary'/><Star color='primary'/>
                </div>
            </div>
            <div classNam='howItWorks'>
                <img id='big-stripe' src={BigStripe} alt='big-stripe'/>
                <h1>How it Works</h1>
                <h3>(Insert Video)</h3>
            </div>
        </div>
        </div>
        <div>
        <Footer
        style={{maxWidth:'100%'}}
        theme='dark'
        columns={[
        {
            icon: (
                <img src={Logo} alt='logo'/>
            ),
            title: '',
            url: '',
            description: '知识创作与分享工具',
            openExternal: true,
        },
        ]}
        bottom="Copyright (c) 2021 CONNECT!"
        />
        </div>
        </>
    )
}

