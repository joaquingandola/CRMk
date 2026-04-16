import api from "./axios"
import type {
    ClienteResponseDTO, 
    ClienteCreateDTO,
    ClienteUpdateDTO
} from "../types"

export const getClientesActivos = () => api.
    get<ClienteResponseDTO[]>("api/v1/clientes/activos")

export const buscarClientes = (termino : string) => api.
    get<ClienteResponseDTO[]>(`api/v1/clientes/buscar?termino=${termino}`)

export const getClientePorId = (id : number) => api.
    get<ClienteResponseDTO>(`api/v1/clientes/${id}`)

export const crearCliente = (data : ClienteCreateDTO) => api.
    post<ClienteResponseDTO>("api/v1/clientes", data)

export const actualizarCliente = (id : number, data : ClienteUpdateDTO) => api.
    put<ClienteResponseDTO>(`api/v1/clientes/${id}`, data)

export const darDeBaja = (id : number) => api.
    patch<void>(`api/v1/clientes/${id}/baja`)