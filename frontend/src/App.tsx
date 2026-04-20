import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { PrivateRoute } from "./components/PrivateRoute"
import { Layout } from "./components/Layout"
import { Login } from "./pages/Login"
import { ClientesPage } from "./pages/clientes/ClientesPage"
import { ClienteDetalle } from "./pages/clientes/ClienteDetalle"
import { UsuariosPage } from "./pages/usuarios/UsuariosPage"
import { ClienteNuevo } from "./pages/clientes/ClienteNuevo"
import { ClienteEditar } from "./pages/clientes/ClienteEditar"
import { ViajesPage } from "./pages/viajes/ViajesPage"
import { ViajeDetalle } from "./pages/viajes/ViajeDetalle"
import { ViajeNuevo } from "./pages/viajes/ViajeNuevo"

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route element={<PrivateRoute/>}>
                        <Route element={<Layout/>}>
                            <Route index element={<Navigate to="/clientes" replace />} />
                            <Route path="/clientes" element={<ClientesPage />} />
                            <Route path="/clientes/:id" element={<ClienteDetalle />} />
                            <Route path="/usuarios" element={<UsuariosPage />} />
                            <Route path="/clientes/nuevo" element={<ClienteNuevo />} />
                            <Route path="/clientes/:id/editar" element={<ClienteEditar/>} />
                            <Route path="/viajes" element={<ViajesPage/>} />
                            <Route path="/viajes/:id" element={<ViajeDetalle/>} />  
                            <Route path= "/viajes/nuevo" element={<ViajeNuevo/>} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}