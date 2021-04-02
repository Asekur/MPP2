import React, { useCallback, useState, useContext, useEffect } from 'react'
import { useHttp } from '../hooks/hookHTTP'
import { Loader } from '../components/Loader'
import { CarList } from '../components/CarList'
import { ContextAuth } from '../context/ContextAuth'

export const Catalog = () => {
    const [cars, setCars] = useState()
    const { loading, request } = useHttp()
    const { token, userId } = useContext(ContextAuth)

    const fetchCars = useCallback(async () => {
        try {
            const fetched = await request('/create', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setCars(fetched)
        } catch (err) { }
    }, [token, request])

    useEffect(() => {
        fetchCars()
    }, [fetchCars])

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            {!loading && <CarList cars={cars} userId={userId} />}
        </div>
    )
}