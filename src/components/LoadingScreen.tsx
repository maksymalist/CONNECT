import { CircularProgress } from '@mui/material'

type Props = {}

const LoadingScreen = (props: Props) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress thickness={4} size={200} />
    </div>
  )
}

export default LoadingScreen
