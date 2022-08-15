//@ts-nocheck
import { CircularProgress, Typography } from '@mui/material'
import '../../../style/style.css'
import useTranslations from '../../../hooks/useTranslations'
export default function FinishedScreen({ match, user }) {
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
      <Typography variant="h3" style={{ color: 'white', marginBottom: '10px' }}>
        <b>{translations.finishedscreen.title}</b>
      </Typography>
      <Typography variant="h3" style={{ color: 'white', marginBottom: '10px' }}>
        <b>{translations.finishedscreen.sub}</b>
      </Typography>
      <CircularProgress
        thickness={5}
        size={150}
        style={{ color: 'white', marginTop: '100px' }}
      />
    </div>
  )
}
