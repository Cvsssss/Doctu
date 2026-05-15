import React from 'react';
// IMPORTANTE: Importar la imagen directamente desde la carpeta assets
import logoDoctu from '../assets/Logo.png'; 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Usamos la variable logoDoctu que acabamos de importar */}
        <img src={logoDoctu} alt="Logo de Doctu" className="navbar-logo" />
        <ul className="navbar-menu">
          <li>Inicio</li>
          <li>Acerca de</li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;