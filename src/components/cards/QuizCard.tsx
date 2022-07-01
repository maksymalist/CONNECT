//@ts-nocheck
import { Lock } from '@mui/icons-material'
import { Chip, Avatar, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import Placeholder from '../../img/quizCoverPlaceholder.png'
import useTranslations from '../../hooks/useTranslations'
import { Link } from 'react-router-dom'

const QuizCard = ({ data, isPrivate, tags, classID }) => {
  const translations = useTranslations()

  const getLink = (key, type, isPrivate, classID) => {
    if (classID) {
      if (isPrivate) {
        if (type === 'Quiz') {
          return `/quiz/normal/private/${key}?classid=${classID}`
        }
        if (type === 'Multi') {
          return `/quiz/multi/private/${key}?classid=${classID}`
        }
      } else {
        if (type === 'Quiz') {
          return `/quiz/normal/${key}?classid=${classID}`
        }
        if (type === 'Multi') {
          return `/quiz/multi/${key}?classid=${classID}`
        }
      }
    } else {
      if (isPrivate) {
        if (type === 'Quiz') {
          return `/quiz/normal/private/${key}`
        }
        if (type === 'Multi') {
          return `/quiz/multi/private/${key}`
        }
      } else {
        if (type === 'Quiz') {
          return `/quiz/normal/${key}`
        }
        if (type === 'Multi') {
          return `/quiz/multi/${key}`
        }
      }
    }
  }
  const link = getLink(data._id, data.__typename, isPrivate, classID)
  const tagsLength = tags ? tags.length : 0
  return (
    <>
      {tagsLength === 0 || tags.some((item) => data.tags.includes(item.tag)) ? (
        <Link to={link}>
          <div className="quiz__card">
            <img
              src={data.coverImg || Placeholder}
              className="quiz__card__image"
              alt=""
            />
            <div className="quiz__card__overlay">
              <div className="quiz__card__header">
                <img
                  className="quiz__card__thumb"
                  src={
                    data.userProfilePic || (
                      <Avatar style={{ width: '50px', height: '50px' }}>
                        {data.userName}
                      </Avatar>
                    )
                  }
                  alt=""
                />
                <div className="quiz__card__header-text">
                  <h3 className="quiz__card__title">
                    {data.name} {isPrivate ? '🔒' : null}
                  </h3>
                  <span className="quiz__card__status">
                    {translations.profile.quizzes.by} {data.userName}
                  </span>
                </div>
              </div>
              <div class="card__description">
                {data.tags == undefined
                  ? null
                  : data.tags.map((tag, index) => {
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
            </div>
          </div>
        </Link>
      ) : null}
    </>
  )
}
export default QuizCard
