import React, { useState } from 'react';
import '../styles/style.css';

function RegistroPaciente() {
  // Aquí guardaremos los datos que escriba el médico
  const [paciente, setPaciente] = useState({
    nombre: '',
    curp: '',
    email: ''
  });

  const manejarCambio = (e) => {
    setPaciente({
      ...paciente,
      [e.target.name]: e.target.value
    });
  };

  const guardarPaciente = (e) => {
    e.preventDefault();
    console.log("Datos a enviar al back de Fer:", paciente);
    // Más adelante aquí conectaremos con tu Middleware
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0 p-4" style={{maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--white)'}}>
        <h2 style={{color: 'var(--purple-accent)', marginBottom: '1.5rem'}}>Nuevo Expediente</h2>
        
        <form onSubmit={guardarPaciente}>
          <div className="mb-3">
            <label className="form-label" style={{color: 'var(--text-light)'}}>Nombre Completo</label>
            <input 
              type="text" 
              className="form-control" 
              name="nombre"
              value={paciente.nombre}
              onChange={manejarCambio}
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{color: 'var(--text-light)'}}>CURP</label>
            <input 
              type="text" 
              className="form-control" 
              name="curp"
              value={paciente.curp}
              onChange={manejarCambio}
              maxLength="18"
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label" style={{color: 'var(--text-light)'}}>Correo Electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              name="email"
              value={paciente.email}
              onChange={manejarCambio}
              required 
            />
          </div>

          <button type="submit" className="btn-pastel-primary w-100">Guardar Paciente</button>
        </form>
      </div>
    </div>
  );
}

export default RegistroPaciente;