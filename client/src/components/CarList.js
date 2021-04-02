import React, { useContext } from 'react'
import { useHttp } from '../hooks/hookHTTP'
import { ContextAuth } from '../context/ContextAuth'

export const CarList = ({ cars, userId }) => {
    const { loading, request } = useHttp()
    const authorize = useContext(ContextAuth)

    if (!cars) {
        return <p className="center">No items</p>
    }

    const deleteHandler = async name => {
        try {
            const data = await request('/create', 'DELETE', { name: name }, {
                Authorization: `Bearer ${authorize.token}`
            })
            console.log(data)
            document.getElementById(name).remove()
        } catch (err) {
            console.log(err)
        }
    }

    if (userId === "606213c42d8f9e28904e06ce") {
        return (
            <div className="carlist">
                {cars.map(car => {
                    return (
                        <div className="row" id={car.name} key={car.name}>
                            <div className="col">
                                <div className="card">
                                    <div className="card-image">
                                        <p className="carPrice">{car.price}</p>
                                        <img src={`http://localhost:8000/${car.photo}`} alt="Car"></img>
                                        <button
                                            className="btn-floating halfway-fab waves-effect waves-light deep-orange accent-2"
                                            disabled={loading}
                                            onClick={event => deleteHandler(car.name)}
                                        >
                                            <i className="material-icons">clear</i>
                                        </button>
                                    </div>
                                    <div className="card-content">
                                        <div className="contentCard">
                                            <p className="carName">{car.name}</p>
                                            <p className="carColor">{car.color}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    } else {
        return (
            <div className="carlist">
                {cars.map(car => {
                    return (
                        <div className="row" key={car.name}>
                            <div className="col">
                                <div className="card">
                                    <div className="card-image">
                                        <p className="carPrice">{car.price}</p>
                                        <img src={`http://localhost:8000/${car.photo}`} alt="Car"></img>
                                    </div>
                                    <div className="card-content">
                                        <div className="contentCard">
                                            <p className="carName">{car.name}</p>
                                            <p className="carColor">{car.color}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}