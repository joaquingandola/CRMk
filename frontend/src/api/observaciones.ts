import api from "./axios"
import type { ObservacionCreateDTO, ObservacionResponseDTO } from "../types"

export const listarObservacionesPorCliente = (idCliente: number) => 
    api.get<ObservacionResponseDTO[]>(`api/v1/clientes/${idCliente}/observaciones`)

export const crearObservacion = (idCliente:number, data: ObservacionCreateDTO) =>
    api.post<ObservacionResponseDTO>(`api/v1/clientes/${idCliente}/observaciones`, data)

export const eliminarObservacion = (idObservacion: number) =>
    api.delete<void>(`api/v1/observaciones/${idObservacion}`)