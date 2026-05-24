import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import VisorExpediente from './VisorExpediente';
import { useAuth } from '../App'; // 1. Conectamos con el estado global de App.js

function PortalPaciente() {
  const { user } = useAuth(); // 2. Extraemos el usuario autenticado (id, nombre, email, rol)
  
  const [vistaActiva, setVistaActiva] = useState('citas');
  
  // Inicializamos el estado del paciente usando los datos que ya tenemos en 'user'
  // para que NUNCA se quede la pantalla congelada en "Cargando..."
  const [paciente, setPaciente] = useState(user ? { id: user.id, nombre: user.nombre } : null);
  const [citas, setCitas] = useState([]);

  // 1. Cargar datos del paciente desde el Backend (GET)
  const loadPatientWelcome = async (usuarioGlobal) => {
    if (!usuarioGlobal) return;
    console.log(`Cargando portal para paciente ID: ${usuarioGlobal.id}`);
    try {
      // Apunta exactamente al endpoint '/api/patients/:id' configurado en back.js
      const res = await fetch(`http://localhost:5000/api/patients/${usuarioGlobal.id}`);
      
      if (!res.ok) {
        throw new Error('Error al obtener datos del paciente en el servidor');
      }
      
      const data = await res.json();
      // data contiene { id: X, nombre: "..." } según tu patientController.js
      setPaciente(data);
    } catch (error) {
      console.error("Error cargando paciente desde la base de datos:", error);
    }
  };

  // 2. Obtener próximas citas usando el ID dinámico real
  const fetchUpcomingAppointments = async (patientId) => {
    if (!patientId) return;
    
    console.log(`Solicitando citas al backend para el paciente: ${patientId}`);
    
    try {
      // CORRECCIÓN: Se agrega '/api/appointments' antes de '/patient/.../upcoming'
      // para alinearse perfectamente con la configuración de rutas de Tris en back.js
      const respuesta = await fetch(`http://localhost:5000/api/appointments/patient/${patientId}/upcoming`);
      
      if (!respuesta.ok) {
        throw new Error('Error al conectar con el servidor de citas');
      }

      const datosReales = await respuesta.json();
      setCitas(datosReales);
      
    } catch (error) {
      console.error("Hubo un problema trayendo las citas:", error);
    }
  };

  const switchMainView = (viewType) => {
    setVistaActiva(viewType);
  };

  const processNewPayment = async (appointmentId, paymentMethod) => {
    console.log(`Procesando pago con ${paymentMethod} para la cita ${appointmentId}`);
    
    try {
      const res = await fetch(`http://localhost:3000/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Confirmada (Pagado)' })
      });
      if (res.ok) {
        setCitas(citas.map(c => 
          c.id === appointmentId ? { ...c, estado: 'Confirmada (Pagado)' } : c
        ));
        alert('Pago procesado con éxito. Su cita está confirmada.');
      }
    } catch (error) {
      console.error("Error procesando pago:", error);
    }
  };

  // 3. El useEffect reacciona inmediatamente al usuario global que provee App.js
  useEffect(() => {
    if (user) {
      // Si por alguna razón el estado inicial estaba vacío, sincronizamos con 'user'
      if (!paciente) {
        setPaciente({ id: user.id, nombre: user.nombre });
      }
      loadPatientWelcome(user);
      fetchUpcomingAppointments(user.id);
    }
  }, [user]); 

  const renderVistaActiva = () => {
    switch(vistaActiva) {
      case 'citas':
        return (
          <div className="animacion-entrada">
            <h3 className="text-purple mb-4" style={{fontWeight: 'bold'}}>Mis Citas Próximas</h3>
            {citas.length === 0 ? (
              <p style={{color: 'var(--text-light)'}}>No tienes citas programadas próximamente.</p>
            ) : (
              citas.map(cita => (
                <div key={cita.id} className="card p-4 mb-3 shadow-sm border-0" style={{ borderLeft: `5px solid ${cita.estado.includes('Pago') ? 'var(--purple-accent)' : '#4CAF50'}` }}>
                  <h5 style={{fontWeight: '600'}}>{cita.doctor}</h5>
                  <p className="mb-1" style={{color: 'var(--text-light)'}}><strong>Fecha:</strong> {cita.fecha} | <strong>Hora:</strong> {cita.hora} hrs</p>
                  <p className="mb-3">Estado: <strong style={{color: cita.estado.includes('Pago') ? 'var(--purple-accent)' : '#4CAF50'}}>{cita.estado}</strong></p>
                  
                  {cita.estado === 'Pendiente de Pago' && (
                    <button 
                      className="btn-pastel-primary"
                      onClick={() => processNewPayment(cita.id, 'Stripe')}
                    >
                      Pagar Consulta Ahora
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        );
      case 'mensajes':
        return (
          <div className="animacion-entrada text-center mt-5">
            <h3 className="text-purple">Buzón de Mensajes</h3>
            <p style={{color: 'var(--text-light)'}}>No tienes mensajes nuevos de tus especialistas.</p>
          </div>
        );
      case 'expediente':
        return (
            <div className="animacion-entrada">
              <h3 className="text-purple mb-4" style={{fontWeight: 'bold'}}>Mi Historial Clínico</h3>
              <VisorExpediente />
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row g-4">
        {/* Sidebar / Menú de Navegación Lateral */}
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{backgroundColor: 'var(--white)', top: '100px'}}>
            <h4 className="text-purple mb-4" style={{fontWeight: 'bold'}}>
              Hola, <br/>
              {paciente ? paciente.nombre : 'Cargando...'}
            </h4>
            
            <div className="d-flex flex-column gap-2">
              <button 
                className={`btn ${vistaActiva === 'citas' ? 'btn-pastel-primary' : 'btn-pastel-secondary'}`} 
                onClick={() => switchMainView('citas')}
              >
                Mis Citas
              </button>
              <button 
                className={`btn ${vistaActiva === 'mensajes' ? 'btn-pastel-primary' : 'btn-pastel-secondary'}`} 
                onClick={() => switchMainView('mensajes')}
              >
                Mis Mensajes
              </button>
              <button 
                className={`btn ${vistaActiva === 'expediente' ? 'btn-pastel-primary' : 'btn-pastel-secondary'}`} 
                onClick={() => switchMainView('expediente')}
              >
                Mi Expediente
              </button>
            </div>
          </div>
        </div>

        {/* Área de Contenido Dinámico */}
        <div className="col-md-9">
          <div className="card shadow-sm border-0 p-4" style={{backgroundColor: 'var(--white)', minHeight: '60vh'}}>
            {renderVistaActiva()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortalPaciente;