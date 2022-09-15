import { CircularProgress } from '@mui/material'

type Props = {}

const LoadingScreen = (props: Props) => {
  return (
    <div
      style={{
        width: '100%',
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress thickness={4} size={200} style={{ color: 'white' }} />
    </div>
  )
}

export default LoadingScreen
