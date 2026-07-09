import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { crearViaje } from "../../api/viajes"
import { getAerolineas } from "../../api/aerolineas"
import { eliminarAcompanante } from "../../api/acompanantes"
import { getClientePorId } from "../../api/clientes"
import {
    useDestinosForm,
    useAcompanantesForm,
    validarDestinos,
    destinosValidos,
    destinoFormAPayload,
    guardarAcompanantes,
    DatosGeneralesSection,
    AcompanantesSection,
    DestinosSection,
    type DatosGeneralesValue,
} from "../../utils/ViajeForm"

import type {
    AerolineaResponseDTO,
    ClienteResponseDTO,
} from '../../types'

export function ViajeNuevo() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const clienteIdParam = searchParams.get('clienteId')
    const [cliente, setCliente] = useState<ClienteResponseDTO | null>(null)

    const [aerolineas, setAerolineas] = useState<AerolineaResponseDTO[]>([])

    const [idCliente] = useState<string>(clienteIdParam ?? '')
    const [datosGenerales, setDatosGenerales] = useState<DatosGeneralesValue>({
        idAerolinea: '',
        fechaInicioViaje: '',
        fechaFinViaje: '',
        precio: '',
    })

    const {
        destinos, actualizarDestino, agregarDestino, quitarDestino,
        seleccionarHotel, escribirNombreHotelLibre,
    } = useDestinosForm()

    const {
        acompanantes, actualizarAcompanante, agregarAcompanante, quitarAcompanante,
    } = useAcompanantesForm([], {
        // pre-envío nunca hay acompañantes ya asociados a un viaje, pero se conserva
        // el mismo contrato que en edición por si ya fueron persistidos del lado del servidor
        onQuitarPersistido: async (a) => { await eliminarAcompanante(a.id!) },
    })

    const [error, setError] = useState('')
    const [guardando, setGuardando] = useState(false)

    const actualizarDatoGeneral = (campo: keyof DatosGeneralesValue, valor: string) =>
        setDatosGenerales({ ...datosGenerales, [campo]: valor })

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                const { data: aerolineasData } = await getAerolineas()
                setAerolineas(aerolineasData)

                if (clienteIdParam) {
                    const { data: clienteData } = await getClientePorId(Number(clienteIdParam))
                    setCliente(clienteData)
                }
            } catch (err: any) {
                if (err.response?.status === 403 || err.response?.status === 401) {
                    navigate('/viajes', { replace: true })
                    return
                }

                setError('No se pudieron cargar los datos iniciales')
            }
        }
        cargarDatosIniciales()
    }, [clienteIdParam])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const errorDestinos = validarDestinos(destinos)
        if (errorDestinos) {
            setError(errorDestinos)
            return
        }

        setGuardando(true)
        try {
            const idsAcompanantes = await guardarAcompanantes(acompanantes)

            const { data } = await crearViaje({
                idCliente: Number(idCliente),
                idAerolinea: Number(datosGenerales.idAerolinea),
                fechaInicioViaje: datosGenerales.fechaInicioViaje,
                fechaFinViaje: datosGenerales.fechaFinViaje,
                precio: Number(datosGenerales.precio),
                idAcompanantes: idsAcompanantes,
                destinos: destinosValidos(destinos).map((d) => destinoFormAPayload(d)),
            })
            navigate(`/viajes/${data.idViaje}`)
        } catch (err: any) {
            setError(err.response?.data?.mensaje ?? "No se pudo cargar el viaje")
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="max-w-2xl space-y-6">
            <button
                onClick={() =>
                    clienteIdParam
                        ? navigate(`/clientes/${clienteIdParam}`)
                        : navigate('/viajes')
                }
                className="text-sm text-slate-400 hover:text-blue-400 mb-2 flex items-center gap-1 transition-colors group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver
            </button>

            <h1 className="text-2xl font-bold text-white tracking-light">
                {cliente ? `Nuevo viaje para ${cliente.nombre} ${cliente.apellido}` : 'Nuevo viaje'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <DatosGeneralesSection
                    aerolineas={aerolineas}
                    value={datosGenerales}
                    onChange={actualizarDatoGeneral}
                />

                <AcompanantesSection
                    acompanantes={acompanantes}
                    onActualizar={actualizarAcompanante}
                    onAgregar={agregarAcompanante}
                    onQuitar={quitarAcompanante}
                />

                <DestinosSection
                    destinos={destinos}
                    fechaInicio={datosGenerales.fechaInicioViaje}
                    fechaFin={datosGenerales.fechaFinViaje}
                    onActualizar={actualizarDestino}
                    onAgregar={agregarDestino}
                    onQuitar={quitarDestino}
                    onSeleccionarHotel={seleccionarHotel}
                    onEscribirNombreHotelLibre={escribirNombreHotelLibre}
                />

                {error && (
                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        {error}
                    </div>
                )}

                <div className="flex gap-4 pt-2">
                    <button
                        type="button"
                        onClick={() =>
                            clienteIdParam
                                ? navigate(`/clientes/${clienteIdParam}`)
                                : navigate('/viajes')
                        }
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold py-3 rounded-xl transition-all border border-slate-700"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={guardando}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 disabled:text-slate-400 text-white text-sm font-semibold py-3 rounded-xl transition-all"
                    >
                        {guardando ? 'Guardando...' : 'Crear viaje'}
                    </button>
                </div>
            </form>
        </div>
    )
}
