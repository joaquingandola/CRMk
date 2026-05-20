import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getAerolineas } from "../../api/aerolineas"
import { actualizarViaje, getViajePorId } from "../../api/viajes"
import { Spinner } from "../../components/ui/Spinner"
import type { AerolineaResponseDTO } from "../../types"

export function ViajeEditar() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [aerolineas, setAerolineas] = useState<AerolineaResponseDTO[]>([])
    const [form, setForm] = useState({
        idAerolinea: '',
        fechaInicioViaje: '',
        fechaFinViaje: '',
        precio: '',
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [guardando, setGuardando] = useState(false)

    useEffect(() => {
        if (!id) return

        setLoading(true)
        setError('')

        Promise.all([
            getViajePorId(Number(id)),
            getAerolineas(),
        ])
            .then(([{ data: viaje }, { data: aerolineasData }]) => {
                setAerolineas(aerolineasData)
                setForm({
                    idAerolinea: viaje.aerolinea?.idAerolinea ? String(viaje.aerolinea.idAerolinea) : '',
                    fechaInicioViaje: viaje.fechaInicioViaje?.split('T')[0] ?? '',
                    fechaFinViaje: viaje.fechaFinViaje?.split('T')[0] ?? '',
                    precio: viaje.precio != null ? String(viaje.precio) : '',
                })
            })
            .catch(() => setError('No se pudieron cargar los datos del viaje'))
            .finally(() => setLoading(false))
    }, [id])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return

        setError('')

        if (form.fechaInicioViaje && form.fechaFinViaje && form.fechaInicioViaje > form.fechaFinViaje) {
            setError('La fecha de inicio no puede ser posterior a la fecha de fin.')
            return
        }

        setGuardando(true)
        try {
            await actualizarViaje(Number(id), {
                idAerolinea: Number(form.idAerolinea),
                fechaInicioViaje: form.fechaInicioViaje || undefined,
                fechaFinViaje: form.fechaFinViaje || undefined,
                precio: form.precio ? Number(form.precio) : undefined,
            })
            navigate(`/viajes/${id}`)
        } catch (err: any) {
            setError(err.response?.data?.mensaje ?? 'No se pudo actualizar el viaje')
        } finally {
            setGuardando(false)
        }
    }

    if (loading) return <Spinner />

    return (
        <div className="max-w-2xl space-y-6">
            <button
                onClick={() => navigate(`/viajes/${id}`)}
                className="text-sm text-slate-400 hover:text-blue-400 mb-2 flex items-center gap-1 transition-colors group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver
            </button>

            <h1 className="text-2xl font-bold text-white tracking-light">Editar viaje</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-5">
                        Datos generales
                    </h2>

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-300">
                                Aerolínea <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="idAerolinea"
                                value={form.idAerolinea}
                                onChange={handleChange}
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
                                    name="fechaInicioViaje"
                                    type="date"
                                    value={form.fechaInicioViaje}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white [color-scheme:dark] focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-300">
                                    Fecha de fin <span className="text-red-400">*</span>
                                </label>
                                <input
                                    name="fechaFinViaje"
                                    type="date"
                                    value={form.fechaFinViaje}
                                    min={form.fechaInicioViaje}
                                    onChange={handleChange}
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
                                name="precio"
                                type="number"
                                min="0"
                                value={form.precio}
                                onChange={handleChange}
                                required
                                placeholder="150000"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">
                        Campos no incluidos en esta edición
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Esta pantalla actualiza aerolínea, fechas y precio porque son los campos disponibles en el DTO de actualización actual del backend.
                        Destinos, hoteles y acompañantes quedan visibles en el detalle, pero no se editan desde esta propuesta.
                    </p>
                </div>

                {error && (
                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-pulse">
                        {error}
                    </div>
                )}

                <div className="flex gap-4 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate(`/viajes/${id}`)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold py-3 rounded-xl transition-all border border-slate-700"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={guardando}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 disabled:text-slate-400 text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                    >
                        {guardando ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </form>
        </div>
    )
}
