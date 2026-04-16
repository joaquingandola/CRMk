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
        <div className="max-w-4xl">
            <button
                onClick={() => navigate('/clientes')}
                className="text-sm text-gray-500 hover:text-gray-700 mb-5 flex items-center gap-1"
            >
              ← Clientes
            </button>

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    {cliente.nombre} {cliente.apellido}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500">DNI {cliente.dni}</span>
                    {cliente.enViaje && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                        En viaje
                    </span>
                    )}
                </div>
                </div>
                <div className="flex gap-2">
                <button
                    onClick={() => navigate(`/clientes/${id}/editar`)}
                    className="text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                    Editar
                </button>
                <button
                    onClick={() => setConfirmandoBaja(true)}
                    className="text-sm border border-red-200 hover:bg-red-50 text-red-600 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                    Dar de baja
                </button>
                </div>
            </div>
            
            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            {/* Datos + Contactos */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">Datos personales</h2>
                <dl className="space-y-3">
                    <Row label="Nombre completo" value={`${cliente.nombre} ${cliente.apellido}`} />
                    <Row label="DNI" value={String(cliente.dni)} />
                    <Row label="Fecha de nacimiento" value={formatFecha(cliente.fechaNacimiento)} />
                    <Row label="Alta en sistema" value={formatFecha(cliente.fechaCreacion)} />
                </dl>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Contactos</h2>
            {cliente.contactos?.length > 0 ? (
                <ul className="space-y-3">
                {cliente.contactos.map((c) => (
                    <li key={c.idContacto} className="flex items-center gap-3">
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md w-24 text-center">
                        {c.medio}
                    </span>
                    <span className="text-sm text-gray-800">{c.detalle}</span>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-400">Sin contactos registrados.</p>
            )}
            </div>
        </div>

        {/* Viajes */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">
                Viajes
                <span className="ml-2 text-xs font-normal text-gray-400">({viajes.length})</span>
            </h2>
            <button
                onClick={() => navigate(`/viajes/nuevo?clienteId=${id}`)}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
                + Nuevo viaje
            </button>
            </div>

            {viajes.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">
                Este cliente no tiene viajes registrados.
            </p>
            ) : (
            <div className="space-y-3">
                {viajes.map((v) => (
                <div
                    key={v.idViaje}
                    onClick={() => navigate(`/viajes/${v.idViaje}`)}
                    className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                    <div>
                    <div className="text-sm font-medium text-gray-900">
                        {v.destinos?.length > 0
                        ? v.destinos.map((d) => d.ciudad?.nombre).join(' → ')
                        : 'Sin destinos cargados'}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                        {formatFecha(v.fechaInicioViaje)} → {formatFecha(v.fechaFinViaje)}
                        {v.aerolinea?.aerolinea && ` · ${v.aerolinea.aerolinea}`}
                    </div>
                    </div>
                    <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">
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
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm mx-4">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                ¿Dar de baja a {cliente.nombre}?
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                El cliente quedará inactivo. Si tiene viajes activos la operación será rechazada.
                </p>
                <div className="flex gap-3">
                <button
                    onClick={() => setConfirmandoBaja(false)}
                    className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleBaja}
                    disabled={dandoDeBaja}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium py-2 rounded-lg transition-colors"
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
            <dt className='text-gray-500'>{label}</dt>
            <dd className='text-gray-900 font-medium'>{value}</dd>
        </div>
    )
}