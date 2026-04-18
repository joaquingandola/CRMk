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
        <div className="max-w-2xl">
        <button
            onClick={() => navigate(`/clientes/${id}`)}
            className="text-sm text-gray-500 hover:text-gray-700 mb-5 flex items-center gap-1"
        >
            ← Volver
        </button>

        <h1 className="text-xl font-semibold text-gray-900 mb-6">Editar cliente</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Datos personales</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
                <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de nacimiento
                </label>
                <input
                    name="fechaNacimiento"
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
            </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Contactos</h2>
                {contactos.length < 4 && (
                <button
                    type="button"
                    onClick={agregarContacto}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                    + Agregar
                </button>
                )}
            </div>
            <div className="space-y-3">
                {contactos.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                    <select
                    value={c.medio}
                    onChange={(e) => handleContactoChange(i, 'medio', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                    {MEDIOS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                    </select>
                    <input
                    type="text"
                    value={c.detalle}
                    onChange={(e) => handleContactoChange(i, 'detalle', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {contactos.length > 1 && (
                    <button
                        type="button"
                        onClick={() => quitarContacto(i)}
                        className="text-gray-400 hover:text-red-500 text-lg leading-none"
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

            <div className="flex gap-3">
            <button
                type="button"
                onClick={() => navigate(`/clientes/${id}`)}
                className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={guardando}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
            </div>
        </form>
        </div>
    )
    }