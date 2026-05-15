import React from 'react';
import './styles/style.css';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      
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
            <button className="btn-pastel-primary">Comenzar ahora</button>
            <button className="btn-pastel-secondary">Saber más</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;