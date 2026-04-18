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
            <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{clientes.length} clientes activos</p>
        </div>
        <button
          onClick={() => navigate('/clientes/nuevo')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
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
            className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>

        {loading ? (
            <Spinner />
        ) : clientes.length === 0 ? (
            <EmptyState message="No se encuentran clientes" />
        ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Nombre</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">DNI</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Contacto principal</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                <tbody className="divide-y divide-gray-100">
                    {clientes.map((c) => (
                        <tr 
                            key={c.idCliente}
                            onClick={() => navigate(`/clientes/${c.idCliente}`)}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <td className="px-5 py-3.5 font-medium text-gray-900">
                                {c.nombre} {c.apellido}
                            </td>
                            <td className="px-5 py-3.5 text-gray-500">{c.dni}</td>
                            <td className="px-5 py-3.5 text-gray-500">
                                {c.contactos?.[0]?.detalle ?? '—'}
                            </td>
                            <td className="px-5 py-3.5">
                                {c.enViaje ? (
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                                    En viaje
                                </span>
                            ) : (
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                                    No esta en viaje
                                </span>
                            )}
                            </td>
                            <td className="px-5 py-3.5 text-right text-gray-400 text-xs"> Ver detalles</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        )}
    </div>
    )
}