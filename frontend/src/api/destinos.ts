import api from "./axios"

import type {
    DestinoCreateDTO,
    DestinoResponseDTO,
} from '../types'

export const crearDestino = (data: DestinoCreateDTO) =>
    api.post<DestinoResponseDTO>(`api/v1/destinos`, data)

export const actualizarDestino = (id: number, data: DestinoCreateDTO) =>
    api.put<DestinoResponseDTO>(`api/v1/destinos/${id}`, data)

export const eliminarDestino = (id: number) =>
    api.delete(`api/v1/destinos/${id}`)
