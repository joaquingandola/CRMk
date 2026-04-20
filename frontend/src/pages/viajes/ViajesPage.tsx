import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import type { ViajeResponseDTO } from "../../types"
import { Spinner } from "../../components/ui/Spinner"
import { EmptyState } from "../../components/ui/EmptyState"
import { Badge } from "../../components/ui/Badge"

export function ViajesPage() {
    const [viajes, setViajes] = useState<ViajeResponseDTO[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(()=> {
        api.get<ViajeResponseDTO[]>('/api/v1/viajes')
            .then(({ data }) => setViajes(data))
            .finally(() => setLoading(false))
    }, [])

    const formatFecha = (iso : string) =>
        new Date(iso).toLocaleDateString('es-AR', {
            day: '2-digit', month: 'short', year: 'numeric',
        })

    return (
        <div>
            <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Viajes</h1>
            <p className="text-sm text-gray-500 mt-0.5">{viajes.length} viajes registrados</p>
            </div>
            {loading ? <Spinner /> : viajes.length === 0 ? (
                <EmptyState message="No hay viajes registrados." />
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Cliente</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Destinos</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Fechas</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Precio</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</th>
                        <th className="px-5 py-3" />
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {viajes.map((v) => (
                        <tr
                        key={v.idViaje}
                        onClick={() => navigate(`/viajes/${v.idViaje}`)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                        <td className="px-5 py-3.5 font-medium text-gray-900">{v.nombreCliente}</td>
                        <td className="px-5 py-3.5 text-gray-600">
                            {v.destinos.length > 0
                            ? v.destinos.map((d) => d.ciudad.nombre).join(' → ')
                            : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 text-xs">
                            {formatFecha(v.fechaInicioViaje)} → {formatFecha(v.fechaFinViaje)}
                        </td>
                        <td className="px-5 py-3.5 text-gray-700 font-medium">
                            ${Number(v.precio).toLocaleString('es-AR')}
                        </td>
                        <td className="px-5 py-3.5">
                            <Badge estado={v.estadoActual?.estadoConcretoViaje} />
                        </td>
                        <td className="px-5 py-3.5 text-right text-gray-400 text-xs">Ver →</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
    )
}
