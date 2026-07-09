import { useState } from "react"
import { crearAcompanante, modificarAcompanante } from "../api/acompanantes"
import { BuscadorCiudad } from "../components/Buscadores/BuscadorCiudad"
import { BuscadorHotel } from "../components/Buscadores/BuscadorHotel"

import type {
    AerolineaResponseDTO,
    AcompananteFormData,
    DestinoFormData,
    DestinoCreateDTO,
    HotelResponseDTO,
} from '../types'

// ------------------------------- valores vacíos -------------------------------

export const acompananteVacio = (): AcompananteFormData => ({
    id: undefined, nombre: '', apellido: '', dni: '', fechaNacimiento: '',
})

export const destinoVacio = (): DestinoFormData => ({
    idDestino: undefined,
    ciudad: null,
    fechaLlegada: '',
    fechaSalida: '',
    hotelSeleccionado: null,
    hotelNombre: '',
    hotelDireccion: '',
})

// ------------------------------- destinos: hook -------------------------------

interface UseDestinosFormOptions {
    // llamado cuando se quita un destino que ya existe en el servidor (tiene idDestino)
    onQuitarPersistido?: (destino: DestinoFormData) => Promise<void>
}

export function useDestinosForm(inicial: DestinoFormData[] = [destinoVacio()], options: UseDestinosFormOptions = {}) {
    const [destinos, setDestinos] = useState<DestinoFormData[]>(inicial)
    const [error, setError] = useState('')

    const actualizarDestino = (index: number, field: keyof DestinoFormData, value: any) => {
        const nuevos = [...destinos]
        nuevos[index] = { ...nuevos[index], [field]: value }
        setDestinos(nuevos)
    }

    const agregarDestino = () => setDestinos([...destinos, destinoVacio()])

    const quitarDestino = async (i: number) => {
        const destino = destinos[i]
        if (destino.idDestino && options.onQuitarPersistido) {
            try {
                await options.onQuitarPersistido(destino)
            } catch {
                setError('No se pudo eliminar el destino del lado del servidor')
            }
        }
        setDestinos(destinos.filter((_, idx) => idx !== i))
    }

    const seleccionarHotel = (index: number, hotel: HotelResponseDTO | null) => {
        const nuevos = [...destinos]
        nuevos[index] = {
            ...nuevos[index],
            hotelSeleccionado: hotel,
            hotelDireccion: hotel ? '' : nuevos[index].hotelDireccion,
            hotelNombre: hotel ? '' : nuevos[index].hotelNombre,
        }
        setDestinos(nuevos)
    }

    const escribirNombreHotelLibre = (index: number, nombre: string) => {
        const nuevos = [...destinos]
        nuevos[index] = {
            ...nuevos[index],
            hotelNombre: nombre,
            hotelSeleccionado: null,
        }
        setDestinos(nuevos)
    }

    return {
        destinos, setDestinos, error,
        actualizarDestino, agregarDestino, quitarDestino,
        seleccionarHotel, escribirNombreHotelLibre,
    }
}

// ------------------------------- acompañantes: hook -------------------------------

interface UseAcompanantesFormOptions {
    // llamado cuando se quita un acompañante que ya existe en el servidor (tiene id)
    onQuitarPersistido?: (acompanante: AcompananteFormData) => Promise<void>
}

export function useAcompanantesForm(inicial: AcompananteFormData[] = [], options: UseAcompanantesFormOptions = {}) {
    const [acompanantes, setAcompanantes] = useState<AcompananteFormData[]>(inicial)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState('')

    const actualizarAcompanante = (index: number, field: keyof AcompananteFormData, value: string) => {
        const nuevos = [...acompanantes]
        nuevos[index] = { ...nuevos[index], [field]: value }
        setAcompanantes(nuevos)
    }

    const agregarAcompanante = () => setAcompanantes([...acompanantes, acompananteVacio()])

    const quitarAcompanante = async (i: number) => {
        const acompanante = acompanantes[i]
        if (acompanante.id && options.onQuitarPersistido) {
            try {
                setGuardando(true)
                await options.onQuitarPersistido(acompanante)
            } catch {
                setError('No se pudo eliminar al acompañante del lado del servidor')
            } finally {
                setGuardando(false)
            }
        }
        setAcompanantes(acompanantes.filter((_, idx) => idx !== i))
    }

    return {
        acompanantes, setAcompanantes, guardando, error,
        actualizarAcompanante, agregarAcompanante, quitarAcompanante,
    }
}

// ------------------------------- validación y payloads -------------------------------

export function validarDestinos(destinos: DestinoFormData[]): string | null {
    const destinosValidos = destinos.filter((d) => d.ciudad !== null && d.fechaLlegada && d.fechaSalida)
    if (destinosValidos.length === 0) {
        return 'Agregá al menos un destino con ciudad seleccionada.'
    }

    const destinoConFechasInvalidas = destinosValidos.some((d) => d.fechaLlegada > d.fechaSalida)
    if (destinoConFechasInvalidas) {
        return 'Revisá las fechas de llegada y salida de los destinos. La fecha de llegada no puede ser posterior a la fecha de salida.'
    }

    const hotelInvalido = destinosValidos.some((d) => d.hotelNombre.trim() !== '' && !d.hotelDireccion.trim())
    if (hotelInvalido) {
        return 'Si cargás un hotel, completá nombre y dirección.'
    }

    return null
}

export const destinosValidos = (destinos: DestinoFormData[]) =>
    destinos.filter((d) => d.ciudad !== null && d.fechaLlegada && d.fechaSalida)

// mapea un destino del form al payload que espera el backend (sin idViaje: cada caller lo agrega según corresponda)
export function destinoFormAPayload(d: DestinoFormData): Omit<DestinoCreateDTO, 'idViaje'> {
    return {
        idCiudad: d.ciudad!.idCiudad,
        fechaLlegada: d.fechaLlegada,
        fechaSalida: d.fechaSalida,
        ...(d.hotelSeleccionado
            ? { idHotel: d.hotelSeleccionado.idHotel }
            : d.hotelNombre.trim()
                ? { hotel: { nombre: d.hotelNombre, direccion: d.hotelDireccion } }
                : {}),
    }
}

// crea o actualiza (según tengan id) los acompañantes cargados en el form y devuelve sus ids en el mismo orden
export async function guardarAcompanantes(acompanantes: AcompananteFormData[]): Promise<number[]> {
    const validos = acompanantes.filter((a) => a.nombre && a.apellido && a.dni)

    return Promise.all(
        validos.map(async (a) => {
            const payload = {
                nombre: a.nombre,
                apellido: a.apellido,
                dni: Number(a.dni),
                fechaNacimiento: a.fechaNacimiento || undefined,
            }

            if (a.id) {
                const { data } = await modificarAcompanante(a.id, payload)
                return data.idAcompanante
            }
            const { data } = await crearAcompanante(payload)
            return data.idAcompanante
        })
    )
}

// ------------------------------- componentes -------------------------------

export interface DatosGeneralesValue {
    idAerolinea: string
    fechaInicioViaje: string
    fechaFinViaje: string
    precio: string
}

interface DatosGeneralesSectionProps {
    aerolineas: AerolineaResponseDTO[]
    value: DatosGeneralesValue
    onChange: (campo: keyof DatosGeneralesValue, valor: string) => void
}

export function DatosGeneralesSection({ aerolineas, value, onChange }: DatosGeneralesSectionProps) {
    return (
        <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-5">Datos generales</h2>
            <div className="space-y-5">
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">
                        Aerolínea <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={value.idAerolinea}
                        onChange={(e) => onChange('idAerolinea', e.target.value)}
                        required
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                    >
                        <option value="" className="bg-slate-900">Seleccioná una aerolínea</option>
                        {aerolineas.map((a) => (
                            <option key={a.idAerolinea} value={a.idAerolinea} className="bg-slate-900">
                                {a.aerolinea}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-300">
                            Fecha de inicio <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            value={value.fechaInicioViaje}
                            onChange={(e) => onChange('fechaInicioViaje', e.target.value)}
                            required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white [color-scheme:dark] focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-300">
                            Fecha de fin <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            value={value.fechaFinViaje}
                            min={value.fechaInicioViaje}
                            onChange={(e) => onChange('fechaFinViaje', e.target.value)}
                            required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white [color-scheme:dark] focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">
                        Precio (USD) <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={value.precio}
                        onChange={(e) => onChange('precio', e.target.value)}
                        required
                        placeholder="150000"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                    />
                </div>
            </div>
        </div>
    )
}

interface AcompanantesSectionProps {
    acompanantes: AcompananteFormData[]
    onActualizar: (index: number, field: keyof AcompananteFormData, value: string) => void
    onAgregar: () => void
    onQuitar: (index: number) => void
}

export function AcompanantesSection({ acompanantes, onActualizar, onAgregar, onQuitar }: AcompanantesSectionProps) {
    return (
        <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                    Acompañantes
                    <span className="ml-2 text-xs font-normal text-slate-500 normal-case tracking-normal">(opcional)</span>
                </h2>
                <button
                    type="button"
                    onClick={onAgregar}
                    className="text-xs bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/20 px-3 py-1.5 rounded-lg font-medium transition-all"
                >
                    + Agregar acompañante
                </button>
            </div>

            {acompanantes.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4 border border-slate-800 border-dashed rounded-xl">
                    Sin acompañantes. Hacé clic en "+ Agregar acompañante" para sumar uno.
                </p>
            ) : (
                <div className="space-y-4">
                    {acompanantes.map((a, i) => (
                        <div key={i} className="border border-slate-700/50 bg-slate-900/30 rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Acompañante {i + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onQuitar(i)}
                                    className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                                >
                                    Quitar
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-slate-400">Nombre</label>
                                    <input
                                        type="text"
                                        value={a.nombre}
                                        onChange={(e) => onActualizar(i, 'nombre', e.target.value)}
                                        placeholder="Juan"
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-slate-400">Apellido</label>
                                    <input
                                        type="text"
                                        value={a.apellido}
                                        onChange={(e) => onActualizar(i, 'apellido', e.target.value)}
                                        placeholder="García"
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-slate-400">DNI</label>
                                    <input
                                        type="number"
                                        value={a.dni}
                                        onChange={(e) => onActualizar(i, 'dni', e.target.value)}
                                        placeholder="30123456"
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-slate-400">Nacimiento</label>
                                    <input
                                        type="date"
                                        value={a.fechaNacimiento}
                                        onChange={(e) => onActualizar(i, 'fechaNacimiento', e.target.value)}
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white [color-scheme:dark] focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

interface DestinosSectionProps {
    destinos: DestinoFormData[]
    fechaInicio: string
    fechaFin: string
    onActualizar: (index: number, field: keyof DestinoFormData, value: any) => void
    onAgregar: () => void
    onQuitar: (index: number) => void
    onSeleccionarHotel: (index: number, hotel: HotelResponseDTO | null) => void
    onEscribirNombreHotelLibre: (index: number, nombre: string) => void
}

export function DestinosSection({
    destinos, fechaInicio, fechaFin,
    onActualizar, onAgregar, onQuitar,
    onSeleccionarHotel, onEscribirNombreHotelLibre,
}: DestinosSectionProps) {
    return (
        <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                    Destinos
                </h2>
                <button
                    type="button"
                    onClick={onAgregar}
                    className="text-xs bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/20 px-3 py-1.5 rounded-lg font-medium transition-all"
                >
                    + Agregar destino
                </button>
            </div>

            <div className="space-y-4">
                {destinos.map((d, i) => (
                    <div key={i} className="border border-slate-700/50 bg-slate-900/30 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Destino {i + 1}
                            </span>
                            {destinos.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => onQuitar(i)}
                                    className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                                >
                                    Quitar
                                </button>
                            )}
                        </div>

                        <BuscadorCiudad
                            value={d.ciudad}
                            onChange={(ciudad) => onActualizar(i, 'ciudad', ciudad)}
                            placeholder="Buscar ciudad..."
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-slate-400">Llegada</label>
                                <input
                                    type="date"
                                    value={d.fechaLlegada}
                                    min={fechaInicio}
                                    max={fechaFin}
                                    onChange={(e) => onActualizar(i, 'fechaLlegada', e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-slate-400">Salida</label>
                                <input
                                    type="date"
                                    value={d.fechaSalida}
                                    min={d.fechaLlegada || fechaInicio}
                                    max={fechaFin}
                                    onChange={(e) => onActualizar(i, 'fechaSalida', e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                                />
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4 space-y-4">
                            <div>
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                    Hotel (opcional)
                                </h3>
                            </div>

                            <BuscadorHotel
                                value={d.hotelSeleccionado}
                                onChange={(hotel) => onSeleccionarHotel(i, hotel)}
                                onNombreLibre={(nombre) => onEscribirNombreHotelLibre(i, nombre)}
                            />

                            {!d.hotelSeleccionado && d.hotelNombre.trim() !== '' && (
                                <input
                                    type="text"
                                    placeholder="Direccion del hotel"
                                    value={d.hotelDireccion}
                                    onChange={(e) => onActualizar(i, 'hotelDireccion', e.target.value)}
                                    className="mt-2 w-full border rounded px-3 py-2 text-sm"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
