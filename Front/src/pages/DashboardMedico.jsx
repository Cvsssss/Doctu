import React, { useState, useEffect } from 'react';
import { useAuth } from '../App'; 
import { supabase } from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la redirección interactiva
import '../styles/style.css';
import { Clock, Search, FileCheck } from 'lucide-react';

function DashboardMedico() {
  const { user } = useAuth(); 
  const navigate = useNavigate(); // Inicializamos el router de navegación
  const [resumenDiario, setResumenDiario] = useState(null);
  
  // Estado para las citas dinámicas con datos reales de la base de datos
  const [citasHoy, setCitasHoy] = useState([]);

  // Estados para el buscador de pacientes
  const [busqueda, setBusqueda] = useState('');
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [pacientesEncontrados, setPacientesEncontrados] = useState([]);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);

  // 1. Cargar el resumen diario del backend
  const fetchDailySummary = async (doctorId, date) => {
    try {
      const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}/summary?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setResumenDiario(data);
      }
    } catch (error) {
      console.error("Error cargando el resumen diario:", error);
    }
  };

  // 2. FUNCIÓN DE HORARIOS: Calcula horas aleatorias con espacio mínimo de 1.5 horas (90 minutos)
  const generarHorariosEscalonados = (cantidad) => {
    const horarios = [];
    let minutosActuales = 10 * 60; // Iniciamos a las 10:00 AM en minutos transcurridos
    const limiteMaximo = 19 * 60;  // Límite a las 7:00 PM en minutos transcurridos

    for (let i = 0; i < cantidad; i++) {
      const margenVar = Math.floor(Math.random() * 25);
      minutosActuales += margenVar;

      if (minutosActuales > limiteMaximo) break;

      const hrs = Math.floor(minutosActuales / 60);
      const mins = minutosActuales % 60;
      
      const horaFormateada = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      horarios.push(horaFormateada);

      minutosActuales += 90;
    }
    return horarios;
  };

  // 3. OBTENER PACIENTES REALES: Extrae nombres de la BDD y les genera sus horas reglamentarias
  const cargarCitasDesdeBDD = async () => {
    try {
      const { data, error } = await supabase
        .schema('operaciones')
        .from('pacientes_pii')
        .select('nombre_completo')
        .limit(3); 

      if (error) throw error;

      if (data && data.length > 0) {
        const horasGeneradas = generarHorariosEscalonados(data.length);
        
        const agendaMapeada = data.map((paciente, idx) => ({
          nombre: paciente.nombre_completo,
          hora: horasGeneradas[idx] || '14:00'
        }));
        
        setCitasHoy(agendaMapeada);
      }
    } catch (error) {
      console.error("Error estructurando horarios reales:", error);
    }
  };

  const refreshDashboardData = () => {
    if (user?.id) {
      fetchDailySummary(user.id, new Date().toISOString());
      cargarCitasDesdeBDD();
    }
  };

  useEffect(() => {
    refreshDashboardData();
  }, [user]);

  // Búsqueda de pacientes e historial clínico
  const manejarBusquedaPaciente = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) return;

    setCargandoBusqueda(true);
    try {
      const { data: pacientes, error: errPacientes } = await supabase
        .schema('operaciones')
        .from('pacientes_pii')
        .select('id_paciente, nombre_completo, curp, email')
        .ilike('nombre_completo', `%${busqueda}%`);

      if (errPacientes) throw errPacientes;

      if (pacientes && pacientes.length > 0) {
        const pacientesConHistorial = await Promise.all(
          pacientes.map(async (paciente) => {
            const { data: expedientes } = await supabase
              .schema('operaciones')
              .from('expediente_general')
              .select('id_expediente, tipo_formato, fecha_creacion')
              .eq('id_paciente', paciente.id_paciente);

            return {
              ...paciente,
              expedientes: expedientes || []
            };
          })
        );
        setPacientesEncontrados(pacientesConHistorial);
      } else {
        setPacientesEncontrados([]);
      }
    } catch (error) {
      console.error("Error al buscar pacientes:", error);
      alert("Error al conectar con el servidor de búsqueda.");
    } finally {
      setCargandoBusqueda(false);
    }
  };

  // VISTA OPTIMIZADA: Contenido del Calendario centrado estructuralmente
  const renderMiniCalendarWidget = () => {
    return (
      <div className="widget card shadow-sm text-center d-flex flex-column align-items-center justify-content-center p-4">
        <h3 className="text-purple mb-3" style={{ fontWeight: 'bold' }}>Calendario de Hoy</h3>
        <div className="w-100 mb-2">
          {citasHoy.length > 0 ? (
            citasHoy.map((cita, i) => (
              <div 
                key={i} 
                className="mb-2 d-flex align-items-center justify-content-center gap-2" 
                style={{ fontSize: '0.95rem' }}
              >
                <Clock size={16} className="text-muted" style={{ flexShrink: 0 }} />
                <p className="m-0">
                  <strong>{cita.hora} hrs</strong> - Consulta ({cita.nombre.split(' ')[0]} {cita.nombre.split(' ')[1] || ''})
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted small italic">Sincronizando agenda clínica...</p>
          )}
        </div>
        {/* Enrutamiento hacia la vista de agenda en CalendarioBuzon */}
        <button 
          className="btn-pastel-secondary mt-2"
          onClick={() => navigate('/calendario', { state: { vista: 'calendario' } })}
        >
          Ver agenda completa
        </button>
      </div>
    );
  };

  // VISTA OPTIMIZADA: Contenido del Buzón centrado estructuralmente
  const renderRecentMessages = () => {
    return (
      <div className="widget card shadow-sm text-center d-flex flex-column align-items-center justify-content-center p-4">
        <h3 className="text-purple mb-3" style={{ fontWeight: 'bold' }}>Buzón de Mensajes</h3>
        <p className="mb-3" style={{ fontSize: '1.05rem' }}>
          Tienes <strong className="text-purple">{resumenDiario ? resumenDiario.mensajesNuevos : 0}</strong> mensajes sin leer.
        </p>
        {/* Enrutamiento hacia la vista de chat en CalendarioBuzon */}
        <button 
          className="btn-pastel-secondary mt-2"
          onClick={() => navigate('/calendario', { state: { vista: 'chat' } })}
        >
          Ir al buzón
        </button>
      </div>
    );
  };

  return (
    <div className="dashboard-container container mt-4">
      <div className="z-layout">
        
        <div className="z-item top-left">
          <h2 className="hero-subtitle" style={{marginBottom: '0.5rem'}}>
            Bienvenido, {user ? user.nombre : 'Doctor'}
          </h2>
          {/* OPTIMIZACIÓN DEL COUNT: Reemplazamos la propiedad estática del backend por la longitud del array real. Todo el h1 es text-purple */}
          <h1 className="hero-title text-purple" style={{fontSize: '2.5rem'}}>
            Tienes {citasHoy.length} {citasHoy.length === 1 ? 'cita' : 'citas'} hoy.
          </h1>
        </div>

        <div className="z-item top-right">
           <button 
             className="btn-pastel-primary" 
             onClick={() => setMostrarBuscador(!mostrarBuscador)}
           >
             {mostrarBuscador ? 'Cerrar Buscador' : 'Buscar Paciente / Expediente'}
           </button>
        </div>
      </div>

      {mostrarBuscador && (
        <div className="card shadow-sm border-0 p-4 mt-4 bg-white animacion-entrada">
          <h4 className="text-purple fw-bold mb-3">Buscador de Pacientes e Historial Clínico</h4>
          <form onSubmit={manejarBusquedaPaciente} className="d-flex gap-2 mb-4">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Escribe el nombre completo del paciente..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn btn-primary d-flex align-items-center gap-2" 
              style={{ backgroundColor: 'var(--purple-accent)', border: 'none' }}
              disabled={cargandoBusqueda}
            >
              {cargandoBusqueda ? (
                'Buscando...'
              ) : (
                <>
                  <Search size={16} />
                  <span>Buscar</span>
                </>
              )}
            </button>
          </form>

          <div className="resultados-busqueda">
            {pacientesEncontrados.length > 0 ? (
              <div className="list-group gap-2">
                {pacientesEncontrados.map((paciente) => (
                  <div key={paciente.id_paciente} className="list-group-item list-group-item-action border rounded p-3 d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <h5 className="fw-bold mb-1">{paciente.nombre_completo}</h5>
                      <p className="mb-0 small text-muted">CURP: <code>{paciente.curp}</code> | Email: {paciente.email}</p>
                    </div>
                    
                    <div className="mt-2 mt-md-0">
                      {paciente.expedientes.length > 0 ? (
                        <div className="d-flex flex-column gap-1 text-end">
                          <span className="badge bg-success mb-1 d-inline-flex align-items-center gap-1 justify-content-center">
                            <FileCheck size={12} />
                            <span>{paciente.expedientes.length} Expediente(s)</span>
                          </span>
                          {paciente.expedientes.map(exp => (
                            <button 
                              key={exp.id_expediente}
                              className="btn btn-sm btn-pastel-primary py-1"
                              onClick={() => alert(`Cargando visor para el Expediente #${exp.id_expediente} (${exp.tipo_formato})`)}
                            >
                              Ver Formato {exp.tipo_formato}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted small italic">Sin expedientes guardados</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              busqueda && !cargandoBusqueda && <p className="text-muted text-center my-3">No se encontraron pacientes que coincidan con la búsqueda.</p>
            )}
          </div>
        </div>
      )}

      {/* Fila Inferior Centrada */}
      <div className="row mt-2">
        <div className="col-md-6 z-item bottom-left mt-4">
          {renderMiniCalendarWidget()}
        </div>
        <div className="col-md-6 z-item bottom-right mt-4">
          {renderRecentMessages()}
        </div>
      </div>
    </div>
  );
}

export default DashboardMedico;