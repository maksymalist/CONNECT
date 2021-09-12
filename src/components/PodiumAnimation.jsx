import { Button } from '@material-ui/core'
import React, { useEffect, useRef } from 'react'
import '../style/podiumAnimation.css'
import Translations from '../translations/translations.json'

function PodiumAnimation({ maxPodiumPlayers, podium }) {


    //podium place refs
    const firstPlacePodium = useRef(null)
    const secondPlacePodium = useRef(null)
    const thirdPlacePodium = useRef(null)

    //podium names refs
    const firstPlaceName = useRef(null)
    const secondPlaceName = useRef(null)
    const thirdPlaceName = useRef(null)
    const otherPlaceName = useRef(null)

    useEffect(() => {
        handlePodiumAnimation()
        return () => {
            if(firstPlacePodium.current === null) return
            firstPlacePodium.current.style.height = '1px'
            if(secondPlacePodium.current === null) return
            secondPlacePodium.current.style.height = '1px'
            if(thirdPlacePodium.current === null) return
            thirdPlacePodium.current.style.height = '1px'
    
            if(firstPlaceName.current === null) return
            firstPlaceName.current.style.opacity = '0'
            
            if(secondPlaceName.current === null) return
            secondPlaceName.current.style.opacity = '0'
            
            if(thirdPlaceName.current === null) return
            thirdPlaceName.current.style.opacity = '0'
            
            if(document.getElementsByClassName('other-places').length === 0) return
            for(var i = 0; i < document.getElementsByClassName('other-places').length; i++) {
                document.getElementsByClassName('other-places')[i].style.opacity = '0'
                document.getElementsByClassName('other-places')[i].style.color = '#fff'
            }
        }
    }, [])

    const handlePodiumAnimation = () => {
        if(firstPlacePodium.current === null) return
        firstPlacePodium.current.style.height = '300px'
        if(secondPlacePodium.current === null) return
        secondPlacePodium.current.style.height = '200px'
        if(thirdPlacePodium.current === null) return
        thirdPlacePodium.current.style.height = '150px'

        if(firstPlaceName.current === null) return
        firstPlaceName.current.style.opacity = '1'

        if(secondPlaceName.current === null) return
        secondPlaceName.current.style.opacity = '1'
        
        if(thirdPlaceName.current === null) return
        thirdPlaceName.current.style.opacity = '1'

        if(document.getElementsByClassName('other-places').length === 0) return
        for(var i = 0; i < document.getElementsByClassName('other-places').length; i++) {
            document.getElementsByClassName('other-places')[i].style.opacity = '1'
            document.getElementsByClassName('other-places')[i].style.color = '#6976EA'
        }
        
    }

    const otherPlaceStyle = {
        backgroundColor:'white', 
        padding:"15px", 
        color:'#fff', 
        width:'150px', 
        fontSize:'1.2rem',
        margin:'10px',
        opacity:'0',
        transition: 'all 5s cubic-bezier(0, 0.13, 1, -1.31)',
        border: '2px solid black',
        boxShadow: '10px 10px 0 #262626',
    }

    // const podium = [
    //     {
    //         player:'John Smith1',
    //         position:'1',
    //         time:'10s'
    //     },
    //     {
    //         player:'John Smith2',
    //         position:'2',
    //         time:'11s'
    //     },
    //     {
    //         player:'John Smith3',
    //         position:'3',
    //         time:'13s'
    //     },
    //     {
    //         player:'John Smith4',
    //         position:'4',
    //         time:'15s'
    //     },
    //     {
    //         player:'John Smith5',
    //         position:'5',
    //         time:'16s'
    //     },
    //     {
    //         player:'John Smith6',
    //         position:'6',
    //         time:'17s'
    //     },
    //     {
    //         player:'John Smith7',
    //         position:'7',
    //         time:'18s'
    //     },
    //     {
    //         player:'John Smith8',
    //         position:'8',
    //         time:'177s'
    //     },
    //     {
    //         player:'John Smith9',
    //         position:'9',
    //         time:'178s'
    //     },
    //     {
    //         player:'John Smith10',
    //         position:'10',
    //         time:'179s'
    //     },
    //     {
    //         player:'John Smith11',
    //         position:'11',
    //         time:'180s'
    //     },
    //     {
    //         player:'John Smith12',
    //         position:'12',
    //         time:'182s'
    //     },
    // ]

    return (
        <div>
                <div>
                    <div className='podium-place-container'>
                        <div id="secondplacepodium" ref={secondPlacePodium}>
                            {
                                podium.map((place, index) => {
                                    if(place.position === '2') {
                                        return <div id='second-place-name-div'><h1 id='second-place-name' ref={secondPlaceName}>{place.player}</h1></div>
                                    }
                                })
                            }
                        </div>
                        <div id="firstplacepodium" ref={firstPlacePodium}>
                            {
                                podium.map((place, index) => {
                                    if(place.position === '1') {
                                        return <div id='first-place-name-div'><h1 id='first-place-name' ref={firstPlaceName}>{place.player}</h1></div>
                                    }
                                })
                            }
                        </div>
                        <div id="thirdplacepodium" ref={thirdPlacePodium}>
                            {
                                podium.map((place, index) => {
                                    if(place.position === '3') {
                                        return <div id='third-place-name-div'><h1 id='third-place-name' ref={thirdPlaceName}>{place.player}</h1></div>
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div>
                        <div style={{display:'flex', width:'100vw', justifyContent:'center', alignItems:'center'}}>
                            <div style={{display:'flex', flexWrap:'wrap', width:'550px', height:'auto'}}>
                            {
                                podium.map((place, index) => {
                                    if(place.position > 3) {
                                        if(place.position <= maxPodiumPlayers){
                                            return <div className='other-places' style={otherPlaceStyle}>{place.position}th place {place.player}</div>
                                        }
                                    }
                                })
                            }
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{window.location = '/play'}}>{Translations[localStorage.getItem('connectLanguage')].gameended.button}</Button>
                    </div>
                </div>
        </div>
    )
}

export default PodiumAnimation
