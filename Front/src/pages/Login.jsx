import React, { useState } from 'react';
import '../styles/style.css';

function Login() {
  const [esMedico, setEsMedico] = useState(false);

  // Funciones abstractas requeridas para manejar JWT y roles [cite: 1051, 1052, 1053, 1054]
  const authenticateUser = async (credentials) => {
    console.log("Autenticando...", credentials);
  };

  const validateSessionStatus = () => {};
  
  const routeUserByRole = (role) => {
    console.log("Enrutando a dashboard de:", role);
  };

  const handleAuthError = (error) => {
    console.error("Error de Auth:", error);
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    const role = esMedico ? "Médico" : "Paciente";
    authenticateUser({ role: role });
    routeUserByRole(role);
  };
return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-sm border-0 p-4" style={{maxWidth: '400px', width: '100%', backgroundColor: 'var(--white)'}}>
        
        <div className="text-center mb-4">
          <h2 style={{color: 'var(--purple-accent)', fontWeight: 'bold'}}>Bienvenido</h2>
          <p style={{color: 'var(--text-light)'}}>Ingresa a tu cuenta en Doctu</p>
        </div>

        {/* SELECTOR DUAL (Médico vs Paciente) */}
        <div className="d-flex justify-content-center mb-4 gap-2">
          <button 
            className={`btn ${!esMedico ? 'btn-pastel-primary' : 'btn-pastel-secondary'}`}
            onClick={() => setEsMedico(false)}
            type="button"
            style={{flex: 1, padding: '8px'}}
          >
            Soy Paciente
          </button>
          <button 
            className={`btn ${esMedico ? 'btn-pastel-primary' : 'btn-pastel-secondary'}`}
            onClick={() => setEsMedico(true)}
            type="button"
            style={{flex: 1, padding: '8px'}}
          >
            Soy Médico
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={manejarSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{color: 'var(--text-light)'}}>Correo Electrónico</label>
            <input type="email" className="form-control" required placeholder="correo@ejemplo.com" />
          </div>

          <div className="mb-4">
            <label className="form-label" style={{color: 'var(--text-light)'}}>Contraseña</label>
            <input type="password" className="form-control" required placeholder="********" />
          </div>

          {/* El botón cambia de texto dependiendo de la pestaña activa */}
          <button type="submit" className="btn-pastel-primary w-100">
            Ingresar como {esMedico ? 'Médico' : 'Paciente'}
          </button>
        </form>

      </div>
    </div>
  );
  }

export default Login;