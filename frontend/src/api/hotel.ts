import api from "./axios"
import type {
    HotelResponseDTO, 
    HotelCreateDTO,
    HotelUpdateDTO,
    HotelVisitadoDTO
} from "../types"

export const buscarHotel = (nombre: string) => {
    api.get<HotelResponseDTO[]>(`/api/v1/destinos/{idDestino}/hoteles/buscar}`)
}

export const eliminarHotel = (id: number) => {
    api.delete(`/api/v1/destinos/{idDestino}/hoteles/${id}`)
}

export const crearHotel = (data : HotelCreateDTO) => {
    api.post<HotelResponseDTO>(`/api/v1/destinos/{idDestino}/hoteles`, data)
}

export const modificarHotel = (id: number, data : HotelUpdateDTO) => {
    api.put<HotelResponseDTO>(`/api/v1/destinos/{idDestino}/hoteles/${id}`, data)
}