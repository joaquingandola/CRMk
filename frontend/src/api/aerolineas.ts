import api from "./axios"
import type { AerolineaResponseDTO } from "../types"

export interface AerolineaCreateDTO {
    aerolinea: string
}

export const getAerolineas = () =>
    api.get<AerolineaResponseDTO[]>('/api/v1/aerolineas')

export const crearAerolinea = (data: AerolineaCreateDTO) =>
    api.post<AerolineaResponseDTO>('/api/v1/aerolineas', data)
