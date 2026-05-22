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
        }) //fijarse si esto queda TODO
    
    const inicioDeHoy = () => {
        const hoy = new Date()
        return new Date(
            hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0, 0
        ).getTime()
    }

    
    const prioridadEstado = (estado?: string) => {
        switch (estado) {
            case 'PAGADO': return 1
            case 'CONFIRMADO': return 2
            case 'COTIZADO': return 3
            case 'CANCELADO': return 4
            default: return 5
        }
    }

    const parseFechaLocal = (fecha : string) => {
        const [year, month, day] = fecha.split('-').map(Number)
        return new Date(year, month - 1, day).getTime()
    }

    const viajesVisiblesOrdenados = [...viajes]
    .filter((v) => parseFechaLocal(v.fechaFinViaje) >= inicioDeHoy())
    .sort((a, b) => {
        const prioridadA = prioridadEstado(a.estadoActual?.estadoConcretoViaje)
        const prioridadB = prioridadEstado(b.estadoActual?.estadoConcretoViaje)
        if(prioridadA !== prioridadB) {
            return prioridadA - prioridadB
        }
        return parseFechaLocal(a.fechaInicioViaje) - parseFechaLocal(b.fechaInicioViaje)
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-light">Viajes</h1>
                    <p className="text-sm text-slate-400 mt-1">{viajesVisiblesOrdenados.length} viajes registrados en curso o a futuro</p>
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : viajesVisiblesOrdenados.length === 0 ? (
                <EmptyState message="No hay viajes registrados." />
            ) : (
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800/60 border-b border-slate-800">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliente</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Destinos</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fechas</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Precio</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {viajesVisiblesOrdenados.map((v) => (
                                <tr
                                    key={v.idViaje}
                                    onClick={() => navigate(`/viajes/${v.idViaje}`)}
                                    className="hover:bg-blue-600/5 cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-100 group-hover:text-blue-400 transition-colors">
                                        {v.nombreCliente}
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {v.destinos.length > 0
                                            ? v.destinos.map((d) => d.ciudad.nombre).join(' → ')
                                            : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-xs">
                                        {formatFecha(v.fechaInicioViaje)} → {formatFecha(v.fechaFinViaje)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-200 font-medium">
                                        ${Number(v.precio).toLocaleString('es-AR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge estado={v.estadoActual?.estadoConcretoViaje} />
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-500 group-hover:text-slate-300 text-xs">
                                        Ver detalles
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
    </div>
    )
}
