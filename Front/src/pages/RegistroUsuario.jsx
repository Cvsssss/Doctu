import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App'; // IMPORTANTE: Importamos el contexto desde App.js
import '../styles/style.css';

function RegistroPaciente() {
  const [tipoUsuario, setTipoUsuario] = useState('paciente');
  const navigate = useNavigate(); 
  
  // Extraemos la función login del contexto global
  const { login } = useAuth(); 

  const [usuario, setUsuario] = useState({
    nombreCompleto: '',
    curp: '',
    email: '',
    telefono: '',
    password: '',
    confirmarPassword: '', 
    cedula: ''
  });

  const [errores, setErrores] = useState({});

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value
    });

    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const validarFormulario = () => {
    let nuevosErrores = {};

    const cantidadEspacios = (usuario.nombreCompleto.trim().match(/ /g) || []).length;
    if (cantidadEspacios < 2) {
      nuevosErrores.nombreCompleto = 'Parece que falta un nombre o apellido.';
    }

    const curpMayus = usuario.curp.toUpperCase();
    const esPuroNumero = /^\d+$/.test(curpMayus);
    const esPuraLetra = /^[A-Z]+$/.test(curpMayus);
    
    if (curpMayus.length !== 18 || esPuroNumero || esPuraLetra) {
      nuevosErrores.curp = 'CURP inválida. Verifica que sean 18 caracteres alfanuméricos.';
    }

    if (!/^\d{10}$/.test(usuario.telefono)) {
      nuevosErrores.telefono = 'El número debe contener exactamente 10 dígitos.';
    }

    if (tipoUsuario === 'medico') {
      if (!usuario.cedula) {
        nuevosErrores.cedula = 'La cédula es obligatoria.';
      } else if (!/^\d+$/.test(usuario.cedula)) {
        nuevosErrores.cedula = 'Dato incorrecto: La cédula solo debe contener números.';
      } else if (usuario.cedula.length < 7 || usuario.cedula.length > 8) {
        nuevosErrores.cedula = 'Dato incorrecto: La cédula debe tener 7 u 8 dígitos.';
      }
    }

    const regexComplejidad = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/;
    
    const tieneCaracteresRepetidos = (str) => {
      return /(.)\1\1/.test(str);
    };

    if (!regexComplejidad.test(usuario.password)) {
      nuevosErrores.password = 'La contraseña debe tener al menos 10 caracteres, una mayúscula, un número y un carácter especial.';
    } else if (tieneCaracteresRepetidos(usuario.password)) {
      nuevosErrores.password = 'La contraseña no puede tener más de 2 caracteres idénticos consecutivos.';
    }
    
    if (usuario.password !== usuario.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return; 
    }

    const datosAEnviar = { ...usuario };
    delete datosAEnviar.confirmarPassword;

    console.log(`Datos enviados exitosamente (Tipo: ${tipoUsuario}):`, datosAEnviar);

    // --- Flujo de Autorización y Redirección ---
    
    // 1. Creamos el objeto de usuario simulando la respuesta de la base de datos
    const usuarioRecienRegistrado = {
      id: Math.floor(Math.random() * 1000), // Simulamos un ID de base de datos
      nombre: usuario.nombreCompleto,
      email: usuario.email,
      rol: tipoUsuario, // 'medico' o 'paciente'
      especialidad: tipoUsuario === 'medico' ? 'Pendiente' : undefined
    };

    // 2. Registramos la sesión globalmente para que App.js nos deje pasar
    login(usuarioRecienRegistrado);

    // 3. Redirigimos al portal que le corresponde
    if (tipoUsuario === 'medico') {
      navigate('/dashboard-medico');
    } else {
      navigate('/portal-paciente');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0 p-4" style={{maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--white)'}}>
        <h2 style={{color: 'var(--purple-accent)', marginBottom: '1.5rem', textAlign: 'center'}}>
          Registro en Doctu
        </h2>

        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group" role="group">
            <button 
              type="button" 
              className={`btn ${tipoUsuario === 'paciente' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => { setTipoUsuario('paciente'); setErrores({}); }}
            >
              Soy Paciente
            </button>
            <button 
              type="button" 
              className={`btn ${tipoUsuario === 'medico' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => { setTipoUsuario('medico'); setErrores({}); }}
            >
              Soy Médico
            </button>
          </div>
        </div>
        
        <form onSubmit={guardarUsuario} noValidate>
          <div className="mb-3">
            <label className="form-label">Nombre Completo</label>
            <input 
              type="text" 
              className={`form-control ${errores.nombreCompleto ? 'is-invalid' : ''}`} 
              name="nombreCompleto" 
              value={usuario.nombreCompleto} 
              onChange={manejarCambio} 
            />
            {errores.nombreCompleto && <div className="invalid-feedback fw-bold">⚠️ {errores.nombreCompleto}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">CURP</label>
            <input 
              type="text" 
              className={`form-control ${errores.curp ? 'is-invalid' : ''}`} 
              name="curp" 
              value={usuario.curp} 
              onChange={manejarCambio} 
              maxLength="18" 
              style={{ textTransform: 'uppercase' }}
            />
            {errores.curp && <div className="invalid-feedback fw-bold">⚠️ {errores.curp}</div>}
          </div>

          {tipoUsuario === 'medico' && (
            <div className="mb-3">
              <label className="form-label">Cédula Profesional</label>
              <input 
                type="text" 
                className={`form-control ${errores.cedula ? 'is-invalid' : ''}`} 
                name="cedula" 
                value={usuario.cedula} 
                onChange={manejarCambio} 
                maxLength="8"
              />
              {errores.cedula && <div className="invalid-feedback fw-bold">⚠️ {errores.cedula}</div>}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input type="email" className="form-control" name="email" value={usuario.email} onChange={manejarCambio} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono (10 dígitos)</label>
            <input 
              type="tel" 
              className={`form-control ${errores.telefono ? 'is-invalid' : ''}`} 
              name="telefono" 
              value={usuario.telefono} 
              onChange={manejarCambio} 
              maxLength="10"
            />
            {errores.telefono && <div className="invalid-feedback fw-bold">⚠️ {errores.telefono}</div>}
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Contraseña</label>
              <input 
                type="password" 
                className={`form-control ${errores.password ? 'is-invalid' : ''}`} 
                name="password" 
                value={usuario.password} 
                onChange={manejarCambio} 
              />
              {errores.password && <div className="invalid-feedback fw-bold">⚠️ {errores.password}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Repetir Contraseña</label>
              <input 
                type="password" 
                className={`form-control ${errores.confirmarPassword ? 'is-invalid' : ''}`} 
                name="confirmarPassword" 
                value={usuario.confirmarPassword} 
                onChange={manejarCambio} 
              />
              {errores.confirmarPassword && <div className="invalid-feedback fw-bold">⚠️ {errores.confirmarPassword}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: 'var(--purple-accent)', border: 'none' }}>
            Completar Registro
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistroPaciente;