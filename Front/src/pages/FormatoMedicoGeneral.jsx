import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { FileText, Activity, Stethoscope, ClipboardCheck, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import '../styles/style.css';

function FormatoMedicoGeneral({ idExpediente, setEstadoGlobal }) {
  const [activeTab, setActiveTab] = useState('antecedentes');
  const [guardando, setGuardando] = useState(false);
  const [modo, setModo] = useState('nuevo'); // 'nuevo' o 'editar'
  
  // Estado mapeado exactamente a la tabla operaciones.formato_medico_general
  const [formData, setFormData] = useState({
    // Antecedentes
    ahfDiabetes: false,
    ahfHipertension: false,
    ahfCardiopatias: false,
    ahfOncologicos: false,
    tabaquismo: false,
    alcoholismo: false,
    alergiasConocidas: 'Negadas',
    enfermedadesCronicas: '',
    cirugiasPrevias: '',
    
    // Interrogatorio y Signos Vitales
    motivoConsulta: '',
    interrogatorioAparatos: '',
    peso: '',
    talla: '',
    temperatura: '',
    frecuenciaCardiaca: '',
    presionSistolica: '',
    presionDiastolica: '',
    
    // Exploración Física
    exploracionCabezaCuello: '',
    exploracionTorax: '',
    exploracionAbdomen: '',
    exploracionNeurologica: '',
    
    // Diagnóstico y Plan
    diagnosticoCIE10: '',
    planTratamiento: '',
    pronostico: '',
    notasEvolucion: '' // Integración del historial clínico dinámico
  });

  // Cargar datos previos si existen para evitar violaciones de Unique Constraint
  useEffect(() => {
    const verificarYcargarPreexistencia = async () => {
      if (!idExpediente) return;
      if (setEstadoGlobal) setEstadoGlobal('Buscando historial clínico general...');

      try {
        const { data, error } = await supabase
          .schema('operaciones')
          .from('formato_medico_general')
          .select('*')
          .eq('id_expediente', idExpediente)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Mapeo inverso de Snake Case (DB) a Camel Case (State)
          setFormData({
            ahfDiabetes: data.ahf_diabetes || false,
            ahfHipertension: data.ahf_hipertension || false,
            ahfCardiopatias: data.ahf_cardiopatias || false,
            ahfOncologicos: data.ahf_oncologicos || false,
            tabaquismo: data.tabaquismo || false,
            alcoholismo: data.alcoholismo || false,
            alergiasConocidas: data.alergias_conocidas || 'Negadas',
            enfermedadesCronicas: data.enfermedades_cronicas || '',
            cirugiasPrevias: data.cirugias_previas || '',
            
            motivoConsulta: data.motivo_consulta || '',
            interrogatorioAparatos: data.interrogatorio_aparatos_sistemas || '',
            peso: data.peso_kg || '',
            talla: data.talla_cm || '',
            temperatura: data.temperatura_c || '',
            frecuenciaCardiaca: data.frecuencia_cardiaca_lpm || '',
            presionSistolica: data.presion_arterial_sistolica || '',
            presionDiastolica: data.presion_arterial_diastolica || '',
            
            exploracionCabezaCuello: data.exploracion_cabeza_cuello || '',
            exploracionTorax: data.exploracion_torax || '',
            exploracionAbdomen: data.exploracion_abdomen || '',
            exploracionNeurologica: data.exploracion_neurologica || '',
            
            diagnosticoCIE10: data.diagnostico_principal_cie10 || '',
            planTratamiento: data.plan_tratamiento_receta || '',
            pronostico: data.pronostico || '',
            notasEvolucion: data.notas_evolucion || ''
          });
          setModo('editar');
          if (setEstadoGlobal) setEstadoGlobal('Expediente previo detectado. Modo de seguimiento activo.');
        } else {
          setModo('nuevo');
          if (setEstadoGlobal) setEstadoGlobal('Expediente médico en blanco listo para llenado.');
        }
      } catch (err) {
        console.error("Error consultando preexistencia médica:", err);
      }
    };

    verificarYcargarPreexistencia();
  }, [idExpediente]);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const guardarFormatoMedico = async (e) => {
    e.preventDefault();
    
    if (!idExpediente) {
      alert("Error: No hay un ID de expediente activo asociado a esta consulta.");
      return;
    }

    setGuardando(true);
    if (setEstadoGlobal) setEstadoGlobal('Sincronizando con Supabase Cloud...');

    // Mapeo limpio a Snake Case estructurado para la base de datos
    const dbPayload = {
      id_expediente: idExpediente,
      ahf_diabetes: formData.ahfDiabetes,
      ahf_hipertension: formData.ahfHipertension,
      ahf_cardiopatias: formData.ahfCardiopatias,
      ahf_oncologicos: formData.ahfOncologicos,
      tabaquismo: formData.tabaquismo,
      alcoholismo: formData.alcoholismo,
      alergias_conocidas: formData.alergiasConocidas,
      enfermedades_cronicas: formData.enfermedadesCronicas,
      cirugias_previas: formData.cirugiasPrevias,
      
      motivo_consulta: formData.motivoConsulta,
      interrogatorio_aparatos_sistemas: formData.interrogatorioAparatos,
      peso_kg: formData.peso ? parseFloat(formData.peso) : null,
      talla_cm: formData.talla ? parseFloat(formData.talla) : null,
      temperatura_c: formData.temperatura ? parseFloat(formData.temperatura) : null,
      frecuencia_cardiaca_lpm: formData.frecuenciaCardiaca ? parseFloat(formData.frecuenciaCardiaca) : null,
      presion_arterial_sistolica: formData.presionSistolica ? parseFloat(formData.presionSistolica) : null,
      presion_arterial_diastolica: formData.presionDiastolica ? parseFloat(formData.presionDiastolica) : null,
      
      exploracion_cabeza_cuello: formData.exploracionCabezaCuello,
      exploracion_torax: formData.exploracionTorax,
      exploracion_abdomen: formData.exploracionAbdomen,
      exploracion_neurologica: formData.exploracionNeurologica,
      
      diagnostico_principal_cie10: formData.diagnosticoCIE10,
      plan_tratamiento_receta: formData.planTratamiento,
      pronostico: formData.pronostico,
      notas_evolucion: formData.notasEvolucion
    };

    try {
      if (modo === 'editar') {
        const { error } = await supabase
          .schema('operaciones')
          .from('formato_medico_general')
          .update(dbPayload)
          .eq('id_expediente', idExpediente);

        if (error) throw error;
        alert('¡Historial clínico médico actualizado correctamente!');
      } else {
        const { error } = await supabase
          .schema('operaciones')
          .from('formato_medico_general')
          .insert([dbPayload]);

        if (error) throw error;
        alert('¡Nuevo expediente médico guardado con éxito!');
        setModo('editar'); 
      }
      if (setEstadoGlobal) setEstadoGlobal('Todos los cambios guardados.');
    } catch (error) {
      console.error("Error en la persistencia médica:", error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: 'var(--white)' }}>
      <h3 className="text-purple mb-4" style={{ fontWeight: 'bold' }}>Expediente Clínico: Medicina General</h3>
      
      {/* Navegación por Pestañas Minimalistas con Lucide Icons */}
      <ul className="nav nav-tabs mb-4" style={{ borderBottom: '2px solid var(--purple-pastel)' }}>
        <li className="nav-item">
          <button 
            type="button"
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'antecedentes' ? 'active text-purple fw-bold' : 'text-muted'}`} 
            onClick={() => setActiveTab('antecedentes')} 
            style={{ border: 'none', backgroundColor: 'transparent' }}
          >
            <FileText size={16} /> 1. Antecedentes
          </button>
        </li>
        <li className="nav-item">
          <button 
            type="button"
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'interrogatorio' ? 'active text-purple fw-bold' : 'text-muted'}`} 
            onClick={() => setActiveTab('interrogatorio')} 
            style={{ border: 'none', backgroundColor: 'transparent' }}
          >
            <Activity size={16} /> 2. Interrogatorio y Vitals
          </button>
        </li>
        <li className="nav-item">
          <button 
            type="button"
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'exploracion' ? 'active text-purple fw-bold' : 'text-muted'}`} 
            onClick={() => setActiveTab('exploracion')} 
            style={{ border: 'none', backgroundColor: 'transparent' }}
          >
            <Stethoscope size={16} /> 3. Exploración Física
          </button>
        </li>
        <li className="nav-item">
          <button 
            type="button"
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'diagnostico' ? 'active text-purple fw-bold' : 'text-muted'}`} 
            onClick={() => setActiveTab('diagnostico')} 
            style={{ border: 'none', backgroundColor: 'transparent' }}
          >
            <ClipboardCheck size={16} /> 4. Diagnóstico
          </button>
        </li>
      </ul>

      {/* Formulario unificado */}
      <form onSubmit={guardarFormatoMedico}>
        <div className="tab-content pt-2">
          
          {/* PESTAÑA 1: ANTECEDENTES */}
          {activeTab === 'antecedentes' && (
            <div className="animacion-entrada">
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5 className="text-purple" style={{fontWeight: '600'}}>Heredofamiliares (AHF)</h5>
                  <div className="form-check form-switch mt-3">
                    <input className="form-check-input" type="checkbox" name="ahfDiabetes" checked={formData.ahfDiabetes} onChange={manejarCambio} />
                    <label className="form-check-label">Diabetes Mellitus</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" name="ahfHipertension" checked={formData.ahfHipertension} onChange={manejarCambio} />
                    <label className="form-check-label">Hipertensión Arterial</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" name="ahfCardiopatias" checked={formData.ahfCardiopatias} onChange={manejarCambio} />
                    <label className="form-check-label">Cardiopatías</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" name="ahfOncologicos" checked={formData.ahfOncologicos} onChange={manejarCambio} />
                    <label className="form-check-label">Enfermedades Oncológicas</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <h5 className="text-purple" style={{fontWeight: '600'}}>Personales No Patológicos</h5>
                  <div className="form-check form-switch mt-3">
                    <input className="form-check-input" type="checkbox" name="tabaquismo" checked={formData.tabaquismo} onChange={manejarCambio} />
                    <label className="form-check-label">Tabaquismo Activo</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" name="alcoholismo" checked={formData.alcoholismo} onChange={manejarCambio} />
                    <label className="form-check-label">Alcoholismo Frecuente</label>
                  </div>
                  <div className="mt-3">
                    <label className="form-label" style={{ color: 'var(--text-light)' }}>Alergias Conocidas</label>
                    <input type="text" className="form-control" name="alergiasConocidas" value={formData.alergiasConocidas} onChange={manejarCambio} />
                  </div>
                </div>
              </div>
              
              <h5 className="text-purple" style={{fontWeight: '600'}}>Personales Patológicos</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small">Enfermedades Crónicas</label>
                  <textarea className="form-control" name="enfermedadesCronicas" value={formData.enfermedadesCronicas} onChange={manejarCambio} rows="2" placeholder="Ej. Asma, Hipotiroidismo..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Cirugías Previas</label>
                  <textarea className="form-control" name="cirugiasPrevias" value={formData.cirugiasPrevias} onChange={manejarCambio} rows="2" placeholder="Ej. Apendicectomía (2015)..." />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2" style={{ backgroundColor: 'var(--purple-accent)', border: 'none' }} onClick={() => setActiveTab('interrogatorio')}>
                  <span>Siguiente: Interrogatorio</span> <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: INTERROGATORIO Y SIGNOS VITALES */}
          {activeTab === 'interrogatorio' && (
            <div className="animacion-entrada">
              <div className="mb-4">
                <label className="form-label fw-bold">Motivo de la Consulta</label>
                <textarea className="form-control" name="motivoConsulta" value={formData.motivoConsulta} onChange={manejarCambio} rows="2" required placeholder="Razón principal de la visita..." />
              </div>
              <div className="mb-4">
                <label className="form-label" style={{ color: 'var(--text-light)' }}>Interrogatorio por Aparatos y Sistemas</label>
                <textarea className="form-control" name="interrogatorioAparatos" value={formData.interrogatorioAparatos} onChange={manejarCambio} rows="3" placeholder="Interrogatorio dirigido..." />
              </div>
              
              <h5 className="text-purple mb-3" style={{fontWeight: '600'}}>Signos Vitales y Somatometría</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <label className="form-label small">Peso (Kg)</label>
                  <input type="number" step="0.1" className="form-control" name="peso" value={formData.peso} onChange={manejarCambio} placeholder="Ej. 75.5" />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Talla (Cm)</label>
                  <input type="number" step="0.1" className="form-control" name="talla" value={formData.talla} onChange={manejarCambio} placeholder="Ej. 175" />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Temp (°C)</label>
                  <input type="number" step="0.1" className="form-control" name="temperatura" value={formData.temperatura} onChange={manejarCambio} placeholder="Ej. 36.5" />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Freq. Cardiaca (LPM)</label>
                  <input type="number" className="form-control" name="frecuenciaCardiaca" value={formData.frecuenciaCardiaca} onChange={manejarCambio} placeholder="Ej. 80" />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Tensión Sistólica (mmHg)</label>
                  <input type="number" className="form-control" name="presionSistolica" value={formData.presionSistolica} onChange={manejarCambio} placeholder="Ej. 120" />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Tensión Diastólica (mmHg)</label>
                  <input type="number" className="form-control" name="presionDiastolica" value={formData.presionDiastolica} onChange={manejarCambio} placeholder="Ej. 80" />
                </div>
              </div>
              
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2" onClick={() => setActiveTab('antecedentes')}>
                  <ArrowLeft size={16} /> Anterior
                </button>
                <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2" style={{ backgroundColor: 'var(--purple-accent)', border: 'none' }} onClick={() => setActiveTab('exploracion')}>
                  <span>Siguiente: Exploración</span> <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* PESTAÑA 3: EXPLORACIÓN FÍSICA */}
          {activeTab === 'exploracion' && (
            <div className="animacion-entrada">
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Exploración Cabeza y Cuello</label>
                  <textarea className="form-control" name="exploracionCabezaCuello" value={formData.exploracionCabezaCuello} onChange={manejarCambio} rows="3" placeholder="Normocéfalo, pupilas isocóricas..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Exploración Tórax</label>
                  <textarea className="form-control" name="exploracionTorax" value={formData.exploracionTorax} onChange={manejarCambio} rows="3" placeholder="Campos pulmonares bien ventilados, ruidos cardiacos rítmicos..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Exploración Abdomen</label>
                  <textarea className="form-control" name="exploracionAbdomen" value={formData.exploracionAbdomen} onChange={manejarCambio} rows="3" placeholder="Blando, depresible, sin megalias..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Exploración Neurológica</label>
                  <textarea className="form-control" name="exploracionNeurologica" value={formData.exploracionNeurologica} onChange={manejarCambio} rows="3" placeholder="Funciones mentales superiores conservadas, sin déficits sensitivos..." />
                </div>
              </div>
              
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2" onClick={() => setActiveTab('interrogatorio')}>
                  <ArrowLeft size={16} /> Anterior
                </button>
                <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2" style={{ backgroundColor: 'var(--purple-accent)', border: 'none' }} onClick={() => setActiveTab('diagnostico')}>
                  <span>Siguiente: Diagnóstico</span> <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* PESTAÑA 4: DIAGNÓSTICO Y TRATAMIENTO */}
          {activeTab === 'diagnostico' && (
            <div className="animacion-entrada">
              <div className="mb-4">
                <label className="form-label fw-bold">Diagnóstico Principal (CIE-10)</label>
                <input type="text" className="form-control" name="diagnosticoCIE10" value={formData.diagnosticoCIE10} onChange={manejarCambio} placeholder="Ej. J02.9 Faringitis aguda" required />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold">Plan de Tratamiento y Receta Médica</label>
                <textarea className="form-control" name="planTratamiento" value={formData.planTratamiento} onChange={manejarCambio} rows="4" placeholder="Indicaciones precisas, fármaco, dosis y frecuencia..." required />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold">Pronóstico Clínico</label>
                <input type="text" className="form-control" name="pronostico" value={formData.pronostico} onChange={manejarCambio} placeholder="Favorable para la vida y la función..." />
              </div>

              {/* SECCIÓN COMPLEMENTARIA NORMADA: NOTAS DE EVOLUCIÓN HISTÓRICA */}
              <div className="mb-4 p-3 rounded border" style={{ backgroundColor: '#F9FAFB', borderLeft: '4px solid var(--purple-accent)' }}>
                <label className="form-label fw-bold text-main" style={{ color: 'var(--purple-accent)' }}>Notas de Evolución (Seguimiento Clínico Continuo)</label>
                <textarea className="form-control bg-white" name="notasEvolucion" value={formData.notasEvolucion} onChange={manejarCambio} rows="3" placeholder="Describa la evolución del cuadro clínico en consultas subsecuentes..." />
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid var(--purple-pastel)' }}>
                <button type="button" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2" onClick={() => setActiveTab('exploracion')}>
                  <ArrowLeft size={16} /> Anterior
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary d-inline-flex align-items-center gap-2"
                  style={{ backgroundColor: 'var(--purple-accent)', border: 'none', fontWeight: 'bold' }}
                  disabled={guardando}
                >
                  <Save size={16} />
                  <span>{guardando ? 'Sincronizando...' : 'Guardar Expediente Médico'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </form>
    </div>
  );
}

export default FormatoMedicoGeneral;