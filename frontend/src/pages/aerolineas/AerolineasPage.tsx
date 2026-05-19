import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { crearAerolinea, getAerolineas } from "../../api/aerolineas"
import type { AerolineaResponseDTO } from "../../types"
import { useAuth } from "../../hooks/useAuth"
import { Spinner } from "../../components/ui/Spinner"
import { EmptyState } from "../../components/ui/EmptyState"

export function AerolineasPage() {
    const { isAdmin } = useAuth()
    const [aerolineas, setAerolineas] = useState<AerolineaResponseDTO[]>([])
    const [nombre, setNombre] = useState('')
    const [loading, setLoading] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState('')
    const [exito, setExito] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if(!isAdmin) {
            navigate('/dashboard')
            return
        }
        cargarAerolineas()
    }, [])

    const cargarAerolineas = async () => {
        setLoading(true)
        try {
            const { data } = await getAerolineas()
            setAerolineas(data)
        } catch {
            setError('No se pudieron cargar las aerolíneas')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setExito('')

        const aerolinea = nombre.trim()
        if (!aerolinea) {
            setError('Ingresá el nombre de la aerolínea.')
            return
        }

        setGuardando(true)
        try {
            const { data } = await crearAerolinea({ aerolinea })
            setAerolineas((actuales) => [...actuales, data])
            setNombre('')
            setExito('Aerolínea cargada correctamente.')
        } catch (err: any) {
            setError(err.response?.data?.mensaje ?? 'No se pudo cargar la aerolínea')
        } finally {
            setGuardando(false)
        }
    }

    if (loading) return <Spinner />

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Cargar aerolíneas</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                    {aerolineas.length} aerolíneas registradas
                </p>
            </div>

            <div className="grid grid-cols-[minmax(0,420px)_1fr] gap-5 items-start">
                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-5"
                >
                    <div>
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                            Nueva aerolínea
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Estas aerolíneas después aparecen al crear viajes.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-300">
                            Nombre <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Aerolíneas Argentinas"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                            {error}
                        </div>
                    )}

                    {exito && (
                        <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                            {exito}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={guardando}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 disabled:text-slate-400 text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                    >
                        {guardando ? 'Guardando...' : 'Cargar aerolínea'}
                    </button>
                </form>

                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="px-6 py-4 border-b border-slate-800">
                        <h2 className="text-sm font-semibold text-white">Aerolíneas cargadas</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Listado disponible para agentes de viaje</p>
                    </div>

                    {loading ? (
                        <div className="py-10">
                            <Spinner />
                        </div>
                    ) : aerolineas.length === 0 ? (
                        <div className="p-6">
                            <EmptyState message="No hay aerolíneas cargadas." />
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-slate-800/60 border-b border-slate-800">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Aerolínea</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {aerolineas.map((a) => (
                                    <tr key={a.idAerolinea} className="hover:bg-blue-600/5 transition-colors">
                                        <td className="px-6 py-4 text-slate-500">#{a.idAerolinea}</td>
                                        <td className="px-6 py-4 font-medium text-slate-100">{a.aerolinea}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}
