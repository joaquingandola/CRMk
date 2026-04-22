import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    getClientesActivos, 
    getClientesEnViaje, 
    getTodosLosViajes, 
    getCiudadesMasVisitadas,
} from '../api/dashboard'

import type {
    ClienteResponseDTO,
    ViajeResponseDTO,
    CiudadVisitadaDTO,
    EstadoConcretoViaje,
} from '../types'

import { Spinner } from "../components/ui/Spinner"
import { Badge } from "../components/ui/Badge"

interface Conteos {
    COTIZADO: number
    CONFIRMADO: number
    PAGADO: number
    CANCELADO: number
}

export function DashboardPage() {
    const navigate = useNavigate()

    const [clientesActivos, setClientesActivos ] = useState<ClienteResponseDTO[]>([])
    const [clientesEnViaje, setClientesEnViaje] = useState<ClienteResponseDTO[]>([])
    const [viajes, setViajes] = useState<ViajeResponseDTO[]>([])
    const [ciudades, setCiudades] = useState<CiudadVisitadaDTO[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            getClientesActivos(),
            getClientesEnViaje(),
            getTodosLosViajes(),
            getCiudadesMasVisitadas(),
        ]).then(([ca, cev, v, c]) => {
            setClientesActivos(ca.data)
            setClientesEnViaje(cev.data)
            setViajes(v.data)
            setCiudades(c.data.slice(0, 5))
        }).finally(() => setLoading(false))
    }, [])

    const conteos: Conteos = viajes.reduce(
        (acc, v) => {
            const estado = v.estadoActual?.estadoConcretoViaje
            if(estado && estado in acc) acc [estado as keyof Conteos]++
            return acc
        },
        {COTIZADO: 0, CONFIRMADO: 0, PAGADO: 0, CANCELADO: 0}
    )

    const formatFecha = (iso: string) => 
        new Date(iso).toLocaleDateString('es-AR', {
            day: '2-digit', month: 'short', year: 'numeric',
        })

    if(loading) return <Spinner />

    const maxVisitas = ciudades[0]?.cantidadVisitas ?? 1

    return (
    <div className="space-y-6">

        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-sm text-slate-400 mt-0.5">Resumen general del sistema</p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-4">
            <MetricCard
                label="Clientes activos"
                value={clientesActivos.length}
                color="slate"
            />
            <MetricCard
                label="En viaje ahora"
                value={clientesEnViaje.length}
                color="blue"
            />
            <MetricCard
                label="Cotizados"
                value={conteos.COTIZADO}
                color="amber"
                sublabel="pendientes"
            />
            <MetricCard
                label="Confirmados"
                value={conteos.CONFIRMADO}
                color="teal"
                sublabel="activos"
            />
        </div>

      {/* Clientes en viaje */}
        <div className="bg-slate-800/30 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-4 border-b border-slate-800">
                <h2 className="text-sm font-semibold text-white">Clientes en viaje ahora</h2>
                <p className="text-xs text-slate-500 mt-0.5">{clientesEnViaje.length} clientes actualmente viajando</p>
            </div>

            {clientesEnViaje.length === 0 ? (
                <div className="px-6 py-10 text-center text-slate-500 text-sm">
                    Ningún cliente está viajando en este momento.
                </div>
            ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-800/60">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Contacto</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Viajes activos</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {clientesEnViaje.map((c) => {
                const viajesDelCliente = viajes.filter(
                  (v) =>
                    v.idCliente === c.idCliente &&
                    v.estadoActual?.estadoConcretoViaje === 'CONFIRMADO'
                )
                return (
                  <tr
                    key={c.idCliente}
                    onClick={() => navigate(`/clientes/${c.idCliente}`)}
                    className="hover:bg-blue-600/5 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-slate-100 group-hover:text-blue-400 transition-colors">
                      {c.nombre} {c.apellido}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {c.contactos?.[0]?.detalle ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {viajesDelCliente.length > 0 ? (
                        <div className="space-y-1">
                          {viajesDelCliente.map((v) => (
                            <div
                              key={v.idViaje}
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/viajes/${v.idViaje}`)
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
                            >
                              {v.destinos.length > 0
                                ? v.destinos.map((d) => d.ciudad.nombre).join(' → ')
                                : 'Sin destinos'}
                              {' · '}
                              {formatFecha(v.fechaInicioViaje)} → {formatFecha(v.fechaFinViaje)}
                            </div>
                          ))}
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 group-hover:text-slate-300 text-xs">
                      Ver →
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Fila inferior: viajes por estado + ciudades */}
      <div className="grid grid-cols-2 gap-4">

        {/* Viajes por estado */}
        <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <h2 className="text-sm font-semibold text-white mb-4">Viajes por estado</h2>
          <div className="space-y-3">
            {(
              [
                { estado: 'COTIZADO',   count: conteos.COTIZADO,   color: 'bg-yellow-400' },
                { estado: 'CONFIRMADO', count: conteos.CONFIRMADO, color: 'bg-blue-400'   },
                { estado: 'PAGADO',     count: conteos.PAGADO,     color: 'bg-green-400'  },
                { estado: 'CANCELADO',  count: conteos.CANCELADO,  color: 'bg-red-400'    },
              ] as { estado: EstadoConcretoViaje; count: number; color: string }[]
            ).map(({ estado, count, color }) => {
              const total = viajes.length || 1
              const pct = Math.round((count / total) * 100)
              return (
                <div key={estado}>
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge estado={estado} />
                    <span className="text-xs text-slate-400">{count} viajes</span>
                  </div>
                  <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} opacity-70 transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Totales */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-500">
            <span>Total viajes</span>
            <span className="text-slate-300 font-medium">{viajes.length}</span>
          </div>
        </div>

        {/* Ciudades más visitadas */}
        <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <h2 className="text-sm font-semibold text-white mb-4">Ciudades más visitadas</h2>

          {ciudades.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              Sin datos de destinos todavía.
            </p>
          ) : (
            <div className="space-y-3">
              {ciudades.map((c, i) => {
                const pct = Math.round((c.cantidadVisitas / maxVisitas) * 100)
                return (
                  <div key={c.idCiudad}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-4">{i + 1}.</span>
                        <span className="text-sm text-slate-200 font-medium">{c.nombre}</span>
                        <span className="text-xs text-slate-500">{c.pais}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {c.cantidadVisitas} {c.cantidadVisitas === 1 ? 'visita' : 'visitas'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-400 opacity-70 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
    label:string
    value:number
    color: 'slate' | 'blue' | 'amber' | 'teal'
    sublabel?:string
}

const colorMap: Record<MetricCardProps['color'], string> = {
    slate: 'bg-slate-700/40 border-slate-700 text-slate-100',
    blue: 'bg-blue-600/10 border-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
}

function MetricCard({ label, value, color, sublabel }: MetricCardProps) {
    return (
        <div className={`rounded-2xl border p-5 backdrop-blur-sm ${colorMap[color]}`}>
            <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
            {sublabel} && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>
        </div>
    )
}