import api from "./axios"
import type {
    HotelResponseDTO, 
    HotelCreateDTO,
    HotelUpdateDTO,
} from "../types"

export const buscarHoteles = (nombre: string) =>
    api.get<HotelResponseDTO[]>(`/api/v1/destinos/{idDestino}/hoteles` , {
        params: {nombre}
    })

export const eliminarHotel = (id: number) =>
    api.delete(`/api/v1/destinos/{idDestino}/hoteles/${id}`)

export const crearHotel = (data : HotelCreateDTO) => 
    api.post<HotelResponseDTO>(`/api/v1/destinos/{idDestino}/hoteles`, data)

export const modificarHotel = (id: number, data : HotelUpdateDTO) =>     
    api.put<HotelResponseDTO>(`/api/v1/destinos/{idDestino}/hoteles/${id}`, data)
