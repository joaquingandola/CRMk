// frontend/src/pages/Dashboard/DashboardMap.tsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getClientesEnViaje, getTodosLosViajes } from "../../api/dashboard"
import type {
    ClienteResponseDTO,
    ViajeResponseDTO,
    DestinoEnViajeDTO,
} from "../../types"
import { Spinner } from "../../components/ui/Spinner"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

import iconMarker from "leaflet/dist/images/marker-icon.png"
import iconRetina from "leaflet/dist/images/marker-icon-2x.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

// ─── tipos internos ───────────────────────────────────────────────────────────

interface ClienteEnDestino {
    cliente: ClienteResponseDTO
    viaje: ViajeResponseDTO
}

interface PinCiudad {
    idCiudad: number
    nombre: string
    pais: string
    latitud: number
    longitud: number
    clientes: ClienteEnDestino[]
}

// ─── helpers de fecha ─────────────────────────────────────────────────────────

/** "YYYY-MM-DD" → Date al inicio del día local */
function parseFechaLocal(iso: string): Date {
    const [y, m, d] = iso.split("-").map(Number)
    return new Date(y, m - 1, d, 0, 0, 0, 0)
}

/** Devuelve true si hoy cae dentro del rango [fechaLlegada, fechaSalida] (inclusive) */
function esDestinoActivo(destino: DestinoEnViajeDTO, ahora: Date): boolean {
    const llegada = parseFechaLocal(destino.fechaLlegada)
    const salida = parseFechaLocal(destino.fechaSalida)
    // fin del día de salida → el cliente todavía está ese día
    salida.setHours(23, 59, 59, 999)
    return llegada <= ahora && ahora <= salida
}

// ─── componente ───────────────────────────────────────────────────────────────

export function DashboardMap() {
    const navigate = useNavigate()
    const [pines, setPines] = useState<PinCiudad[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const cargar = async () => {
            try {
                const [{ data: clientesEnViaje }, { data: todosLosViajes }] =
                    await Promise.all([getClientesEnViaje(), getTodosLosViajes()])

                const idsClientesEnViaje = new Set(
                    clientesEnViaje.map((c) => c.idCliente)
                )

                const ahora = new Date()

                // mapa idCiudad → PinCiudad (acumula clientes)
                const mapaPin = new Map<number, PinCiudad>()

                for (const viaje of todosLosViajes) {
                    // solo viajes de clientes que están en viaje ahora
                    if (!idsClientesEnViaje.has(viaje.idCliente)) continue

                    const cliente = clientesEnViaje.find(
                        (c) => c.idCliente === viaje.idCliente
                    )
                    if (!cliente) continue

                    // destino activo en este momento
                    const destinoActivo = viaje.destinos.find((d) =>
                        esDestinoActivo(d, ahora)
                    )
                    if (!destinoActivo) continue

                    const { idCiudad, nombre, pais, latitud, longitud } =
                        destinoActivo.ciudad

                    // si la ciudad ya tiene pin, solo sumamos el cliente
                    if (mapaPin.has(idCiudad)) {
                        mapaPin.get(idCiudad)!.clientes.push({ cliente, viaje })
                    } else {
                        mapaPin.set(idCiudad, {
                            idCiudad,
                            nombre,
                            pais,
                            latitud,
                            longitud,
                            clientes: [{ cliente, viaje }],
                        })
                    }
                }

                setPines(Array.from(mapaPin.values()))
            } catch {
                setError("No se pudo cargar el mapa.")
            } finally {
                setLoading(false)
            }
        }
        cargar()
    },[])

    const formatFecha = (iso: string) => {
        const [y, m, d] = iso.split("-")
        return `${d}/${m}/${y}`
    }

    if (loading) return <Spinner />

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-sm text-slate-400 hover:text-blue-400 mb-2
                                   flex items-center gap-1 transition-colors group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">
                            ←
                        </span>{" "}
                        Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Mapa de clientes
                    </h1>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Clientes viajando en este momento
                    </p>
                </div>
            </div>

            {/* Métricas rápidas */}
            <div className="grid-cols-2 gap-4 flex items-center max-w-xs">
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Clientes
                    </p>
                    <p className="text-3xl font-bold text-white">
                        {pines.reduce((acc, p) => acc + p.clientes.length, 0)}
                    </p>
                </div>
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Ciudades
                    </p>
                    <p className="text-3xl font-bold text-white">{pines.length}</p>
                </div>
            </div>

            {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {/* Mapa */}
            <div className="rounded-2xl overflow-hidden border border-slate-800"
                 style={{ height: "60vh", minHeight: "420px" }}>
                <MapContainer
                    // centro inicial: mundo
                    center={[20, 10]}
                    zoom={2}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {pines.map((pin) => (
                        <Marker
                            key={pin.idCiudad}
                            position={[pin.latitud, pin.longitud]}
                        >
                            <Popup minWidth={220}>
                                {/* Nombre ciudad */}
                                <div style={{
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    marginBottom: "2px",
                                    color: "#0f172a",
                                }}>
                                    {pin.nombre}
                                </div>
                                <div style={{
                                    fontSize: "12px",
                                    color: "#64748b",
                                    marginBottom: "10px",
                                }}>
                                    {pin.pais}
                                </div>

                                {/* Lista de clientes */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {pin.clientes.map(({ cliente, viaje }) => (
                                        <div
                                            key={`${cliente.idCliente}-${viaje.idViaje}`}
                                            style={{
                                                borderTop: "1px solid #e2e8f0",
                                                paddingTop: "8px",
                                            }}
                                        >
                                            <div style={{
                                                fontWeight: 500,
                                                fontSize: "13px",
                                                color: "#0f172a",
                                            }}>
                                                {cliente.nombre} {cliente.apellido}
                                            </div>

                                            {/* Destinos del viaje en esta ciudad */}
                                            {viaje.destinos
                                                .filter(
                                                    (d) =>
                                                        d.ciudad.idCiudad ===
                                                            pin.idCiudad &&
                                                        esDestinoActivo(
                                                            d,
                                                            new Date()
                                                        )
                                                )
                                                .map((d) => (
                                                    <div
                                                        key={d.idDestino}
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#64748b",
                                                            marginTop: "2px",
                                                        }}
                                                    >
                                                        {formatFecha(d.fechaLlegada)} →{" "}
                                                        {formatFecha(d.fechaSalida)}
                                                    </div>
                                                ))}

                                            {/* Link al viaje */}
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/viajes/${viaje.idViaje}`
                                                    )
                                                }
                                                style={{
                                                    marginTop: "6px",
                                                    fontSize: "12px",
                                                    color: "#2563eb",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    padding: 0,
                                                    textDecoration: "underline",
                                                }}
                                            >
                                                Ver viaje →
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Lista de respaldo si no hay nadie en viaje */}
            {pines.length === 0 && !loading && (
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl
                                p-10 text-center text-slate-500 text-sm">
                    Ningún cliente está en viaje en este momento.
                </div>
            )}

            {/* Tabla resumen (útil en pantallas chicas o como respaldo) */}
            {pines.length > 0 && (
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl
                                overflow-hidden backdrop-blur-sm">
                    <div className="px-6 py-4 border-b border-slate-800">
                        <h2 className="text-sm font-semibold text-white">
                            Detalle por ciudad
                        </h2>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800/60 border-b border-slate-800">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold
                                               text-slate-400 uppercase tracking-wider">
                                    Ciudad
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold
                                               text-slate-400 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold
                                               text-slate-400 uppercase tracking-wider">
                                    Período en destino
                                </th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {pines.flatMap((pin) =>
                                pin.clientes.map(({ cliente, viaje }) => {
                                    const destino = viaje.destinos.find(
                                        (d) =>
                                            d.ciudad.idCiudad === pin.idCiudad &&
                                            esDestinoActivo(d, new Date())
                                    )
                                    return (
                                        <tr
                                            key={`${pin.idCiudad}-${cliente.idCliente}`}
                                            onClick={() =>
                                                navigate(`/viajes/${viaje.idViaje}`)
                                            }
                                            className="hover:bg-blue-600/5 cursor-pointer
                                                       transition-colors group"
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-100
                                                           group-hover:text-blue-400 transition-colors">
                                                {pin.nombre}
                                                <span className="text-slate-500 font-normal
                                                                 ml-1 text-xs">
                                                    {pin.pais}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">
                                                {cliente.nombre} {cliente.apellido}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-xs">
                                                {destino
                                                    ? `${formatFecha(destino.fechaLlegada)} → ${formatFecha(destino.fechaSalida)}`
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-500
                                                           group-hover:text-slate-300 text-xs">
                                                Ver viaje →
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}