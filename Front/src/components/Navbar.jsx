import React from 'react';
import { Link } from 'react-router-dom'; 
import logoDoctu from '../assets/Logo.png'; 
import imagenPortada from '../assets/Background.png';

function Navbar() {
  return (
    <nav 
      className="navbar" 
      style={{ 
        backgroundImage: `url(${imagenPortada})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="navbar-container">
        {/* El logo de la izquierda se mantiene como acceso rápido al inicio */}
        <Link to="/">
          <img src={logoDoctu} alt="Logo de Doctu" className="navbar-logo" />
        </Link>
        
        {/* Menú superior exclusivo con las 3 opciones solicitadas */}
        <ul className="navbar-menu">
          <li>
            <Link to="/registro">Regístrate</Link>
          </li>
          <li>
            <Link to="/login" className="btn-login-nav">
              Inicia Sesión
            </Link>
          </li>
          <li>
            <Link to="/ayuda">Ayuda</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;