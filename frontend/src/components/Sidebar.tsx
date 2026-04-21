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
    <aside className="w-56 min-h-screen bg-slate-900/50 border-r border-slate-800 flex flex-col">
      <div className="px-5 py-5 border-b border-slate-800">
        <span className="text-base font-semibold text-white tracking-tight">CRM</span> 
        {/* deberia pensarse capaz como si se pusiera el nombre de la empresa del agente */}
        <span className="block text-xs text-slate-500 mt-0.5 font-medium">Panel de gestión</span>
      </div>
      
      
    <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
    </nav>
      
    <div className="px-4 py-3 border-t border-slate-800">
      {usuario && (
        <div className = "mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-200 truncate">
              {usuario.username} 
            </span>
            {isAdmin && (
              <span className="text-xs font-medium bg-violet-900/30 text-violet-400 border border-violet-800 px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
          <span className = "text-xs text-slate-500 truncate block">{usuario.email}</span>
        </div>
      )}
    <button
      onClick={handleLogout}
      className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors">
        Cerrar sesión
      </button>
    </div>
  </aside>
  )
}