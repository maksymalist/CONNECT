//@ts-nocheck
import React, { useState } from 'react'
//material ui
import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material'
import '../../../style/style.css'
import useTranslations from '../../../hooks/useTranslations'
export default function FinishedScreen({ match, user, steps }) {
  const translations = useTranslations()
  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginTop: '100px' }}>
        <Typography
          variant="h3"
          style={{ color: 'white', marginBottom: '10px' }}
        >
          <b>{translations.finishedscreen.title}</b>
        </Typography>
        <Typography variant="h3" style={{ color: 'white' }}>
          <b>{translations.finishedscreen.sub}</b>
        </Typography>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'center',
          marginTop: '50px',
          marginBottom: '50px',
        }}
      >
        <Stepper
          style={{
            width: '100%',
            maxWidth: '800px',
            margin: '20px',
            overflowX: 'auto',
            backgroundColor: 'white',
            padding: '15px',
          }}
          activeStep={steps.length}
        >
          {steps.map((step, index) => {
            return (
              <Step key={index}>
                <StepLabel>{step}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </div>
      <CircularProgress thickness={5} size={150} style={{ color: 'white' }} />
      <div>
        <nav style={{ height: '50px', backgroundColor: 'white' }}>
          <div
            style={{
              float: 'left',
              color: 'black',
              marginLeft: '10px',
              marginTop: '-10px',
            }}
          >
            <h2>{user}</h2>
          </div>
        </nav>
      </div>
    </div>
  )
}
