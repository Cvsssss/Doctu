import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import VisorExpediente from './VisorExpediente';

function PortalPaciente() {
  // Estado inicial: El portal siempre abre en 'citas'
  const [vistaActiva, setVistaActiva] = useState('citas');
  const [paciente, setPaciente] = useState(null);
  const [citas, setCitas] = useState([]);

  // 1. Cargar la bienvenida (Simula base de datos)
  const loadPatientWelcome = async (patientId) => {
    console.log(`Cargando portal para paciente ${patientId}`);
    setPaciente({ id: patientId, nombre: 'Juan Pérez' });
  };

  // 2. Obtener próximas citas
  const fetchUpcomingAppointments = async (patientId) => {
    // Mock simulando conexión a Oracle (Agenda_Citas)
    setCitas([
      { id: 1, fecha: '2026-05-20', hora: '10:00', doctor: 'Dr. Arturo (Medicina General)', estado: 'Pendiente de Pago' },
      { id: 2, fecha: '2026-06-05', hora: '16:00', doctor: 'Dra. Elena (Odontología)', estado: 'Confirmada' }
    ]);
  };

  // 3. Cambiar la vista principal (Patrón Strategy)
  const switchMainView = (viewType) => {
    setVistaActiva(viewType);
  };

  // 4. Procesar pagos anticipados (Ventaja competitiva del negocio)
  const processNewPayment = async (appointmentId, paymentMethod) => {
    console.log(`Procesando pago con ${paymentMethod} para la cita ${appointmentId}`);
    
    // Simular latencia de la pasarela de pago
    setTimeout(() => {
      setCitas(citas.map(c => 
        c.id === appointmentId ? { ...c, estado: 'Confirmada (Pagado)' } : c
      ));
      alert('Pago procesado con éxito. Su cita está confirmada.');
    }, 1000);
  };

  useEffect(() => {
    // Al montar el componente, cargamos los datos del paciente logueado (ej. ID 101)
    loadPatientWelcome(101);
    fetchUpcomingAppointments(101);
  }, []);

  // Función núcleo del Patrón Strategy: Decide qué JSX retornar
  const renderVistaActiva = () => {
    switch(vistaActiva) {
      case 'citas':
        return (
          <div className="animacion-entrada">
            <h3 className="text-purple mb-4" style={{fontWeight: 'bold'}}>Mis Citas Próximas</h3>
            {citas.map(cita => (
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
            ))}
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
            {/* visor completo */}
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
            <h4 className="text-purple mb-4" style={{fontWeight: 'bold'}}>Hola, <br/>{paciente?.nombre}</h4>
            
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