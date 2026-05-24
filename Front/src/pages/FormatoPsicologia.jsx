import React, { useState } from 'react';
import { supabase } from '../config/supabaseClient'; // 1. Importar el cliente de Supabase
import '../styles/style.css';

function FormatoPsicologia({ idExpediente, setEstadoGlobal }) { // 2. Recibir props desde el padre
  const [activeTab, setActiveTab] = useState('motivo');
  const [guardando, setGuardando] = useState(false); // 3. Estado de carga
  
  // Estado mapeado a la tabla Formato_Psicologia
  const [formData, setFormData] = useState({
    // Ficha y Motivo
    estadoCivil: '',
    escolaridad: '',
    ocupacion: '',
    religion: '',
    viveCon: '',
    motivoConsulta: '',
    sintomatologiaActual: '',
    fechaInicioSintomas: '',
    eventosDesencadenantes: '',
    
    // Antecedentes
    antecedentesHeredofamiliares: '',
    antecedentesPersonalesPatologicos: '',
    tratamientosPreviosPsicologicos: false,
    medicacionPsiquiatricaActual: '',
    consumoSustancias: '',
    
    // Examen Mental
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
    
    // Esferas y Riesgos
    areaFamiliar: '',
    areaSocialInterpersonal: '',
    areaLaboralAcademica: '',
    areaPsicosexual: '',
    riesgoAutolitico: false,
    riesgoHeteroagresivo: false,
    
    // Diagnóstico y Plan
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

  // 4. LÓGICA DE INSERCIÓN REAL HACIA SUPABASE
  const guardarFormatoPsicologia = async (e) => {
    e.preventDefault();
    
    if (!idExpediente) {
      alert("Error: No hay un ID de expediente activo asociado a esta consulta.");
      return;
    }

    if (!formData.motivoConsulta.trim() || !formData.impresionDiagnosticaCIE10.trim()) {
      alert("Por favor, llene al menos el motivo de consulta y la impresión diagnóstica.");
      return;
    }

    setGuardando(true);
    if (setEstadoGlobal) setEstadoGlobal('Guardando expediente psicológico en Supabase...');

    try {
      const { error } = await supabase
        .schema('operaciones')
        .from('formato_psicologia')
        .insert([{
          id_expediente: idExpediente,
          estado_civil: formData.estadoCivil,
          escolaridad: formData.escolaridad,
          ocupacion: formData.ocupacion,
          religion: formData.religion,
          vive_con: formData.viveCon,
          motivo_consulta: formData.motivoConsulta,
          sintomatologia_actual: formData.sintomatologiaActual,
          fecha_inicio_sintomas: formData.fechaInicioSintomas || null,
          eventos_desencadenantes: formData.eventosDesencadenantes,
          
          antecedentes_heredofamiliares: formData.antecedentesHeredofamiliares,
          antecedentes_personales_patologicos: formData.antecedentesPersonalesPatologicos,
          tratamientos_previos_psicologicos: formData.tratamientosPreviosPsicologicos,
          medicacion_psiquiatrica_actual: formData.medicacionPsiquiatricaActual,
          consumo_sustancias: formData.consumoSustancias,
          
          apariencia_fisica_actitud: formData.aparienciaFisicaActitud,
          estado_conciencia: formData.estadoConciencia,
          orientacion_tep: formData.orientacionTEP,
          atencion_concentracion: formData.atencionConcentracion,
          memoria_corto_largo_plazo: formData.memoriaCortoLargoPlazo,
          pensamiento_curso_contenido: formData.pensamientoCursoContenido,
          lenguaje_comunicacion: formData.lenguajeComunicacion,
          afecto_estado_animo: formData.afectoEstadoAnimo,
          sensopercepcion: formData.sensopercepcion,
          juicio_insight: formData.juicioInsight,
          
          area_familiar: formData.areaFamiliar,
          area_social_interpersonal: formData.areaSocialInterpersonal,
          area_laboral_academica: formData.areaLaboralAcademica,
          area_psicosexual: formData.areaPsicosexual,
          riesgo_autolitico: formData.riesgoAutolitico,
          riesgo_heteroagresivo: formData.riesgoHeteroagresivo,
          
          pruebas_psicometricas_aplicadas: formData.pruebasPsicometricasAplicadas,
          impresion_diagnostica_cie10: formData.impresionDiagnosticaCIE10,
          pronostico: formData.pronostico,
          objetivos_terapeuticos: formData.objetivosTerapeuticos,
          plan_tratamiento: formData.planTratamiento,
          notas_evolucion_sesion: formData.notasEvolucionSesion
        }]);

      if (error) throw error;

      alert('¡Expediente psicológico guardado con éxito!');
      if (setEstadoGlobal) setEstadoGlobal('Cambios guardados con éxito.');
    } catch (error) {
      console.error("Error insertando formato_psicologia:", error);
      alert(`Error al guardar: ${error.message}`);
      if (setEstadoGlobal) setEstadoGlobal('Error al guardar.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: 'var(--white)' }}>
      <h3 className="text-purple mb-4" style={{ fontWeight: 'bold' }}>Expediente Clínico: Psicología</h3>
      
      {/* Navegación por Pestañas */}
      <ul className="nav nav-tabs mb-4" style={{ borderBottom: '2px solid var(--purple-pastel)' }}>
        <li className="nav-item">
          <button type="button" className={`nav-link ${activeTab === 'motivo' ? 'active text-purple fw-bold' : 'text-muted'}`} 
                  onClick={() => setActiveTab('motivo')} style={{ border: 'none', backgroundColor: 'transparent' }}>
            1. Motivo y Antecedentes
          </button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link ${activeTab === 'examen' ? 'active text-purple fw-bold' : 'text-muted'}`} 
                  onClick={() => setActiveTab('examen')} style={{ border: 'none', backgroundColor: 'transparent' }}>
            2. Examen Mental
          </button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link ${activeTab === 'esferas' ? 'active text-purple fw-bold' : 'text-muted'}`} 
                  onClick={() => setActiveTab('esferas')} style={{ border: 'none', backgroundColor: 'transparent' }}>
            3. Esferas y Riesgos
          </button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link ${activeTab === 'plan' ? 'active text-purple fw-bold' : 'text-muted'}`} 
                  onClick={() => setActiveTab('plan')} style={{ border: 'none', backgroundColor: 'transparent' }}>
            4. Diagnóstico y Plan
          </button>
        </li>
      </ul>

      {/* 5. EL FORMULARIO ENVUELVE TODO EL CONTENIDO */}
      <form onSubmit={guardarFormatoPsicologia}>
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
              
              <button type="button" className="btn-pastel-primary" onClick={() => setActiveTab('examen')}>Siguiente: Examen Mental</button>
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
                <button type="button" className="btn-pastel-secondary" onClick={() => setActiveTab('motivo')}>Anterior</button>
                <button type="button" className="btn-pastel-primary" onClick={() => setActiveTab('esferas')}>Siguiente: Esferas</button>
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
                <button type="button" className="btn-pastel-secondary" onClick={() => setActiveTab('examen')}>Anterior</button>
                <button type="button" className="btn-pastel-primary" onClick={() => setActiveTab('plan')}>Siguiente: Diagnóstico</button>
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
                <textarea className="form-control" name="objetivosTerapeuticos" value={formData.objetivosTerapeuticos} onChange={manejarCambio} rows="3" placeholder="Metas a corto y mediano plazo..." />
              </div>
              <div className="mb-4">
                <label className="form-label" style={{ color: 'var(--text-light)' }}>Plan de Tratamiento</label>
                <textarea className="form-control" name="planTratamiento" value={formData.planTratamiento} onChange={manejarCambio} rows="3" placeholder="Enfoque terapéutico, tareas, derivaciones..." />
              </div>
              <div className="mb-4">
                <label className="form-label" style={{ color: 'var(--text-light)' }}>Notas de Evolución de la Sesión Actual</label>
                <textarea className="form-control" name="notasEvolucionSesion" value={formData.notasEvolucionSesion} onChange={manejarCambio} rows="4" placeholder="Desarrollo de la sesión..." />
              </div>
              <div className="d-flex gap-2 justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid var(--purple-pastel)' }}>
                <button type="button" className="btn-pastel-secondary" onClick={() => setActiveTab('esferas')}>Anterior</button>
                <button 
                  type="submit" 
                  className="btn-pastel-primary"
                  disabled={guardando}
                >
                  {guardando ? 'Guardando...' : 'Guardar Expediente Psicológico'}
                </button>
              </div>
            </div>
          )}

        </div>
      </form>
    </div>
  );
}

export default FormatoPsicologia;