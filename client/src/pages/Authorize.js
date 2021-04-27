import React, { useContext, useEffect, useState } from 'react'
import { ContextAuth } from '../context/ContextAuth'

export const Authorize = () => {
    const authorize = useContext(ContextAuth)

    const [form, setForm] = useState({
        login: '', password: ''
    })

    //активные поля
    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    //обновление формы
    const changeHandler = event => {
        //разворачивание формы
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            authorize.socket.emit('reg', {...form})
        } catch (err) { }
    }

    const loginHandler = async () => {
        try {
            authorize.socket.emit('login', {...form})
        } catch (err) { }
    }

    return (
        <div className="authorize">
            <div className="row">
                <div className="col s6 offset-s3">
                    <div className="card">
                        <div className="card-content white-text">
                            <span className="card-title">AUTHORIZE</span>
                            <div>

                                <div className="input-field">
                                    <input
                                        placeholder="Enter login"
                                        id="login"
                                        type="text"
                                        name="login"
                                        className="orange-input"
                                        autocomplete="off"
                                        value={form.login}
                                        onChange={changeHandler}
                                    />
                                    <label htmlFor="login">Login</label>
                                </div>

                                <div className="input-field">
                                    <input
                                        placeholder="Enter password"
                                        id="password"
                                        type="password"
                                        name="password"
                                        className="orange-input"
                                        autocomplete="off"
                                        value={form.password}
                                        onChange={changeHandler}
                                    />
                                    <label htmlFor="password">Password</label>
                                </div>

                            </div>
                        </div>
                        <div className="card-action">
                            <button
                                className="btn deep-orange accent-2"
                                style={{ marginRight: 10 }}
                                onClick={loginHandler}
                            >Sign In</button>
                            <button
                                className="btn grey darken-4"
                                onClick={registerHandler}
                            >Sign up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}