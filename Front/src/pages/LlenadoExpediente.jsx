import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../App'; // 1. Importamos el contexto de autenticación
import '../styles/style.css';

// 2. Importamos los tres formatos especializados que tienes creados
import FormatoMedicoGeneral from './FormatoMedicoGeneral';
import FormatoPsicologia from './FormatoPsicologia';
import FormatoOdontologia from './FormatoOdontologia';

function LlenadoExpediente() {
  const { user } = useAuth(); // 3. Extraemos el médico logueado con su especialidad
  const [pacienteData, setPacienteData] = useState({ nombre: '', curp: '' });
  const [estadoGuardado, setEstadoGuardado] = useState('Listo para iniciar');

  // Cargar datos base de la consulta activa
  const loadPatientBaseData = async (patientId) => {
    console.log(`Cargando datos del paciente ID: ${patientId}`);
    // Mock de datos para el MVP
    setPacienteData({
      nombre: 'Juan Pérez López',
      curp: 'PELJ900101HDFRRN01'
    });
    
    if (user) {
      triggerSecurityAuditLog(patientId, user.id); 
    }
  };

  const triggerSecurityAuditLog = async (patientId, doctorId) => {
    console.log(`[AUDITORÍA] Registro creado. Doctor ${doctorId} accedió al expediente del paciente ${patientId}. Disparando alerta asíncrona.`);
  };

  useEffect(() => {
    loadPatientBaseData(101); // ID simulado para la consulta activa
  }, [user]);

  // 4. FUNCIÓN ORQUESTADORA: Renderiza el formulario según la especialidad real en sesión
  const renderFormatoEspecializado = () => {
    if (!user || user.rol !== 'medico') {
      return (
        <div className="alert alert-warning text-center">
          ⚠️ No tienes permisos de profesional de la salud para editar expedientes.
        </div>
      );
    }

    switch (user.especialidad) {
      case 'Médico General':
      case 'Medicina General':
        return <FormatoMedicoGeneral setEstadoGlobal={setEstadoGuardado} />;
      
      case 'Psicología':
        return <FormatoPsicologia setEstadoGlobal={setEstadoGuardado} />;
      
      case 'Odontología':
        return <FormatoOdontologia setEstadoGlobal={setEstadoGuardado} />;
      
      default:
        // Por si tienes un médico sin especialidad aún asignada, dejamos el formato base normativo
        return (
          <div className="alert alert-info text-center">
            Especialidad no integrada. Mostrando formato clínico general básico.
          </div>
        );
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'var(--white)' }}>
        
        {/* Cabecera de Control Normativo Común */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2" style={{ borderBottom: '1px solid var(--purple-pastel)' }}>
          <div>
            <span className="badge-pastel">NOM-004-SSA3-2012</span>
            <h2 className="text-purple mt-2" style={{ margin: 0, fontWeight: 'bold' }}>Consulta Activa</h2>
            <p style={{ color: 'var(--text-light)', margin: '5px 0 0 0' }}>
              Paciente: <strong>{pacienteData.nombre}</strong> | CURP: <code>{pacienteData.curp}</code>
            </p>
            <p className="small text-muted mb-0 mt-1">
              Atiende: {user?.nombre || 'Cargando profesional...'} ({user?.especialidad || 'Sin especialidad'})
            </p>
          </div>
          <span className="small text-muted" style={{ fontStyle: 'italic' }}>{estadoGuardado}</span>
        </div>

        {/* 5. Aquí se inyecta dinámicamente el formato del especialista */}
        {renderFormatoEspecializado()}

      </div>
    </div>
  );
}

export default LlenadoExpediente;