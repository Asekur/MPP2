import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Catalog } from './pages/Catalog'
import { Home } from './pages/Home'
import { Authorize } from './pages/Authorize'
import { Create } from './pages/Create'

export const useRoutes = (isAuthorize) => {
    if (isAuthorize) {
        return (
            <Switch>
                <Route path="/catalog" exact>
                    <Catalog />
                </Route>
                <Route path="/home" exact>
                    <Home />
                </Route>
                <Route path="/create" exact>
                    <Create />
                </Route>
                <Redirect to="/home" />
            </Switch >
        )
    }
    return (
        <Switch>
            <Route path="/" exact>
                <Authorize />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}