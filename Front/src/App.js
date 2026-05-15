import React from 'react';
// Importamos las herramientas de navegación que acabamos de instalar
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/style.css';
import Navbar from './components/Navbar';
import Inicio from './components/Inicio';
import RegistroPaciente from './components/RegistroPaciente';

function App() {
  return (
    // Router envuelve toda la aplicación para habilitar la navegación
    <Router>
      <div className="app-container">
        {/* El Navbar se queda afuera de las rutas para que siempre esté visible */}
        <Navbar />
        
        {/* Routes es como el semáforo que decide qué componente mostrar */}
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registro" element={<RegistroPaciente />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;