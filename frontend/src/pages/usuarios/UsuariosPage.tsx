import React, { use, useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { getUsuarios, registrarAgente, desactivarUsuario } from "../../api/usuarios"
import type { UsuarioResponseDTO } from "../../types"
import { Spinner } from "../../components/ui/Spinner"

export function UsuariosPage() {
    const {isAdmin} = useAuth()
    const navigate = useNavigate()

    const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    //form nuevo agente
    const [mostrarForm, setMostrarForm] = useState(false)
    const [form, setForm] = useState({username: '', email: '', password:''})
    const [guardando, setGuardando] = useState(false)
    const [formError, setFormError] = useState('')

    useEffect(() => {
        if(!isAdmin) {
            navigate('/clientes')
            return
        }
        cargar()
    }, [isAdmin])

    const cargar = async () => {
        setLoading(true)
        try {
            const {data} = await getUsuarios()
            setUsuarios(data)
        } catch {
            setError("No se pudieron cargar los usuarios")
        }
        finally {
            setLoading(false)
        }
    }

    const handleRegistrar = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')
        setGuardando(true)
        try{
            await registrarAgente(form)
            setForm({username: '', email: '', password:''})
            setMostrarForm(false)
            await cargar()
        } catch (err: any) {
            setFormError(err.response?.data?.message ?? 'Error al registrar agente')
        } finally {
            setGuardando(false)
        }
    }

    const handleDesactivar = async (id: number, username: string) => {
        if(!confirm(`¿Desactivar el usuario ${username}?`)) return
        try {
            await desactivarUsuario(id)
            await cargar()
        } catch {
            setError('Error al desactivar usuario')
        }
    }

    if(loading) return <Spinner />
    
      return (
        <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
            <div>
            <h1 className="text-xl font-semibold text-gray-900">Usuarios</h1>
            <p className="text-sm text-gray-500 mt-0.5">{usuarios.length} usuarios registrados</p>
            </div>
            <button
            onClick={() => setMostrarForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
            + Nuevo agente
            </button>
        </div>

        {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
            </div>
        )}

        {/* Tabla usuarios */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Usuario</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Rol</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3" />
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {usuarios.map((u) => (
                <tr key={u.idUsuario} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{u.username}</td>
                    <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                    <td className="px-5 py-3.5">
                    {u.tipoRol === 'ADMIN' ? (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">
                        Admin
                        </span>
                    ) : (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        Agente
                        </span>
                    )}
                    </td>
                    <td className="px-5 py-3.5">
                    {u.activo ? (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                        Activo
                        </span>
                    ) : (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                        Inactivo
                        </span>
                    )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                    {u.activo && u.tipoRol !== 'ADMIN' && (
                        <button
                        onClick={() => handleDesactivar(u.idUsuario, u.username)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                        Desactivar
                        </button>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* Modal nuevo agente */}
        {mostrarForm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm mx-4">
                <h3 className="text-base font-semibold text-gray-900 mb-5">
                Registrar nuevo agente
                </h3>

                <form onSubmit={handleRegistrar} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de usuario
                    </label>
                    <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                    placeholder="juan.perez"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                    </label>
                    <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="agente@email.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña inicial
                    </label>
                    <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {formError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {formError}
                    </p>
                )}

                <div className="flex gap-3 pt-1">
                    <button
                    type="button"
                    onClick={() => {
                        setMostrarForm(false)
                        setFormError('')
                        setForm({ username: '', email: '', password: '' })
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                    Cancelar
                    </button>
                    <button
                    type="submit"
                    disabled={guardando}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                    >
                    {guardando ? 'Registrando...' : 'Registrar'}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    )
}
