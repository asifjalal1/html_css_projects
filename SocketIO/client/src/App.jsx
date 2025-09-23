import { useMemo, useEffect, useState } from 'react'
import { io } from 'socket.io-client'


function App() {
  const [count, setCount] = useState(0)
  const socket = useMemo(() => io('http://localhost:3000'), [])

  const handleCount = () => {
    socket.emit('send-count', Math.floor(Math.random() * 10))
    // socket.emit('send-count', {id: socket.id, count: Math.floor(Math.random() * 10)})
  }
  useEffect(() => {
    socket.on('connect', () => {
      console.log('client side', socket.id)
    })

    socket.on('count', (data) => {
      // if(data?.id !== socket.id){
      // }
      setCount(data.count)
    });

    return () => {
      socket.disconnect();
    }
  }, [])

  return (
    <>
      <h1>count: {count}</h1>
      <button onClick={handleCount}>Increment</button>
    </>
  )
}

export default App
