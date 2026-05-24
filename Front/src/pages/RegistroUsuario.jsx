import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App'; 
import { supabase } from '../config/supabaseClient'; 
import '../styles/style.css';

function RegistroUsuario() {
  const [tipoUsuario, setTipoUsuario] = useState('paciente');
  const navigate = useNavigate(); 
  
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
  const [procesando, setProcesando] = useState(false); // Para deshabilitar el botón mientras valida

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

  // 1. Validación Local (Formatos y Reglas de Negocio)
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
    const tieneCaracteresRepetidos = (str) => /(.)\1\1/.test(str);

    if (!regexComplejidad.test(usuario.password)) {
      nuevosErrores.password = 'La contraseña debe tener al menos 10 caracteres, una mayúscula, un número y un símbolo.';
    } else if (tieneCaracteresRepetidos(usuario.password)) {
      nuevosErrores.password = 'La contraseña no puede tener más de 2 caracteres idénticos consecutivos.';
    }
    
    if (usuario.password !== usuario.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // 2. Validación en Base de Datos (Cruzar datos con las 2 tablas)
  const verificarDuplicados = async () => {
    let erroresDB = {};

    try {
      // Búsqueda cruzada en Tabla Pacientes (Revisamos Email, CURP y Teléfono)
      const { data: pacientes } = await supabase
        .from('pacientes_pii')
        .select('curp, email, telefono')
        .or(`email.eq.${usuario.email},curp.eq.${usuario.curp.toUpperCase()},telefono.eq.${usuario.telefono}`);

      if (pacientes && pacientes.length > 0) {
        pacientes.forEach(p => {
          if (p.email === usuario.email) erroresDB.email = 'Este correo ya está registrado en Doctu.';
          if (p.curp === usuario.curp.toUpperCase()) erroresDB.curp = 'Esta CURP ya se encuentra registrada.';
          if (p.telefono === usuario.telefono) erroresDB.telefono = 'Este número de teléfono ya está en uso.';
        });
      }

      // Búsqueda cruzada en Tabla Profesionales (Revisamos Email y Cédula)
      // Nota: Si es paciente, usuario.cedula está vacío, por lo que solo busca el email.
      let queryMedicos = `email.eq.${usuario.email}`;
      if (usuario.cedula) queryMedicos += `,cedula_profesional.eq.${usuario.cedula}`;

      const { data: medicos } = await supabase
        .from('profesionales_perfiles')
        .select('email, cedula_profesional')
        .or(queryMedicos);

      if (medicos && medicos.length > 0) {
        medicos.forEach(m => {
          if (m.email === usuario.email) erroresDB.email = 'Este correo ya pertenece a un usuario en Doctu.';
          if (m.cedula_profesional === usuario.cedula) erroresDB.cedula = 'Esta cédula profesional ya fue registrada.';
        });
      }
    } catch (error) {
      console.error("Error al consultar duplicados:", error);
    }

    return erroresDB;
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    
    // Paso 1: Validar reglas de escritura locales
    if (!validarFormulario()) return; 

    setProcesando(true);

    try {
      // Paso 2: Validar duplicados contra la Base de Datos
      const duplicados = await verificarDuplicados();
      
      // Si el objeto 'duplicados' tiene llaves, significa que algo ya existe
      if (Object.keys(duplicados).length > 0) {
        setErrores((prev) => ({ ...prev, ...duplicados }));
        setProcesando(false);
        return; // Detenemos el registro
      }

      console.log(`Enviando registro al servidor para: ${tipoUsuario}`);

      if (tipoUsuario === 'paciente') {
        const respuesta = await fetch('http://localhost:5000/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombreCompleto: usuario.nombreCompleto,
            curp: usuario.curp.toUpperCase(),
            email: usuario.email,
            telefono: usuario.telefono,
            password: usuario.password
          })
        });

        const data = await respuesta.json();
        if (!respuesta.ok) throw new Error(data.error || 'Error al registrar paciente en el servidor');

        const usuarioRegistrado = {
          id: data.id, 
          nombre: usuario.nombreCompleto,
          email: usuario.email,
          rol: 'paciente'
        };

        login(usuarioRegistrado);
        navigate('/portal-paciente');

      } else {
        const { data, error } = await supabase
          .from('profesionales_perfiles')
          .insert([
            {
              nombre_completo: usuario.nombreCompleto,
              cedula_profesional: usuario.cedula,
              especialidad: 'Medicina General',
              email: usuario.email,
              password_hash: usuario.password
            }
          ])
          .select()
          .single();

        if (error) throw error;

        const usuarioRegistrado = {
          id: data.id_profesional,
          nombre: data.nombre_completo,
          email: data.email,
          rol: 'medico',
          especialidad: data.especialidad
        };

        login(usuarioRegistrado);
        navigate('/dashboard-medico');
      }

      alert('¡Registro completado con éxito!');

    } catch (error) {
      console.error("Error crítico durante el registro:", error);
      
      const errorMsg = error.message || '';
      let nuevosErrores = {};

      // Atrapamos los errores técnicos de Postgres y los traducimos al formulario
      if (errorMsg.includes('pacientes_pii_email_key') || errorMsg.includes('profesionales_perfiles_email_key') || errorMsg.includes('duplicate')) {
        nuevosErrores.email = 'Este correo electrónico ya está registrado en Doctu.';
      } 
      if (errorMsg.includes('pacientes_pii_curp_key')) {
        nuevosErrores.curp = 'Esta CURP ya se encuentra registrada en el sistema.';
      }

      // Si encontramos un error de duplicado, pintamos los textos rojos en el input
      if (Object.keys(nuevosErrores).length > 0) {
        setErrores((prev) => ({ ...prev, ...nuevosErrores }));
      } else {
        // Solo usamos alert para errores de conexión genéricos, sin exponer la base de datos
        alert('No pudimos conectar con el servidor. Verifica tu conexión e intenta de nuevo.');
      }
    } finally {
      setProcesando(false);
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
              disabled={procesando}
            >
              Soy Paciente
            </button>
            <button 
              type="button" 
              className={`btn ${tipoUsuario === 'medico' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => { setTipoUsuario('medico'); setErrores({}); }}
              disabled={procesando}
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
              disabled={procesando}
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
              disabled={procesando}
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
                disabled={procesando}
              />
              {errores.cedula && <div className="invalid-feedback fw-bold">⚠️ {errores.cedula}</div>}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              className={`form-control ${errores.email ? 'is-invalid' : ''}`} 
              name="email" 
              value={usuario.email} 
              onChange={manejarCambio} 
              disabled={procesando}
            />
            {errores.email && <div className="invalid-feedback fw-bold">⚠️ {errores.email}</div>}
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
              disabled={procesando}
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
                disabled={procesando}
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
                disabled={procesando}
              />
              {errores.confirmarPassword && <div className="invalid-feedback fw-bold">⚠️ {errores.confirmarPassword}</div>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn w-100" 
            style={{ backgroundColor: 'var(--purple-accent)', color: 'white', border: 'none' }}
            disabled={procesando}
          >
            {procesando ? 'Validando datos...' : 'Completar Registro'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistroUsuario;