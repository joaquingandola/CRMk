import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getViajePorId, cambiarEstadoViaje } from "../../api/viajes"
import type { ViajeResponseDTO, EstadoConcretoViaje } from "../../types"
import { Spinner } from "../../components/ui/Spinner"
import { Badge } from "../../components/ui/Badge"

const TRANSICIONES : Record<EstadoConcretoViaje, EstadoConcretoViaje[]> = {
    COTIZADO: ['CONFIRMADO', 'CANCELADO'],
    CONFIRMADO: ['PAGADO', 'CANCELADO'],
    CANCELADO : [],
    PAGADO: [],
}

export function ViajeDetalle() {
    const { id } = useParams<{ id : string}>()
    const navigate = useNavigate()

    const [viaje, setViaje] = useState<ViajeResponseDTO | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [cambiandoEstado, setCambiandoEstado] = useState(false)

    useEffect(() => {
        if (id) cargar(Number(id))
    }, [id])

    const cargar = async (viajeId: number) => {
        setLoading(true)
        try {
            const { data } = await getViajePorId(viajeId)
            setViaje(data)
        } catch { 
            setError('No se pudo cargar el viaje')
        } finally {
            setLoading(false)
        }
    }


    const handleCambiarEstado = async (nuevo: EstadoConcretoViaje) => {
        if (!id || !viaje) return 
        setCambiandoEstado(true) 
        try {
            const { data } = await cambiarEstadoViaje(Number(id), nuevo)
            setViaje(data)
        } catch (err:any) {
            setError(err.response?.data?.mensaje ?? ' No se pudo cambiar el estado')
        } finally {
            setCambiandoEstado(false)
        }
    }

    const formatFecha = (iso: string | null) => 
        iso ? new Date(iso).toLocaleDateString('es-AR', {
            day: '2-digit', month: 'short', year: 'numeric',    
        }) : '-'

    const formatMonto = (n: number) => 
        `$${Number(n).toLocaleString('es-AR')}`

    if(loading) return <Spinner />
    if(error && !viaje) {
        return (
            <div className="text-center py-16">
                <p className="text-red-600 text-sm">{error}</p>
                <button onClick={()=> navigate('/viajes')} className="mt-4 text-sm text-blue-600 hover:underline">
                    ← Volver a viajes
                </button>
            </div>
        )
    }

    if(!viaje) return null

    const estadoActual = viaje.estadoActual?.estadoConcretoViaje
    const siguientes = estadoActual ? TRANSICIONES[estadoActual] : []

    return (
        <div className="max-w-4xl">
            <button
                onClick={() => navigate(`/clientes/${viaje.idCliente}`)}
                className="text-sm text-gray-500 hover:text-gray-700 mb-5 flex items-center gap-1"
            >
                ← {viaje.nombreCliente}
            </button>

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    {viaje.destinos.length > 0
                    ? viaje.destinos.map((d) => d.ciudad.nombre).join(' → ')
                    : 'Viaje sin destinos'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    {formatFecha(viaje.fechaInicioViaje)} → {formatFecha(viaje.fechaFinViaje)}
                    {viaje.aerolinea && ` · ${viaje.aerolinea.aerolinea}`}
                </p>
                </div>
                <div className="flex items-center gap-3">
                <Badge estado={estadoActual} />
                <span className="text-lg font-semibold text-gray-800">
                    {formatMonto(viaje.precio)}
                </span>
                </div>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
                </div>
            )}

            {/* Cambio de estado */}
            {siguientes.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Cambiar estado</h2>
                <div className="flex gap-2">
                    {siguientes.map((s) => (
                    <button
                        key={s}
                        onClick={() => handleCambiarEstado(s)}
                        disabled={cambiandoEstado}
                        className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
                        s === 'CANCELADO'
                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                            : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                        }`}
                    >
                        {cambiandoEstado ? 'Procesando...' : `Marcar como ${s}`}
                    </button>
                    ))}
                </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">

                {/* Info general */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">Información</h2>
                <dl className="space-y-3">
                    <Row label="Cliente" value={viaje.nombreCliente} />
                    <Row label="Aerolínea" value={viaje.aerolinea?.aerolinea ?? '—'} />
                    <Row label="Inicio" value={formatFecha(viaje.fechaInicioViaje)} />
                    <Row label="Fin" value={formatFecha(viaje.fechaFinViaje)} />
                    <Row label="Precio" value={formatMonto(viaje.precio)} />
                    <Row label="Creado" value={formatFecha(viaje.fechaCreacion)} />
                </dl>
                </div>

                {/* Destinos */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">
                    Destinos
                    <span className="ml-1 text-xs font-normal text-gray-400">
                    ({viaje.destinos.length})
                    </span>
                </h2>
                {viaje.destinos.length === 0 ? (
                    <p className="text-sm text-gray-400">Sin destinos cargados.</p>
                ) : (
                    <ol className="space-y-3">
                    {viaje.destinos.map((d, i) => (
                        <li key={d.idDestino} className="flex gap-3 text-sm">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                        </span>
                        <div>
                            <div className="font-medium text-gray-900">
                            {d.ciudad.nombre}
                            <span className="text-gray-400 font-normal ml-1">{d.ciudad.pais}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                            {formatFecha(d.fechaLlegada)} → {formatFecha(d.fechaSalida)}
                            </div>
                        </div>
                        </li>
                    ))}
                    </ol>
                )}
                </div>
            </div>

            {/* Acompañantes */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Acompañantes
                <span className="ml-1 text-xs font-normal text-gray-400">
                    ({viaje.acompanantes.length})
                </span>
                </h2>
                {viaje.acompanantes.length === 0 ? (
                <p className="text-sm text-gray-400">Sin acompañantes registrados.</p>
                ) : (
                <div className="overflow-hidden rounded-lg border border-gray-100">
                    <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Nombre</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">DNI</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Nacimiento</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {viaje.acompanantes.map((a) => (
                        <tr key={a.idAcompanante}>
                            <td className="px-4 py-3 font-medium text-gray-900">
                            {a.nombre} {a.apellido}
                            </td>
                            <td className="px-4 py-3 text-gray-500">{a.dni}</td>
                            <td className="px-4 py-3 text-gray-500">{formatFecha(a.fechaNacimiento)}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </div>
        </div>
    )
}

function Row({label, value}: {label : string, value: string}) {
    return (
        <div className="flex justify-between text-sm">
            <dt className="text-gray-500">{label}</dt>
            <dd className="text-gray-900 font-medium">{value}</dd>
        </div>  
    )
}