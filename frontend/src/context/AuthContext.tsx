import {createContext, useState, type ReactNode} from 'react'

interface AuthContextType {
    token: string | null
    isAuth: boolean
    login: (token: string) => void
    logout: () => void
}

