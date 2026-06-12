import { useState, useEffect, useRef } from "react"
import { buscarCiudades } from "../../api/ciudades"
import type { CiudadResponseDTO } from "../../types"

interface Props {
    value : CiudadResponseDTO | null
    onChange: (ciudad: CiudadResponseDTO) => void
    placeholder?: string
}

export function BuscadorCiudad({ value, onChange, placeholder = 'Buscar Ciudad...'} : Props) {
    const [query, setQuery] = useState(value ? `${value.nombre}, ${value.pais}` : '')
    const [resultados, setResultados]= useState<CiudadResponseDTO[]>([])
    const [abierto, setAbierto]= useState(false)
    const [buscando, setBuscando] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if(ref.current && !ref.current.contains(e.target as Node)) {
                setAbierto(false)
            }
        }
        document.addEventListener('mousedown', handler)
    }, [])

    //debounce 
    useEffect(() => {
        if(query.trim().length < 2) {
            setResultados([])
            return
        }
        const timer = setTimeout(async () => {
            setBuscando(true)
        try {
            const {data} = await buscarCiudades(query)
            setResultados(data) 
            setAbierto(true)
        } finally {
            setBuscando(false)
        }
        }, 350)
        return () => clearTimeout(timer)
    }, [query])

    const seleccionar = (ciudad : CiudadResponseDTO) => {
        onChange(ciudad)
        setQuery(`${ciudad.nombre}, ${ciudad.pais}`)
        setAbierto(false)
        setResultados([])
    }

    return (
        <div ref={ref} className="relative">
            <input
                type="text"
                value={query}
                onChange={(e) => {
                setQuery(e.target.value)
                if (value) onChange(null as any) // resetea si escribe de nuevo
                }}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {buscando && (
                <span className="absolute right-3 top-2.5 text-xs text-gray-400">Buscando...</span>
            )}
            {abierto && resultados.length > 0 && (
                <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-52 overflow-y-auto">
                {resultados.map((c) => (
                    <li
                    key={c.idCiudad}
                    onMouseDown={() => seleccionar(c)}
                    className="px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                    <span className="font-medium text-gray-900">{c.nombre}</span>
                    <span className="text-gray-400 ml-1">{c.pais}</span>
                    </li>
                ))}
                </ul>
            )}
            {abierto && !buscando && resultados.length === 0 && query.length >= 2 && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md px-4 py-3 text-sm text-gray-400">
                Sin resultados para "{query}"
                </div>
            )}
        </div>
  )
}
