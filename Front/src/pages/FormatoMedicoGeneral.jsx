import React, { useState } from 'react';
import '../styles/style.css';

function FormatoMedicoGeneral() {
  const [activeTab, setActiveTab] = useState('antecedentes');
  
  // Estado mapeado exactamente a la tabla Formato_Medico_General en Oracle
  const [formData, setFormData] = useState({
    // Antecedentes
    tipoSanguineo: '',
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
    habitoExterior: '',
    exploracionCabezaCuello: '',
    exploracionTorax: '',
    exploracionAbdomen: '',
    exploracionNeurologica: '',
    // Diagnóstico
    diagnosticoCIE10: '',
    planTratamiento: '',
    pronostico: ''
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
      <h3 className="text-purple mb-4" style={{ fontWeight: 'bold' }}>Expediente Clínico: Medicina General</h3>
      
      {/* Navegación por Pestañas */}
      <ul className="nav nav-tabs mb-4" style={{ borderBottom: '2px solid var(--purple-pastel)' }}>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'antecedentes' ? 'active text-purple fw-bold' : 'text-muted'}`} 
                  onClick={() => setActiveTab('antecedentes')} style={{ border: 'none', backgroundColor: 'transparent' }}>
            1. Antecedentes
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'interrogatorio' ? 'active text-purple fw-bold' : 'text-muted'}`} 
                  onClick={() => setActiveTab('interrogatorio')} style={{ border: 'none', backgroundColor: 'transparent' }}>
            2. Interrogatorio y Vitals
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'exploracion' ? 'active text-purple fw-bold' : 'text-muted'}`} 
                  onClick={() => setActiveTab('exploracion')} style={{ border: 'none', backgroundColor: 'transparent' }}>
            3. Exploración Física
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'diagnostico' ? 'active text-purple fw-bold' : 'text-muted'}`} 
                  onClick={() => setActiveTab('diagnostico')} style={{ border: 'none', backgroundColor: 'transparent' }}>
            4. Diagnóstico
          </button>
        </li>
      </ul>

      {/* Contenido Dinámico de las Pestañas */}
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
                <div className="form-check mt-3">
                  <input className="form-check-input" type="checkbox" name="tabaquismo" checked={formData.tabaquismo} onChange={manejarCambio} />
                  <label className="form-check-label">Tabaquismo Activo</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="alcoholismo" checked={formData.alcoholismo} onChange={manejarCambio} />
                  <label className="form-check-label">Alcoholismo Frecuente</label>
                </div>
                <div className="mt-3">
                  <label className="form-label" style={{ color: 'var(--text-light)' }}>Alergias Conocidas</label>
                  <input type="text" className="form-control" name="alergiasConocidas" value={formData.alergiasConocidas} onChange={manejarCambio} />
                </div>
              </div>
            </div>
            <button className="btn-pastel-primary" onClick={() => setActiveTab('interrogatorio')}>Siguiente: Interrogatorio</button>
          </div>
        )}

        {/* PESTAÑA 2: INTERROGATORIO Y SIGNOS VITALES */}
        {activeTab === 'interrogatorio' && (
          <div className="animacion-entrada">
            <div className="mb-4">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Motivo de la Consulta</label>
              <textarea className="form-control" name="motivoConsulta" value={formData.motivoConsulta} onChange={manejarCambio} rows="2" required />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Interrogatorio por Aparatos y Sistemas</label>
              <textarea className="form-control" name="interrogatorioAparatos" value={formData.interrogatorioAparatos} onChange={manejarCambio} rows="3" />
            </div>
            
            <h5 className="text-purple mb-3" style={{fontWeight: '600'}}>Signos Vitales</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <label className="form-label small">Peso (Kg)</label>
                <input type="number" className="form-control" name="peso" value={formData.peso} onChange={manejarCambio} />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Talla (Cm)</label>
                <input type="number" className="form-control" name="talla" value={formData.talla} onChange={manejarCambio} />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Temp (°C)</label>
                <input type="number" className="form-control" name="temperatura" value={formData.temperatura} onChange={manejarCambio} />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Freq. Cardiaca (LPM)</label>
                <input type="number" className="form-control" name="frecuenciaCardiaca" value={formData.frecuenciaCardiaca} onChange={manejarCambio} />
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn-pastel-secondary" onClick={() => setActiveTab('antecedentes')}>Anterior</button>
              <button className="btn-pastel-primary" onClick={() => setActiveTab('exploracion')}>Siguiente: Exploración</button>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: EXPLORACIÓN FÍSICA */}
        {activeTab === 'exploracion' && (
          <div className="animacion-entrada">
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label" style={{ color: 'var(--text-light)' }}>Exploración Cabeza y Cuello</label>
                <textarea className="form-control" name="exploracionCabezaCuello" value={formData.exploracionCabezaCuello} onChange={manejarCambio} rows="2" />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ color: 'var(--text-light)' }}>Exploración Tórax</label>
                <textarea className="form-control" name="exploracionTorax" value={formData.exploracionTorax} onChange={manejarCambio} rows="2" />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ color: 'var(--text-light)' }}>Exploración Abdomen</label>
                <textarea className="form-control" name="exploracionAbdomen" value={formData.exploracionAbdomen} onChange={manejarCambio} rows="2" />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ color: 'var(--text-light)' }}>Exploración Neurológica</label>
                <textarea className="form-control" name="exploracionNeurologica" value={formData.exploracionNeurologica} onChange={manejarCambio} rows="2" />
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn-pastel-secondary" onClick={() => setActiveTab('interrogatorio')}>Anterior</button>
              <button className="btn-pastel-primary" onClick={() => setActiveTab('diagnostico')}>Siguiente: Diagnóstico</button>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: DIAGNÓSTICO Y TRATAMIENTO */}
        {activeTab === 'diagnostico' && (
          <div className="animacion-entrada">
            <div className="mb-4">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Diagnóstico Principal (CIE-10)</label>
              <input type="text" className="form-control" name="diagnosticoCIE10" value={formData.diagnosticoCIE10} onChange={manejarCambio} placeholder="Ej. J02.9 Faringitis aguda" required />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Plan de Tratamiento y Receta Medica</label>
              <textarea className="form-control" name="planTratamiento" value={formData.planTratamiento} onChange={manejarCambio} rows="4" placeholder="Indicaciones precisas, dosis y frecuencia..." required />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ color: 'var(--text-light)' }}>Pronóstico</label>
              <input type="text" className="form-control" name="pronostico" value={formData.pronostico} onChange={manejarCambio} placeholder="Favorable para la vida y la función..." />
            </div>
            <div className="d-flex gap-2 justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid var(--purple-pastel)' }}>
              <button className="btn-pastel-secondary" onClick={() => setActiveTab('exploracion')}>Anterior</button>
              <button className="btn-pastel-primary" onClick={() => alert('Generando registro final en base de datos...')}>Guardar Expediente Médico</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default FormatoMedicoGeneral;