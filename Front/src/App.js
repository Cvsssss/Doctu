import React from 'react';
// Importamos las herramientas de navegación 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/style.css';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import RegistroPaciente from './pages/RegistroUsuario';
import DashboardMedico from './pages/DashboardMedico';
import LlenadoExpediente from './pages/LlenadoExpediente';
import CalendarioBuzon from './pages/CalendarioBuzon';
import BusquedaPaciente from './pages/BusquedaPaciente';
import PortalPaciente from './pages/PortalPaciente';
import PasarelaPagos from './pages/PasarelaPagos';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroPaciente />} />

          {/* Rutas del Flujo Médico */}
          <Route path="/dashboard-medico" element={<DashboardMedico />} />
          <Route path="/buscar-paciente" element={<BusquedaPaciente />} />
          <Route path="/llenado-expediente" element={<LlenadoExpediente />} />
          <Route path="/calendario" element={<CalendarioBuzon />} />

          {/* Rutas del Flujo Paciente */}
          <Route path="/portal-paciente" element={<PortalPaciente />} />
          <Route path="/pasarela-pago" element={<PasarelaPagos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;