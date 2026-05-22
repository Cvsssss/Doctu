import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './styles/style.css';
import Navbar from './components/Navbar';

// ── Páginas Públicas ──
import Inicio          from './pages/Inicio';
import Login           from './pages/Login';
import RegistroPaciente from './pages/RegistroPaciente';

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
const Protegida = ({ children, rol }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (rol && user.rol !== rol) {
    return <Navigate to={user.rol === 'medico' ? '/dashboard-medico' : '/portal-paciente'} replace />;
  }
  return children;
};

/* ─── App ─── */
function App() {
  /**
   * user: {
   *   id:           number,
   *   nombre:       string,
   *   email:        string,
   *   rol:          'medico' | 'paciente',
   *   especialidad: string | undefined,
   * }
   */

  
  const [user, setUser] = useState(null);

  const login  = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="app-container">
          <Navbar />

          <Routes>
            {/* Públicas */}
            <Route path="/"         element={<Inicio />} />
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
      </Router>
    </AuthContext.Provider>
  );
}

export default App;