import {useState, useEffect, useRef} from 'react'
import { buscarHoteles } from '../api/hotel.ts'
import type { HotelResponseDTO } from  '../types'

interface Props {
    value: HotelResponseDTO | null
    onChange: (hotel: HotelResponseDTO | null) => void
    onNombreLibre: (nombre:string) => void
}

export function BuscadorHotel({ value, onChange, onNombreLibre }: Props) {
    const [query, setQuery] = useState(value?.nombre ?? '')
    const [resultados, setResultados] = useState<HotelResponseDTO[]>([])
    const [abierto, setAbierto] = useState(false)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if(query.length < 2) {
            setResultados([])
            setAbierto(false)
            return
        }

        if (value && value.nombre === query) return

        if (debounceRef.current) clearTimeout(debounceRef.current)

        debounceRef.current = setTimeout(async () => {
            try {
                const { data } = await buscarHoteles(query) 
                setResultados(data)
                setAbierto(true)
            } catch {
                setResultados([])
            }
    }, 300)
}, [query])

    const seleccionar = (hotel: HotelResponseDTO) => {
        onChange(hotel)
        setQuery(hotel.nombre)
        setAbierto(false)
        setResultados([])
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val)
        onChange(null)
        onNombreLibre(val)
    }

    const limpiar = () => {
        setQuery('')
        onChange(null)
        onNombreLibre('')
        setResultados([])
        setAbierto(false)
    }
    
    return (
        <div className="relative">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Buscar hotel existente"
                    className="w-full border rounded px-3 py-2 text-sm"
                />
                {query && (
                    <button 
                        type="button"
                        onClick={limpiar}
                        className="text-gray-400 hover:text-gray-600 text-xs px-2"
                    >
                        X
                    </button>
                )}
            </div>

            {abierto && resultados.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded shadow-md mt-1 max-h-48 overflow-y-auto">
                {resultados.map((hotel) => (
                    <li 
                        key={hotel.idHotel}
                        onClick={() => seleccionar(hotel)}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    >
                        <span className="font-medium">{hotel.nombre}</span>
                        {hotel.direccion && (
                            <span className="text-gray-400 ml-2 text-xs">
                            {hotel.direccion}
                            </span>
                        )}
                    </li>
                ))}
                </ul>
            )}

            {abierto && resultados.length === 0 && query.length >= 2 && !value && (
                <p className="text-xs text-yellow-600 mt-1">
                    No se encontro el hotel, al completar este campo se creara uno nuevo
                </p>
            )}
        </div>
    )
}