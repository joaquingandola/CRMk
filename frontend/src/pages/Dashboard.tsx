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

}