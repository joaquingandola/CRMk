import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getClientePorId, actualizarCliente } from "../../api/clientes"
import type { ContactoInputDTO, Medio } from "../../types"

const MEDIOS: Medio[] = ['MAIL', 'TELEFONO', 'TELEGRAM', 'WHATSAPP']

export function ClienteEditar() {
    const {id} = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
    })
    const [contactos, setContactos] = useState<ContactoInputDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [guardando, setGuardando] = useState(false)

    useEffect (() => {
        if(!id) return 
        getClientePorId(Number(id)).then(({ data }) => {
            setForm({
                nombre: data.nombre,
                apellido: data.apellido,
                fechaNacimiento: data.fechaNacimiento?.split('T')[0] ?? '',
            })
            setContactos(
                data.contactos.map((c) => ({ medio: c.medio, detalle: c.detalle}))
            )
        }).finally(() => setLoading(false))
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => 
        setForm({...form, [e.target.name]: e.target.value })

    const handleContactoChange = (
        index: number, 
        field: keyof ContactoInputDTO,
        value: string
    ) => {
        const nuevos = [...contactos]
        nuevos[index] = { ...nuevos[index], [field] : value}
        setContactos(nuevos)
    }

    const agregarContacto = () => {
        if(contactos.length >=4) return
        setContactos([...contactos, {medio: 'WHATSAPP', detalle: ''}])
    }

    const quitarContacto = (index: number) => 
        setContactos(contactos.filter((_, i) => i !== index))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setGuardando(true)
        try {
            await actualizarCliente(Number(id), {
                nombre: form.nombre.trim(),
                apellido: form.apellido.trim(),
                fechaNacimiento: form.fechaNacimiento || undefined,
                contactos: contactos.filter((c) => c.detalle.trim() !== ''),
            })
            navigate(`/clientes/${id}`)
        } catch(err: any) {
            setError(err.response?.data?.mensaje ?? 'No se pudo actualizar el cliente')
        } finally {
            setGuardando(false)
        }
    }

    if(loading) return (
        <div className="flex justify-center items-center py-16">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="max-w-2xl space-y-6">
        <button
            onClick={() => navigate(`/clientes/${id}`)}
            className="text-sm text-slate-400 hover:text-blue-400 mb-2 flex items-center gap-1 transition-colors group"
        >
            ← Volver
        </button>

        <h1 className="text-2xl font-bold text-white tracking-light">Editar cliente</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-5">Datos personales</h2>
            <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Nombre</label>
                <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                />
                </div>
                <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Apellido</label>
                <input
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                />
                </div>
                <div className="col-span-2 space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">
                    Fecha de nacimiento
                </label>
                <input
                    name="fechaNacimiento"
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white [color-scheme:dark] focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                />
                </div>
            </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Contactos</h2>
                {contactos.length < 4 && (
                <button
                    type="button"
                    onClick={agregarContacto}
                    className="text-xs bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/20 px-3 py-1.5 rounded-lg font-medium transition-all"
                >
                    + Agregar
                </button>
                )}
            </div>
            <div className="space-y-4">
                {contactos.map((c, i) => (
                <div key={i} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <select
                    value={c.medio}
                    onChange={(e) => handleContactoChange(i, 'medio', e.target.value)}
                    className="bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                    >
                    {MEDIOS.map((m) => (
                        <option key={m} value={m} className="bg-slate-900">{m}</option>
                    ))}
                    </select>
                    <input
                    type="text"
                    value={c.detalle}
                    onChange={(e) => handleContactoChange(i, 'detalle', e.target.value)}
                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                    />
                    {contactos.length > 1 && (
                    <button
                        type="button"
                        onClick={() => quitarContacto(i)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors leading:none"
                    >
                        ×
                    </button>
                    )}
                </div>
                ))}
            </div>
            </div>

            {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
            </p>
            )}

            <div className="flex gap-4 pt-2">
            <button
                type="button"
                onClick={() => navigate(`/clientes/${id}`)}
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