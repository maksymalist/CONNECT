import React, { useEffect} from 'react'
import { Button } from '@material-ui/core'
import HomePageImg from '../img/HomePageImg.svg'


export default function HomePage() {
    useEffect(() => {
        document.getElementById('navMargin').setAttribute('style', `margin: ${document.querySelector('nav').offsetHeight }`)
        return () => {
            //cleanup
        }
    }, [])
    return (
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
            <br /><br /><br /><br /><br />
            <h3 className='homepage-text-small'>CONNECT! helps you learn fast <br /> and together.</h3>
            <br /><br /><br /><br /><br />
            <Button style={{zIndex:'2'}} id='button-start' variant="contained" color="primary" size='large' onClick={()=>{window.location = '/play'}}>Start Learning ➞</Button>
            <br></br><br></br><br></br><br></br>
            <img className='imgDiv' id='home-page-img' alt='home-page-img' src={HomePageImg}/>
            </div>
        </div>
        <div className="newdiv2">
            <h1>About</h1>
            <div>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio consectetur voluptate laudantium, facilis dolorum quibusdam saepe sit, </p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio consectetur voluptate laudantium, facilis dolorum quibusdam saepe sit,  cumque ab rem? Ratione aut non cumque.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio consectetur voluptate laudantium, facilis dolorum quibusdam saepe sit, </p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio consectetur voluptate laudantium, facilis dolorum quibusdam saepe sit, </p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio consectetur voluptate laudantium, facilis dolorum quibusdam saepe sit</p>
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
                <div className='about-card'>Card1</div>
                <div className='about-card'>Card2</div>
                <div className='about-card'>Card3</div>
            </div>
        </div>
        </div>
    )
}

