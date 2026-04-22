import api from "./axios"
import type { ClienteResponseDTO, ViajeResponseDTO,  CiudadResponseDTO, CiudadVisitadaDTO } from "../types"

export const getClientesEnViaje = () => 
    api.get<ClienteResponseDTO[]>('/api/v1/clientes/en-viaje')

export const getClientesActivos = () => 
    api.get<ClienteResponseDTO[]>('api/v1/clientes/activos')

export const getTodosLosViajes = () => 
    api.get<ViajeResponseDTO[]>('/api/v1/viajes')

/* esto por ahora no
export const getViajesPorEstado = (estado : string) => 
    api.get<ViajeResponseDTO[]>(`/api/v1/viajes?estado=${estado}`)
*/
export const getCiudadesMasVisitadas = () => 
    api.get<CiudadVisitadaDTO[]>('/api/v1/destinos/dashboard/ciudades-visitadas')