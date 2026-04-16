import api from "./axios"

import type {
    ViajeResponseDTO, 
    ViajeCreateDTO,
    EstadoConcretoViaje,
    EstadoViajeResponseDTO
} from '../types'

export const getViajesPorCliente = (idCliente: number) => 
    api.get<ViajeResponseDTO[]>(`api/v1/viajes/cliente/${idCliente}`)

export const getViajePorId = (id : number) =>
    api.get<ViajeResponseDTO>(`api/v1/viajes/${id}`)

export const crearViaje = (data: ViajeCreateDTO) =>
    api.post<ViajeResponseDTO>(`api/v1/viajes`, data)

export const cambiarEstadoViaje = (id: number, nuevo: EstadoConcretoViaje) => 
    api.patch<ViajeResponseDTO>(`api/v1/viajes/${id}/estado?nuevo=${nuevo}`)

export const historialEstados = (id: number) =>
    api.get<EstadoViajeResponseDTO[]>(`api/v1/viajes/${id}/estados`)