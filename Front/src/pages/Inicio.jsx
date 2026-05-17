import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

function Inicio() {
  const navigate = useNavigate();

  // Funciones abstractas obligatorias 
  const scrollToSection = (sectionId) => {
    console.log("Navegando a sección:", sectionId);
    // Lógica futura para scrolling 
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const renderServicesList = () => {
    return (
      <ul style={{ listStyle: 'none', color: 'var(--text-light)', marginTop: '1rem' }}>
        <li>✓ Gestión integral de consultorios</li>
        <li>✓ Expediente clínico interoperable</li>
      </ul>
    );
  };

  return (
    <main className="hero-desktop">
      <div className="hero-text-area">
        <span className="badge-pastel">Plataforma Médica Integral</span>
        <h1 className="hero-title">
          Tu consultorio,<br/>
          <span className="text-purple">ahora en la nube.</span>
        </h1>
        <p className="hero-subtitle">
          Recupera el control del expediente clínico con un sistema rápido, seguro y diseñado para especialistas.
        </p>
        
        {/* Renderizado de lista de servicios [cite: 1040] */}
        {renderServicesList()}
        <br/>

        <div className="hero-actions">
          <Link to="/login">
            <button className="btn-pastel-primary">Comenzar ahora</button>
          </Link>

          <Link to="#">
            <button className="btn-pastel-secondary">Saber más</button>
          </Link>
           
        </div>
      </div>
    </main>
  );
}

export default Inicio;