import React,{ useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { io } from 'socket.io-client'

import firebase from "firebase"
import "firebase/database";


import '../style/style.css'
import loading from '../img/loading.gif'
import Button from '@material-ui/core/Button'

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
          keys.map((key, index)=>{
            var k = keys[index]

            let newQuiz = document.createElement('div')
            newQuiz.id = `newQuiz${index}`
            newQuiz.className = 'newQuiz'
            document.getElementById('feed').appendChild(newQuiz)

            ReactDOM.render(
                <div>
                    <div style={{margin:'100px'}}/>
                    <h1>{data[k].name}</h1>
                    <h2>Game Code: {k}</h2>
                    <div>
                        <h1>Questions</h1>
                        <div>
                        <h3>{data[k].q0.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q0.answer}>{data[k].q0.answer}</h3>
                        <Button id={(data[k].name)+'q1'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q0.answer, (data[k].name)+'q1')}}>REVEAL ANSWER</Button>
                        </div>
                        <h3>{data[k].q1.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q1.answer}>{data[k].q1.answer}</h3>
                        <Button id={(data[k].name)+'q2'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q1.answer, (data[k].name)+'q2')}}>REVEAL ANSWER</Button>
                        <div>
                        <h3>{data[k].q2.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q2.answer}>{data[k].q2.answer}</h3>
                        <Button id={(data[k].name)+'q3'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q2.answer, (data[k].name)+'q3')}}>REVEAL ANSWER</Button>
                        </div>
                        <div>
                        <h3>{data[k].q3.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q3.answer}>{data[k].q3.answer}</h3>
                        <Button id={(data[k].name)+'q4'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q3.answer, (data[k].name)+'q4')}}>REVEAL ANSWER</Button>
                        </div>
                        <div>
                        <h3>{data[k].q4.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q4.answer}>{data[k].q4.answer}</h3>
                        <Button id={(data[k].name)+'q5'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q4.answer, (data[k].name)+'q5')}}>REVEAL ANSWER</Button>
                        </div>
                        <div>
                        <h3>{data[k].q5.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q5.answer}>{data[k].q5.answer}</h3>
                        <Button id={(data[k].name)+'q6'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q5.answer, (data[k].name)+'q6')}}>REVEAL ANSWER</Button>
                        </div>
                    </div>
                </div>,
                document.getElementById(`newQuiz${index}`)
            )
            document.getElementById('loading').setAttribute('hidden', 'true')
          })
          /*for (var i = 0 ; i < keys.length; i++){
              var k = keys[i]

              let newQuiz = document.createElement('div')
              newQuiz.id = `newQuiz${i}`
              newQuiz.className = 'newQuiz'
              document.getElementById('feed').appendChild(newQuiz)

              ReactDOM.render(
                  <div>
                      <div style={{margin:'100px'}}/>
                      <h1>{JSON.stringify(data[k].name)}</h1>
                      <h2>Game Code: {k}</h2>
                      <div>
                          <h1>Questions(6)</h1>
                          <div>
                          <h3>{data[k].q0.question}</h3>
                          <h3 hidden id={data[k].q0.answer}>{data[k].q0.answer}</h3>
                          <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q0.answer)}}>REVEAL ANSWER</Button>
                          </div>
                          <h3>{data[k].q1.question}</h3>
                          <h3 hidden id={data[k].q1.answer}>{data[k].q1.answer}</h3>
                          <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q1.answer)}}>REVEAL ANSWER</Button>
                          <div>
                          <h3>{data[k].q2.question}</h3>
                          <h3 hidden id={data[k].q2.answer}>{data[k].q2.answer}</h3>
                          <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q2.answer)}}>REVEAL ANSWER</Button>
                          </div>
                          <div>
                          <h3>{data[k].q3.question}</h3>
                          <h3 hidden id={data[k].q3.answer}>{data[k].q3.answer}</h3>
                          <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q3.answer)}}>REVEAL ANSWER</Button>
                          </div>
                          <div>
                          <h3>{data[k].q4.question}</h3>
                          <h3 hidden id={data[k].q4.answer}>{data[k].q4.answer}</h3>
                          <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q4.answer)}}>REVEAL ANSWER</Button>
                          </div>
                          <div>
                          <h3>{data[k].q5.question}</h3>
                          <h3 hidden id={data[k].q5.answer}>{data[k].q5.answer}</h3>
                          <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q5.answer)}}>REVEAL ANSWER</Button>
                          </div>
                      </div>
                  </div>,
                  document.getElementById(`newQuiz${i}`)
              )
              document.getElementById('loading').setAttribute('hidden', 'true')


    
    
          }*/
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    }

    const revealAns = (ans, button) =>{
        document.getElementById(ans).style.visibility = "visible"
        document.getElementById(button).style.visibility = "hidden"
        console.log(ans)
    }
    const hideAns = (ans) =>{
        document.getElementById(ans).setAttribute('hidden', true)
    }



    return (
        <div style={{marginTop:'60vh'}} id='feed'>
            <h1 id='loading'>Loading<img alt='load-animation' src={loading}></img></h1>
        </div>
    )
}
