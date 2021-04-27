import { createContext } from 'react'
import {Socket} from "socket.io-client";

function noop() { }

export const ContextAuth = createContext({
    token: null,
    userId: null,
    signin: noop,
    signout: noop,
    isAuthorize: false,
    socket: Socket
})