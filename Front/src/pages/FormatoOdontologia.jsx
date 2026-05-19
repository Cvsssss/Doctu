import React, { useState } from 'react';
import '../styles/style.css';

// --- COMPONENTE INTERNO: Lógica del Canvas 3D para el Odontograma ---
// Este componente encapsula la lógica gráfica para no saturar el formulario principal
const OdontogramaInteractivo = ({ jsonState, setJsonState }) => {
  const registrarHallazgo = (dienteId, hallazgo) => {
    // Aquí actualizamos el estado JSON que se enviará a la BDD
    const nuevoEstado = { ...jsonState, [dienteId]: hallazgo };
    setJsonState(nuevoEstado);
  };

  return (
    <div className="odontograma-canvas-container" style={{ width: '100%', height: '400px', backgroundColor: '#E3F2FD', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* ESPACIO PARA WEBGL / OPENGL:
        Aquí puedes montar tu <Canvas> (ej. usando react-three-fiber).
        Importa los modelos .gltf/.obj de la dentadura desde Autodesk Maya.
        Aplica mapeo UV para las texturas de las caras (oclusal, mesial, distal, etc.)
        y usa shaders básicos para cambiar el color de la geometría en el evento onClick.
      */}
      
      <div className="text-center" style={{ zIndex: 10 }}>
        <h5 style={{ color: '#1565C0', fontWeight: 'bold' }}>Entorno Gráfico 3D / 2D</h5>
        <p style={{ color: '#1976D2', fontSize: '0.9rem' }}>Canvas interactivo listo para recibir modelos y texturas.</p>
        <button 
          className="btn btn-sm mt-2" 
          style={{ backgroundColor: '#1565C0', color: 'white' }}
          onClick={(e) => { e.preventDefault(); registrarHallazgo('Diente_46', 'Caries Oclusal'); }}
        >
          Simular clic en Diente 46 (Caries)
        </button>
      </div>

      {/* Visualizador de debug del JSON en tiempo real */}
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(255,255,255,0.8)', padding: '5px 10px', borderRadius: '5px', fontSize: '0.75rem' }}>
        <strong>JSON a enviar:</strong> {JSON.stringify(jsonState)}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
function FormatoOdontologia() {
  const [activeTab, setActiveTab] = useState('atm');
  
  // Estado mapeado exactamente a la tabla Formato_Odontologia [cite: 674-699]
  const [formData, setFormData] = useState({
    // ATM y Tejidos Blandos [cite: 680-685]
    atmChasquido: false,
    atmCrepitacion: false,
    atmDolor: false,
    atmDesviacionApertura: false,
    alteracionesMaxilofaciales: '',
    labiosCarrillos: 'Sin alteraciones',
    lenguaPisoBoca: 'Sin alteraciones',
    paladarOrofaringe: 'Sin alteraciones',
    enciasPeriodonto: 'Sin alteraciones',
    
    // Hábitos [cite: 685]
    habitoBruxismo: false,
    habitoDeglucionAtipica: false,
    habitoRespiracionBucal: false,
    habitosOtros: '',
    
    // Índices y Odontograma [cite: 686-690]
    indicePlacaOLeary: '',
    cepilladoFrecuencia: '',
    usoHiloDental: false,
    usoEnjuague: false,
    odontogramaJSON: {}, // Este es el JSON CLOB de la BDD
    dientesCariados: 0,
    dientesPerdidos: 0,
    dientesObturados: 0,
    indiceCPO: 0,
    
    // Diagnóstico y Plan [cite: 691-697]
    clasificacionAngle: '',
    sobremordidaHorizontal: '',
    sobremordidaVertical: '',
    diagnosticoPulpar: '',
    diagnosticoPeriodontal: '',
    planTratamientoFases: '',
    presupuestoEstimado: '',
    consentimientoFirmado: false
  });

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Función para calcular automáticamente el CPO [cite: 690]
  const calcularCPO = (c, p, o) => {
    const total = (parseInt(c) || 0) + (parseInt(p) || 0) + (parseInt(o) || 0);
    setFormData(prev => ({ ...prev, indiceCPO: total }));
  };

  return (
    <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: 'var(--white)' }}>
      <h3 className="text-purple mb-4" style={{ fontWeight: 'bold' }}>Expediente Clínico: Odontología</h3>
      
      {/* Navegación por Pestañas */}
      <ul className="nav nav-tabs mb-4" style={{ borderBottom: '2px solid #BBDEFB' }}>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'atm' ? 'active fw-bold' : 'text-muted'}`} 
                  onClick={(e) => { e.preventDefault(); setActiveTab('atm'); }} 
                  style={{ border: 'none', backgroundColor: 'transparent', color: activeTab === 'atm' ? '#1565C0' : 'inherit' }}>
            1. ATM y Tejidos
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'odontograma' ? 'active fw-bold' : 'text-muted'}`} 
                  onClick={(e) => { e.preventDefault(); setActiveTab('odontograma'); }} 
                  style={{ border: 'none', backgroundColor: 'transparent', color: activeTab === 'odontograma' ? '#1565C0' : 'inherit' }}>
            2. Odontograma e Índices
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'diagnostico' ? 'active fw-bold' : 'text-muted'}`} 
                  onClick={(e) => { e.preventDefault(); setActiveTab('diagnostico'); }} 
                  style={{ border: 'none', backgroundColor: 'transparent', color: activeTab === 'diagnostico' ? '#1565C0' : 'inherit' }}>
            3. Diagnóstico y Plan
          </button>
        </li>
      </ul>

      {/* Contenido Dinámico */}
      <form>
        {/* PESTAÑA 1: ATM, TEJIDOS BLANDOS Y HÁBITOS */}
        {activeTab === 'atm' && (
          <div className="animacion-entrada">
            <h5 style={{ color: '#1565C0', fontWeight: '600' }}>Articulación Temporomandibular (ATM)</h5>
            <div className="d-flex gap-4 mt-3 mb-4">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" name="atmChasquido" checked={formData.atmChasquido} onChange={manejarCambio} />
                <label className="form-check-label">Chasquido</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" name="atmCrepitacion" checked={formData.atmCrepitacion} onChange={manejarCambio} />
                <label className="form-check-label">Crepitación</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" name="atmDolor" checked={formData.atmDolor} onChange={manejarCambio} />
                <label className="form-check-label">Dolor</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" name="atmDesviacionApertura" checked={formData.atmDesviacionApertura} onChange={manejarCambio} />
                <label className="form-check-label">Desviación en Apertura</label>
              </div>
            </div>

            <h5 style={{ color: '#1565C0', fontWeight: '600' }} className="mt-4">Tejidos Blandos</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label small">Labios y Carrillos</label>
                <input type="text" className="form-control" name="labiosCarrillos" value={formData.labiosCarrillos} onChange={manejarCambio} />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Lengua y Piso de Boca</label>
                <input type="text" className="form-control" name="lenguaPisoBoca" value={formData.lenguaPisoBoca} onChange={manejarCambio} />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Paladar y Orofaringe</label>
                <input type="text" className="form-control" name="paladarOrofaringe" value={formData.paladarOrofaringe} onChange={manejarCambio} />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Encías y Periodonto</label>
                <input type="text" className="form-control" name="enciasPeriodonto" value={formData.enciasPeriodonto} onChange={manejarCambio} />
              </div>
            </div>

            <h5 style={{ color: '#1565C0', fontWeight: '600' }} className="mt-4">Hábitos Perniciosos</h5>
            <div className="d-flex gap-4 mt-3 mb-4">
              <div className="form-check mt-1">
                <input className="form-check-input" type="checkbox" name="habitoBruxismo" checked={formData.habitoBruxismo} onChange={manejarCambio} />
                <label className="form-check-label">Bruxismo</label>
              </div>
              <div className="form-check mt-1">
                <input className="form-check-input" type="checkbox" name="habitoDeglucionAtipica" checked={formData.habitoDeglucionAtipica} onChange={manejarCambio} />
                <label className="form-check-label">Deglución Atípica</label>
              </div>
              <div className="form-check mt-1">
                <input className="form-check-input" type="checkbox" name="habitoRespiracionBucal" checked={formData.habitoRespiracionBucal} onChange={manejarCambio} />
                <label className="form-check-label">Respiración Bucal</label>
              </div>
            </div>

            <button className="btn mt-4" style={{ backgroundColor: '#1565C0', color: 'white' }} onClick={(e) => { e.preventDefault(); setActiveTab('odontograma'); }}>Siguiente: Odontograma</button>
          </div>
        )}

        {/* PESTAÑA 2: ODONTOGRAMA E ÍNDICES */}
        {activeTab === 'odontograma' && (
          <div className="animacion-entrada">
            <h5 style={{ color: '#1565C0', fontWeight: '600' }} className="mb-3">Mapa Dental</h5>
            
            {/* Montamos el componente gráfico interactivo */}
            <OdontogramaInteractivo 
              jsonState={formData.odontogramaJSON} 
              setJsonState={(nuevoJson) => setFormData({...formData, odontogramaJSON: nuevoJson})} 
            />

            <div className="row g-4 mt-4">
              <div className="col-md-6">
                <div className="p-3 rounded" style={{ backgroundColor: '#F5F5F5', border: '1px solid #E0E0E0' }}>
                  <h6 style={{ fontWeight: 'bold' }}>Índice CPO (Cariados, Perdidos, Obturados)</h6>
                  <div className="d-flex gap-2 align-items-center mt-3">
                    <input type="number" className="form-control text-center" name="dientesCariados" value={formData.dientesCariados} onChange={(e) => { manejarCambio(e); calcularCPO(e.target.value, formData.dientesPerdidos, formData.dientesObturados); }} placeholder="C" />
                    <span>+</span>
                    <input type="number" className="form-control text-center" name="dientesPerdidos" value={formData.dientesPerdidos} onChange={(e) => { manejarCambio(e); calcularCPO(formData.dientesCariados, e.target.value, formData.dientesObturados); }} placeholder="P" />
                    <span>+</span>
                    <input type="number" className="form-control text-center" name="dientesObturados" value={formData.dientesObturados} onChange={(e) => { manejarCambio(e); calcularCPO(formData.dientesCariados, formData.dientesPerdidos, e.target.value); }} placeholder="O" />
                    <span className="fw-bold ms-2">=</span>
                    <input type="text" className="form-control text-center fw-bold" value={formData.indiceCPO} readOnly style={{ backgroundColor: '#E3F2FD', color: '#1565C0' }} />
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="p-3 rounded" style={{ backgroundColor: '#F5F5F5', border: '1px solid #E0E0E0' }}>
                  <h6 style={{ fontWeight: 'bold' }}>Higiene Bucal</h6>
                  <div className="mb-2 mt-3">
                    <label className="form-label small">Índice Placa O'Leary (%)</label>
                    <input type="number" step="0.1" className="form-control" name="indicePlacaOLeary" value={formData.indicePlacaOLeary} onChange={manejarCambio} />
                  </div>
                  <div className="d-flex gap-3 mt-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="usoHiloDental" checked={formData.usoHiloDental} onChange={manejarCambio} />
                      <label className="form-check-label small">Usa Hilo Dental</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="usoEnjuague" checked={formData.usoEnjuague} onChange={manejarCambio} />
                      <label className="form-check-label small">Usa Enjuague</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-outline-secondary" onClick={(e) => { e.preventDefault(); setActiveTab('atm'); }}>Anterior</button>
              <button className="btn" style={{ backgroundColor: '#1565C0', color: 'white' }} onClick={(e) => { e.preventDefault(); setActiveTab('diagnostico'); }}>Siguiente: Diagnóstico</button>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: DIAGNÓSTICO Y PLAN DE TRATAMIENTO */}
        {activeTab === 'diagnostico' && (
          <div className="animacion-entrada">
            <h5 style={{ color: '#1565C0', fontWeight: '600' }} className="mb-3">Diagnóstico Definitivo</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label small">Diagnóstico Pulpar</label>
                <textarea className="form-control" name="diagnosticoPulpar" value={formData.diagnosticoPulpar} onChange={manejarCambio} rows="2" />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Diagnóstico Periodontal</label>
                <textarea className="form-control" name="diagnosticoPeriodontal" value={formData.diagnosticoPeriodontal} onChange={manejarCambio} rows="2" />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Clasificación Angle (Oclusión)</label>
                <input type="text" className="form-control" name="clasificacionAngle" value={formData.clasificacionAngle} onChange={manejarCambio} placeholder="Ej. Clase I, II o III" />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Sobremordida Horizontal (mm)</label>
                <input type="number" step="0.1" className="form-control" name="sobremordidaHorizontal" value={formData.sobremordidaHorizontal} onChange={manejarCambio} />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Sobremordida Vertical (mm)</label>
                <input type="number" step="0.1" className="form-control" name="sobremordidaVertical" value={formData.sobremordidaVertical} onChange={manejarCambio} />
              </div>
            </div>

            <h5 style={{ color: '#1565C0', fontWeight: '600' }} className="mb-3 mt-4">Plan de Tratamiento</h5>
            <div className="mb-4">
              <label className="form-label small">Tratamiento por Fases</label>
              <textarea className="form-control" name="planTratamientoFases" value={formData.planTratamientoFases} onChange={manejarCambio} rows="4" placeholder="Fase Higiénica, Fase Quirúrgica, Fase Protésica..." required />
            </div>

            <div className="row g-3 align-items-center mb-4">
              <div className="col-md-4">
                <label className="form-label fw-bold">Presupuesto Estimado (MXN)</label>
                <input type="number" step="0.01" className="form-control" name="presupuestoEstimado" value={formData.presupuestoEstimado} onChange={manejarCambio} placeholder="$ 0.00" />
              </div>
              <div className="col-md-8 pt-4">
                <div className="form-check form-switch p-3 rounded" style={{ backgroundColor: '#E8F5E9', border: '1px solid #4CAF50' }}>
                  <input className="form-check-input ms-0 me-3" type="checkbox" name="consentimientoFirmado" checked={formData.consentimientoFirmado} onChange={manejarCambio} />
                  <label className="form-check-label fw-bold" style={{ color: '#2E7D32' }}>Consentimiento Informado Firmado por el Paciente</label>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid #BBDEFB' }}>
              <button className="btn btn-outline-secondary" onClick={(e) => { e.preventDefault(); setActiveTab('odontograma'); }}>Anterior</button>
              <button className="btn" style={{ backgroundColor: '#1565C0', color: 'white' }} onClick={(e) => { e.preventDefault(); alert('Enviando Odontograma JSON y expediente a Oracle DB...'); }}>
                Guardar Expediente Odontológico
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default FormatoOdontologia;