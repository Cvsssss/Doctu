import React from 'react';
import logo from '../assets/Logo.png';

<img src={logo} alt="Logo de Doctu" height="90" />

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#!">
          <img src={logo} alt="Logo de Doctu" height="90" />
        </a>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link active" href="#!">Inicio</a></li>
            <li className="nav-item"><a className="nav-link" href="#!">Productos</a></li>
            <li className="nav-item"><a className="nav-link" href="#!">FAQ</a></li>
            <li className="nav-item"><a className="nav-link" href="#!">Contáctanos</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;