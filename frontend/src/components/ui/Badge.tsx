import type { EstadoConcretoViaje } from "../../types"

const variants: Record<EstadoConcretoViaje, string> = {
    COTIZADO: 'bg-yellow-100 text-yellow-800',
    CONFIRMADO: 'bg-blue-100 text-blue-800',
    CANCELADO: 'bg-red-100 text-red-800', 
    PAGADO: 'bg-green-100 text-green-800', 
}

interface Props {
    estado : EstadoConcretoViaje | null | undefined
}

export function Badge({ estado }: Props) {
    if (!estado) return null
    return (
        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${variants[estado]}`}>
            {estado}
        </span>
    )
}