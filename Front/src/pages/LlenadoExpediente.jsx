import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import '../styles/style.css';

// Importamos los formatos especializados
import FormatoMedicoGeneral from './FormatoMedicoGeneral';
import FormatoPsicologia from './FormatoPsicologia';
import FormatoOdontologia from './FormatoOdontologia';

function LlenadoExpediente() {
  const { user } = useAuth();
  const [pacienteData, setPacienteData] = useState({ nombre: '', curp: '' });
  const [estadoGuardado, setEstadoGuardado] = useState('Listo para iniciar');
  
  // 1. NUEVO ESTADO: Aquí guardaremos el ID real del expediente extraído de la BDD
  const [idExpedienteActivo, setIdExpedienteActivo] = useState(null);

  // Cargar datos base de la consulta activa
  const loadPatientBaseData = async (patientId) => {
    console.log(`Cargando datos del paciente ID: ${patientId}`);
    
    // Mock de datos para el paciente
    setPacienteData({
      nombre: 'Juan Pérez López',
      curp: 'PELJ900101HDFRRN01'
    });
    
    // 2. SIMULACIÓN / EXTRACCIÓN DE ID EXPEDIENTE:
    // Para tus pruebas locales o en la nube, el ID de expediente debe existir en la tabla operaciones.expediente_general.
    // Usaremos el ID 2 que es el que insertamos con el script de datos de prueba para Odontología.
    setIdExpedienteActivo(2); 

    if (user) {
      triggerSecurityAuditLog(patientId, user.id); 
    }
  };

  const triggerSecurityAuditLog = async (patientId, doctorId) => {
    console.log(`[AUDITORÍA] Registro creado. Doctor ${doctorId} accedió al expediente del paciente ${patientId}. Disparando alerta asíncrona.`);
  };

  useEffect(() => {
    loadPatientBaseData(101); // ID simulado de la consulta actual
  }, [user]);

  // Renderizador dinámico por especialidad
  const renderFormatoEspecializado = () => {
    if (!user || user.rol !== 'medico') {
      return (
        <div className="alert alert-warning text-center">
          No tienes permisos de profesional de la salud para editar expedientes.
        </div>
      );
    }

    // 3. PASAR EL ID EXPEDIENTE COMO PROP A LOS COMPONENTES HIJOS
    switch (user.especialidad) {
      case 'Médico General':
      case 'Medicina General':
        return <FormatoMedicoGeneral idExpediente={idExpedienteActivo} setEstadoGlobal={setEstadoGuardado} />;
      
      case 'Psicología':
        return <FormatoPsicologia idExpediente={idExpedienteActivo} setEstadoGlobal={setEstadoGuardado} />;
      
      case 'Odontología':
        return <FormatoOdontologia idExpediente={idExpedienteActivo} setEstadoGlobal={setEstadoGuardado} />;
      
      default:
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
              Atiende: {user?.nombre || 'Cargando profesional...'} ({user?.especialidad || 'Sin especialidad'}) | 
              <strong> ID Expediente: #{idExpedienteActivo || 'Ninguno'}</strong>
            </p>
          </div>
          <span className="small text-muted" style={{ fontStyle: 'italic' }}>{estadoGuardado}</span>
        </div>

        {/* Aquí se inyecta dinámicamente el formato del especialista con sus props listas */}
        {renderFormatoEspecializado()}

      </div>
    </div>
  );
}

export default LlenadoExpediente;