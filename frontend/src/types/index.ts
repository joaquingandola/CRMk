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
    idContacto: number
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
    contactos: ContactoDTO[]
    idAgente?: number
    nombreAgente?: string
    observaciones?: ObservacionResponseDTO[]
}

export interface ClienteCreateDTO {
    nombre: string
    apellido: string
    dni: number
    fechaNacimiento?: string | null
    contactos?: ContactoInputDTO[]
    observaciones?: ObservacionCreateDTO[]
}

export interface ClienteUpdateDTO {
    nombre?: string
    apellido?: string
    fechaNacimiento?: string
    contactos?: ContactoInputDTO[]
    observaciones?: ObservacionCreateDTO[]
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

export interface CiudadVisitadaDTO {
    idCiudad: number
    nombre: string
    pais: string
    cantidadVisitas: number
}

//hotel
export interface HotelCreateDTO {
    nombre: string
    direccion?: string
}

export interface HotelResponseDTO {
    idHotel: number
    idDestino: number
    nombre: string
    direccion: string
}

export interface HotelUpdateDTO {
    nombre?: string
    direccion?: string

}

export interface HotelVisitadoDTO {
    idHotel: number
    nombre: string
    direccion: string
    cantidadVisitas: number
}

//destino
export interface DestinoEnViajeDTO {
    idDestino: number
    ciudad: CiudadResponseDTO
    fechaLlegada: string
    fechaSalida: string
    idHotel?: number | null
}

export interface DestinoCreateDTO {
    idCiudad: number
    idViaje?: number
    idHotel?: number
    hotel?: HotelCreateDTO
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
    destinos?: DestinoCreateDTO[]
}

export interface ViajeUpdateDTO {
    idAerolinea?: number
    fechaInicioViaje?: string
    fechaFinViaje?: string
    precio?: number
}

export interface UsuarioResponseDTO {
    idUsuario: number
    username: string
    email: string
    tipoRol: TipoRol
    activo: boolean
}

//error api
export interface ApiError {
    status: number
    error: string
    mensaje: string
    path: string
    timestamp: string
}

//formulario viaje
export interface AcompananteFormData {
    nombre: string
    apellido: string
    dni: string
    fechaNacimiento: string
}

export interface DestinoFormData {
    ciudad : CiudadResponseDTO | null
    fechaLlegada : string
    fechaSalida : string
    hotelSeleccionado: HotelResponseDTO | null
    hotelNombre : string
    hotelDireccion : string
}

export interface ObservacionFormData {
    idObservacion?: number
    observacion: string
}

//observaciones
export interface ObservacionCreateDTO {
    observacion: string
}

export interface ObservacionResponseDTO {
    idObservacion: number
    idCliente: number
    observacion: string
    fechaCreacion: string
}