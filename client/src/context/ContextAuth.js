import { createContext } from 'react'

function noop() { }

export const ContextAuth = createContext({
    token: null,
    userId: null,
    signin: noop,
    signout: noop,
    isAuthorize: false
})