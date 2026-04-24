import React, { useEffect, useState } from "react"
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
        <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-2xl font-bold text-white tracking-light">Usuarios</h1>
            <p className="text-sm text-slate-400 mt-1">{usuarios.length} usuarios registrados</p>
            </div>
            <button
            onClick={() => setMostrarForm(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
            + Nuevo agente
            </button>
        </div>

        {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-pulse">
            {error}
            </div>
        )}

        {/* Tabla usuarios */}
        <div className="bg-slate-800/30 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
            <table className="w-full text-sm">
            <thead className="bg-slate-800/60 border-b border-slate-800">
                <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuario</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rol</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4" />
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
                {usuarios.map((u) => (
                <tr key={u.idUsuario} className="hover:bg-blue-600/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-100 group-hover:text-blue-400 transition-colors">{u.username}</td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                    {u.tipoRol === 'ADMIN' ? (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        Admin
                        </span>
                    ) : (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-700/60 text-slate-300 border border-slate-700">
                        Agente
                        </span>
                    )}
                    </td>
                    <td className="px-6 py-4">
                    {u.activo ? (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        Activo
                        </span>
                    ) : (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        Inactivo
                        </span>
                    )}
                    </td>
                    <td className="px-6 py-4 text-right">
                    {u.activo && u.tipoRol !== 'ADMIN' && (
                        <button
                        onClick={() => handleDesactivar(u.idUsuario, u.username)}
                        className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg font-medium transition-all"
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
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/40 p-6 w-full max-w-sm mx-4">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-5">
                Registrar nuevo agente
                </h3>

                <form onSubmit={handleRegistrar} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">
                    Nombre de usuario
                    </label>
                    <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                    placeholder="juan.perez"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">
                    Email
                    </label>
                    <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="agente@email.com"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">
                    Contraseña inicial
                    </label>
                    <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                    />
                </div>

                {formError && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
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
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold py-2.5 rounded-xl transition-all border border-slate-700"
                    >
                    Cancelar
                    </button>
                    <button
                    type="submit"
                    disabled={guardando}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 disabled:text-slate-400 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
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
