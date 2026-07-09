import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getAerolineas } from "../../api/aerolineas"
import { actualizarViaje, getViajePorId, agregarAcompananteAViaje, quitarAcompananteDeViaje } from "../../api/viajes"
import { crearDestino, actualizarDestino as actualizarDestinoApi, eliminarDestino } from "../../api/destinos"
import { Spinner } from "../../components/ui/Spinner"
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
import type { AerolineaResponseDTO } from "../../types"

export function ViajeEditar() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [aerolineas, setAerolineas] = useState<AerolineaResponseDTO[]>([])
    const [datosGenerales, setDatosGenerales] = useState<DatosGeneralesValue>({
        idAerolinea: '',
        fechaInicioViaje: '',
        fechaFinViaje: '',
        precio: '',
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [guardando, setGuardando] = useState(false)

    const {
        destinos, setDestinos, actualizarDestino, agregarDestino, quitarDestino,
        seleccionarHotel, escribirNombreHotelLibre,
    } = useDestinosForm([], {
        onQuitarPersistido: async (d) => { await eliminarDestino(d.idDestino!) },
    })

    const {
        acompanantes, setAcompanantes, actualizarAcompanante, agregarAcompanante, quitarAcompanante,
    } = useAcompanantesForm([], {
        // desasocia al acompañante de este viaje sin borrar su registro global,
        // porque puede seguir asociado a otros viajes
        onQuitarPersistido: async (a) => { await quitarAcompananteDeViaje(Number(id), a.id!) },
    })

    const actualizarDatoGeneral = (campo: keyof DatosGeneralesValue, valor: string) =>
        setDatosGenerales((prev) => ({ ...prev, [campo]: valor }))

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
                setDatosGenerales({
                    idAerolinea: viaje.aerolinea?.idAerolinea ? String(viaje.aerolinea.idAerolinea) : '',
                    fechaInicioViaje: viaje.fechaInicioViaje?.split('T')[0] ?? '',
                    fechaFinViaje: viaje.fechaFinViaje?.split('T')[0] ?? '',
                    precio: viaje.precio != null ? String(viaje.precio) : '',
                })
                setDestinos(viaje.destinos.map((d) => ({
                    idDestino: d.idDestino,
                    ciudad: d.ciudad,
                    fechaLlegada: d.fechaLlegada?.split('T')[0] ?? '',
                    fechaSalida: d.fechaSalida?.split('T')[0] ?? '',
                    hotelSeleccionado: d.hotel ?? null,
                    hotelNombre: '',
                    hotelDireccion: '',
                })))
                setAcompanantes(viaje.acompanantes.map((a) => ({
                    id: a.idAcompanante,
                    nombre: a.nombre,
                    apellido: a.apellido,
                    dni: String(a.dni),
                    fechaNacimiento: a.fechaNacimiento?.split('T')[0] ?? '',
                })))
            })
            .catch((err: any) => {
                if (err.response?.status === 403 || err.response?.status === 401) {
                    navigate('/viajes', { replace: true })
                    return
                }
                setError('No se pudieron cargar los datos del viaje')
            })
            .finally(() => setLoading(false))
    }, [id, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return

        setError('')

        const errorDestinos = validarDestinos(destinos)
        if (errorDestinos) {
            setError(errorDestinos)
            return
        }

        setGuardando(true)
        try {
            await actualizarViaje(Number(id), {
                idAerolinea: Number(datosGenerales.idAerolinea),
                fechaInicioViaje: datosGenerales.fechaInicioViaje || undefined,
                fechaFinViaje: datosGenerales.fechaFinViaje || undefined,
                precio: datosGenerales.precio ? Number(datosGenerales.precio) : undefined,
            })

            // crea/actualiza los acompañantes cargados y asocia al viaje los que sean nuevos
            const acompanantesAGuardar = acompanantes.filter((a) => a.nombre && a.apellido && a.dni)
            const idsResultado = await guardarAcompanantes(acompanantesAGuardar)
            const idsNuevos = acompanantesAGuardar
                .map((a, idx) => (a.id ? null : idsResultado[idx]))
                .filter((idA): idA is number => idA !== null)
            await Promise.all(idsNuevos.map((idA) => agregarAcompananteAViaje(Number(id), idA)))

            // crea o actualiza cada destino cargado
            await Promise.all(
                destinosValidos(destinos).map((d) => {
                    const payload = destinoFormAPayload(d)
                    return d.idDestino
                        ? actualizarDestinoApi(d.idDestino, payload)
                        : crearDestino({ ...payload, idViaje: Number(id) })
                })
            )

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
