import api from "./axios"
import type { AcompananteResponseDTO } from "../types"

export const crearAcompanante = (data: {
    nombre : string
    apellido : string
    dni : number
    fechaNacimiento? : string
}) => api.post<AcompananteResponseDTO>('/api/v1/acompanantes', data)