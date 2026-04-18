import api from "./axios"
import type { AerolineaResponseDTO } from "../types"

export const getAerolineas = () =>
    api.get<AerolineaResponseDTO[]>('/api/v1/aerolineas')