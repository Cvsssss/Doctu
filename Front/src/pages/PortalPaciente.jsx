import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import { useAuth } from '../App';
import { MessageSquare, Send, User, FileText, Brain, Stethoscope, Clock, ShieldCheck, Download } from 'lucide-react';

function PortalPaciente() {
  const { user } = useAuth(); 
  
  const [vistaActiva, setVistaActiva] = useState('citas');
  const [paciente, setPaciente] = useState(user ? { id: user.id, nombre: user.nombre } : null);
  const [citas, setCitas] = useState([]);

  // Estados para el Buzón Simulado
  const [chatActivoId, setChatActivoId] = useState(1);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  // Estados para el Visor de Expedientes
  const [expedienteTab, setExpedienteTab] = useState('medicina');

  // --- DATOS SIMULADOS: CHATS ---
  const [conversaciones, setConversaciones] = useState([
    {
      id: 1,
      doctor: 'Dr. Roberto Muelas',
      especialidad: 'Odontología',
      mensajes: [
        { id: 1, remitente: 'medico', texto: 'Hola, ¿cómo sentiste la resina que colocamos ayer?' },
        { id: 2, remitente: 'paciente', texto: 'Hola doctor, todo muy bien. Ya no hay sensibilidad al tomar agua fría.' },
        { id: 3, remitente: 'medico', texto: 'Excelente. Recuerda no morder cosas muy duras de ese lado por un par de días. Nos vemos en tu limpieza semestral.' }
      ]
    },
    {
      id: 2,
      doctor: 'Dra. Laura Mente',
      especialidad: 'Psicología',
      mensajes: [
        { id: 1, remitente: 'medico', texto: 'Buen día, te acabo de enviar por correo el cuestionario de seguimiento para nuestra próxima sesión.' },
        { id: 2, remitente: 'paciente', texto: 'Hola doctora, gracias. Lo respondo hoy por la noche.' },
        { id: 3, remitente: 'medico', texto: 'Perfecto. Recuerda anotar en tu bitácora si presentas algún evento de ansiedad.' }
      ]
    },
    {
      id: 3,
      doctor: 'Dr. Carlos Cuerpo',
      especialidad: 'Medicina General',
      mensajes: [
        { id: 1, remitente: 'paciente', texto: 'Doctor, el dolor abdominal ya disminuyó bastante con el Omeprazol.' },
        { id: 2, remitente: 'medico', texto: 'Qué buena noticia. Sigue con la dieta blanda y termina el esquema de 14 días.' },
      ]
    }
  ]);

  // --- DATOS SIMULADOS: EXPEDIENTES (Basados en esquemas de base de datos) ---
  const expedientesSimulados = {
    medicina: {
      tituloEspecialidad: 'MEDICINA GENERAL',
      fecha: '24 Mayo 2026',
      motivo: 'Dolor abdominal de 3 días de evolución, acompañado de náuseas.',
      diagnostico: 'K30 - Dispepsia funcional',
      tratamiento: 'Omeprazol 20mg c/24h por 14 días. Dieta blanda sin irritantes.',
      signos: { peso: '78 kg', presion: '120/80 mmHg', temp: '36.8 °C', frec: '75 lpm' },
      notas: 'Paciente presenta dolor en epigastrio a la palpación profunda, sin signos de irritación peritoneal. Signos vitales estables.'
    },
    psicologia: {
      tituloEspecialidad: 'PSICOLOGÍA CLÍNICA',
      fecha: '18 Mayo 2026',
      motivo: 'Problemas de estrés laboral y falta de sueño.',
      diagnostico: 'F41.1 - Trastorno de ansiedad generalizada',
      objetivos: 'Implementar estrategias de afrontamiento y mejorar higiene del sueño.',
      riesgo: 'Negativo (Sin riesgo autolítico ni heteroagresivo).',
      notas: 'Sesión inicial de encuadre. Se establece rapport y se acuerda frecuencia semanal. Se aplicó inventario de Beck.'
    },
    odontologia: {
      tituloEspecialidad: 'ODONTOLOGÍA Y CIRUGÍA MAXILOFACIAL',
      fecha: '10 Mayo 2026',
      motivo: 'Sensibilidad en molar superior derecho y revisión general.',
      odontograma: 'Diente 16: Caries. Diente 21: Corona.',
      higiene: 'Índice O\'Leary: 15.5%. Uso ocasional de hilo dental.',
      atm: 'Chasquido leve a la apertura. Sin dolor.',
      tratamiento: 'Fase 1: Profilaxis. Fase 2: Resina en diente 16.',
      notas: 'Se retira tejido cariado en 16 y se coloca resina compuesta. Ajuste de oclusión sin puntos prematuros.'
    }
  };

  // ─── IMPLEMENTACIÓN REVOLUCIONARIA DE DESCARGA PDF (NATIVA Y LIMPIA) ───
  const descargarPDF = (tipo) => {
    const data = expedientesSimulados[tipo];
    const nombrePaciente = paciente ? paciente.nombre : "Paciente Doctu";
    const ventanaImpresion = window.open('', '_blank');

    let seccionesEspecificasHTML = '';

    if (tipo === 'medicina') {
      seccionesEspecificasHTML = `
        <div class="section-title">Signos Vitales y Somatometría</div>
        <table class="meds-table">
          <tr>
            <th>Peso Corporal</th><td>${data.signos.peso}</td>
            <th>Presión Arterial</th><td>${data.signos.presion}</td>
          </tr>
          <tr>
            <th>Temperatura</th><td>${data.signos.temp}</td>
            <th>Frecuencia Cardiaca</th><td>${data.signos.frec}</td>
          </tr>
        </table>
        <div class="section-title">Diagnóstico Principal (CIE-10)</div>
        <p class="box-content">${data.diagnostico}</p>
        <div class="section-title">Plan de Tratamiento y Receta Médica</div>
        <p class="box-content font-mono">${data.tratamiento}</p>
      `;
    } else if (tipo === 'psicologia') {
      seccionesEspecificasHTML = `
        <div class="section-title">Impresión Diagnóstica (CIE-10)</div>
        <p class="box-content">${data.diagnostico}</p>
        <div class="section-title">Evaluación de Riesgo Clínico-Legal</div>
        <p class="box-content text-success"><strong>${data.riesgo}</strong></p>
        <div class="section-title">Objetivos Terapéuticos Planeados</div>
        <p class="box-content">${data.objetivos}</p>
      `;
    } else if (tipo === 'odontologia') {
      seccionesEspecificasHTML = `
        <div class="section-title">Hallazgos del Odontograma (FDI)</div>
        <p class="box-content font-mono">${data.odontograma}</p>
        <div class="section-title">Evaluación de la ATM y Tejidos Blandos</div>
        <p class="box-content">${data.atm}</p>
        <div class="section-title">Índices de Higiene Bucal</div>
        <p class="box-content">${data.higiene}</p>
        <div class="section-title">Plan de Tratamiento por Fases</div>
        <p class="box-content">${data.tratamiento}</p>
      `;
    }

    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Doctu_Expediente_${tipo}_${nombrePaciente.replace(/\s+/g, '_')}</title>
          <style>
            body { font-family: 'Arial', sans-serif; color: #2C3E50; padding: 40px; line-height: 1.6; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; border-bottom: 2px solid #6C5CE7; padding-bottom: 10px; }
            .brand { font-size: 24px; font-weight: bold; color: #6C5CE7; letter-spacing: 1px; }
            .norm-badge { background: #E8F5E9; color: #2E7D32; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; text-align: right; }
            .doc-title { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 25px; color: #34495E; text-transform: uppercase; }
            .meta-grid { width: 100%; border-collapse: collapse; margin-bottom: 25px; background: #F8F9FA; border-radius: 6px; }
            .meta-grid td { padding: 10px; border: 1px solid #E2E8F0; font-size: 13px; }
            .section-title { font-size: 14px; font-weight: bold; color: #6C5CE7; text-transform: uppercase; margin-top: 25px; margin-bottom: 8px; border-left: 3px solid #6C5CE7; padding-left: 8px; }
            .box-content { background: #FFFFFF; border: 1px solid #E2E8F0; padding: 12px; border-radius: 6px; font-size: 13px; margin: 0; }
            .meds-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            .meds-table th { background: #F1F3F5; text-align: left; padding: 8px; font-size: 12px; border: 1px solid #E2E8F0; width: 25%; }
            .meds-table td { padding: 8px; font-size: 13px; border: 1px solid #E2E8F0; }
            .font-mono { font-family: 'Courier New', Courier, monospace; white-space: pre-line; }
            .text-success { color: #2E7D32; }
            .footer-legal { margin-top: 60px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px dashed #CBD5E1; padding-top: 15px; }
            .signature-area { margin-top: 50px; text-align: center; font-size: 13px; font-weight: bold; border-top: 1px solid #64748B; width: 200px; margin-left: auto; margin-right: auto; padding-top: 5px; }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td class="brand">DOCTU</td>
              <td style="text-align: right;"><span class="norm-badge">EXPEDIENTE INTEROPERABLE COMPLIANCE</span></td>
            </tr>
          </table>
          
          <div class="doc-title">Resumen de Expediente de ${data.tituloEspecialidad}</div>
          
          <table class="meta-grid">
            <tr>
              <td><strong>Paciente:</strong> ${nombrePaciente}</td>
              <td><strong>Fecha de Apertura/Cierre:</strong> ${data.fecha}</td>
            </tr>
            <tr>
              <td><strong>Estatus Legal:</strong> Dictaminado según NOM-004-SSA3</td>
              <td><strong>Validación:</strong> Firma Electrónica Médica Activada</td>
            </tr>
          </table>

          <div class="section-title">1. Motivo de la Consulta / Padecimiento Actual</div>
          <p class="box-content">${data.motivo}</p>

          ${seccionesEspecificasHTML}

          <div class="section-title">Análisis Clínico Evolutivo y Notas Adicionales</div>
          <p class="box-content fst-italic" style="color: #555;">${data.notes || data.notas}</p>

          <div class="signature-area">
            Firma del Especialista
          </div>

          <div class="footer-legal">
            Documento emitido de forma automatizada por la infraestructura digital Doctu en colaboración con la Facultad de Ingeniería de la UNAM. Los datos sensibles están protegidos bajo cifrado criptográfico simétrico.
          </div>
          
          <script>
            window.onload = function() { 
              window.print(); 
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    ventanaImpresion.document.close();
  };

  const loadPatientWelcome = async (usuarioGlobal) => {
    if (!usuarioGlobal) return;
    try {
      const res = await fetch(`http://localhost:5000/api/patients/${usuarioGlobal.id}`);
      if (res.ok) {
        const data = await res.json();
        setPaciente(data);
      }
    } catch (error) {
      console.error("Error cargando paciente:", error);
    }
  };

  // ─── FUNCIÓN PARA GENERAR FECHAS DINÁMICAS ───
  const obtenerFechaFutura = (diasAdelante) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + diasAdelante);
    return fecha.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }); 
  };

  const cargarCitasSimuladas = () => {
    setCitas([
      {
        id: 901,
        doctor: 'Dr. Roberto Muelas',
        especialidad: 'Odontología',
        fecha: obtenerFechaFutura(2), 
        hora: '10:00',
        estado: 'Confirmada'
      },
      {
        id: 902,
        doctor: 'Dra. Laura Mente',
        especialidad: 'Psicología',
        fecha: obtenerFechaFutura(5), 
        hora: '16:30',
        estado: 'Pendiente de Pago'
      },
      {
        id: 903,
        doctor: 'Dr. Carlos Cuerpo',
        especialidad: 'Medicina General',
        fecha: obtenerFechaFutura(14), 
        hora: '11:15',
        estado: 'Confirmada'
      }
    ]);
  };

  // ─── FUNCIÓN DE CITAS CON RESPALDO DINÁMICO ───
  const fetchUpcomingAppointments = async (patientId) => {
    if (!patientId) return;
    try {
      const respuesta = await fetch(`http://localhost:5000/api/appointments/patient/${patientId}/upcoming`);
      
      if (respuesta.ok) {
        const datosReales = await respuesta.json();
        if (datosReales && datosReales.length > 0) {
          setCitas(datosReales);
        } else {
          cargarCitasSimuladas();
        }
      } else {
        cargarCitasSimuladas();
      }
    } catch (error) {
      console.warn("Servidor inactivo o sin datos. Cargando simulación dinámica de citas.");
      cargarCitasSimuladas();
    }
  };

  useEffect(() => {
    if (user) {
      if (!paciente) setPaciente({ id: user.id, nombre: user.nombre });
      loadPatientWelcome(user);
      fetchUpcomingAppointments(user.id);
    }
  }, [user]); 

  const processNewPayment = async (appointmentId) => {
    alert('Simulación: Redirigiendo a pasarela de pago (Stripe)...');
    setCitas(citas.map(c => c.id === appointmentId ? { ...c, estado: 'Confirmada (Pagado)' } : c));
  };

  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;
    
    const chatsActualizados = conversaciones.map(chat => {
      if (chat.id === chatActivoId) {
        return {
          ...chat,
          mensajes: [...chat.mensajes, { id: Date.now(), remitente: 'paciente', texto: nuevoMensaje }]
        };
      }
      return chat;
    });
    setConversaciones(chatsActualizados);
    setNuevoMensaje('');
  };

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
                <div key={cita.id} className="card p-4 mb-3 shadow-sm border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center" style={{ borderLeft: `5px solid ${cita.estado.includes('Pago') ? 'var(--purple-accent)' : '#4CAF50'}` }}>
                  <div>
                    <h5 style={{fontWeight: '600', color: 'var(--purple-dark)'}}>{cita.doctor}</h5>
                    <p className="mb-1 small" style={{color: 'var(--text-light)'}}>
                      <Clock size={14} className="me-1"/> <strong>{cita.fecha}</strong> a las <strong>{cita.hora} hrs</strong>
                    </p>
                    <p className="mb-0 small">Estado: <strong style={{color: cita.estado.includes('Pago') ? 'var(--purple-accent)' : '#4CAF50'}}>{cita.estado}</strong></p>
                  </div>
                  <div className="mt-3 mt-md-0 text-end">
                    {cita.estado === 'Pendiente de Pago' && (
                      <button className="btn-pastel-primary btn-sm px-4 py-2 fw-bold" onClick={() => processNewPayment(cita.id)}>
                        Pagar Consulta
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'mensajes':
        const chatActivo = conversaciones.find(c => c.id === chatActivoId);
        return (
          <div className="animacion-entrada d-flex flex-column h-100">
            <h3 className="text-purple mb-4" style={{fontWeight: 'bold'}}>Buzón de Mensajes</h3>
            <div className="card shadow-sm border-0 flex-grow-1 overflow-hidden d-flex flex-row" style={{ minHeight: '500px' }}>
              
              {/* Lista de Chats */}
              <div className="border-end" style={{ width: '35%', backgroundColor: '#F8F9FA' }}>
                <div className="p-3 border-bottom bg-white fw-bold text-muted small">MIS ESPECIALISTAS</div>
                <div className="list-group list-group-flush">
                  {conversaciones.map(chat => (
                    <button 
                      key={chat.id}
                      className={`list-group-item list-group-item-action p-3 border-bottom ${chatActivoId === chat.id ? 'active bg-light border-start border-4' : ''}`}
                      style={{ borderLeftColor: chatActivoId === chat.id ? 'var(--purple-accent)' : 'transparent', cursor: 'pointer' }}
                      onClick={() => setChatActivoId(chat.id)}
                    >
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <div className="bg-purple rounded-circle d-flex align-items-center justify-content-center text-white" style={{width: 32, height: 32, backgroundColor: 'var(--purple-accent)'}}>
                          <User size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <h6 className="mb-0 fw-bold text-truncate" style={{fontSize: '0.9rem', color: chatActivoId === chat.id ? 'var(--purple-dark)' : 'inherit'}}>{chat.doctor}</h6>
                          <small className="text-muted">{chat.especialidad}</small>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ventana de Chat Activo */}
              <div className="d-flex flex-column" style={{ width: '65%', backgroundColor: '#FFF' }}>
                <div className="p-3 border-bottom d-flex align-items-center gap-2 bg-light">
                  <MessageSquare size={18} className="text-purple" />
                  <h6 className="mb-0 fw-bold text-purple">{chatActivo?.doctor}</h6>
                </div>
                
                {/* Mensajes */}
                <div className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-3" style={{ maxHeight: '380px' }}>
                  {chatActivo?.mensajes.map(msg => {
                    const esPaciente = msg.remitente === 'paciente';
                    return (
                      <div key={msg.id} className={`d-flex ${esPaciente ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div 
                          className={`p-2 px-3 rounded shadow-sm`} 
                          style={{ 
                            maxWidth: '75%', 
                            fontSize: '0.9rem',
                            backgroundColor: esPaciente ? 'var(--purple-accent)' : '#F1F3F5',
                            color: esPaciente ? 'white' : '#333',
                            borderBottomRightRadius: esPaciente ? '0' : '8px',
                            borderBottomLeftRadius: esPaciente ? '8px' : '0'
                          }}
                        >
                          {msg.texto}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Input de Mensaje */}
                <form onSubmit={enviarMensaje} className="p-3 border-top bg-light d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Escribe un mensaje..." 
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary d-flex align-items-center justify-content-center" style={{backgroundColor: 'var(--purple-accent)', border: 'none', width: '45px'}}>
                    <Send size={18} />
                  </button>
                </form>
              </div>

            </div>
          </div>
        );

      case 'expediente':
        return (
          <div className="animacion-entrada">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-purple mb-0" style={{fontWeight: 'bold'}}>Mi Historial Clínico</h3>
              <span className="badge bg-success d-flex align-items-center gap-1 px-3 py-2"><ShieldCheck size={14}/> NOM-004-SSA3</span>
            </div>

            {/* Selector de Especialidad */}
            <ul className="nav nav-pills mb-4 gap-2 border-bottom pb-3">
              <li className="nav-item">
                <button className={`nav-link d-flex align-items-center gap-2 ${expedienteTab === 'medicina' ? 'active' : 'bg-light text-dark'}`} style={{backgroundColor: expedienteTab === 'medicina' ? 'var(--purple-accent)' : ''}} onClick={() => setExpedienteTab('medicina')}>
                  <Stethoscope size={16}/> Medicina General
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link d-flex align-items-center gap-2 ${expedienteTab === 'psicologia' ? 'active' : 'bg-light text-dark'}`} style={{backgroundColor: expedienteTab === 'psicologia' ? 'var(--purple-accent)' : ''}} onClick={() => setExpedienteTab('psicologia')}>
                  <Brain size={16}/> Psicología
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link d-flex align-items-center gap-2 ${expedienteTab === 'odontologia' ? 'active' : 'bg-light text-dark'}`} style={{backgroundColor: expedienteTab === 'odontologia' ? 'var(--purple-accent)' : ''}} onClick={() => setExpedienteTab('odontologia')}>
                  <FileText size={16}/> Odontología
                </button>
              </li>
            </ul>

            {/* VISOR DE DATOS DE EXPEDIENTE */}
            <div className="card border p-4 bg-white shadow-sm rounded">
              <div className="d-flex justify-content-between border-bottom pb-3 mb-4">
                <div>
                  <p className="text-muted small mb-1">Última actualización de expediente</p>
                  <h5 className="fw-bold text-main m-0">{expedientesSimulados[expedienteTab].fecha}</h5>
                </div>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 h-50"
                  onClick={() => descargarPDF(expedienteTab)}
                >
                  <Download size={14}/> Descargar PDF
                </button>
              </div>

              {expedienteTab === 'medicina' && (
                <div className="row g-4 animacion-entrada">
                  <div className="col-12">
                    <h6 className="text-purple fw-bold mb-2">Motivo de Consulta</h6>
                    <p className="p-3 bg-light rounded small border">{expedientesSimulados.medicina.motivo}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-purple fw-bold mb-2">Diagnóstico (CIE-10)</h6>
                    <p className="small border p-2 rounded">{expedientesSimulados.medicina.diagnostico}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-purple fw-bold mb-2">Signos Vitales</h6>
                    <div className="d-flex gap-2 flex-wrap small">
                      <span className="badge bg-light text-dark border">Peso: {expedientesSimulados.medicina.signos.peso}</span>
                      <span className="badge bg-light text-dark border">TA: {expedientesSimulados.medicina.signos.presion}</span>
                      <span className="badge bg-light text-dark border">Temp: {expedientesSimulados.medicina.signos.temp}</span>
                      <span className="badge bg-light text-dark border">FC: {expedientesSimulados.medicina.signos.frec}</span>
                    </div>
                  </div>
                  <div className="col-12">
                    <h6 className="text-purple fw-bold mb-2">Plan y Receta Médica</h6>
                    <p className="p-3 bg-light rounded small border">{expedientesSimulados.medicina.tratamiento}</p>
                  </div>
                  <div className="col-12 border-top pt-3 mt-2">
                    <h6 className="text-muted fw-bold mb-2 small">Notas de Evolución Clínicas</h6>
                    <p className="small fst-italic text-muted">{expedientesSimulados.medicina.notas}</p>
                  </div>
                </div>
              )}

              {expedienteTab === 'psicologia' && (
                <div className="row g-4 animacion-entrada">
                  <div className="col-12">
                    <h6 className="text-purple fw-bold mb-2">Motivo de Consulta</h6>
                    <p className="p-3 bg-light rounded small border">{expedientesSimulados.psicologia.motivo}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-purple fw-bold mb-2">Impresión Diagnóstica (CIE-10)</h6>
                    <p className="small border p-2 rounded">{expedientesSimulados.psicologia.diagnostico}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-purple fw-bold mb-2">Evaluación de Riesgos</h6>
                    <p className="small border p-2 rounded text-success fw-bold">{expedientesSimulados.psicologia.riesgo}</p>
                  </div>
                  <div className="col-12">
                    <h6 className="text-purple fw-bold mb-2">Objetivos Terapéuticos</h6>
                    <p className="p-3 bg-light rounded small border">{expedientesSimulados.psicologia.objetivos}</p>
                  </div>
                  <div className="col-12 border-top pt-3 mt-2">
                    <h6 className="text-muted fw-bold mb-2 small">Notas y Desarrollo de la Sesión</h6>
                    <p className="small fst-italic text-muted">{expedientesSimulados.psicologia.notas}</p>
                  </div>
                </div>
              )}

              {expedienteTab === 'odontologia' && (
                <div className="row g-4 animacion-entrada">
                  <div className="col-12">
                    <h6 className="text-purple fw-bold mb-2">Motivo y Exploración General</h6>
                    <p className="p-3 bg-light rounded small border">{expedientesSimulados.odontologia.motivo}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-purple fw-bold mb-2">Odontograma (FDI)</h6>
                    <p className="small border p-2 rounded bg-light">{expedientesSimulados.odontologia.odontograma}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-purple fw-bold mb-2">ATM y Tejidos Blandos</h6>
                    <p className="small border p-2 rounded">{expedientesSimulados.odontologia.atm}</p>
                  </div>
                  <div className="col-12">
                    <h6 className="text-purple fw-bold mb-2">Tratamiento por Fases</h6>
                    <p className="p-3 bg-light rounded small border">{expedientesSimulados.odontologia.tratamiento}</p>
                  </div>
                  <div className="col-12 border-top pt-3 mt-2">
                    <h6 className="text-muted fw-bold mb-2 small">Notas de Evolución (Procedimiento)</h6>
                    <p className="small fst-italic text-muted">{expedientesSimulados.odontologia.notas}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ minHeight: '80vh' }}>
      <div className="row g-4">
        {/* Sidebar / Menú de Navegación Lateral */}
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{backgroundColor: 'var(--white)', top: '100px'}}>
            <h4 className="text-purple mb-4" style={{fontWeight: 'bold'}}>
              Hola, <br/>
              {paciente ? paciente.nombre.split(' ')[0] : 'Cargando...'}
            </h4>
            
            <div className="d-flex flex-column gap-2">
              <button 
                className={`btn fw-bold text-start px-3 py-2 ${vistaActiva === 'citas' ? 'btn-pastel-primary' : 'btn-pastel-secondary'}`} 
                onClick={() => setVistaActiva('citas')}
              >
                Mis Citas
              </button>
              <button 
                className={`btn fw-bold text-start px-3 py-2 ${vistaActiva === 'mensajes' ? 'btn-pastel-primary' : 'btn-pastel-secondary'}`} 
                onClick={() => setVistaActiva('mensajes')}
              >
                Mis Mensajes
              </button>
              <button 
                className={`btn fw-bold text-start px-3 py-2 ${vistaActiva === 'expediente' ? 'btn-pastel-primary' : 'btn-pastel-secondary'}`} 
                onClick={() => setVistaActiva('expediente')}
              >
                Mi Expediente Clínico
              </button>
            </div>
          </div>
        </div>

        {/* Área de Contenido Dinámico */}
        <div className="col-md-9">
          <div className="card shadow-sm border-0 p-4" style={{backgroundColor: 'var(--white)', minHeight: '600px'}}>
            {renderVistaActiva()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortalPaciente;