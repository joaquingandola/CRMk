import api from "./axios"
import type { AerolineaResponseDTO, CiudadResponseDTO } from "../types"

export const buscarCiudades = (nombre : string) => 
    api.get<CiudadResponseDTO[]>(`/api/v1/destinos/ciudades/buscar?nombre=${nombre}`)
