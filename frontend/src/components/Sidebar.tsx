import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const links = [
    {to : '/clientes', label: 'Clientes'},
    {to: '/viajes', label: 'Viajes'},
]

export function Sidebar() {
    const { logout } = useAuth()
    const navigate = useNavigate()
     
    const handleLogout = () => {
        logout()
        navigate('/login')
    }
