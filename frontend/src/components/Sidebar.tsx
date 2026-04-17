import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const agentLinks = [
    {to : '/clientes', label: 'Clientes'},
    {to: '/viajes', label: 'Viajes'},
]

const adminLinks = [
  { to: '/clientes', label: 'Clientes'},
  {to: '/viajes', label: 'Viajes'},
  {to: '/usuarios', label: 'Usuarios'},
]

export function Sidebar() {
    const { logout, usuario, isAdmin } = useAuth()
    const navigate = useNavigate()
     
    const links = isAdmin ? adminLinks : agentLinks

    const handleLogout = () => {
        logout()
        navigate('/login')
    }
    
    return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-100">
        <span className="text-base font-semibold text-gray-900">CRM</span> 
        {/* deberia pensarse capaz como si se pusiera el nombre de la empresa del agente */}
        <span className="block text-xs text-gray-400 mt-0.5">Panel de gestión</span>
      </div>
      
      
    <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
    </nav>
      
    <div className="px-4 py-3 border-t border-gray-100">
      {usuario && (
        <div className = "mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800 truncate">
              {usuario.username} 
            </span>
            {isAdmin && (
              <span className="text-xs font-medium bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
          <span className = "text-xs text-gray-400 truncate block">{usuario.email}</span>
        </div>
      )}
    <button
      onClick={handleLogout}
      className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
        Cerrar sesión
      </button>
    </div>
  </aside>
  )
}