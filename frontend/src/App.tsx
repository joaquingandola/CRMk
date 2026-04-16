import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { PrivateRoute } from "./components/PrivateRoute"
import { Layout } from "./components/Layout"
import { Login } from "./pages/Login"
import { ClientesPage } from "./pages/clientes/ClientesPage"


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
                            <Route path="/clientes/:id" element={<ClientesDetalle />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}