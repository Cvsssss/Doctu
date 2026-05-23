import React, { useState } from 'react';
import '../styles/style.css';

function RegistroPaciente() {
  // Ajustado al modelo de la tabla Pacientes_PII de Oracle 
  const [paciente, setPaciente] = useState({
    nombreCompleto: '',
    curp: '',
    email: '',
    telefono: '',
    password: '' 
  });

  const manejarCambio = (e) => {
    setPaciente({
      ...paciente,
      [e.target.name]: e.target.value
    });
  };

  const guardarPaciente = async (e) => {
    e.preventDefault();
    console.log("Datos a enviar al Middleware/API:", paciente);
    
    try {
      const res = await fetch('http://localhost:3000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paciente)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert('¡Paciente creado con éxito! ID: ' + data.id);
        // Opcional: limpiar formulario o redireccionar
      } else {
        alert('Error al crear paciente: ' + data.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0 p-4" style={{maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--white)'}}>
        <h2 style={{color: 'var(--purple-accent)', marginBottom: '1.5rem'}}>Nuevo Expediente (Paciente)</h2>
        
        <form onSubmit={guardarPaciente}>
          <div className="mb-3">
            <label className="form-label">Nombre Completo</label>
            <input type="text" className="form-control" name="nombreCompleto" value={paciente.nombreCompleto} onChange={manejarCambio} required />
          </div>

          <div className="mb-3">
            <label className="form-label">CURP</label>
            <input type="text" className="form-control" name="curp" value={paciente.curp} onChange={manejarCambio} maxLength="18" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input type="email" className="form-control" name="email" value={paciente.email} onChange={manejarCambio} required />
          </div>

          {/* Nuevos campos obligatorios según la BDD [cite: 537, 538] */}
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input type="tel" className="form-control" name="telefono" value={paciente.telefono} onChange={manejarCambio} />
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña de Portal</label>
            <input type="password" className="form-control" name="password" value={paciente.password} onChange={manejarCambio} required />
          </div>

          <button type="submit" className="btn-pastel-primary w-100">Guardar Paciente</button>
        </form>
      </div>
    </div>
  );
}

export default RegistroPaciente;