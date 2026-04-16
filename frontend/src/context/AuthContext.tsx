import {createContext, useState, type ReactNode} from 'react'

interface AuthContextType {
    token: string | null
    isAuth: boolean
    login: (token: string) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: {children: ReactNode}) {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem('token')
    )

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{token, isAuth: !!token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}