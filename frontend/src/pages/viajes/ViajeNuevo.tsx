import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { crearViaje } from "../../api/viajes"
import { getAerolineas } from "../../api/aerolineas"
import { BuscadorCiudad } from "../../components/ui/BuscadorCiudad"
import { crearAcompanante } from "../../api/acompanantes"

import type {
    AerolineaResponseDTO,
    AcompananteFormData,
    DestinoFormData,
} from '../../types'

const acompananteVacio = (): AcompananteFormData => ({
    nombre : '', apellido : '', dni: '', fechaNacimiento : '',
})

const destinoVacio = (): DestinoFormData => ({
    ciudad: null,
    fechaLlegada: '',
    fechaSalida: '',
    idHotel: '',
    hotelNombre: '',
    hotelDireccion: '',
})

export function ViajeNuevo() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const clienteIdParam = searchParams.get('clienteId')

    const [aerolineas, setAerolineas] = useState<AerolineaResponseDTO[]>([])

    const [idCliente] = useState<string>(clienteIdParam ?? '')
    const [idAerolinea, setIdAerolinea] = useState<string>('')
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const [precio, setPrecio] = useState('')

    const [destinos, setDestinos] = useState<DestinoFormData[]>([destinoVacio()])

    const [acompanantes, setAcompanantes] = useState<AcompananteFormData[]>([])
    const [error, setError] = useState('')
    const [guardando, setGuardando] = useState(false)

    useEffect(() => {
        getAerolineas()
            .then(({ data }) => setAerolineas(data))
            .catch(() => setError('No se pudieron cargar las aerolíneas.'))
    }, [])

    const actualizarDestino = (
        index: number,
        field: keyof DestinoFormData,
        value: any
    ) => {
        const nuevos = [...destinos]
        nuevos[index] = {...nuevos[index], [field]: value}
        setDestinos(nuevos)
    }

    const agregarDestinos = () => setDestinos([...destinos, destinoVacio()])
    const quitarDestino = (i: number) => setDestinos(destinos.filter((_, idx) => idx !== i))
    const nombreCliente = idCliente //TODO 
    

    const actualizarAcompanante = (
        index: number,
        field: keyof AcompananteFormData,
        value: string,
    ) => {
        const nuevos = [...acompanantes]
        nuevos[index] = { ...nuevos[index], [field]: value}
        setAcompanantes(nuevos)
    }

    const agregarAcompanante = () => 
        setAcompanantes([...acompanantes, acompananteVacio()])

    const quitarAcompanante = (i:number) =>
        setAcompanantes(acompanantes.filter((_, idx) => idx !== i))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const destinosValidos = destinos.filter((d) => d.ciudad !== null)
        if (destinosValidos.length === 0) {
            setError('Agregá al menos un destino con ciudad seleccionada.')
            return
        }

        const hotelInvalido = destinosValidos.some(
            (d) => (d.hotelNombre && !d.hotelDireccion) || (!d.hotelNombre && d.hotelDireccion)
        )

        if (hotelInvalido) {
            setError('Si cargás un hotel, completá nombre y dirección.')
            return
        }

        setGuardando(true)
        try {
            const acompanantesValidos = acompanantes.filter(
                (a) => a.nombre && a.apellido && a.dni
            )

            const idsAcompanantes = await Promise.all(
                acompanantesValidos.map((a) =>
                    crearAcompanante({
                        nombre : a.nombre,
                        apellido : a.apellido, 
                        dni: Number(a.dni),
                        fechaNacimiento: a.fechaNacimiento || undefined, 
                    }).then(({ data }) => data.idAcompanante)
                )
            ) 

            const { data } = await crearViaje({
                idCliente: Number(idCliente),
                idAerolinea: Number(idAerolinea),
                fechaInicioViaje: fechaInicio,
                fechaFinViaje: fechaFin,
                precio: Number(precio),
                destinos: destinosValidos.map((d) => ({
                    idCiudad: d.ciudad!.idCiudad,
                    fechaLlegada: d.fechaLlegada,
                    fechaSalida: d.fechaSalida,
                    ...(d.idHotel
                        ? { idHotel: Number(d.idHotel) }
                        : d.hotelNombre
                            ? {
                                hotel: {
                                    nombre: d.hotelNombre,
                                    direccion: d.hotelDireccion,
                                },
                            }
                            : {}),
                })),
                idAcompanantes: idsAcompanantes
            })

            navigate(`/viajes/${data.idViaje}`)
        } catch (err: any) {
            setError(err.response?.data?.mensaje ?? "No se pudo cargar el viaje")
        } finally {
            setGuardando(false)
        }
    }

return (
    <div className="max-w-2xl space-y-6">
        <button
            onClick={() =>
                clienteIdParam
                    ? navigate(`/clientes/${clienteIdParam}`)
                    : navigate('/viajes')
            }
            className="text-sm text-slate-400 hover:text-blue-400 mb-2 flex items-center gap-1 transition-colors group"
        >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver
        </button>

        <h1 className="text-2xl font-bold text-white tracking-light">Nuevo viaje para {nombreCliente}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-5">Datos generales</h2>
                <div className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-300">
                            Aerolínea <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={idAerolinea}
                            onChange={(e) => setIdAerolinea(e.target.value)}
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
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
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
                                value={fechaFin}
                                min={fechaInicio}
                                onChange={(e) => setFechaFin(e.target.value)}
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
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            required
                            placeholder="150000"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Acompañantes */}
            <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                        Acompañantes
                        <span className="ml-2 text-xs font-normal text-slate-500 normal-case tracking-normal">(opcional)</span>
                    </h2>
                    <button
                        type="button"
                        onClick={agregarAcompanante}
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
                                        onClick={() => quitarAcompanante(i)}
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
                                            onChange={(e) => actualizarAcompanante(i, 'nombre', e.target.value)}
                                            placeholder="Juan"
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-slate-400">Apellido</label>
                                        <input
                                            type="text"
                                            value={a.apellido}
                                            onChange={(e) => actualizarAcompanante(i, 'apellido', e.target.value)}
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
                                            onChange={(e) => actualizarAcompanante(i, 'dni', e.target.value)}
                                            placeholder="30123456"
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-slate-400">Nacimiento</label>
                                        <input
                                            type="date"
                                            value={a.fechaNacimiento}
                                            onChange={(e) => actualizarAcompanante(i, 'fechaNacimiento', e.target.value)}
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white [color-scheme:dark] focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                        Destinos
                    </h2>
                    <button
                        type="button"
                        onClick={agregarDestinos}
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
                                        onClick={() => quitarDestino(i)}
                                        className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                                    >
                                        Quitar
                                    </button>
                                )}
                            </div>

                            <BuscadorCiudad
                                value={d.ciudad}
                                onChange={(ciudad) => actualizarDestino(i, 'ciudad', ciudad)}
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
                                        onChange={(e) => actualizarDestino(i, 'fechaLlegada', e.target.value)}
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
                                        onChange={(e) => actualizarDestino(i, 'fechaSalida', e.target.value)}
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

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-slate-400">
                                        ID hotel existente
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={d.idHotel}
                                        onChange={(e) => actualizarDestino(i, 'idHotel', e.target.value)}
                                        placeholder="Ej: 3"
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                                    />
                                </div>

                                <div className="text-center text-xs text-slate-500 uppercase tracking-wider">
                                    o crear uno nuevo
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-slate-400">
                                            Nombre hotel
                                        </label>
                                        <input
                                            type="text"
                                            value={d.hotelNombre}
                                            onChange={(e) => actualizarDestino(i, 'hotelNombre', e.target.value)}
                                            placeholder="Hilton"
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-slate-400">
                                            Dirección
                                        </label>
                                        <input
                                            type="text"
                                            value={d.hotelDireccion}
                                            onChange={(e) => actualizarDestino(i, 'hotelDireccion', e.target.value)}
                                            placeholder="Macacha Güemes 351"
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            <div className="flex gap-4 pt-2">
                <button
                    type="button"
                    onClick={() =>
                        clienteIdParam
                            ? navigate(`/clientes/${clienteIdParam}`)
                            : navigate('/viajes')
                    }
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold py-3 rounded-xl transition-all border border-slate-700"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={guardando}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 disabled:text-slate-400 text-white text-sm font-semibold py-3 rounded-xl transition-all"
                >
                    {guardando ? 'Guardando...' : 'Crear viaje'}
                </button>
            </div>
        </form>
    </div>
)
}
