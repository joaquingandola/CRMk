import { useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import { importarCiudades, type ImportacionResultadoDTO } from "../../api/importacionCiudades"
import { useAuth } from "../../hooks/useAuth"
import { Spinner } from "../../components/ui/Spinner"

export function ImportacionCiudadesPage() {
    const { isAdmin, authLoading } = useAuth()
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [archivo, setArchivo] = useState<File | null>(null)
    const [importando, setImportando] = useState(false)
    const [error, setError] = useState('')
    const [resultado, setResultado] = useState<ImportacionResultadoDTO | null>(null)

    const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const seleccionado = e.target.files?.[0] ?? null
        setArchivo(seleccionado)
        setError('')
        setResultado(null)
    }

    const limpiarArchivo = () => {
        setArchivo(null)
        setError('')
        setResultado(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setResultado(null)

        if (!archivo) {
            setError('Seleccioná un archivo CSV para importar.')
            return
        }

        if (!archivo.name.toLowerCase().endsWith('.csv')) {
            setError('El archivo tiene que ser un .csv.')
            return
        }

        setImportando(true)
        try {
            const { data } = await importarCiudades(archivo)
            setResultado(data)
            if (inputRef.current) inputRef.current.value = ''
            setArchivo(null)
        } catch (err: any) {
            setError(err.response?.data?.mensaje ?? err.response?.data?.message ?? 'No se pudo importar el archivo CSV')
        } finally {
            setImportando(false)
        }
    }

    if (authLoading) return <Spinner />
    if (!isAdmin) return <Navigate to="/dashboard" replace />
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Importación de ciudades</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                    Cargá ciudades del mundo desde un archivo CSV
                </p>
            </div>

            <div className="grid grid-cols-[minmax(0,460px)_1fr] gap-5 items-start">
                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-5"
                >
                    <div>
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                            Subir CSV
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            El archivo se procesa en el backend y crea países/ciudades automáticamente.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-300">
                            Archivo <span className="text-red-400">*</span>
                        </label>
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".csv,text/csv"
                            onChange={handleArchivo}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-blue-400 hover:file:bg-blue-600/20 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                        />
                    </div>

                    {archivo && (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-200 truncate">{archivo.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {(archivo.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={limpiarArchivo}
                                className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                            >
                                Quitar
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={importando}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 disabled:text-slate-400 text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                    >
                        {importando ? 'Importando...' : 'Importar ciudades'}
                    </button>
                </form>

                <div className="space-y-5">
                    <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                        <h2 className="text-sm font-semibold text-white">Formato esperado</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            El CSV debe tener encabezados compatibles con el importador del backend.
                        </p>

                        <div className="mt-5 bg-slate-950/50 border border-slate-800 rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-800/60 border-b border-slate-800">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Campo</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    <tr>
                                        <td className="px-4 py-3 text-slate-200 font-medium">city</td>
                                        <td className="px-4 py-3 text-slate-400">Nombre de la ciudad</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-slate-200 font-medium">country</td>
                                        <td className="px-4 py-3 text-slate-400">Nombre del país</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-slate-200 font-medium">lat</td>
                                        <td className="px-4 py-3 text-slate-400">Latitud</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-slate-200 font-medium">lng</td>
                                        <td className="px-4 py-3 text-slate-400">Longitud</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {resultado && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm">
                            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                                Resultado de importación
                            </h2>
                            <p className="text-sm text-slate-200 mt-3">{resultado.mensaje}</p>

                            <div className="grid grid-cols-2 gap-4 mt-5">
                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Importadas</p>
                                    <p className="text-2xl font-bold text-white mt-1">{resultado.importadas}</p>
                                </div>
                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Errores</p>
                                    <p className="text-2xl font-bold text-white mt-1">{resultado.errores}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
