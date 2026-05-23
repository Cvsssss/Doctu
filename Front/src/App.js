import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './styles/style.css';
import Navbar from './components/Navbar';

// ── Páginas Públicas ──
import Inicio          from './pages/Inicio';
import Login           from './pages/Login';
import RegistroPaciente from './pages/RegistroUsuario';

// ── Flujo Médico ──
import DashboardMedico    from './pages/DashboardMedico';
import BusquedaPaciente   from './pages/BusquedaPaciente';
import LlenadoExpediente  from './pages/LlenadoExpediente';
import CalendarioBuzon    from './pages/CalendarioBuzon';

// ── Flujo Paciente ──
import PortalPaciente from './pages/PortalPaciente';
import PasarelaPagos  from './pages/PasarelaPagos';

/* ─── AuthContext ─── */
const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthContext.Provider>');
  return ctx;
};

/* ─── Ruta protegida ─── */
// Agregamos un pequeño log para que puedas ver en la consola web qué está decidiendo la ruta
const Protegida = ({ children, rol }) => {
  const { user } = useAuth();
  
  // Si no hay usuario en el contexto, rebota a login
  if (!user) {
    console.warn("⚠️ Acceso denegado: Usuario no autenticado. Redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }
  
  // Si hay usuario pero su rol no coincide con la ruta que quiere ver, lo manda a SU portal
  if (rol && user.rol !== rol) {
    console.warn(`⚠️ Rol incorrecto: Se esperaba ${rol} pero el usuario es ${user.rol}`);
    return <Navigate to={user.rol === 'medico' ? '/dashboard-medico' : '/portal-paciente'} replace />;
  }
  
  // Si todo está bien, renderiza la pantalla solicitada
  return children;
};

/* ─── Componente Principal de Rutas ─── */
function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        {/* Públicas */}
        <Route path="/"         element={<Inicio />} />
        
        {/* Lógica dinámica para la pantalla de Login */}
        <Route
          path="/login"
          element={
            !user
              ? <Login />
              : <Navigate to={user.rol === 'medico' ? '/dashboard-medico' : '/portal-paciente'} replace />
          }
        />
        
        <Route path="/registro" element={<RegistroPaciente />} />

        {/* Médico */}
        <Route path="/dashboard-medico" element={<Protegida rol="medico"><DashboardMedico /></Protegida>} />
        <Route path="/buscar-paciente"  element={<Protegida rol="medico"><BusquedaPaciente /></Protegida>} />
        <Route path="/llenado-expediente" element={<Protegida rol="medico"><LlenadoExpediente /></Protegida>} />
        <Route path="/calendario"       element={<Protegida rol="medico"><CalendarioBuzon /></Protegida>} />

        {/* Paciente */}
        <Route path="/portal-paciente" element={<Protegida rol="paciente"><PortalPaciente /></Protegida>} />
        <Route path="/pasarela-pago"   element={<Protegida rol="paciente"><PasarelaPagos /></Protegida>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

/* ─── App (Proveedor Global) ─── */
function App() {
  const [user, setUser] = useState(null);

  // Funciones globales para manejar la sesión
  const login  = (userData) => {
    console.log("✅ Sesión iniciada globalmente:", userData);
    setUser(userData);
  };
  const logout = () => {
    console.log("🔴 Sesión cerrada");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        {/* Delegamos las rutas a un componente hijo para que pueda consumir el contexto de forma segura */}
        <AppRoutes />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;