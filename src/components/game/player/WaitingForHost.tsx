//@ts-nocheck
import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material'
import useTranslations from '../../../hooks/useTranslations'
const WaitingForHost = ({ steps, activeStep }) => {
  const translations = useTranslations()
  return (
    <div>
      <Typography
        variant="h3"
        style={{ color: 'white', marginTop: '100px', marginBottom: '50px' }}
      >
        <b>
          {translations.waitforhost.title} <br /> {translations.waitforhost.sub}
        </b>
      </Typography>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Stepper
          id="stepRef"
          style={{
            width: '100%',
            maxWidth: '800px',
            margin: '20px',
            overflowX: 'auto',
            backgroundColor: 'white',
            padding: '15px',
          }}
          activeStep={activeStep}
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
      <div>
        <CircularProgress
          size={200}
          thickness={3}
          style={{ color: 'white', margin: '100px' }}
        />
      </div>
    </div>
  )
}
export default WaitingForHost
