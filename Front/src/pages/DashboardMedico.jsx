import React, { useState, useEffect } from 'react';
import '../styles/style.css';

function DashboardMedico() {
  const [resumenDiario, setResumenDiario] = useState(null);

  // Funciones abstractas requeridas por la arquitectura
  const fetchDailySummary = async (doctorId, date) => {
    // Aquí irá la conexión futura a Oracle DB (Agenda_Citas y Pagos_Transacciones)
    console.log(`Buscando resumen para el doctor ${doctorId} en la fecha ${date}`);
    setResumenDiario({ citasPendientes: 4, mensajesNuevos: 2 });
  };

  const refreshDashboardData = () => {
    fetchDailySummary(1, new Date().toISOString());
  };

  useEffect(() => {
    refreshDashboardData();
  }, []);

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
    <div className="dashboard-container">
      {/* Estructura de lectura en "Z" */}
      <div className="z-layout">
        
        {/* Punto 1 (Arriba Izquierda): Bienvenida y Resumen Rápido */}
        <div className="z-item top-left">
          <h2 className="hero-subtitle" style={{marginBottom: '0.5rem'}}>Bienvenido, Dr. Arturo</h2>
          <h1 className="hero-title" style={{fontSize: '2.5rem'}}>Tienes <span className="text-purple">{resumenDiario ? resumenDiario.citasPendientes : 0} citas</span> hoy.</h1>
        </div>

        {/* Punto 2 (Arriba Derecha): Acciones Rápidas */}
        <div className="z-item top-right">
           <button className="btn-pastel-primary">Buscar Paciente / Expediente</button>
        </div>

        {/* Punto 3 (Abajo Izquierda): Mini Calendario */}
        <div className="z-item bottom-left mt-5">
          {renderMiniCalendarWidget()}
        </div>

        {/* Punto 4 (Abajo Derecha): Mensajes */}
        <div className="z-item bottom-right mt-5">
          {renderRecentMessages()}
        </div>

      </div>
    </div>
  );
}

export default DashboardMedico;