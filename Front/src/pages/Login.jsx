import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';

function Login() {
  const [esMedico, setEsMedico] = useState(false);
  const navigate = useNavigate(); 

  const [credenciales, setCredenciales] = useState({
    email: '',
    password: ''
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errores, setErrores] = useState({});

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setCredenciales({
      ...credenciales,
      [name]: value
    });

    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const validarFormulario = () => {
    let nuevosErrores = {};

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(credenciales.email)) {
      nuevosErrores.email = 'Por favor, ingresa un formato de correo válido (ejemplo@correo.com).';
    }

    const regexComplejidad = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/;
    const tieneCaracteresRepetidos = (str) => /(.)\1\1/.test(str);

    if (!credenciales.password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    } else if (!regexComplejidad.test(credenciales.password)) {
      nuevosErrores.password = 'Formato inválido. Recuerda: mín 10 caracteres, 1 mayúscula, 1 número y 1 símbolo.';
    } else if (tieneCaracteresRepetidos(credenciales.password)) {
      nuevosErrores.password = 'La contraseña no puede tener más de 2 caracteres idénticos consecutivos.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const authenticateUser = async (credentials) => {
    console.log("Validando en base de datos...", credentials);
    return new Promise(resolve => setTimeout(resolve, 800));
  };
  
  const routeUserByRole = (role) => {
    if (role === "Médico") {
      navigate('/dashboard-medico');
    } else {
      navigate('/portal-paciente');
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return; 
    }

    const role = esMedico ? "Médico" : "Paciente";
    
    await authenticateUser({ email: credenciales.email, password: credenciales.password, role: role });
    routeUserByRole(role);
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-sm border-0 p-4" style={{maxWidth: '400px', width: '100%', backgroundColor: 'var(--white)'}}>
        
        <div className="text-center mb-4">
          <h2 style={{color: 'var(--purple-accent)', fontWeight: 'bold'}}>Bienvenido</h2>
          <p style={{color: 'var(--text-light)'}}>Ingresa a tu cuenta en Doctu</p>
        </div>

        <div className="d-flex justify-content-center mb-4 gap-2">
          <button 
            className={`btn ${!esMedico ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => { setEsMedico(false); setErrores({}); }}
            type="button"
            style={{flex: 1, padding: '8px'}}
          >
            Soy Paciente
          </button>
          <button 
            className={`btn ${esMedico ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => { setEsMedico(true); setErrores({}); }}
            type="button"
            style={{flex: 1, padding: '8px'}}
          >
            Soy Médico
          </button>
        </div>

        <form onSubmit={manejarSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{color: 'var(--text-light)'}}>
              Correo Electrónico
            </label>
              <input 
                type="email" 
                id="email"                    /* Ancla para el navegador */
                autoComplete="email"          /* Mágica línea que despierta el autocompletado de Google */
                className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                name="email"
                value={credenciales.email}
                onChange={manejarCambio}
                placeholder="correo@ejemplo.com" 
                />
                  {errores.email && <div className="invalid-feedback fw-bold">⚠️ {errores.email}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label" style={{color: 'var(--text-light)'}}>Contraseña</label>
            
            {/* Contenedor relativo para posicionar el ícono absolutamente sobre él */}
            <div style={{ position: 'relative' }}>
              <input 
                type={mostrarPassword ? "text" : "password"} 
                className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                name="password"
                value={credenciales.password}
                onChange={manejarCambio}
                placeholder="********" 
                style={{ paddingRight: '45px' }} /* Espacio extra para que el texto no pise el ojo */
              />
              
              {/* Ojo posicionado de manera flotante */}
              <span 
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: 'var(--text-light)',
                  zIndex: 10 /* Asegura que flote por encima del input y de los íconos de Bootstrap */
                }}
                onMouseDown={() => setMostrarPassword(true)}
                onMouseUp={() => setMostrarPassword(false)}
                onMouseLeave={() => setMostrarPassword(false)}
                onTouchStart={() => setMostrarPassword(true)}
                onTouchEnd={() => setMostrarPassword(false)}
              >
                {mostrarPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </span>
            </div>
            
            {/* Mensaje de error extraído del contenedor relativo */}
            {errores.password && <div className="text-danger mt-1 fw-bold" style={{fontSize: '0.875em'}}>⚠️ {errores.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2" style={{ backgroundColor: 'var(--purple-accent)', border: 'none' }}>
            Ingresar como {esMedico ? 'Médico' : 'Paciente'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;