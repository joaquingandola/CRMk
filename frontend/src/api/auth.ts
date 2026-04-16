import api from './axios'
import type { AuthResponse, LoginRequest } from "../types"

export const loginRequest = (data : LoginRequest) => 
    api.post<AuthResponse>('/auth/login', data)