import React, { useEffect} from 'react'
import { Button, Divider } from '@material-ui/core'
import { Star, School, Group, PartyMode } from '@material-ui/icons'
import HomePageImage from '../img/HomePageImage1.svg'
import BigStripe from '../img/BigStripe.svg'
import HostVideo from '../video/hostvideogif.gif'
import JoinVideo from '../video/joinvideogf.gif'
import GameRoomVideo from '../video/gameroomvideogf.gif'



export default function HomePage() {
    useEffect(() => {
        if(JSON.parse(localStorage.getItem('user')) == null) window.location = '/login'
        document.getElementById('root').style.padding = '0px'
        return () => {
            document.getElementById('root').style.padding = '10px'
        }
    }, [])

    const Gears = () => (
        <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="gears">
        <g id="large" opacity="0.7">
        <path id="large-gear" d="M12.195 28.1985C12.3352 28.5764 12.4865 28.9486 12.6826 29.3256C12.8787 29.7027 13.0965 30.0403 13.3254 30.3721L11.9371 33.4188C11.8129 33.6948 11.9132 34.023 12.1731 34.1978L16.3867 36.8814C16.5788 37.007 16.8192 37.0087 17.0188 36.9049C17.0854 36.8703 17.1461 36.8246 17.19 36.7736L19.3747 34.2285C20.1821 34.3722 20.9934 34.4152 21.8141 34.3406L23.7639 37.0603C23.9356 37.3091 24.2723 37.3876 24.5495 37.2434L28.9855 34.9364C29.2627 34.7922 29.3918 34.4715 29.2867 34.188L28.1797 31.0301C28.712 30.401 29.1369 29.701 29.4887 28.9685L32.8268 28.6414C32.9049 28.629 32.9772 28.6055 33.0437 28.5709C33.2323 28.4728 33.3689 28.275 33.3764 28.0456L33.5988 23.055C33.6161 22.7361 33.3939 22.4712 33.0966 22.4145L29.805 21.8016C29.6648 21.4236 29.5078 21.0404 29.3175 20.6744C29.1271 20.3084 28.9035 19.9598 28.6746 19.628L30.0629 16.5812C30.1871 16.3053 30.0869 15.977 29.8269 15.8022L25.6134 13.1186C25.4213 12.9931 25.1808 12.9913 24.9812 13.0951C24.9147 13.1297 24.8539 13.1754 24.81 13.2265L22.6254 15.7715C21.818 15.6279 21.0066 15.5849 20.186 15.6594L18.2362 12.9398C18.0645 12.6909 17.7278 12.6124 17.4505 12.7566L13.0146 15.0636C12.7373 15.2078 12.6082 15.5285 12.7134 15.812L13.8203 18.97C13.2881 19.599 12.8631 20.2991 12.5114 21.0315L9.17323 21.3586C9.09516 21.371 9.02285 21.3946 8.95631 21.4292C8.76778 21.5272 8.63116 21.7251 8.62363 21.9544L8.4012 26.945C8.39501 27.2582 8.60618 27.5288 8.9034 27.5856L12.195 28.1985V28.1985ZM15.377 28.9529C15.1539 28.6321 15.0217 28.405 14.9006 28.1721C14.7795 27.9392 14.6748 27.6837 14.535 27.3337L14.0385 25.9998L12.6478 25.7368L10.9656 25.4282L11.044 23.6826L12.7466 23.5157L14.1422 23.3816L14.7481 22.1085C15.0404 21.5056 15.3567 21.003 15.7133 20.578L16.6408 19.4897L16.1665 18.1443L15.6097 16.5318L17.1623 15.7244L18.1516 17.1119L18.9808 18.2728L20.4043 18.1383C20.985 18.0899 21.5613 18.1143 22.1779 18.2163L23.5908 18.4677L24.5183 17.3795L25.6326 16.0815L27.1068 17.0196L26.3935 18.5741L25.8102 19.8637L26.6172 21.0361C26.8293 21.3626 26.9841 21.6061 27.0995 21.8279C27.2148 22.0497 27.3253 22.3163 27.465 22.6663L27.9615 24.0002L29.3522 24.2632L31.0344 24.5719L30.956 26.3175L29.2534 26.4843L27.8578 26.6184L27.2519 27.8916C26.9596 28.4945 26.6434 28.9971 26.2867 29.4221L25.3592 30.5103L25.8335 31.8557L26.3903 33.4682L24.8488 34.2699L23.8595 32.8823L23.0303 31.7215L21.6068 31.856C21.0261 31.9043 20.4499 31.88 19.8332 31.778L18.4203 31.5265L17.4928 32.6147L16.3785 33.9128L14.9044 32.9746L15.6008 31.4149L16.184 30.1253L15.377 28.9529ZM23.307 29.436C25.7579 28.1614 26.7106 25.1439 25.436 22.693C24.1614 20.2422 21.1439 19.2894 18.693 20.5641C16.2422 21.8387 15.2894 24.8561 16.5641 27.307C17.8387 29.7579 20.8561 30.7106 23.307 29.436ZM19.8465 22.782C21.0664 22.1476 22.5836 22.6266 23.218 23.8465C23.8524 25.0664 23.3734 26.5836 22.1535 27.218C20.9336 27.8524 19.4165 27.3734 18.782 26.1535C18.1476 24.9336 18.6266 23.4165 19.8465 22.782Z" fill="#4E54C8"/>
        </g>
        <g id="small" opacity="0.9">
        <path id="small-gear" d="M45.9024 51.8237C46.5388 51.6084 47.1662 51.3743 47.8038 51.0659C48.4415 50.7575 49.0144 50.4109 49.5783 50.0456L54.5869 52.506C55.0406 52.7262 55.5923 52.575 55.896 52.1504L60.5707 45.2607C60.7892 44.9467 60.8037 44.5463 60.6404 44.2087C60.586 44.0962 60.5128 43.9927 60.43 43.9171L56.2956 40.1544C56.5741 38.8163 56.685 37.4667 56.6005 36.0958L61.2257 32.9792C61.6486 32.7052 61.7956 32.148 61.5688 31.6792L57.9401 24.1774C57.7133 23.7085 57.1853 23.478 56.7079 23.6394L51.3933 25.3308C50.371 24.4135 49.2254 23.6717 48.0222 23.0503L47.6388 17.4732C47.6219 17.3426 47.5862 17.221 47.5318 17.1085C47.3775 16.7896 47.0545 16.5524 46.6728 16.5288L38.3694 15.9167C37.8389 15.8725 37.3869 16.23 37.278 16.7224L36.0976 22.1764C35.4612 22.3917 34.8151 22.6348 34.1962 22.9342C33.5773 23.2335 32.9856 23.5892 32.4217 23.9545L27.4131 21.4941C26.9594 21.2739 26.4077 21.425 26.104 21.8497L21.4293 28.7394C21.2108 29.0533 21.1963 29.4538 21.3596 29.7914C21.414 29.9039 21.4872 30.0074 21.57 30.083L25.7044 33.8457C25.4259 35.1838 25.315 36.5334 25.3995 37.9042L20.7743 41.0209C20.3514 41.2949 20.2044 41.852 20.4312 42.3209L24.0599 49.8227C24.2866 50.2916 24.8147 50.5221 25.2921 50.3606L30.6067 48.6693C31.629 49.5865 32.7746 50.3283 33.9778 50.9498L34.3612 56.5268C34.3781 56.6575 34.4138 56.7791 34.4682 56.8916C34.6225 57.2104 34.9455 57.4476 35.3272 57.4713L43.6306 58.0833C44.1521 58.1088 44.6131 57.7701 44.722 57.2777L45.9024 51.8237ZM47.3132 46.559C46.7681 46.9152 46.3833 47.1245 45.9895 47.315C45.5956 47.5055 45.1649 47.6676 44.575 47.8835L42.3288 48.646L41.8233 50.9502L41.2277 53.7377L38.3234 53.5226L38.1278 50.6781L37.972 48.3466L35.8802 47.2756C34.89 46.7594 34.0679 46.2082 33.3772 45.5935L31.6091 43.9956L29.3447 44.7207L26.6314 45.5703L25.3614 42.9446L27.7209 41.3636L29.695 40.0384L29.5398 37.6604C29.4873 36.6906 29.5558 35.7318 29.7556 34.7095L30.2429 32.3678L28.4748 30.7699L26.3662 28.8507L28.0005 26.4402L30.5556 27.7037L32.6758 28.7378L34.6681 27.4501C35.2222 27.1127 35.6354 26.8665 36.0105 26.6851C36.3856 26.5036 36.8351 26.3325 37.425 26.1166L39.6712 25.3541L40.1767 23.0499L40.7723 20.2624L43.6766 20.4775L43.8722 23.322L44.028 25.6535L46.1198 26.7245C47.11 27.2406 47.9321 27.7918 48.6228 28.4066L50.3909 30.0045L52.6553 29.2794L55.3686 28.4298L56.6295 31.0367L54.2701 32.6177L52.2959 33.9429L52.4511 36.321C52.5036 37.2907 52.4351 38.2495 52.2354 39.2719L51.7481 41.6135L53.5161 43.2114L55.6247 45.1306L53.9904 47.5411L51.4256 46.3055L49.3054 45.2713L47.3132 46.559ZM48.5018 33.3713C46.4969 29.2266 41.516 27.4934 37.3713 29.4982C33.2266 31.5031 31.4933 36.484 33.4982 40.6287C35.5031 44.7735 40.484 46.5067 44.6287 44.5018C48.7734 42.497 50.5067 37.5161 48.5018 33.3713ZM37.2491 38.8144C36.2512 36.7514 37.1227 34.247 39.1856 33.2491C41.2486 32.2512 43.753 33.1227 44.7509 35.1857C45.7488 37.2487 44.8773 39.753 42.8144 40.7509C40.7514 41.7488 38.247 40.8774 37.2491 38.8144Z" fill="#646ECB"/>
        </g>
        </g>
        </svg>
    )

    return (
        <>
        <div>
        <div id='homePageDivPurple' className='homePageDivPurple'>
            <br></br>
            <br></br>
            <div className='homepage-text'>
                <svg width="340" height="90" viewBox="0 0 340 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 5C0 2.23858 2.23858 0 5 0H335C337.761 0 340 2.23858 340 5V84.4737C340 87.2351 337.761 89.4737 335 89.4737H5C2.23858 89.4737 0 87.2351 0 84.4737V5Z" fill="#6C63FF"/>
                    <path d="M85.0702 69.9543C60.1881 70.7168 63.7294 24.62 87.7728 24.62C112.003 24.62 110.605 69.1918 85.0702 69.9543ZM87.4932 60.2497C93.4575 60.3884 95.4145 49.3667 95.694 44.3064C95.9736 39.2462 93.8302 32.1757 88.1455 32.3143C82.4609 32.453 79.3856 43.2667 79.5719 47.4258C79.8515 52.7633 81.4358 60.1111 87.4932 60.2497ZM122.44 64.5475L109.3 64.1316L112.468 22.8177L120.39 22.6097L134.555 44.5837L138.562 21.6393L146.949 23.5802L142.756 60.5963L134.368 61.4281L120.39 38.8996L122.44 64.5475ZM165.215 64.5475L152.075 64.1316L155.243 22.8177L163.165 22.6097L177.33 44.5837L181.337 21.6393L189.724 23.5802L185.531 60.5963L177.143 61.4281L163.165 38.8996L165.215 64.5475ZM221.596 70.093L196.154 69.7464L194.85 28.0859L219.732 25.6597L219.452 33.4927H205.194V46.7326L217.122 45.9701L217.775 53.8724L205.66 53.7338L205.008 63.785L222.528 63.2998L221.596 70.093ZM264.557 67.3202C248.714 80.4214 227.839 76.2623 227.653 51.7929C227.467 30.7893 249.367 22.4711 262.413 31.9677L258.499 38.2757C253.374 34.3939 239.209 37.8598 238.09 51.5849C237.065 63.7157 248.994 71.1328 257.754 60.8043L264.557 67.3202ZM299.224 24.4813L298.385 32.6609L288.787 32.9382L289.439 67.4589L275.367 69.1918L277.976 33.2155L267.819 33.4927L268.098 25.8677L299.224 24.4813ZM305.841 52.2088V12.9744L319.074 12.2812L312.737 52.0008L305.841 52.2088ZM308.077 67.3202C301.554 67.3202 301.833 57.6849 308.73 57.6849C315.533 57.6849 318.887 67.3202 308.077 67.3202Z" fill="white"/>
                    <path d="M58.7665 60.9058C63.8091 62.3473 64.3484 66.3862 54.8564 72.3045C49.6152 75.5723 43.2216 77.9872 37.521 77.0212C31.8205 76.0551 26.7525 72.9248 23.1805 68.1635C19.6085 63.4022 17.7536 57.3046 17.9317 50.9095C18.1099 44.5145 20.3101 38.2177 24.1575 33.0921C28.0049 27.9666 33.2615 24.3293 39.0315 22.8001C44.8015 21.2709 51.1081 20.8902 55.4027 25.0165C58.7665 27.8308 60.0929 32.0078 60.0929 32.0078L47.0362 42.0759L36.6012 42.0759L36.6012 60.9058C46.0924 62.721 53.7238 59.4643 58.7665 60.9058Z" fill="white"/>
                    <path d="M48.2502 52.1915C55.2081 61.4342 41.5958 62.6329 36.8785 61.4342C32.1612 60.2355 29.6042 54.1539 31.1673 47.8506C32.7304 41.5473 37.8217 37.4092 42.539 38.608C47.2563 39.8067 49.8133 45.8882 48.2502 52.1915Z" fill="#6C63FF"/>
                    <path d="M42.9473 41.5103C48.4611 41.5103 47.2724 43.0163 50.1052 40.3516V45.6147H43.6808L42.9473 41.5103Z" fill="#6C63FF"/>
                    <path d="M45.1458 40.3516C45.1458 40.3516 46.714 42.3667 49.9263 40.9463L51.8947 45.6147H44.7368L45.1458 40.3516Z" fill="#6C63FF"/>
                    <path d="M58.3355 27.5923C55.1701 21.2553 66.7662 27.6167 66.7662 27.6167L66.6937 34.2739L56.2197 34.8898C56.2197 34.8898 61.5008 33.9293 58.3355 27.5923Z" fill="#6C63FF"/>
                </svg>
            </div>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <div id='homePageDivWhite' className='homePageDivWhite'>
            <br></br><br></br><br></br><br></br>
            <h2 className='homepage-text-medium'>Take learning to the <br/> next level.</h2>
            <br /><br /><br /><br /><br /><br /><br />
            <h3 className='homepage-text-small'>CONNECT! helps you learn faster <br /> and together.</h3>
            <br /><br /><br /><br /><br />
            <Button style={{zIndex:'2'}} id='button-start' variant="contained" color="primary" size='large' onClick={()=>{window.location = '/play'}}>Start Learning ➞</Button>
            <br></br><br></br><br></br><br></br><br></br><br></br>
            <div className='imgDiv'>
                <img draggable='false' src={HomePageImage} id='home-page-img' alt='home-page-img'/>
            </div>
            </div>
        </div>
        <br></br><br></br><br></br><br></br>
        <div className="newdiv2">
        <img id='big-stripe-top' style={{minWidth:'1980px', transform:'rotate(-180deg)'}} src={BigStripe} alt='big-stripe'/>
            <div className='purpleAboutDiv'>
                <h1 className='aboutText' style={{color:'white', zIndex:'230'}}>About</h1>
                <div className='aboutText' style={{color:'white', zIndex:'230'}}>
                    <p className='aboutText' style={{color:'white', zIndex:'230'}}>CONNECT!’s goal is to make class learning easier and more fun for students and teachers from all around the world.</p>
                    <p className='aboutText' style={{color:'white', zIndex:'230'}}>For us, learning is the key to a better future and it is our priority to make learning more accessible and more engaging for everyone, everywhere.</p>
                </div>
                <img id='big-stripe' style={{minWidth:'1980px'}} src={BigStripe} alt='big-stripe'/>
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
                <h1>How it Works <Gears/></h1>
                <div className='howitworks-div'>
                    <div style={{display:'flex', alignItems:'center', flexWrap:'wrap', justifyContent:'space-around', width:'70%', margin:'100px', minWidth:'350px'}}>
                        <div className='iphone-div'>
                            <img draggable='false' id='background-video' src={HostVideo} alt='host-video'/>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', height:'725px'}}>
                            <p style={{width:'380px', textAlign:'start'}}>Select your desired game mode</p>
                            <p style={{width:'380px', textAlign:'start'}}>Type in the room name / code or click the “GENERATE NAME” button</p>
                            <p style={{width:'380px', textAlign:'start'}}>Go to <a style={{color:'#6976EA', margin:'0'}} href='/browsequizzes/normal'>Browse Quizzes</a> and find a game you would like to host copy that game’s code (don't forget to include the “-” at the start of the code)</p>
                            <p style={{width:'380px', textAlign:'start'}}>Enter the amount of players you want in your room Starter plan users max out at 8 users whilst Classroom plan users get 40 users</p>
                            <p style={{width:'380px', textAlign:'start'}}>Specify if the user nicknames should be friendly</p>
                            <p style={{width:'380px', textAlign:'start'}}>Start the game!!!</p>
                        </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', flexWrap:'wrap', justifyContent:'space-around', width:'70%', margin:'100px', minWidth:'350px'}}>
                    <div style={{display:'flex', flexDirection:'column', height:'725px'}}>
                            <p style={{width:'380px', textAlign:'start'}}>Enter your nickname</p>
                            <p style={{width:'380px', textAlign:'start'}}>Enter a valid room name / code</p>
                            <p style={{width:'380px', textAlign:'start'}}>Join your game and (hopefully) have fun !!!</p>
                        </div>
                        <div className='iphone-div'>
                            <img draggable='false' style={{width:'320px', height:'220px'}} src={JoinVideo} alt='join-video'/>
                        </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', flexWrap:'wrap', justifyContent:'space-around', width:'70%', margin:'100px', minWidth:'350px'}}>
                        <div className='iphone-div'>
                            <img draggable='false' style={{width:'320px', height:'400px'}} src={GameRoomVideo} alt='game-video'/>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', height:'725px'}}>
                            <p style={{width:'380px', textAlign:'start'}}>Match the question cards with their answers</p>
                            <p style={{width:'380px', textAlign:'start'}}>If you match the wrong cards 5s will be added to your timer</p>
                            <p style={{width:'380px', textAlign:'start'}}>The goal is to get the lowest time to have the highest place on the podium and have fun whilst learning!!!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        </>
    )
}

