import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { crearCliente } from "../../api/clientes"
import type { ContactoInputDTO, Medio } from "../../types"

const MEDIOS: Medio[] = ["MAIL", "TELEFONO", "WHATSAPP"]

export function ClienteNuevo() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        dni: "",
        fechaNacimiento: "",
    })

    const [contactos, setContactos] = useState<ContactoInputDTO[]>([
        { medio: 'TELEFONO', detalle: '' },
    ])
    const [error, setError] = useState("")
    const [guardando, setGuardando] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => 
        setForm({...form, [e.target.name]: e.target.value })

    const handleContactoChange = (
        index: number,
        field: keyof ContactoInputDTO,
        value: string
    ) => {
        const nuevos = [...contactos]
        nuevos[index] = { ...nuevos[index], [field]: value }
        setContactos(nuevos)
    }

    const agregarContacto = () => {
        if(contactos.length > 3) return
        setContactos([...contactos, { medio: 'TELEFONO', detalle: '' }])
    }

    const quitarContacto = (index: number) => 
        setContactos(contactos.filter((_, i) => i !== index))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        
        const contactosFiltrados = contactos.filter((c) => c.detalle.trim() !== "")

        setGuardando(true)
        try {
            const {data} = await crearCliente({
                nombre: form.nombre.trim(),
                apellido: form.apellido.trim(),
                dni: Number(form.dni),
                fechaNacimiento: form.fechaNacimiento || undefined,
                contactos: contactosFiltrados,
            })
            navigate(`/clientes/${data.idCliente}`)
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Error al crear cliente")
        } finally {
            setGuardando(false)
        }
    }
  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate('/clientes')}
        className="text-sm text-gray-500 hover:text-gray-700 mb-5 flex items-center gap-1"
      >
        ← Clientes
      </button>

      <h1 className="text-xl font-semibold text-gray-900 mb-6">Nuevo cliente</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Datos personales */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Datos personales</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Juan"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                placeholder="Pérez"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI <span className="text-red-500">*</span>
              </label>
              <input
                name="dni"
                type="number"
                value={form.dni}
                onChange={handleChange}
                required
                placeholder="12345678"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
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

        {/* Contactos */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Contactos</h2>
            {contactos.length < 4 && (
              <button
                type="button"
                onClick={agregarContacto}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                + Agregar contacto
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
                  placeholder={
                    c.medio === 'MAIL' ? 'ejemplo@mail.com' :
                    c.medio === 'TELEFONO' || c.medio === 'WHATSAPP' ? '+54 9 11 1234 5678' :
                    '@usuario'
                  }
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {contactos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => quitarContacto(i)}
                    className="text-gray-400 hover:text-red-500 text-lg leading-none transition-colors"
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

        {/* Acciones */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/clientes')}
            className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {guardando ? 'Guardando...' : 'Crear cliente'}
          </button>
        </div>
      </form>
    </div>
  )
}