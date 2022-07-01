//@ts-nocheck
import { Button, Divider, Typography } from '@mui/material'
import { useState } from 'react'
import Confetti from 'react-confetti'
import { Link } from 'react-router-dom'
import useTranslations from '../../hooks/useTranslations'
//icon
import DiscordIcon from '../../img/DiscordIcon.svg'
const FinishedTutorial = () => {
  const translations = useTranslations()
  return (
    <>
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: '#1BB978',
            color: 'white',
            padding: '20px',
            border: '2px solid black',
            boxShadow: '10px 10px 0 #262626',
            margin: '15px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography variant="h4">
            <b>{translations.tutorial.tutorialcompleted.title}</b>
          </Typography>
          <br />
        </div>
        <div
          style={{
            margin: '15px',
            marginTop: '50px',
            maxWidth: '600px',
          }}
        >
          <br />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              width: '100%',
              maxWidth: '800px',
              justifyContent: 'center',
            }}
          >
            <Link to="/quizzes">
              <Button
                variant="contained"
                color="error"
                size="large"
                style={{
                  minWidth: '250px',
                  margin: '10px',
                  padding: '10px',
                  fontSize: '1.5rem',
                }}
              >
                {translations.tutorial.tutorialcompleted.button1}
              </Button>
            </Link>
            <Link to="/newquiz">
              <Button
                variant="contained"
                color="warning"
                size="large"
                style={{
                  minWidth: '250px',
                  margin: '10px',
                  padding: '10px',
                  fontSize: '1.5rem',
                }}
              >
                {translations.tutorial.tutorialcompleted.button2}
              </Button>
            </Link>
            <Link to="/play">
              <Button
                variant="contained"
                color="primary"
                size="large"
                style={{
                  minWidth: '250px',
                  margin: '10px',
                  padding: '10px',
                  fontSize: '1.5rem',
                }}
              >
                {translations.tutorial.tutorialcompleted.button3}
              </Button>
            </Link>
            <Button
              variant="contained"
              color="action"
              size="large"
              style={{
                minWidth: '250px',
                margin: '10px',
                padding: '10px',
                fontSize: '1.5rem',
              }}
              startIcon={<img src={DiscordIcon} width={36} height={36} />}
              onClick={() =>
                window.open('https://discord.gg/WSBtsD66yc', '_blank')
              }
            >
              {translations.tutorial.tutorialcompleted.button4}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
export default FinishedTutorial
