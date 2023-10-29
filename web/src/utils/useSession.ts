import { createContext } from 'react'
import { User } from '../api/interfaces'

// @ts-expect-error -- gotta feed it undefined but it will be overwritten almost inmediatly
export const SessionContext = createContext<User>(undefined)
