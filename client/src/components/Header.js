import React, { useContext } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { ContextAuth } from '../context/ContextAuth'

export const Header = ({ userId }) => {
    const history = useHistory()
    const auth = useContext(ContextAuth)
    const signoutHandler = event => {
        event.preventDefault()
        auth.signout()
        history.push('/')
    }

    //определение пользователя
    if (userId === "606213c42d8f9e28904e06ce") {
        return (
            <nav>
                <div class="nav">
                    <ul id="nav-mobile" class="right">
                        <li><NavLink to="/home">Home</NavLink></li>
                        <li><NavLink to="/catalog">Catalog</NavLink></li>
                        <li><NavLink to="/create">New</NavLink></li>
                        <li><a href="/" onClick={signoutHandler}>Sign Out</a></li>
                    </ul>
                </div>
            </nav>
        )
    } else {
        return (
            <nav>
                <div class="nav">
                    <ul id="nav-mobile" class="right">
                        <li><NavLink to="/home">Home</NavLink></li>
                        <li><NavLink to="/catalog">Catalog</NavLink></li>
                        <li><a href="/" onClick={signoutHandler}>Sign Out</a></li>
                    </ul>
                </div>
            </nav>
        )
    }
}