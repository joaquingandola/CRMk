import { use, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { buscarClientes, getClientesActivos } from "../../api/clientes"
import type { ClienteResponseDTO } from "../../types"
import { Spinner } from "../../components/ui/Spinner"
import { EmptyState } from "../../components/ui/EmptyState"

export function ClientesPage() {
    const [clientes, setClientes] = useState<ClienteResponseDTO[]>([])
    const [busqueda, setBusqueda] = useState("")
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        cargarClientes()
    }, [])

    const cargarClientes = async () => {
        setLoading(true)
        try {
            const {data} = await getClientesActivos()
            setClientes(data)
        } finally {
            setLoading(false)
        }
    }

    const handleBusqueda = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value
        setBusqueda(valor)
        if (valor.trim().length < 2) {
            cargarClientes()
            return
        }
        try {
            const {data} = await buscarClientes(valor)
            setClientes(data)
        } catch {
            //mantiene lista anterior si falla
        }
    }

    return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-sm text-slate-400 hover:text-blue-400 mb-2 flex items-center gap-1 transition-colors group">Clientes</h1>
            <p className="text-sm text-slate-400">{clientes.length} clientes activos</p>
            </div>
            <button
                onClick={() => navigate('/clientes/nuevo')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-600/20"
                >
                    + Nuevo cliente
            </button>
        </div>

        <div className="mb-4">
            <input 
                type="text"
                value={busqueda}
                onChange={handleBusqueda}
                placeholder="Buscar por nombre o apellido..."
                className="w-full max-w-sm bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
            />
        </div>

        {loading ? (
            <Spinner />
        ) : clientes.length === 0 ? (
            <EmptyState message="No se encuentran clientes" />
        ) : (
            <div className="bg-slate-800/30 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-800/60 border-b border-slate-800">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Nombre</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">DNI</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Contacto principal</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Estado</th>
                            <th className="px-6 py-4" />
                        </tr>
                    </thead>
                <tbody className="divide-y divide-slate-800/50">
                    {clientes.map((c) => (
                        <tr 
                            key={c.idCliente}
                            onClick={() => navigate(`/clientes/${c.idCliente}`)}
                            className="hover:bg-blue-600/5 cursor-pointer transition-colors group"
                        >
                            <td className="px-6 py-4 font-medium text-slate-100 group-hover:text-blue-400 transition-colors">
                                {c.nombre} {c.apellido}
                            </td>
                            <td className="px-6 py-4 text-slate-400">{c.dni}</td>
                            <td className="px-6 py-4 text-slate-400">
                                {c.contactos?.[0]?.detalle ?? '—'}
                            </td>
                            <td className="px-6 py-4">
                                {c.enViaje ? (
                                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    En viaje
                                </span>
                            ) : (
                                <span className="py-1 px-2.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-400 border border-slate-700">
                                    No esta en viaje
                                </span>
                            )}
                            </td>
                            <td className="px-6 py-4 text-right text-slate-500 group-hover:text-slate-300 text-xs"> Ver detalles</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        )}
    </div>
    )
}