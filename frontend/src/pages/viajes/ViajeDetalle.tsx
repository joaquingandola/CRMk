import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getViajePorId, cambiarEstadoViaje } from "../../api/viajes"
import type { ViajeResponseDTO, EstadoConcretoViaje } from "../../types"
import { Spinner } from "../../components/ui/Spinner"
import { Badge } from "../../components/ui/Badge"

const TRANSICIONES : Record<EstadoConcretoViaje, EstadoConcretoViaje[]> = {
    COTIZADO: ['CONFIRMADO', 'CANCELADO'],
    CONFIRMADO: ['PAGADO', 'CANCELADO'],
    CANCELADO : [],
    PAGADO: [],
}

export function ViajeDetalle() {
    const { id } = useParams<{ id : string}>()
    const navigate = useNavigate()

    const [viaje, setViaje] = useState<ViajeResponseDTO | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [cambiandoEstado, setCambiandoEstado] = useState(false)

    useEffect(() => {
        if (id) cargar(Number(id))
    }, [id])

    const cargar = async (viajeId: number) => {
        setLoading(true)
        try {
            const { data } = await getViajePorId(viajeId)
            setViaje(data)
        } catch { 
            setError('No se pudo cargar el viaje')
        } finally {
            setLoading(false)
        }
    }


    const handleCambiarEstado = async (nuevo: EstadoConcretoViaje) => {
        if (!id || !viaje) return 
        setCambiandoEstado(true) 
        try {
            const { data } = await cambiarEstadoViaje(Number(id), nuevo)
            setViaje(data)
        } catch (err:any) {
            setError(err.response?.data?.mensaje ?? ' No se pudo cambiar el estado')
        } finally {
            setCambiandoEstado(false)
        }
    }
}