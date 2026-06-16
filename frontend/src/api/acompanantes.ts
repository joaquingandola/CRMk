import api from "./axios"
import type { AcompananteResponseDTO } from "../types"

export const crearAcompanante = (data: {
    nombre : string
    apellido : string
    dni : number
    fechaNacimiento? : string
}) => api.post<AcompananteResponseDTO>(`/api/v1/acompanantes`, data)

export const modificarAcompanante = (id : number, data: {
    nombre: string
    apellido: string
    dni: number
    fechaNacimiento?: string
}) => api.put<AcompananteResponseDTO>(`/api/v1/acompanantes/${id}`, data)

export const eliminarAcompanante = ( id: number) =>
    api.delete(`/api/v1/acompanantes/${id}`)