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
        <div className="max-w-4xl space-y-6">
            <button
                onClick={() => navigate(`/clientes/${viaje.idCliente}`)}
                className="text-sm text-slate-400 hover:text-blue-400 mb-2 flex items-center gap-1 transition-colors group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> {viaje.nombreCliente}
            </button>

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-light">
                        {viaje.destinos.length > 0
                            ? viaje.destinos.map((d) => d.ciudad.nombre).join(' → ')
                            : 'Viaje sin destinos'}
                    </h1>
                    <p className="text-sm text-slate-400 mt-2">
                        {formatFecha(viaje.fechaInicioViaje)} → {formatFecha(viaje.fechaFinViaje)}
                        {viaje.aerolinea && ` · ${viaje.aerolinea.aerolinea}`}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge estado={estadoActual} />
                    <span className="text-xl font-bold text-white">
                        {formatMonto(viaje.precio)}
                    </span>
                </div>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-pulse">
                    {error}
                </div>
            )}

            {/* Cambio de estado */}
            {siguientes.length > 0 && (
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm mb-6">
                    <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Cambiar estado</h2>
                    <div className="flex gap-3">
                        {siguientes.map((s) => (
                            <button
                                key={s}
                                onClick={() => handleCambiarEstado(s)}
                                disabled={cambiandoEstado}
                                className={`text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                    s === 'CANCELADO'
                                        ? 'border-red-500/20 text-red-400 bg-red-500/10 hover:bg-red-500/20'
                                        : 'border-blue-500/20 text-blue-400 bg-blue-600/10 hover:bg-blue-600/20'
                                }`}
                            >
                                {cambiandoEstado ? 'Procesando...' : `Marcar como ${s}`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-5 mb-6">
                {/* Info general */}
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-5">Información</h2>
                    <dl className="space-y-4">
                        <Row label="Cliente" value={viaje.nombreCliente} />
                        <Row label="Aerolínea" value={viaje.aerolinea?.aerolinea ?? '—'} />
                        <Row label="Inicio" value={formatFecha(viaje.fechaInicioViaje)} />
                        <Row label="Fin" value={formatFecha(viaje.fechaFinViaje)} />
                        <Row label="Precio" value={formatMonto(viaje.precio)} />
                        <Row label="Creado" value={formatFecha(viaje.fechaCreacion)} />
                    </dl>
                </div>

                {/* Destinos */}
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-5">
                        Destinos
                        <span className="ml-2 text-xs font-normal text-slate-500">
                            ({viaje.destinos.length})
                        </span>
                    </h2>
                    {viaje.destinos.length === 0 ? (
                        <p className="text-sm text-slate-500">Sin destinos cargados.</p>
                    ) : (
                        <ol className="space-y-4">
                            {viaje.destinos.map((d, i) => (
                                <li key={d.idDestino} className="flex gap-4 text-sm bg-slate-900/30 border border-slate-800 rounded-xl p-3">
                                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <div className="font-medium text-slate-100">
                                            {d.ciudad.nombre}
                                            <span className="text-slate-500 font-normal ml-1 border-l border-slate-700 pl-1">{d.ciudad.pais}</span>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
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
            <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-5">
                    Acompañantes
                    <span className="ml-2 text-xs font-normal text-slate-500">
                        ({viaje.acompanantes.length})
                    </span>
                </h2>
                {viaje.acompanantes.length === 0 ? (
                    <p className="text-sm text-slate-500">Sin acompañantes registrados.</p>
                ) : (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-800/60 border-b border-slate-800">
                                <tr>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">DNI</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nacimiento</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {viaje.acompanantes.map((a) => (
                                    <tr key={a.idAcompanante} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-5 py-3 font-medium text-slate-200">
                                            {a.nombre} {a.apellido}
                                        </td>
                                        <td className="px-5 py-3 text-slate-400">{a.dni}</td>
                                        <td className="px-5 py-3 text-slate-400">{formatFecha(a.fechaNacimiento)}</td>
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
            <dt className="text-slate-400">{label}</dt>
            <dd className="text-slate-100 font-medium text-right">{value}</dd>
        </div>  
    )
}