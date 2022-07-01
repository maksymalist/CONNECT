//@ts-nocheck
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import '../../style/viewQuizStyles.css'
import { Divider, Typography, Button, Chip } from '@mui/material'
import Placeholder from '../../img/quizCoverPlaceholder.svg'
import { useLocation } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { CircularProgress } from '@mui/material'
import useTranslations from '../../hooks/useTranslations'
const GET_QUIZ_DETAILS = gql`
  query multi($id: ID!) {
    multi(id: $id) {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
      steps
      description
      plays
    }
  }
`
function ViewMultiQuiz() {
  const [ansIsShown, setAnsIsShown] = useState(false)
  const { mode, code } = useParams()
  const translations = useTranslations()
  const search = useLocation().search
  const classid = new URLSearchParams(search).get('classid')
  const { loading, error, data } = useQuery(GET_QUIZ_DETAILS, {
    variables: { id: code },
  })
  useEffect(() => {
    Object.keys(
      document.getElementsByClassName('view__quiz__content__question')
    ).map((el, index) => {
      if (
        document.getElementsByClassName('view__quiz__content__question')[
          index
        ] !== undefined
      )
        document
          .getElementsByClassName('view__quiz__content__question')
          [index].remove()
    })
  }, [])
  const handleShowAnswers = () => {
    setAnsIsShown(true)
  }
  const handleHideAnswers = () => {
    setAnsIsShown(false)
  }
  const handleUserProfile = (userID) => {
    const id = userID.replace('user:', '')
    window.location.href = `/profiles/${id}`
  }
  return (
    <div>
      {loading ? (
        <CircularProgress
          size={150}
          thickness={3}
          style={{ color: 'white', margin: '100px' }}
        />
      ) : (
        <div className="view__quiz__flex">
          <div className="view__quiz__content">
            <img
              style={{ width: '100%', height: '400px' }}
              src={data.multi.coverImg || Placeholder}
              alt="quiz"
              className="view__quiz__image"
            />
            <div style={{ textAlign: 'left', padding: '10px' }}>
              <Typography variant="h4" component="h4">
                {data.multi.name}
              </Typography>
              <br />
              <Typography variant="sub1">
                ✨ {data.multi.plays} {translations.multiquiz.plays} ✨
              </Typography>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <br />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: '30px',
                  }}
                >
                  <Link
                    to={`/play?gamecode=${code}&classid=${classid}&mode=multi`}
                  >
                    <Button variant="contained" color="primary">
                      {translations.multiquiz.play}
                    </Button>
                  </Link>
                  <Link to={`/practice/multi/${code}`}>
                    <Button
                      variant="contained"
                      color="info"
                      style={{ marginLeft: '20px' }}
                    >
                      {translations.multiquiz.practice}
                    </Button>
                  </Link>
                </div>
              </div>
              <div
                style={{
                  textAlign: 'left',
                  marginBottom: '20px',
                  marginTop: '20px',
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    data.multi.description !== '' ? data.multi.description : '',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <img
                  style={{
                    width: '30px',
                    height: '30px',
                    marginRight: '10px',
                    borderRadius: '50%',
                  }}
                  draggable="false"
                  src={data.multi.userProfilePic}
                  alt="quiz-img"
                  onClick={() => {
                    handleUserProfile(data.multi.userID)
                  }}
                />
                <h3>
                  {translations.multiquiz.by}{' '}
                  {data.multi.userName || 'undefined'}
                </h3>
              </div>
              <div>
                {data.multi.tags == undefined ? null : (
                  <div>
                    <br />
                    {data.multi.tags.map((tag, index) => {
                      return (
                        <Chip
                          style={{ margin: '5px' }}
                          key={tag + index}
                          label={'#' + tag}
                          color="primary"
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="view__quiz__content__questions">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'sticky',
                top: '0',
                backgroundColor: 'white',
                padding: '10px',
                zIndex: '1',
                borderBottom: '1px solid #c4c4c4',
              }}
            >
              <Typography variant="h5" component="h5">
                {translations.multiquiz.steps}(
                {Object.keys(JSON.parse(data.multi.steps)).length})
              </Typography>
              {ansIsShown ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleHideAnswers()}
                >
                  {translations.multiquiz.hideanswers}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleShowAnswers()}
                >
                  {translations.multiquiz.showanswers}
                </Button>
              )}
            </div>
            {Object.keys(JSON.parse(data.multi.steps)).map((step, index) => {
              const questions = JSON.parse(data.multi.steps)[step]
              return (
                <div key={index}>
                  <Typography variant="h4" component="h4">
                    {step}
                  </Typography>
                  {Object.keys(questions).map((question, index) => {
                    const type =
                      questions[question].type === undefined
                        ? 'ques_ans'
                        : questions[question].type
                    return (
                      <div
                        key={index}
                        className="view__quiz__content__question"
                      >
                        {type === 'ques_ans' && (
                          <Typography variant="h5" component="h5">
                            {index + 1}. {questions[question].question}
                          </Typography>
                        )}
                        {type === 'ques_img' && (
                          <>
                            <Typography variant="h5" component="h5">
                              {index + 1}.
                            </Typography>
                            <br />
                            <img
                              style={{
                                width: '100%',
                                maxWidth: '200px',
                                height: '150px',
                              }}
                              src={questions[question].question}
                              alt="quiz"
                            />
                          </>
                        )}
                        {ansIsShown ? (
                          <div style={{ width: '100%' }}>
                            <br />
                            <Divider light />
                            <br />
                            <Typography variant="h6" component="h6">
                              {questions[question].answer}
                            </Typography>
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
export default ViewMultiQuiz
