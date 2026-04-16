import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export function PrivateRoute() {
    const { isAuth } = useAuth()
    
    return isAuth ? <Outlet /> : <Navigate to="/login" replace/>
}
