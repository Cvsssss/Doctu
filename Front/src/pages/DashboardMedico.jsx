import React, { useState, useEffect } from 'react';
import { useAuth } from '../App'; // Conectamos con el contexto global
import { supabase } from '../config/supabaseClient';
import '../styles/style.css';

function DashboardMedico() {
  const { user } = useAuth(); // Obtenemos el médico logueado
  const [resumenDiario, setResumenDiario] = useState(null);
  
  // Estados para el buscador de pacientes
  const [busqueda, setBusqueda] = useState('');
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [pacientesEncontrados, setPacientesEncontrados] = useState([]);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);

  // 1. Cargar el resumen desde tu backend real usando el ID dinámico
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

  const refreshDashboardData = () => {
    if (user?.id) {
      fetchDailySummary(user.id, new Date().toISOString());
    }
  };

  useEffect(() => {
    refreshDashboardData();
  }, [user]);

  // 2. FUNCIÓN DE BÚSQUEDA: Busca al paciente y detecta si tiene expedientes
  const manejarBusquedaPaciente = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) return;

    setCargandoBusqueda(true);
    try {
      // Buscamos coincidencias de nombre en la tabla de pacientes
      const { data: pacientes, error: errPacientes } = await supabase
        .schema('operaciones')
        .from('pacientes_pii')
        .select('id_paciente, nombre_completo, curp, email')
        .ilike('nombre_completo', `%${busqueda}%`);

      if (errPacientes) throw errPacientes;

      if (pacientes && pacientes.length > 0) {
        // Por cada paciente encontrado, verificamos de forma paralela si tiene expedientes creados
        const pacientesConHistorial = await Promise.all(
          pacientes.map(async (paciente) => {
            const { data: expedientes } = await supabase
              .schema('operaciones')
              .from('expediente_general')
              .select('id_expediente, tipo_formato, fecha_creacion')
              .eq('id_paciente', paciente.id_paciente);

            return {
              ...paciente,
              expedientes: expedientes || [] // Guardamos su lista de expedientes si existen
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

  const renderMiniCalendarWidget = () => {
    return (
      <div className="widget card shadow-sm">
        <h3 className="text-purple">Calendario de Hoy</h3>
        <p>14:00 - Consulta General (Juan Pérez)</p>
        <p>16:30 - Revisión (María Gómez)</p>
        <button className="btn-pastel-secondary mt-3">Ver agenda completa</button>
      </div>
    );
  };

  const renderRecentMessages = () => {
    return (
      <div className="widget card shadow-sm">
        <h3 className="text-purple">Buzón de Mensajes</h3>
        <p>Tienes {resumenDiario ? resumenDiario.mensajesNuevos : 0} mensajes sin leer.</p>
        <button className="btn-pastel-secondary mt-3">Ir al buzón</button>
      </div>
    );
  };

  return (
    <div className="dashboard-container container mt-4">
      <div className="z-layout">
        
        {/* Punto 1: Bienvenida dinámica con el nombre real */}
        <div className="z-item top-left">
          <h2 className="hero-subtitle" style={{marginBottom: '0.5rem'}}>
            Bienvenido, {user ? user.nombre : 'Doctor'}
          </h2>
          <h1 className="hero-title" style={{fontSize: '2.5rem'}}>
            Tienes <span className="text-purple">{resumenDiario ? resumenDiario.citasPendientes : 0} citas</span> hoy.
          </h1>
        </div>

        {/* Punto 2: Acciones Rápidas (Despliega el buscador) */}
        <div className="z-item top-right">
           <button 
             className="btn-pastel-primary" 
             onClick={() => setMostrarBuscador(!mostrarBuscador)}
           >
             {mostrarBuscador ? 'Cerrar Buscador' : 'Buscar Paciente / Expediente'}
           </button>
        </div>
      </div>

      {/* INTERFAZ DESPLEGABLE DEL BUSCADOR DE EXPEDIENTES */}
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
            <button type="submit" className="btn btn-primary" style={{backgroundColor: 'var(--purple-accent)', border:'none'}}>
              {cargandoBusqueda ? 'Buscando...' : '🔍 Buscar'}
            </button>
          </form>

          {/* LISTADO DE RESULTADOS CON SUS EXPEDIENTES */}
          <div className="resultados-busqueda">
            {pacientesEncontrados.length > 0 ? (
              <div className="list-group gap-2">
                {pacientesEncontrados.map((paciente) => (
                  <div key={paciente.id_paciente} className="list-group-item list-group-item-action border rounded p-3 d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <h5 className="fw-bold mb-1">{paciente.nombre_completo}</h5>
                      <p className="mb-0 small text-muted">CURP: <code>{paciente.curp}</code> | Email: {paciente.email}</p>
                    </div>
                    
                    {/* VALIDACIÓN: Si tiene expedientes guardados en la BDD */}
                    <div className="mt-2 mt-md-0">
                      {paciente.expedientes.length > 0 ? (
                        <div className="d-flex flex-column gap-1 text-end">
                          <span className="badge bg-success mb-1">✓ {paciente.expedientes.length} Expediente(s)</span>
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
                        <span className="text-muted small italic"> Sin expedientes guardados</span>
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

      {/* Fila Inferior de la estructura en Z */}
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