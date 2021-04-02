import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../hooks/hookPostHTTP'
import { ContextAuth } from '../context/ContextAuth'
import AttachFileIcon from '@material-ui/icons/AttachFile';

export const Create = () => {
    const history = useHistory()
    const authorize = useContext(ContextAuth)
    const { loading, request } = useHttp()
    const [name, setName] = useState()
    const [color, setColor] = useState()
    const [price, setPrice] = useState()
    const [photo, setPhoto] = useState()

    //активные поля
    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const pressHandler = async event => {
        try {
            const data = await request('/create/generate', 'POST', { name: name, color: color, price: price, photo: photo }, {
                Authorization: `Bearer ${authorize.token}`
            })
            console.log(data)
            history.push(`/catalog`)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="createPageRow">
            <div className="row">
                <div className="col s6 offset-s3">
                    <div className="card">
                        <div className="card-content white-text">
                            <span className="card-title">ADD CAR</span>
                            <div>
                                <div className="input-field">
                                    <input
                                        placeholder="Enter name"
                                        id="name"
                                        type="text"
                                        value={name}
                                        className="orange-input"
                                        autocomplete="off"
                                        onChange={e => setName(e.target.value)}
                                    />
                                    <label htmlFor="create">Name</label>
                                </div>
                                <div className="input-field">
                                    <input
                                        placeholder="Enter color"
                                        id="color"
                                        type="text"
                                        value={color}
                                        className="orange-input"
                                        autocomplete="off"
                                        onChange={e => setColor(e.target.value)}
                                    />
                                    <label htmlFor="create">Color</label>
                                </div>
                                <div className="input-field">
                                    <input
                                        placeholder="Enter price"
                                        id="price"
                                        type="text"
                                        value={price}
                                        className="orange-input"
                                        autocomplete="off"
                                        onChange={e => setPrice(e.target.value)}
                                    />
                                    <label htmlFor="create">Price</label>
                                </div>
                                <div className="form-file">
                                    <label className="label">
                                        <i><AttachFileIcon /></i>
                                        <input
                                            required type="file"
                                            id="photo"
                                            name="photo"
                                            onChange={e => setPhoto(e.target.files[0])}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="card-action">
                                <button
                                    className="btn deep-orange accent-2"
                                    disabled={loading}
                                    onClick={pressHandler}
                                >Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}