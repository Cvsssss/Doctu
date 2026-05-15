import React from 'react';
import { Link } from 'react-router-dom'; // IMPORTANTE: Importar Link

function Inicio() {
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
        
        <div className="hero-actions">
          {/* Envolvemos el botón en el Link hacia /registro */}
          <Link to="/registro">
            <button className="btn-pastel-primary">Comenzar ahora</button>
          </Link>
          
          <button className="btn-pastel-secondary">Saber más</button>
        </div>
      </div>
    </main>
  );
}

export default Inicio;