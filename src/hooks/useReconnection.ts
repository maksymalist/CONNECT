import { toast } from 'react-toastify'
import socket from '../socket-io'

type ReconnectionStatus = 'error' | 'success' | 'already-in-room' | 'no-room'

const checkConnection = (room: string, name: string, id: string) => {
  socket.emit('check-room-connection', {
    room: room,
    name: name,
    id: id,
  })
}

const handleReconnection = (data: any) => {
  const status: ReconnectionStatus = data.status

  if (status === 'success') {
    toast.success(`✨ Reconnected ✨`)
  }
}

export const useReconnection = () => {
  return [checkConnection, handleReconnection]
}
