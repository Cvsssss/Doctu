import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import VisorExpediente from './VisorExpediente';
import { useAuth } from '../App'; // 1. IMPORTANTE: Conectamos con el estado global de App.js

function PortalPaciente() {
  const { user } = useAuth(); // 2. Extraemos el usuario autenticado (trae id, nombre, email, rol, etc.)
  
  const [vistaActiva, setVistaActiva] = useState('citas');
  const [paciente, setPaciente] = useState(null);
  const [citas, setCitas] = useState([]);

  // 3. Modificamos para aceptar los datos reales del contexto o hacer el GET
  const loadPatientWelcome = async (usuarioGlobal) => {
    if (!usuarioGlobal) return;

    console.log(`Cargando portal para paciente ID: ${usuarioGlobal.id}`);
    
    /* ESTRATEGIA RECOMENDADA:
       - Si viene del Registro: El contexto ya tiene su 'nombreCompleto' u 'nombre'.
       - Si viene del Login: Aquí puedes meter tu método GET apuntando a tu base de datos si requieres más info:
         const { data, error } = await supabase.from('pacientes').select('*').eq('id', usuarioGlobal.id).single();
    */

    setPaciente({
      id: usuarioGlobal.id,
      // Usamos 'nombre' o 'nombreCompleto' dependiendo de cómo mapeaste el objeto en Login/Registro
      nombre: usuarioGlobal.nombre || usuarioGlobal.nombreCompleto || 'Paciente'
    });
  };

  // 4. Obtener próximas citas usando el ID dinámico real
  const fetchUpcomingAppointments = async (patientId) => {
    if (!patientId) return;
    
    console.log(`Haciendo GET de citas en Agenda_Citas para el paciente: ${patientId}`);
    // Mock simulando conexión a la base de datos (Filtrado por el ID real del usuario)
    setCitas([
      { id: 1, fecha: '2026-05-20', hora: '10:00', doctor: 'Dr. Arturo (Medicina General)', estado: 'Pendiente de Pago' },
      { id: 2, fecha: '2026-06-05', hora: '16:00', doctor: 'Dra. Elena (Odontología)', estado: 'Confirmada' }
    ]);
  };

  const switchMainView = (viewType) => {
    setVistaActiva(viewType);
  };

  const processNewPayment = async (appointmentId, paymentMethod) => {
    console.log(`Procesando pago con ${paymentMethod} para la cita ${appointmentId}`);
    
    setTimeout(() => {
      setCitas(citas.map(c => 
        c.id === appointmentId ? { ...c, estado: 'Confirmada (Pagado)' } : c
      ));
      alert('Pago procesado con éxito. Su cita está confirmada.');
    }, 1000);
  };

  // 5. El useEffect ahora reacciona inmediatamente al usuario global que provee App.js
  useEffect(() => {
    if (user) {
      loadPatientWelcome(user);
      fetchUpcomingAppointments(user.id);
    }
  }, [user]); // Al poner 'user' como dependencia, si cambia la sesión, se actualiza el portal automáticamente

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