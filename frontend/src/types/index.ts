export type TipoRol = 'ADMIN' | 'AGENTE'
export type Medio = 'TELEFONO' | 'WHATSAPP' | 'MAIL' | 'TELEGRAM'
export type EstadoConcretoViaje = 'COTIZADO' | 'CONFIRMADO' | 'PAGADO' | 'CANCELADO'
export type TipoDocumento = 'DNI' | 'PASAPORTE' | 'OTRO'

//AUTH
export interface AuthResponse {
    access_token: string
}

export interface LoginRequest {
    email: string
    password: string
}

//contacto
export interface ContactoDTO {
    medio: Medio
    detalle: string
}

export interface ContactoInputDTO {
    medio: Medio
    detalle: string
}

//cliente
export interface ClienteResponseDTO {
    idCliente: number
    nombre: string
    apellido: string
    dni: number
    fechaNacimiento: string | null
    fechaCreacion: string | null
    activo: boolean
    enViaje: boolean
    contactos: ContactoDTO[]
}

export interface ClienteCreateDTO {
    nombre: string
    apellido: string
    dni: number
    fechaNacimiento?: string | null
    contactos?: ContactoInputDTO[]
}

export interface ClienteUpdateDTO {
    nombre?: string
    apellido?: string
    fechaNacimiento?: string
    contactos?: ContactoInputDTO[]
}

//aerolinea
export interface AerolineaResponseDTO {
    idAerolinea: number
    aerolinea: string
}

//estadoviaje
export interface EstadoViajeResponseDTO {
    idEstadoViaje: number
    estadoConcretoViaje: EstadoConcretoViaje
    fechaActualizacion: string
}

//ciudad
export interface CiudadResponseDTO {
    idCiudad: number
    nombre: string
    pais: string
    latitud: number
    longitud: number
}

//destino
export interface DestinoEnViajeDTO {
    idDestino: number
    ciudad: CiudadResponseDTO
    fechaLlegada: string
    fechaSalida: string
}

//acompanante
export interface AcompananteResponseDTO {
    idAcompanante: number
    nombre: string
    apellido: string
    dni: number
    fechaNacimiento: string | null
}

//viaje
export interface ViajeResponseDTO {
    idViaje: number
    fechaInicioViaje: string
    fechaFinViaje: string
    fechaCreacion: string
    precio: number
    activo: boolean
    idCliente: number
    nombreCliente: string
    aerolinea: AerolineaResponseDTO | null
    estadoActual: EstadoViajeResponseDTO | null
    destinos: DestinoEnViajeDTO[]
    acompanantes: AcompananteResponseDTO[]
}

export interface ViajeCreateDTO {
    idCliente: number
    idAerolinea: number
    fechaInicioViaje: string
    fechaFinViaje: string
    precio: number
    idAcompanantes?: number[]
    destinos?: {
        idCiudad: number
        idViaje?: number
        fechaLlegada: string
        fechaSalida: string
    }[]
}


//error api
export interface ApiError {
    status: number
    error: string
    mensaje: string
    path: string
    timestamp: string
}