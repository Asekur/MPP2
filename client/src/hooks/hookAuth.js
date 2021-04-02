import { useState, useCallback, useEffect } from 'react'
const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(false)
    const [userId, setUserId] = useState(null)

    const signin = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setUserId(id)

        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken
        }))
    }, [])

    const signout = useCallback((jwtToken) => {
        setToken(null)
        setUserId(null)

        localStorage.removeItem(storageName)
    }, [])

    //есть ли вообще данные в localStorage
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            signin(data.token, data.userId)
        }
        setReady(true)
    }, [signin])

    return { signin, signout, token, userId, ready }
}