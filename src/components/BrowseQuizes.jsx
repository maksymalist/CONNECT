import React,{ useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { io } from 'socket.io-client'

import firebase from "firebase"
import "firebase/database";


import '../style/style.css'
import loading from '../img/loading.gif'

//globals

export default function BrowseQuizes() {

    useEffect(() => {
        GetQuizes()
        return () => {
            //cleanup
        }
    }, [])

    //styles
    const newQuizStyle = {backgroundColor:'white', borderRadius:'25px'}

    const GetQuizes = () => {

        var db = firebase.database().ref('quizes/')
        
        // Attach an asynchronous callback to read the data at our posts reference
        db.on("value", function(snapshot) {
          var data = snapshot.val();
          var keys = Object.keys(data);
          for (var i = 0 ; i < keys.length; i++){
              var k = keys[i]

              let newQuiz = document.createElement('div')
              newQuiz.id = `newQuiz${i}`
              newQuiz.className = 'newQuiz'
              document.getElementById('feed').appendChild(newQuiz)

              ReactDOM.render(
                  <div>
                      <h1>{JSON.stringify(data[k].name)}</h1>
                      <h2>Game Code: {k}</h2>
                      <div>
                          <h1>Questions</h1>
                          <h3>{JSON.stringify(data[k].q0)}</h3>
                          <h3>{JSON.stringify(data[k].q1)}</h3>
                          <h3>{JSON.stringify(data[k].q2)}</h3>
                          <h3>{JSON.stringify(data[k].q3)}</h3>
                          <h3>{JSON.stringify(data[k].q4)}</h3>
                          <h3>{JSON.stringify(data[k].q5)}</h3>
                      </div>
                  </div>,
                  document.getElementById(`newQuiz${i}`)
              )
              document.getElementById('loading').setAttribute('hidden', 'true')


    
    
          }
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    }



    return (
        <div id='feed'>
            <h1 id='loading'>Loading<img src={loading}></img></h1>
        </div>
    )
}
