import {createContext, useState, useEffect, type ReactNode} from 'react'
import { getMe } from '../api/usuarios'
import type { UsuarioResponseDTO } from '../types'
import { data } from 'react-router-dom'


interface AuthContextType {
    token: string | null
    usuario: UsuarioResponseDTO | null
    isAuth: boolean
    isAdmin: boolean
    login: (token: string) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: {children: ReactNode}) {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem('token')
    )
    const [usuario, setUsuario] = useState<UsuarioResponseDTO | null > (null)

    useEffect(() => {
        if(token) {
            getMe()
                .then(({data}) => setUsuario(data))
                .catch(() => {
                    //token invalido o expirado
                    localStorage.removeItem('token')
                    setToken(null)
                })
        } else {
            setUsuario(null)
        }
    }, [token])

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUsuario(null)
    }

    return (
        <AuthContext.Provider value={{
            token, 
            usuario,
            isAuth: !!token,
            isAdmin: usuario?.tipoRol === 'ADMIN',
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
)
}