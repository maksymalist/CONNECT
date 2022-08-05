//@ts-nocheck
import React, { useState, useEffect } from 'react'

import '../../style/style.css'
import {
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  Chip,
  Button,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material'

import TagIcon from '@mui/icons-material/Tag'

import { useQuery, gql } from '@apollo/client'

import banner from '../../img/banner.svg'
import Wave from '../../img/WhiteBigStripe.svg'

import QuizCard from '../cards/QuizCard'
import useTranslations from '../../hooks/useTranslations'

const GET_QUIZZES = gql`
  query allQuizzes {
    allQuizzes {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
      __typename
    }
  }
`

const GET_MULTIS = gql`
  query allMultis {
    allMultis {
      _id
      name
      coverImg
      tags
      userID
      userName
      userProfilePic
      __typename
    }
  }
`

export default function BrowseQuizzes() {
  const [gameMode, setGameMode] = useState('normal')
  const translations = useTranslations()

  const [currentTag, setCurrentTag] = useState('')
  const [tags, setTags] = useState([])

  const { loading, error, data: quizzes } = useQuery(GET_QUIZZES)
  const { loading: multisLoading, data: multis } = useQuery(GET_MULTIS)

  const changeGamemode = (event) => {
    event.preventDefault()
    setGameMode(event.target.value)
  }

  return (
    <>
      <div
        style={{
          width: '100vw',
          height: 'auto',
          minHeight: '200px',
          display: 'flex',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
          marginTop: '50px',
          backgroundColor: '#fff',
          padding: '10px',
        }}
      >
        <div>
          <div>
            <Typography
              variant="h2"
              style={{
                marginBottom: '20px',
                marginTop: '50px',
                fontWeight: 'bold',
                textAlign: 'left',
              }}
            >
              {translations.quizzes.bar.discover}
            </Typography>
          </div>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'left',
                marginLeft: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Chip
                label={translations.quizzes.bar.tags.history}
                style={{ backgroundColor: '#FCC73E' }}
                className="mui-chip"
                color="primary"
              />
              <Chip
                label={translations.quizzes.bar.tags.geography}
                style={{ backgroundColor: '#1594DB' }}
                className="mui-chip"
                color="primary"
              />
              <Chip
                label={translations.quizzes.bar.tags.science}
                style={{ backgroundColor: '#1BB978' }}
                className="mui-chip"
                color="primary"
              />
              <Chip
                label={translations.quizzes.bar.tags.sports}
                style={{ backgroundColor: '#DC014E' }}
                className="mui-chip"
                color="primary"
              />
            </div>
          </div>
        </div>
        <div>
          <img
            src={banner}
            alt="banner"
            style={{
              maxWidth: '400px',
              maxHeight: '400px',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>
      <img
        src={Wave}
        alt="wave"
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
      <br></br>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            backgroundColor: 'white',
            alignItems: 'center',
            border: '2px solid black',
            boxShadow: '10px 10px 0 #262626',
            padding: '20px',
            width: '90%',
          }}
        >
          <Typography variant="h4" style={{ marginRight: '20px' }}>
            <b>{translations.quizzes.bar.title}</b>
          </Typography>
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">
              {translations.quizzes.bar.gamemode.title}
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={gameMode}
              onChange={changeGamemode}
              label="GameMode"
              style={{ width: '180px', height: '40px' }}
              required
            >
              <MenuItem value="normal">
                ⚡️ {translations.quizzes.bar.gamemode.normal}
              </MenuItem>
              <MenuItem value="multi">
                🥳 {translations.quizzes.bar.gamemode.multi}
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" style={{ marginLeft: '10px' }}>
            <TextField
              variant="outlined"
              label={translations.quizzes.bar.tagsearch}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TagIcon style={{ color: 'c4c4c4', opacity: '90%' }} />
                  </InputAdornment>
                ),
              }}
              value={currentTag}
              onChange={(e) => {
                setCurrentTag(e.target.value)
              }}
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setTags([
                ...tags,
                {
                  tag: currentTag,
                  seed: Math.floor(Math.random() * (3 + 1)),
                },
              ])
              setCurrentTag('')
            }}
          >
            {translations.quizzes.bar.add}
          </Button>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag.tag}
            className="mui-chip"
            onDelete={() => {
              setTags(tags.filter((t) => t.tag !== tag.tag))
            }}
            color="primary"
            style={{
              backgroundColor: ['#FCC73E', '#1594DB', '#1BB978', '#DC014E'][
                tag.seed
              ],
              color: 'white',
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: '30px' }} id="feed">
        {gameMode === 'normal' ? (
          loading ? (
            <CircularProgress
              size={150}
              thickness={3}
              style={{ margin: '100px', color: 'white' }}
            />
          ) : (
            quizzes?.allQuizzes?.map((quiz, index) => {
              return <QuizCard key={quiz.id + index} data={quiz} tags={tags} />
            })
          )
        ) : null}
        {gameMode === 'multi' ? (
          multisLoading ? (
            <CircularProgress
              size={150}
              thickness={3}
              style={{ margin: '100px', color: 'white' }}
            />
          ) : (
            multis?.allMultis?.map((quiz, index) => {
              return <QuizCard key={quiz.id + index} data={quiz} tags={tags} />
            })
          )
        ) : null}
      </div>
    </>
  )
}
