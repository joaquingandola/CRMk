import api from "./axios"
import type { UsuarioResponseDTO } from "../types"

export const getMe = () => 
    api.get<UsuarioResponseDTO>('api/v1/usuarios/me')

export const getUsuarios = () => 
    api.get<UsuarioResponseDTO[]>('api/v1/usuarios')

export const registrarAgente = (data: { username: string; email: string; password: string}) => 
    api.post('auth/register',data) 

export const desactivarUsuario = (id : number) => 
    api.patch(`/api/v1/usuarios/${id}/desactivar`)