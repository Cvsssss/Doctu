import React from 'react';
import { Link } from 'react-router-dom'; // IMPORTANTE: Importar Link
import logoDoctu from '../assets/Logo.png'; 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Al hacer clic en el logo, regresas al inicio */}
        <Link to="/">
          <img src={logoDoctu} alt="Logo de Doctu" className="navbar-logo" />
        </Link>
        
        <ul className="navbar-menu">
          {/* Usamos Link en lugar de las etiquetas <li> normales */}
          <li>
            <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>Inicio</Link>
          </li>
          <li>
            <Link to="/registro" style={{textDecoration: 'none', color: 'inherit'}}>Registro de Paciente</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;