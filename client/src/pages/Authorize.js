import React, { useContext, useEffect, useState } from 'react'
import { useMessage } from '../hooks/hookMsg'
import { ContextAuth } from '../context/ContextAuth'

require('isomorphic-fetch');

export const Authorize = () => {
    const authorize = useContext(ContextAuth)
    const message = useMessage()

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
        const query = `
                    mutation($qLogin: String!, $qPassword: String!) {
                        reg(login: $qLogin, password: $qPassword) {
                            token
                            userId
                            message
                        }
                    }
                `;
        const variables = { qLogin: form.login, qPassword: form.password };

        fetch('/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query,
                variables
            }),
        })
            .then(res => res.json())
            .then(res => {
                const data = res.data
                handleAuthResult(data, 'reg')
            });
    }

    const loginHandler = async () => {
        const query = `
                    query($qLogin: String!, $qPassword: String!) {
                        login(login: $qLogin, password: $qPassword) {
                            token
                            userId
                            message
                        }
                    }
                `;
        const variables = { qLogin: form.login, qPassword: form.password };
        fetch('/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query,
                variables
            }),
        })
            .then(res => res.json())
            .then(res => {
                const data = res.data
                handleAuthResult(data, 'login')
            });
    }

    const handleAuthResult = (data, path) => {
        if (JSON.stringify(data)) {
            let error = data[path].message
            if (error) {
                message(error)
            } else {
                let token = data[path].token
                let userId = data[path].userId
                if (token && userId) {
                    authorize.signin(token, userId)
                } else {
                    message('No jwt token received')
                }
            }
        } else {
            message('Invalid auth_result data')
        }
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