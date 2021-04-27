import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { useMessage } from './hooks/hookMsg'
import { ContextAuth } from './context/ContextAuth'
import { Header } from './components/Header'
import { Loader } from './components/Loader'
import {io} from "socket.io-client";
import 'materialize-css'

const storageName = 'userData'
const angelina = 'socket';

function App() {
  const [socket, setSocket] = useState(false)
  const [isAuthorize, setIsAuthorize] = useState(false)
  const [ready, setIsReady] = useState(false)
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const routes = useRoutes(isAuthorize)

  const message = useMessage()

  const signin = (jwtToken, id) => {
    setToken(jwtToken)
    setUserId(id)
    setIsAuthorize(true)
    localStorage.setItem(storageName, JSON.stringify({
        userId: id, token: jwtToken
    }))
  }

  const signout = () => {
    setToken(null)
    setUserId(null)
    setIsAuthorize(false)
    localStorage.removeItem(storageName)
  }

    useEffect(() => {
      if (!ready) {
        //инициализация сокета
          const socket = io('')
          setSocket(socket)

          //восстановление авторизации
          const userData = JSON.parse(localStorage.getItem(storageName))
          if (userData) {
            signin(userData.token, userData.userId)
          }

          socket.on('resultauth', (data) => {
            const jwt = data.token
            const userId = data.userId
            if (jwt && userId) {
              signin(jwt, userId)
            } else {
              message(data.message)
            }
          })

          //проинициализировался ли сокет
          setIsReady(true)
      }
  }, [angelina])

  if (!ready) {
    return <Loader />
  }
  return (
    <ContextAuth.Provider value={{
      token, signin, signout, userId, isAuthorize, socket
    }}>
      <Router>
        {isAuthorize && <Header userId={userId} />}
        <div className="container">
          {routes}
        </div>
      </Router>
    </ContextAuth.Provider>
  )

}

export default App
