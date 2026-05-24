import React, { useState } from 'react';
import '../styles/style.css';

function FormatoPsicologia() {
  const [activeTab, setActiveTab] = useState('motivo');
  
  // Estado mapeado a la tabla Formato_Psicologia [cite: 640-672]
  const [formData, setFormData] = useState({
    // Ficha y Motivo [cite: 643-651]
    estadoCivil: '',
    escolaridad: '',
    ocupacion: '',
    religion: '',
    viveCon: '',
    motivoConsulta: '',
    sintomatologiaActual: '',
    fechaInicioSintomas: '',
    eventosDesencadenantes: '',
    
    // Antecedentes [cite: 652-655]
    antecedentesHeredofamiliares: '',
    antecedentesPersonalesPatologicos: '',
    tratamientosPreviosPsicologicos: false,
    medicacionPsiquiatricaActual: '',
    consumoSustancias: '',
    
    // Examen Mental [cite: 656-662]
    aparienciaFisicaActitud: '',
    estadoConciencia: 'Alerta',
    orientacionTEP: 'Orientado en Tiempo, Espacio y Persona',
    atencionConcentracion: '',
    memoriaCortoLargoPlazo: '',
    pensamientoCursoContenido: '',
    lenguajeComunicacion: '',
    afectoEstadoAnimo: '',
    sensopercepcion: '',
    juicioInsight: '',
    
    // Esferas y Riesgos [cite: 662-665]
    areaFamiliar: '',
    areaSocialInterpersonal: '',
    areaLaboralAcademica: '',
    areaPsicosexual: '',
    riesgoAutolitico: false,
    riesgoHeteroagresivo: false,
    
    // Diagnóstico y Plan [cite: 666-671]
    pruebasPsicometricasAplicadas: '',
    impresionDiagnosticaCIE10: '',
    pronostico: '',
    objetivosTerapeuticos: '',
    planTratamiento: '',
    notasEvolucionSesion: ''
  });

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: 'var(--white)' }}>
      <h3 className="text-purple mb-4" style={{ fontWeight: 'bold' }}>Expediente Clínico: Psicología</h3>
      
      {/* Navegación por Pestañas */}
      <ul className="nav nav-tabs mb-4" style={{ borderBottom: '2px solid var(--purple-pastel)' }}>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'motivo' ? 'active text-purple fw-bold' : 'text-muted'}`} 
                  onClick={() => setActiveTab('motivo')} style={{ border: 'none', backgroundColor: 'transparent' }}>
            1. Motivo y Antecedentes
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'examen' ? 'active text-purple fw-bold' : 'text-muted'}`} 
                  onClick={() => setActiveTab('examen')} style={{ border: 'none', backgroundColor: 'transparent' }}>
            2. Examen Mental
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'esferas' ? 'active text-purple fw-bold' : 'text-muted'}`} 
                  onClick={() => setActiveTab('esferas')} style={{ border: 'none', backgroundColor: 'transparent' }}>
            3. Esferas y Riesgos
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'plan' ? 'active text-purple fw-bold' : 'text-muted'}`} 
                  onClick={() => setActiveTab('plan')} style={{ border: 'none', backgroundColor: 'transparent' }}>
            4. Diagnóstico y Plan
          </button>
        </li>
      </ul>

      {/* Contenido Dinámico de las Pestañas */}
      <div className="tab-content pt-2">
        
        {/* PESTAÑA 1: MOTIVO Y ANTECEDENTES */}
        {activeTab === 'motivo' && (
          <div className="animacion-entrada">
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <label className="form-label small">Estado Civil</label>
                <input type="text" className="form-control" name="estadoCivil" value={formData.estadoCivil} onChange={manejarCambio} />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Ocupación</label>
                <input type="text" className="form-control" name="ocupacion" value={formData.ocupacion} onChange={manejarCambio} />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Vive Con</label>
                <input type="text" className="form-control" name="viveCon" value={formData.viveCon} onChange={manejarCambio} />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Fecha Inicio Síntomas</label>
                <input type="date" className="form-control" name="fechaInicioSintomas" value={formData.fechaInicioSintomas} onChange={manejarCambio} />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Motivo de la Consulta</label>
              <textarea className="form-control" name="motivoConsulta" value={formData.motivoConsulta} onChange={manejarCambio} rows="2" required />
            </div>

            <h5 className="text-purple mt-4 mb-3" style={{fontWeight: '600'}}>Antecedentes Relevantes</h5>
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label small">Heredofamiliares</label>
                <textarea className="form-control" name="antecedentesHeredofamiliares" value={formData.antecedentesHeredofamiliares} onChange={manejarCambio} rows="2" />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Consumo de Sustancias</label>
                <textarea className="form-control" name="consumoSustancias" value={formData.consumoSustancias} onChange={manejarCambio} rows="2" />
              </div>
              <div className="col-md-12 d-flex align-items-center gap-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" name="tratamientosPreviosPsicologicos" checked={formData.tratamientosPreviosPsicologicos} onChange={manejarCambio} />
                  <label className="form-check-label text-muted">¿Tratamientos Previos Psicológicos?</label>
                </div>
                <input type="text" className="form-control" name="medicacionPsiquiatricaActual" value={formData.medicacionPsiquiatricaActual} onChange={manejarCambio} placeholder="Medicación Psiquiátrica Actual (Si aplica)" />
              </div>
            </div>
            
            <button className="btn-pastel-primary" onClick={() => setActiveTab('examen')}>Siguiente: Examen Mental</button>
          </div>
        )}

        {/* PESTAÑA 2: EXAMEN MENTAL */}
        {activeTab === 'examen' && (
          <div className="animacion-entrada">
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label small">Estado de Conciencia</label>
                <select className="form-control" name="estadoConciencia" value={formData.estadoConciencia} onChange={manejarCambio}>
                  <option value="Alerta">Alerta</option>
                  <option value="Somnolencia">Somnolencia</option>
                  <option value="Estupor">Estupor</option>
                  <option value="Coma">Coma</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small">Orientación TEP</label>
                <select className="form-control" name="orientacionTEP" value={formData.orientacionTEP} onChange={manejarCambio}>
                  <option value="Orientado en Tiempo, Espacio y Persona">Orientado Globalmente</option>
                  <option value="Desorientado Parcialmente">Desorientado Parcialmente</option>
                  <option value="Desorientado Totalmente">Desorientado Totalmente</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small">Apariencia Física y Actitud</label>
                <textarea className="form-control" name="aparienciaFisicaActitud" value={formData.aparienciaFisicaActitud} onChange={manejarCambio} rows="2" />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Pensamiento (Curso y Contenido)</label>
                <textarea className="form-control" name="pensamientoCursoContenido" value={formData.pensamientoCursoContenido} onChange={manejarCambio} rows="2" />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Afecto y Estado de Ánimo</label>
                <textarea className="form-control" name="afectoEstadoAnimo" value={formData.afectoEstadoAnimo} onChange={manejarCambio} rows="2" />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Juicio e Insight</label>
                <textarea className="form-control" name="juicioInsight" value={formData.juicioInsight} onChange={manejarCambio} rows="2" />
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn-pastel-secondary" onClick={() => setActiveTab('motivo')}>Anterior</button>
              <button className="btn-pastel-primary" onClick={() => setActiveTab('esferas')}>Siguiente: Esferas</button>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: ESFERAS Y RIESGOS */}
        {activeTab === 'esferas' && (
          <div className="animacion-entrada">
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label small">Área Familiar</label>
                <textarea className="form-control" name="areaFamiliar" value={formData.areaFamiliar} onChange={manejarCambio} rows="2" />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Área Social e Interpersonal</label>
                <textarea className="form-control" name="areaSocialInterpersonal" value={formData.areaSocialInterpersonal} onChange={manejarCambio} rows="2" />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Área Laboral / Académica</label>
                <textarea className="form-control" name="areaLaboralAcademica" value={formData.areaLaboralAcademica} onChange={manejarCambio} rows="2" />
              </div>
            </div>

            <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#FFF0F0', borderLeft: '5px solid #FF5252' }}>
              <h5 style={{ color: '#D32F2F', fontWeight: 'bold' }}>Evaluación de Riesgo</h5>
              <div className="d-flex gap-4 mt-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" name="riesgoAutolitico" checked={formData.riesgoAutolitico} onChange={manejarCambio} />
                  <label className="form-check-label fw-bold" style={{ color: '#D32F2F' }}>Riesgo Autolítico Activo</label>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" name="riesgoHeteroagresivo" checked={formData.riesgoHeteroagresivo} onChange={manejarCambio} />
                  <label className="form-check-label fw-bold" style={{ color: '#D32F2F' }}>Riesgo Heteroagresivo Activo</label>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button className="btn-pastel-secondary" onClick={() => setActiveTab('examen')}>Anterior</button>
              <button className="btn-pastel-primary" onClick={() => setActiveTab('plan')}>Siguiente: Diagnóstico</button>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: DIAGNÓSTICO Y PLAN */}
        {activeTab === 'plan' && (
          <div className="animacion-entrada">
            <div className="mb-4">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Impresión Diagnóstica (CIE-10)</label>
              <input type="text" className="form-control" name="impresionDiagnosticaCIE10" value={formData.impresionDiagnosticaCIE10} onChange={manejarCambio} placeholder="Ej. F41.1 Trastorno de ansiedad generalizada" required />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Objetivos Terapéuticos</label>
              <textarea className="form-control" name="objetivosTerapeuticos" value={formData.objetivosTerapeuticos} onChange={manejarCambio} rows="3" placeholder="Metas a corto y mediano plazo..." required />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Plan de Tratamiento</label>
              <textarea className="form-control" name="planTratamiento" value={formData.planTratamiento} onChange={manejarCambio} rows="3" placeholder="Enfoque terapéutico, tareas, derivaciones..." required />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Notas de Evolución de la Sesión Actual</label>
              <textarea className="form-control" name="notasEvolucionSesion" value={formData.notasEvolucionSesion} onChange={manejarCambio} rows="4" placeholder="Desarrollo de la sesión..." />
            </div>
            <div className="d-flex gap-2 justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid var(--purple-pastel)' }}>
              <button className="btn-pastel-secondary" onClick={() => setActiveTab('esferas')}>Anterior</button>
              <button className="btn-pastel-primary" onClick={() => alert('Firmando y guardando formato psicológico en la BDD...')}>Guardar Expediente Psicológico</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default FormatoPsicologia;