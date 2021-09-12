import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'

//firebase
import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";


//styles
import '../style/style.css'
import loading from '../img/loading.gif'


export default function MemberRoom() {
    var [isActive, setIsActive] = useState("inactive")
    
    useEffect(() => {
        console.log('asdafafafa')
        firebase.database().ref(`users/${JSON.parse(localStorage.getItem('user')).profileObj.googleId}/planStatus`).on('value',(snap)=>{
            console.log('asdafafafa')
            if(snap.exists()){
                alert('qwodhvoyicwdvuiopwdbuivdwsdwzvscbgvvb')
              var planStatus = snap.val()
              setIsActive(isActive = planStatus)
              if(isActive == "active"){
                  ReactDOM.render(
                      <div><h1 style={{margin:'300px'}}>You Are A Classroom Member</h1></div>,
                      document.getElementById('mainDiv')
                  )
              }
              else{
                ReactDOM.render(
                    <div><h1 style={{margin:'300px'}}>You Are Not A Classroom Member</h1></div>,
                    document.getElementById('mainDiv')
                )
              }
            }
            else{
                alert('niigigiefifgeifei')
                console.log('asdafafafa')
            }
          });
        return () => {
            //cleanup
        }
    }, [])
    return (
        <div id='mainDiv'>
            <h1 id='loading'>Loading<img alt='load-animation' src={loading}></img></h1>
        </div>
    )
}
