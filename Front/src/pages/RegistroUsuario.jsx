import React, { useState } from 'react';
import '../styles/style.css';

function RegistroPaciente() {
  // Estado para alternar entre paciente y médico
  const [tipoUsuario, setTipoUsuario] = useState('paciente');

  // El estado ahora es general ("usuario") e incluye la cédula
  const [usuario, setUsuario] = useState({
    nombreCompleto: '',
    curp: '',
    email: '',
    telefono: '',
    password: '',
    cedula: ''
  });

  // Estado para manejar el mensaje de error visual de la cédula
  const [errorCedula, setErrorCedula] = useState('');

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    
    setUsuario({
      ...usuario,
      [name]: value
    });

    // Si el usuario está escribiendo en el campo cédula, validamos en tiempo real
    if (name === 'cedula' && tipoUsuario === 'medico') {
      validarCedula(value);
    }
  };

  const validarCedula = (valor) => {
    // 1. Validar que no esté vacía
    if (!valor) {
      setErrorCedula('La cédula es obligatoria.');
      return false;
    }
    // 2. Validar que no tenga "basura" (solo se permiten números)
    if (!/^\d+$/.test(valor)) {
      setErrorCedula('Dato incorrecto: La cédula solo debe contener números, sin letras ni espacios.');
      return false;
    }
    // 3. Validar longitud (7 u 8 dígitos)
    if (valor.length < 7 || valor.length > 8) {
      setErrorCedula('Dato incorrecto: Una cédula profesional válida debe tener 7 u 8 dígitos.');
      return false;
    }
    
    // Si pasa todas las pruebas, limpiamos el error
    setErrorCedula('');
    return true;
  };

  const guardarUsuario = (e) => {
    e.preventDefault();
    
    // Antes de enviar, si es médico, damos una última revisada a la cédula
    if (tipoUsuario === 'medico') {
      if (!validarCedula(usuario.cedula)) {
        return; // Detiene el envío del formulario si hay error
      }
    }

    console.log(`Datos a enviar a Supabase (Tipo: ${tipoUsuario}):`, usuario);
    // Aquí iría tu fetch o supabase.from().insert()
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0 p-4" style={{maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--white)'}}>
        <h2 style={{color: 'var(--purple-accent)', marginBottom: '1.5rem', textAlign: 'center'}}>
          Registro en Doctu
        </h2>

        {/* Botones para seleccionar el tipo de usuario */}
        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group" role="group">
            <button 
              type="button" 
              className={`btn ${tipoUsuario === 'paciente' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTipoUsuario('paciente')}
            >
              Soy Paciente
            </button>
            <button 
              type="button" 
              className={`btn ${tipoUsuario === 'medico' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTipoUsuario('medico')}
            >
              Soy Médico
            </button>
          </div>
        </div>
        
        <form onSubmit={guardarUsuario}>
          <div className="mb-3">
            <label className="form-label">Nombre Completo</label>
            <input type="text" className="form-control" name="nombreCompleto" value={usuario.nombreCompleto} onChange={manejarCambio} required />
          </div>

          <div className="mb-3">
            <label className="form-label">CURP</label>
            <input type="text" className="form-control" name="curp" value={usuario.curp} onChange={manejarCambio} maxLength="18" required />
          </div>

          {/* RENDERIZADO CONDICIONAL: Solo aparece si selecciona "Soy Médico" */}
          {tipoUsuario === 'medico' && (
            <div className="mb-3">
              <label className="form-label">Cédula Profesional</label>
              <input 
                type="text" 
                className={`form-control ${errorCedula ? 'is-invalid' : ''}`} 
                name="cedula" 
                value={usuario.cedula} 
                onChange={manejarCambio} 
                maxLength="8"
                required 
              />
              {/* Etiqueta dinámica de error */}
              {errorCedula && (
                <div className="invalid-feedback fw-bold">
                  ⚠️ {errorCedula}
                </div>
              )}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input type="email" className="form-control" name="email" value={usuario.email} onChange={manejarCambio} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input type="tel" className="form-control" name="telefono" value={usuario.telefono} onChange={manejarCambio} />
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña de Portal</label>
            <input type="password" className="form-control" name="password" value={usuario.password} onChange={manejarCambio} required />
          </div>

          <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: 'var(--purple-accent)', border: 'none' }}>
            Guardar {tipoUsuario === 'medico' ? 'Médico' : 'Paciente'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistroPaciente;