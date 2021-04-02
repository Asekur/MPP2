import { useState, useCallback } from 'react'

//работа с запросами на сервер в формате хуков
export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-type'] = 'application/json'
            }
            const response = await fetch(url, { method, body, headers })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Something do wrong')
            }
            setLoading(false)
            return data

        } catch (err) {
            setLoading(false)
            setError(err.message)
            throw err
        }
    }, [])

    //функция для очистки ошибок
    const clearError = useCallback(() => setError(null), [])

    return { loading, request, error, clearError }
}