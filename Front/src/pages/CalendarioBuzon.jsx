import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import '../styles/style.css';
import { useLocation } from 'react-router-dom';

function CalendarioBuzon() {
  const location = useLocation(); // <--- EL HOOK VA AQUÍ ADENTRO
  
  const [vistaActiva, setVistaActiva] = useState('calendario'); // 'calendario' o 'chat'
  const [citas, setCitas] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  
  // Estados para el sistema de mensajería (Chat Web)
  const [conversaciones, setConversaciones] = useState([]);
  const [chatActivo, setChatActivo] = useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  // <--- Y EL USE EFFECT VA INMEDIATAMENTE DESPUÉS DE LOS ESTADOS
  useEffect(() => {
    // Si venimos redirigidos desde el Dashboard, leemos el estado de la ruta
    if (location.state && location.state.vista) {
      setVistaActiva(location.state.vista);
    }
  }, [location]);

  const hoy = new Date();
  const diaActual = hoy.getDate();

  // 1. OBTENER Y REPLICAR CITAS REALES CONGRUENTES
  const cargarAgendaMensual = async () => {
    try {
      // Consultamos los pacientes reales de la base de datos
      const { data: pacientes, error } = await supabase
        .schema('operaciones')
        .from('pacientes_pii')
        .select('id_paciente, nombre_completo, curp, telefono');

      if (error) throw error;

      if (pacientes && pacientes.length > 0) {
        // Mapeamos citas congruentes: Hoy y días posteriores
        const agendaMapeada = [
          {
            id: 1,
            paciente: pacientes[0].nombre_completo,
            curp: pacientes[0].curp,
            telefono: pacientes[0].telefono,
            dia: diaActual,
            hora: '10:00',
            pago: true,
            estado: 'Confirmada',
            motivo: 'Control de hipertensión arterial crónica.',
            evolucion: 'Paciente refiere estabilidad con el tratamiento actual. Sin cefaleas.'
          },
          {
            id: 2,
            paciente: pacientes[1].nombre_completo,
            curp: pacientes[1].curp,
            telefono: pacientes[1].telefono,
            dia: diaActual,
            hora: '14:00',
            pago: false,
            estado: 'Pendiente de Pago',
            motivo: 'Evaluación psicológica inicial por cuadro de estrés laboral.',
            evolucion: 'Primera sesión. Se observa disposición al diálogo y apertura.'
          },
          {
            id: 3,
            paciente: pacientes[2].nombre_completo,
            curp: pacientes[2].curp,
            telefono: pacientes[2].telefono,
            dia: diaActual + 2, // Cita posterior
            hora: '16:30',
            pago: true,
            estado: 'Confirmada (Pagado)',
            motivo: 'Limpieza dental profunda y evaluación de amalgamas.',
            evolucion: 'Seguimiento preventivo semestral programado.'
          }
        ];
        setCitas(agendaMapeada);

        // Inicializar el buzón con chats reales basados en los mismos pacientes
        const chatsIniciales = pacientes.map((p, index) => ({
          id: p.id_paciente,
          nombre: p.nombre_completo,
          ultimoMensaje: index === 0 ? 'Doctor, ya realicé mi pago de la consulta.' : '¿Me podría compartir la receta digital?',
          fecha: 'Hoy',
          mensajes: [
            { id: 1, remitente: 'paciente', texto: 'Hola Doctor, buenas tardes.' },
            { id: 2, remitente: 'medico', texto: 'Hola, ¿en qué te puedo ayudar hoy?' },
            { id: 3, remitente: 'paciente', texto: index === 0 ? 'Doctor, ya realicé mi pago de la consulta.' : '¿Me podría compartir la receta digital?' }
          ]
        }));
        setConversaciones(chatsIniciales);
      }
    } catch (error) {
      console.error("Error estructurando agenda congruente:", error);
    }
  };

  useEffect(() => {
    cargarAgendaMensual();
  }, []);

  // Enviar mensaje en el chat web
  const enviarMensajeChat = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !chatActivo) return;

    const mensajeNuevoObj = {
      id: Date.now(),
      remitente: 'medico',
      texto: nuevoMensaje
    };

    // Actualizamos la conversación activa
    const conversacionesActualizadas = conversaciones.map(c => {
      if (c.id === chatActivo.id) {
        return {
          ...c,
          ultimoMensaje: nuevoMensaje,
          mensajes: [...c.mensajes, mensajeNuevoObj]
        };
      }
      return c;
    });

    setConversaciones(conversacionesActualizadas);
    setChatActivo({
      ...chatActivo,
      mensajes: [...chatActivo.mensajes, mensajeNuevoObj]
    });
    setNuevoMensaje('');
  };

  const diasMes = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    // Agregamos pt-5 y estilo inline para empujar el contenido debajo de la Navbar
    <div className="container mb-5" style={{ paddingTop: '95px' }}>
      
      {/* Selector de Navegación de la Vista */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div className="d-flex gap-2">
          <button 
            className={`btn ${vistaActiva === 'calendario' ? 'btn-primary' : 'btn-outline-primary'}`}
            style={{ backgroundColor: vistaActiva === 'calendario' ? 'var(--purple-accent)' : 'transparent', borderColor: 'var(--purple-accent)' }}
            onClick={() => setVistaActiva('calendario')}
          >
            📅 Calendario y Agenda
          </button>
          <button 
            className={`btn ${vistaActiva === 'chat' ? 'btn-primary' : 'btn-outline-primary'}`}
            style={{ backgroundColor: vistaActiva === 'chat' ? 'var(--purple-accent)' : 'transparent', borderColor: 'var(--purple-accent)', color: vistaActiva === 'chat' ? '#white' : 'var(--purple-accent)' }}
            onClick={() => { setVistaActiva('chat'); if(conversaciones.length > 0) setChatActivo(conversaciones[0]); }}
          >
            💬 Buzón de Mensajes
          </button>
        </div>
        <span className="badge-pastel font-monospace">Mayo 2026</span>
      </div>

      {/* VISTA 1: CALENDARIO Y AGENDA */}
      {vistaActiva === 'calendario' && (
        <div className="row g-4 animacion-entrada">
          {/* Cuadrícula de Calendario */}
          <div className="col-md-7">
            <div className="card shadow-sm border-0 p-4 bg-white">
              <h4 className="fw-bold text-purple mb-3">Mayo 2026</h4>
              <div className="calendario-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {diasMes.map(dia => {
                  const citasDelDia = citas.filter(c => c.dia === dia);
                  const esHoy = dia === diaActual;

                  return (
                    <div 
                      key={dia} 
                      className={`p-2 rounded border text-center position-relative ${esHoy ? 'border-primary bg-light' : ''}`} 
                      style={{ 
                        minHeight: '85px', 
                        cursor: citasDelDia.length > 0 ? 'pointer' : 'default',
                        boxShadow: esHoy ? '0 0 0 2px var(--purple-pastel)' : 'none'
                      }}
                      onClick={() => citasDelDia.length > 0 && setCitaSeleccionada(citasDelDia[0])}
                    >
                      <span className={`fw-bold small ${esHoy ? 'text-purple' : 'text-muted'}`}>
                        {dia} {esHoy && '(Hoy)'}
                      </span>
                      {citasDelDia.map(cita => (
                        <div 
                          key={cita.id} 
                          className="badge w-100 mt-1 overflow-hidden text-truncate p-1"
                          style={{ 
                            backgroundColor: cita.pago ? '#E8F5E9' : '#FFF3E0', 
                            color: cita.pago ? '#2E7D32' : '#E65100',
                            fontSize: '0.7rem'
                          }}
                        >
                          {cita.hora} - {cita.paciente.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* BARRA LATERAL DERECHA DE DETALLES CLÍNICOS */}
          <div className="col-md-5">
            <div className="card shadow-sm border-0 p-4 bg-white h-100 d-flex flex-column">
              <h4 className="text-purple fw-bold mb-3">Detalles de Consulta</h4>
              
              {citaSeleccionada ? (
                <div className="detalles-clinicos animacion-entrada d-flex flex-column h-100">
                  <h5 className="fw-bold mb-1 text-main">{citaSeleccionada.paciente}</h5>
                  <p className="small text-muted mb-3">CURP: <code>{citaSeleccionada.curp}</code> | Tel: {citaSeleccionada.telefono}</p>
                  
                  <div className="p-3 bg-light rounded border-start border-4 mb-3" style={{ borderColor: 'var(--purple-accent)' }}>
                    <p className="mb-1 small text-secondary"><strong>Horario asignado:</strong></p>
                    <p className="mb-0 fw-bold">Día {citaSeleccionada.dia} de Mayo · {citaSeleccionada.hora} hrs</p>
                  </div>

                  <div className="mb-3">
                    <label className="small text-muted fw-bold mb-1">Motivo de la Consulta / Seguimiento</label>
                    <p className="p-2 border rounded bg-white small mb-0">{citaSeleccionada.motivo}</p>
                  </div>

                  <div className="mb-4">
                    <label className="small text-muted fw-bold mb-1">Evolución y Notas Clínicas</label>
                    <p className="p-2 border rounded bg-white small mb-0" style={{ backgroundColor: '#FAF9FB', fontStyle: 'italic' }}>{citaSeleccionada.evolucion}</p>
                  </div>

                  <div className="mt-auto pt-3 border-top d-flex gap-2">
                    <span className={`badge p-2 flex-grow-1 text-center`} style={{ backgroundColor: citaSeleccionada.pago ? '#E8F5E9' : '#FFF0F0', color: citaSeleccionada.pago ? '#2E7D32' : '#D32F2F', fontSize: '0.85rem' }}>
                      {citaSeleccionada.pago ? '✓ Cobro Liquidado' : '⌛ Pago Pendiente'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center my-auto text-muted">
                  <p className="p-3 border rounded bg-light" style={{ borderStyle: 'dashed' }}>
                    Seleccione un paciente de la cuadrícula médica para consultar el motivo de consulta, evolución y estatus del anticipo transaccional.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: BUZÓN / INTERFAZ DE CHAT WEB */}
      {vistaActiva === 'chat' && (
        <div className="card shadow-sm border-0 bg-white animacion-entrada" style={{ height: '65vh', overflow: 'hidden' }}>
          <div className="row g-0 h-100">
            
            {/* Panel de Conversaciones (Izquierda) */}
            <div className="col-4 border-end h-100 d-flex flex-column" style={{ backgroundColor: '#FAF9FB' }}>
              <div className="p-3 border-bottom bg-white">
                <h5 className="fw-bold text-purple mb-0">Especialistas y Canales</h5>
              </div>
              <div className="list-group list-group-flush overflow-auto flex-grow-1">
                {conversaciones.map(chat => (
                  <button
                    key={chat.id}
                    type="button"
                    className={`list-group-item list-group-item-action p-3 border-bottom text-start ${chatActivo?.id === chat.id ? 'active bg-light border-start border-4' : ''}`}
                    style={{ borderStartColor: chatActivo?.id === chat.id ? 'var(--purple-accent)' : 'transparent' }}
                    onClick={() => setChatActivo(chat)}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className={chatActivo?.id === chat.id ? 'text-purple' : 'text-dark'}>{chat.nombre.split(' ')[0]} {chat.nombre.split(' ')[1] || ''}</strong>
                      <span className="small text-muted">{chat.fecha}</span>
                    </div>
                    <p className="mb-0 small text-truncate text-muted">{chat.ultimoMensaje}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Ventana de Mensajes (Derecha) */}
            <div className="col-8 h-100 d-flex flex-column bg-white">
              {chatActivo ? (
                <>
                  {/* Cabecera del chat */}
                  <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light">
                    <div>
                      <h6 className="fw-bold mb-0 text-main">{chatActivo.nombre}</h6>
                      <span className="small text-success">● Paciente en línea</span>
                    </div>
                  </div>

                  {/* Cuerpo de mensajes */}
                  <div className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-2 bg-white" style={{ minHeight: '0' }}>
                    {chatActivo.mensajes.map((m) => {
                      const esMedico = m.remitente === 'medico';
                      return (
                        <div 
                          key={m.id} 
                          className={`p-2 rounded max-width-75 ${esMedico ? 'align-self-end bg-purple text-white' : 'align-self-start bg-light text-dark'}`}
                          style={{ 
                            backgroundColor: esMedico ? 'var(--purple-accent)' : '#F1F0F5',
                            maxWidth: '70%',
                            borderRadius: '12px'
                          }}
                        >
                          <p className="mb-0 small">{m.texto}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Caja de texto */}
                  <form onSubmit={enviarMensajeChat} className="p-3 border-top bg-light d-flex gap-2">
                    <input 
                      type="text" 
                      className="form-control border-0 shadow-none" 
                      placeholder="Escriba un mensaje de seguimiento..." 
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary px-4" style={{ backgroundColor: 'var(--purple-accent)', border: 'none' }}>
                      Enviar
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center my-auto text-muted">
                  <p>Seleccione un canal de comunicación para iniciar la mensajería.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default CalendarioBuzon;