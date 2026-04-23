import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getClientePorId, darDeBaja } from '../../api/clientes'
import { getViajesPorCliente } from '../../api/viajes'
import type { ClienteResponseDTO, ViajeResponseDTO } from '../../types'
import { Spinner } from '../../components/ui/Spinner'
import { Badge } from '../../components/ui/Badge'


export function ClienteDetalle() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [cliente, setCliente] = useState<ClienteResponseDTO | null>(null)
    const [viajes, setViajes] = useState<ViajeResponseDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [confirmandoBaja, setConfirmandoBaja] = useState(false)
    const [dandoDeBaja, setDandoDeBaja] = useState(false)

    useEffect(() => {
        if (id) cargar(Number(id))
    }, [id])

    const cargar = async (clienteId: number) => {
        setLoading(true)
        setError('')
        try {
            const [{data : clienteData }, {data : viajesData}] = await Promise.all([
                getClientePorId(clienteId),
                getViajesPorCliente(clienteId)
            ])
            setCliente(clienteData)
            setViajes(viajesData)
        } catch { 
            setError('Error al cargar los datos del cliente')
        } finally {
            setLoading(false)
        }
    }

    const handleBaja = async () => {
        if(!id) return  
        setDandoDeBaja(true)
        try {
            await darDeBaja(Number(id))
            navigate('/clientes')
        } catch (err: any) {
            const msg = err.response?.data?.mensaje ?? 'No se pudo dar de baja al cliente.'
            setError(msg)
            setConfirmandoBaja(false)
        } finally {
            setDandoDeBaja(false)
        }
    }

    const formatFecha = (iso: string | null) =>
        iso ? new Date(iso).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric',
        }) : '—'
    
    const formatMonto = (n: number | null) =>
        n != null ? `$${Number(n).toLocaleString('es-AR')}` : '—'

    if (loading) return <Spinner />

    if (error && !cliente) {
        return (
        <div className="text-center py-16">
            <p className="text-red-600 text-sm">{error}</p>
            <button
                onClick={() => navigate('/clientes')}
                className="mt-4 text-sm text-blue-600 hover:underline"
            >
                ← Volver a clientes
            </button>
        </div>
        )
    }

    if (!cliente) return null

    return (
        <div className="max-w-4xl space-y-6">
            <button
                onClick={() => navigate('/clientes')}
                className="text-sm text-slate-400 hover:text-blue-400 mb-2 flex items-center gap-1 transition-colors group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Clientes
            </button>

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                <h1 className="text-2xl font-bold text-white tracking-light">
                    {cliente.nombre} {cliente.apellido}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm text-slate-400">DNI {cliente.dni}</span>
                    {cliente.enViaje && (
                    <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        En viaje
                    </span>
                    )}
                </div>
                </div>
                <div className="flex gap-3">
                <button
                    onClick={() => navigate(`/clientes/${id}/editar`)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all border border-slate-700"
                >
                    Editar
                </button>
                <button
                    onClick={() => setConfirmandoBaja(true)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all border border-red-500/20"
                >
                    Dar de baja
                </button>
                </div>
            </div>
            
            {error && (
                <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-pulse">
                    {error}
                </div>
            )}

            {/* Datos + Contactos */}
            <div className="grid grid-cols-2 gap-5 mb-6">
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-5">Datos personales</h2>
                <dl className="space-y-4">
                    <Row label="Nombre completo" value={`${cliente.nombre} ${cliente.apellido}`} />
                    <Row label="DNI" value={String(cliente.dni)} />
                    <Row label="Fecha de nacimiento" value={formatFecha(cliente.fechaNacimiento)} />
                    <Row label="Alta en sistema" value={formatFecha(cliente.fechaCreacion)} />
                </dl>
            </div>

            <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-5">Contactos</h2>
            {cliente.contactos?.length > 0 ? (
                <ul className="space-y-4">
                {cliente.contactos.map((c) => (
                    <li key={c.idContacto} className="flex items-center gap-3">
                    <span className="text-xs font-medium bg-slate-900 text-slate-400 border border-slate-700 px-2 py-1.5 rounded-lg w-24 text-center">
                        {c.medio}
                    </span>
                    <span className="text-sm text-slate-200">{c.detalle}</span>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-sm text-slate-500">Sin contactos registrados.</p>
            )}
            </div>
        </div>

        {/* Viajes */}
        <div className="bbg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                Viajes
                <span className="ml-2 text-xs font-normal text-slate-500">({viajes.length})</span>
            </h2>
            <button
                onClick={() => navigate(`/viajes/nuevo?clienteId=${id}`)}
                className="text-xs bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/20 px-3 py-1.5 rounded-lg font-medium transition-all"
            >
                + Nuevo viaje
            </button>
            </div>

            {viajes.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
                Este cliente no tiene viajes registrados.
            </p>
            ) : (
            <div className="space-y-3">
                {viajes.map((v) => (
                <div
                    key={v.idViaje}
                    onClick={() => navigate(`/viajes/${v.idViaje}`)}
                    className="flex items-center justify-between border border-slate-700/50 bg-slate-900/20 rounded-xl px-5 py-4 hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                    <div>
                    <div className="text-sm font-medium text-gray-900">
                        {v.destinos?.length > 0
                        ? v.destinos.map((d) => d.ciudad?.nombre).join(' → ')
                        : 'Sin destinos cargados'}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                        {formatFecha(v.fechaInicioViaje)} → {formatFecha(v.fechaFinViaje)}
                        {v.aerolinea?.aerolinea && ` · ${v.aerolinea.aerolinea}`}
                    </div>
                    </div>
                    <div className="flex items-center gap-5">
                    <span className="text-sm font-medium text-slate-300">
                        {formatMonto(v.precio)}
                    </span>
                    <Badge estado={v.estadoActual?.estadoConcretoViaje} />
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>


        {/* Modal baja */}
        {confirmandoBaja && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                ¿Dar de baja a {cliente.nombre}?
                </h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                El cliente quedará inactivo. Si tiene viajes activos la operación será rechazada.
                </p>
                <div className="flex gap-3">
                <button
                    onClick={() => setConfirmandoBaja(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold py-2.5 rounded-xl transition-all border border-slate-700"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleBaja}
                    disabled={dandoDeBaja}
                    className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 disabled:text-slate-400 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-red-600/20s"
                >
                    {dandoDeBaja ? 'Procesando...' : 'Confirmar baja'}
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between text-sm"> 
            <dt className='text-white'>{label}</dt>
            <dd className='text-white font-semibold text-right'>{value}</dd>
        </div>
    )
}