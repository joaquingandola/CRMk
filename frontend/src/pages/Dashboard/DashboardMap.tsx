import {useEffect, useState } from "react"
import {useNavigate} from "react-router-dom"
import {getClientesEnViaje, getClientesActivos } from "../../api/dashboard"
import type { 
    ClienteResponseDTO,
    ViajeResponseDTO,
    CiudadVisitadaDTO } from "../../types"
import {Spinner} from "../../components/ui/Spinner"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;



export function DashboardMap() {
    const [clientesEnViaje, setClientesEnViaje] = useState<ClienteResponseDTO[]>([])
    const [viajes, setViajes] = useState<ViajeResponseDTO[]>([])
    const [ciudadesVisitadas, setCiudadesVisitadas] = useState<CiudadVisitadaDTO[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        Promise.all([
            getClientesEnViaje(),
            getTodosLosViajes()
        ]).then(([ca, cv]) => {
            setClientesEnViaje(ca.data)
            setViajes(cv.data)
        },[])


    return (
        <div className="p-4">
            <h1>Dashboard Map</h1>
            <p>This is the dashboard map page.</p>
        </div>
    )
}