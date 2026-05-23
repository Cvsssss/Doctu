import React, { useState, useEffect, useRef } from 'react';
import '../styles/style.css';

function LlenadoExpediente() {
  const [pacienteData, setPacienteData] = useState({ nombre: '', curp: '' });
  const [formData, setFormData] = useState({
    motivoConsulta: '',
    peso: '',
    talla: '',
    temperatura: '',
    presionSistolica: '',
    presionDiastolica: '',
    diagnostico: '',
    planTratamiento: ''
  });
  const [estadoGuardado, setEstadoGuardado] = useState('Cambios guardados localmente');
  const timerAutosave = useRef(null);

  // 1. Cargar datos base de la tabla Pacientes_PII al abrir la vista
  const loadPatientBaseData = async (patientId) => {
    console.log(`Cargando datos del paciente ID: ${patientId}`);
    // Mock de datos para pruebas en el MVP
    setPacienteData({
      nombre: 'Juan Pérez López',
      curp: 'PELJ900101HDFRRN01'
    });
    // Disparar log de auditoría obligatorio al acceder a la información confidencial
    triggerSecurityAuditLog(patientId, 1); 
  };

  // 2. Disparar registro en Log_Accesos_Seguridad
  const triggerSecurityAuditLog = async (patientId, doctorId) => {
    console.log(`[AUDITORÍA] Registro creado. Doctor ${doctorId} accedió al expediente del paciente ${patientId}. Disparando alerta asíncrona.`);
  };

  // 3. Guardado automático (Autosave en Expediente_Consulta_Activa)
  const autoSaveDraft = (data) => {
    setEstadoGuardado('Guardando borrador automáticamente...');
    
    // Simulación de sincronización asíncrona con el backend
    setTimeout(() => {
      console.log('Borrador actualizado en caché/DB:', data);
      setEstadoGuardado('Borrador sincronizado con éxito');
    }, 1000);
  };

  // 4. Guardado final y definitivo (Cierre del expediente)
  const submitFinalRecord = async (e) => {
    e.preventDefault();
    setEstadoGuardado('Enviando registro definitivo...');
    console.log('Insertando datos finales en Expediente_General:', formData);
    
    try {
      // 101 es el ID mockeado del paciente en esta vista
      const payload = {
        pacienteId: 101,
        ...formData
      };

      const res = await fetch('http://localhost:3000/api/expedientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Expediente clínico cerrado y firmado con éxito bajo los lineamientos de la NOM-004. ID: ' + data.idExpediente);
        setEstadoGuardado('Expediente finalizado.');
      } else {
        alert('Error al guardar el expediente: ' + data.error);
        setEstadoGuardado('Error al guardar.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión con el servidor');
      setEstadoGuardado('Error de conexión.');
    }
  };

  // Cargar información del paciente al inicializar la pantalla
  useEffect(() => {
    loadPatientBaseData(101); // ID simulado para la prueba
  }, []);

  // Manejador de cambios controlado con temporizador (Efecto Debounce)
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    const nuevosDatos = { ...formData, [name]: value };
    setFormData(nuevosDatos);
    setEstadoGuardado('Hay cambios sin guardar...');

    // Limpiar el temporizador activo cada que el usuario presiona una tecla
    if (timerAutosave.current) clearTimeout(timerAutosave.current);

    // Activar el guardado automático tras 3 segundos de inactividad en el teclado
    timerAutosave.current = setTimeout(() => {
      autoSaveDraft(nuevosDatos);
    }, 3000);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--white)' }}>
        
        {/* Cabecera de Control Normativo */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2" style={{ borderBottom: '1px solid var(--purple-pastel)' }}>
          <div>
            <span className="badge-pastel">NOM-004-SSA3-2012</span>
            <h2 className="text-purple mt-2" style={{ margin: 0, fontWeight: 'bold' }}>Consulta Activa</h2>
            <p style={{ color: 'var(--text-light)', margin: '5px 0 0 0' }}>
              Paciente: <strong>{pacienteData.nombre}</strong> | CURP: <code>{pacienteData.curp}</code>
            </p>
          </div>
          <span className="small text-muted" style={{ fontStyle: 'italic' }}>{estadoGuardado}</span>
        </div>

        <form onSubmit={submitFinalRecord}>
          {/* Sección 1: Interrogatorio */}
          <h4 className="text-purple mb-3" style={{ fontWeight: '600' }}>1. Interrogatorio</h4>
          <div className="mb-3">
            <label className="form-label" style={{ color: 'var(--text-light)' }}>Motivo de la Consulta</label>
            <textarea className="form-control" name="motivoConsulta" value={formData.motivoConsulta} onChange={manejarCambio} rows="3" required placeholder="Describa los síntomas y padecimiento actual..." />
          </div>

          {/* Sección 2: Exploración Física y Signos Vitales */}
          <h4 className="text-purple mb-3 mt-4" style={{ fontWeight: '600' }}>2. Exploración Física y Signos Vitales</h4>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Peso (Kg)</label>
              <input type="number" step="0.1" className="form-control" name="peso" value={formData.peso} onChange={manejarCambio} required placeholder="0.0" />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Talla (Cm)</label>
              <input type="number" className="form-control" name="talla" value={formData.talla} onChange={manejarCambio} required placeholder="0" />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Temperatura (°C)</label>
              <input type="number" step="0.1" className="form-control" name="temperatura" value={formData.temperatura} onChange={manejarCambio} required placeholder="36.5" />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Tensión Arterial (S/D)</label>
              <div className="d-flex gap-2 align-items-center">
                <input type="number" className="form-control" name="presionSistolica" value={formData.presionSistolica} onChange={manejarCambio} placeholder="120" required />
                <span>/</span>
                <input type="number" className="form-control" name="presionDiastolica" value={formData.presionDiastolica} onChange={manejarCambio} placeholder="80" required />
              </div>
            </div>
          </div>

          {/* Sección 3: Diagnóstico y Tratamiento */}
          <h4 className="text-purple mb-3 mt-4" style={{ fontWeight: '600' }}>3. Diagnóstico y Plan Terapéutico</h4>
          <div className="mb-3">
            <label className="form-label" style={{ color: 'var(--text-light)' }}>Diagnóstico Principal (CIE-10)</label>
            <input type="text" className="form-control" name="diagnostico" value={formData.diagnostico} onChange={manejarCambio} required placeholder="Código o descripción diagnóstica..." />
          </div>

          <div className="mb-4">
            <label className="form-label" style={{ color: 'var(--text-light)' }}>Indicación Terapéutica / Receta</label>
            <textarea className="form-control" name="planTratamiento" value={formData.planTratamiento} onChange={manejarCambio} rows="4" required placeholder="Tratamiento detallado e indicaciones de medicamentos..." />
          </div>

          {/* Botones de Acción */}
          <div className="d-flex gap-3 justify-content-end">
            <button type="button" className="btn-pastel-secondary" onClick={() => autoSaveDraft(formData)}>
              Forzar Sincronización
            </button>
            <button type="submit" className="btn-pastel-primary">
              Guardar y Finalizar Consulta
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default LlenadoExpediente;