import { useEffect, useState } from "react"
import { data, useNavigate, useSearchParams } from "react-router-dom"
import { crearViaje } from "../../api/viajes"
import { getAerolineas } from "../../api/aerolineas"
import { getClientesActivos } from "../../api/clientes"
import { BuscadorCiudad } from "../../components/ui/BuscadorCiudad"
import { crearAcompanante } from "../../api/acompanantes"

import type {
    AerolineaResponseDTO,
    ClienteResponseDTO,
    AcompananteFormData,
    DestinoFormData,
} from '../../types'

const acompananteVacio = (): AcompananteFormData => ({
    nombre : '', apellido : '', dni: '', fechaNacimiento : '',
})

const destinoVacio = (): DestinoFormData => ({
    ciudad: null, fechaLlegada: '', fechaSalida: '',
})

export function ViajeNuevo() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const clienteIdParam = searchParams.get('clienteId')

    //res
    const[aerolineas, setAerolineas] = useState<AerolineaResponseDTO[]>([])

    //const[clientes, setClientes] = useState<ClienteResponseDTO[]>([]) -=- por ahora afuera, porque se crea viaje desde cliente

    //form principal
    const [idCliente, setIdCliente] = useState<string>(clienteIdParam ?? '')
    const [idAerolinea, setIdAerolinea] = useState<string>('')
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const [precio, setPrecio] = useState('')

    //destinos
    const [destinos, setDestinos] = useState<DestinoFormData[]>([destinoVacio()])

    //acompanantes
    const [acompanantes, setAcompanantes] = useState<AcompananteFormData[]>([])

    const [error, setError] = useState('')
    const [guardando, setGuardando] = useState(false)

    /* ---- corto por lo mismo que arriba
    useEffect(() => {
        getAerolineas().then(({ data }) => setAerolineas(data))
        if(!clienteIdParam) {
            getClientesActivos().then(({data}) => setClientes(data))
        }
    }, [])*/

    //destinos
    const actualizarDestino = (
        index: number,
        field: keyof DestinoFormData,
        value: any
    ) => {
        const nuevos = [...destinos]
        nuevos[index] = {...nuevos[index], [field]: value}
        setDestinos(nuevos)
    }

    const agregarDestinos = () => setDestinos([...destinos, destinoVacio()])
    const quitarDestino = (i: number) => setDestinos(destinos.filter((_, idx) => idx !== 1))

    //acompanantes
    const actualizarAcompanante = (
        index: number,
        field: keyof AcompananteFormData,
        value: string,
    ) => {
        const nuevos = [...acompanantes]
        nuevos[index] = { ...nuevos[index], [field]: value}
        setAcompanantes(nuevos)
    }

    const agregarAcompanante = () => 
        setAcompanantes([...acompanantes, acompananteVacio()])

    const quitarAcompanante = (I:number) =>
        setAcompanantes(acompanantes.filter((_, idx) => idx !== 1))


    //submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const destinosValidos = destinos.filter((d) => d.ciudad !== null)
        if (destinosValidos.length === 0) {
            setError('Agregá al menos un destino con ciudad seleccionada.')
            return
        }

        setGuardando(true)
        try {
            const acompanantesValidos = acompanantes.filter(
                (a) => a.nombre && a.apellido && a.dni
            )

            const idsAcompanantes = await Promise.all(
                acompanantesValidos.map((a) =>
                    crearAcompanante({
                        nombre : a.nombre,
                        apellido : a.apellido, 
                        dni: Number(a.dni),
                        fechaNacimiento: a.fechaNacimiento || undefined, 
                    }).then(({ data }) => data.idAcompanante)
                )
            ) 

            const { data } = await crearViaje({
                idCliente: Number(idCliente),
                idAerolinea: Number(idAerolinea),
                fechaInicioViaje: fechaInicio,
                fechaFinViaje: fechaFin,
                precio: Number(precio),
                destinos: destinosValidos.map((d) => ({
                idCiudad: d.ciudad!.idCiudad,
                fechaLlegada: d.fechaLlegada,
                fechaSalida: d.fechaSalida,
                })),
                idAcompanantes: idsAcompanantes
            })
            navigate(`/viajes.${data.idViaje}`)
        } catch (err: any) {
            setError(err.response?.data?.mensaje ?? "No se pudo cargar el viaje")
        } finally {
            setGuardando(false)
        }
    }

    
    return (
        <div className="max-w-2xl">
        <button
            onClick={() =>
            clienteIdParam
                ? navigate(`/clientes/${clienteIdParam}`)
                : navigate('/viajes')
            }
            className="text-sm text-gray-500 hover:text-gray-700 mb-5 flex items-center gap-1"
        >
            ← Volver
        </button>

        <h1 className="text-xl font-semibold text-gray-900 mb-6">Nuevo viaje</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Datos generales */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Datos generales</h2>
            <div className="space-y-4">

                {/* Cliente — solo si no viene por param  ---------------- por ahora queda afuera, se crea el viaje desde el cliente

                {!clienteIdParam && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente <span className="text-red-500">*</span>
                    </label>
                    <select
                    value={idCliente}
                    onChange={(e) => setIdCliente(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    <option value="">Seleccioná un cliente</option>
                    {clientes.map((c) => (
                        <option key={c.idCliente} value={c.idCliente}>
                        {c.nombre} {c.apellido} — DNI {c.dni}
                        </option>
                    ))}
                    </select>
                </div>
                )}
                */}
                
                {/* Aerolínea */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aerolínea <span className="text-red-500">*</span>
                </label>
                <select
                    value={idAerolinea}
                    onChange={(e) => setIdAerolinea(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Seleccioná una aerolínea</option>
                    {aerolineas.map((a) => (
                    <option key={a.idAerolinea} value={a.idAerolinea}>
                        {a.aerolinea}
                    </option>
                    ))}
                </select>
                </div>

                {/* Fechas y precio */}
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de fin <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="date"
                    value={fechaFin}
                    min={fechaInicio}
                    onChange={(e) => setFechaFin(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio (ARS) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    min="0"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                    placeholder="150000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
            </div>
            </div>

            {/* Destinos */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">
                Destinos
                <span className="ml-1 text-xs font-normal text-gray-400">
                    (en orden de visita)
                </span>
                </h2>
                <button
                type="button"
                onClick={agregarDestinos}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                + Agregar destino
                </button>
            </div>

            <div className="space-y-4">
                {destinos.map((d, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                        Destino {i + 1}
                    </span>
                    {destinos.length > 1 && (
                        <button
                        type="button"
                        onClick={() => quitarDestino(i)}
                        className="text-xs text-red-400 hover:text-red-600"
                        >
                        Quitar
                        </button>
                    )}
                    </div>
                    <BuscadorCiudad
                    value={d.ciudad}
                    onChange={(ciudad) => actualizarDestino(i, 'ciudad', ciudad)}
                    placeholder="Buscar ciudad..."
                    />
                    <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                        Llegada
                        </label>
                        <input
                        type="date"
                        value={d.fechaLlegada}
                        min={fechaInicio}
                        max={fechaFin}
                        onChange={(e) => actualizarDestino(i, 'fechaLlegada', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                        Salida
                        </label>
                        <input
                        type="date"
                        value={d.fechaSalida}
                        min={d.fechaLlegada || fechaInicio}
                        max={fechaFin}
                        onChange={(e) => actualizarDestino(i, 'fechaSalida', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* Acompañantes */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">
                Acompañantes
                <span className="ml-1 text-xs font-normal text-gray-400">(opcional)</span>
                </h2>
                <button
                type="button"
                onClick={agregarAcompanante}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                + Agregar acompañante
                </button>
            </div>

            {acompanantes.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-2">
                Sin acompañantes. Hacé clic en "+ Agregar" para sumar uno.
                </p>
            ) : (
                <div className="space-y-4">
                {acompanantes.map((a, i) => (
                    <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">
                        Acompañante {i + 1}
                        </span>
                        <button
                        type="button"
                        onClick={() => quitarAcompanante(i)}
                        className="text-xs text-red-400 hover:text-red-600"
                        >
                        Quitar
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                        <input
                            type="text"
                            value={a.nombre}
                            onChange={(e) => actualizarAcompanante(i, 'nombre', e.target.value)}
                            placeholder="Juan"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        </div>
                        <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Apellido</label>
                        <input
                            type="text"
                            value={a.apellido}
                            onChange={(e) => actualizarAcompanante(i, 'apellido', e.target.value)}
                            placeholder="García"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        </div>
                        <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">DNI</label>
                        <input
                            type="number"
                            value={a.dni}
                            onChange={(e) => actualizarAcompanante(i, 'dni', e.target.value)}
                            placeholder="30123456"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        </div>
                        <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Fecha de nacimiento
                        </label>
                        <input
                            type="date"
                            value={a.fechaNacimiento}
                            onChange={(e) => actualizarAcompanante(i, 'fechaNacimiento', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>

            {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
            </p>
            )}

            <div className="flex gap-3">
            <button
                type="button"
                onClick={() =>
                clienteIdParam
                    ? navigate(`/clientes/${clienteIdParam}`)
                    : navigate('/viajes')
                }
                className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={guardando}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
                {guardando ? 'Guardando...' : 'Crear viaje'}
            </button>
            </div>
        </form>
        </div>
  ) 
}