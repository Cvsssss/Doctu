import React, { useState } from 'react';
import { supabase } from '../config/supabaseClient';
import '../styles/style.css';

// --- COMPONENTE INTERNO: Odontograma Clínico Interactivo (FDI) ---
const OdontogramaInteractivo = ({ jsonState, setJsonState }) => {
  // Arreglos de dientes normativos para adultos según el sistema FDI
  const cuadrante1 = [18, 17, 16, 15, 14, 13, 12, 11]; // Superior Derecho
  const cuadrante2 = [21, 22, 23, 24, 25, 26, 27, 28]; // Superior Izquierdo
  const cuadrante4 = [48, 47, 46, 45, 44, 43, 42, 41]; // Inferior Derecho
  const cuadrante3 = [31, 32, 33, 34, 35, 36, 37, 38]; // Inferior Izquierdo

  const estadosPosibles = [
    { clave: 'Sano', color: '#4CAF50', icono: '🦷' },
    { clave: 'Caries', color: '#F44336', icono: '🔴' },
    { clave: 'Corona', color: '#FF9800', icono: '👑' },
    { clave: 'Ausente', color: '#9E9E9E', icono: '❌' },
    { clave: 'Tratamiento de Conducto', color: '#9C27B0', icono: '⚡' }
  ];

  const [dienteSeleccionado, setDienteSeleccionado] = useState(null);

  const cambiarEstadoDiente = (dienteId, estado) => {
    const nuevoEstado = { ...jsonState, [dienteId]: estado };
    setJsonState(nuevoEstado);
    setDienteSeleccionado(null); // Cerrar panel de edición
  };

  const renderFilaDientes = (dientes) => (
    <div className="d-flex justify-content-center gap-2 my-2 flex-wrap">
      {dientes.map((d) => {
        const estadoActual = jsonState[`diente_${d}`] || 'Sano';
        const configEstado = estadosPosibles.find(e => e.clave === estadoActual) || estadosPosibles[0];
        
        return (
          <div 
            key={d} 
            className="text-center p-2 rounded border"
            style={{ 
              cursor: 'pointer', 
              backgroundColor: dienteSeleccionado === d ? '#E3F2FD' : '#MismoFondo',
              borderColor: dienteSeleccionado === d ? '#1565C0' : '#E0E0E0',
              minWidth: '55px',
              transition: 'all 0.2s'
            }}
            onClick={() => setDienteSeleccionado(d)}
          >
            <div style={{ fontSize: '1.2rem' }}>{configEstado.icono}</div>
            <div className="fw-bold small" style={{ color: '#1565C0' }}>{d}</div>
            <div className="badge mt-1" style={{ backgroundColor: configEstado.color, fontSize: '0.65rem', display: 'block' }}>
              {configEstado.clave}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="card p-3 border-0 bg-light mb-4">
      <h6 className="fw-bold text-secondary mb-3">Haga clic en un diente para registrar un hallazgo:</h6>
      
      {/* Arcada Superior */}
      <div className="mb-3">
        <div className="small text-muted text-center">Arcada Superior (Derecha / Izquierda)</div>
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          {renderFilaDientes(cuadrante1)}
          {renderFilaDientes(cuadrante2)}
        </div>
      </div>

      {/* Arcada Inferior */}
      <div className="mb-4">
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          {renderFilaDientes(cuadrante4)}
          {renderFilaDientes(cuadrante3)}
        </div>
        <div className="small text-muted text-center">Arcada Inferior (Derecha / Izquierda)</div>
      </div>

      {/* Panel Flotante / Contextual de Edición */}
      {dienteSeleccionado && (
        <div className="p-3 bg-white border rounded shadow-sm text-center animacion-entrada" style={{ borderTop: '4px solid #1565C0' }}>
          <h6 className="fw-bold mb-3 text-purple">Asignar diagnóstico al Diente {dienteSeleccionado}</h6>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            {estadosPosibles.map((est) => (
              <button
                key={est.clave}
                type="button"
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                onClick={() => cambiarEstadoDiente(`diente_${dienteSeleccionado}`, est.clave)}
              >
                <span>{est.icono}</span> {est.clave}
              </button>
            ))}
            <button 
              type="button" 
              className="btn btn-sm btn-link text-muted" 
              onClick={() => setDienteSeleccionado(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


function FormatoOdontologia({ idExpediente, setEstadoGlobal }) {
  const [activeTab, setActiveTab] = useState('atm');
  const [guardando, setGuardando] = useState(false);
  
  // Estado mapeado exactamente a la tabla operaciones.formato_odontologia
  const [formData, setFormData] = useState({
    atmChasquido: false,
    atmCrepitacion: false,
    atmDolor: false,
    atmDesviacionApertura: false,
    alteracionesMaxilofaciales: '',
    labiosCarrillos: 'Sin alteraciones',
    lenguaPisoBoca: 'Sin alteraciones',
    paladarOrofaringe: 'Sin alteraciones',
    enciasPeriodonto: 'Sin alteraciones',
    habitoBruxismo: false,
    habitoDeglucionAtipica: false,
    habitoRespiracionBucal: false,
    habitosOtros: '',
    indicePlacaOLeary: '',
    cepilladoFrecuencia: '',
    usoHiloDental: false,
    usoEnjuague: false,
    odontogramaJSON: {}, 
    dientesCariados: 0,
    dientesPerdidos: 0,
    dientesObturados: 0,
    indiceCPO: 0,
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

  const calcularCPO = (c, p, o) => {
    const total = (parseInt(c) || 0) + (parseInt(p) || 0) + (parseInt(o) || 0);
    setFormData(prev => ({ ...prev, indiceCPO: total }));
  };

  // Función para guardar el formato en Supabase mapeando los campos del Front a Snake Case
  const guardarFormatoOdontologia = async (e) => {
    e.preventDefault();
    
    if (!idExpediente) {
      alert("Error: No hay un ID de expediente activo asociado a esta consulta.");
      return;
    }

    setGuardando(true);
    if (setEstadoGlobal) setEstadoGlobal('Optimizando datos de consulta...');

    // ─── OPTIMIZACIÓN: Filtramos para enviar SOLO los dientes con hallazgos ───
    const odontogramaFiltrado = {};
    Object.keys(formData.odontogramaJSON).forEach((dienteKey) => {
      const estado = formData.odontogramaJSON[dienteKey];
      // Si el estado es diferente de 'Sano', lo incluimos en el reporte
      if (estado !== 'Sano') {
        odontogramaFiltrado[dienteKey] = estado;
      }
    });

    try {
      const { error } = await supabase
        .schema('operaciones')
        .from('formato_odontologia')
        .insert([{
          id_expediente: idExpediente,
          atm_chasquido: formData.atmChasquido,
          atm_crepitacion: formData.atmCrepitacion,
          atm_dolor: formData.atmDolor,
          atm_desviacion_apertura: formData.atmDesviacionApertura,
          alteraciones_maxilofaciales: formData.alteracionesMaxilofaciales,
          labios_carrillos: formData.labiosCarrillos,
          lengua_pisoboca: formData.lenguaPisoBoca,
          paladar_orofaringe: formData.paladarOrofaringe,
          encias_periodonto: formData.enciasPeriodonto,
          habito_bruxismo: formData.habitoBruxismo,
          habito_deglucion_atipica: formData.habitoDeglucionAtipica,
          habito_respiracion_bucal: formData.habitoRespiracionBucal,
          habitos_otros: formData.habitosOtros,
          indice_placa_o_leary: formData.indicePlacaOLeary ? parseFloat(formData.indicePlacaOLeary) : null,
          cepillado_frecuencia: formData.cepilladoFrecuencia,
          uso_hilo_dental: formData.usoHiloDental,
          uso_enjuague: formData.usoEnjuague,
          
          // Enviamos el JSON reducido, pesará hasta un 90% menos
          odontograma_json: odontogramaFiltrado, 
          
          dientes_cariados_c: parseInt(formData.dientesCariados) || 0,
          dientes_perdidos_p: parseInt(formData.dientesPerdidos) || 0,
          dientes_obturados_o: parseInt(formData.dientesObturados) || 0,
          indice_cpo: parseInt(formData.indiceCPO) || 0,
          clasificacion_angle: formData.clasificacionAngle,
          sobremordida_horizontal: formData.sobremordidaHorizontal ? parseFloat(formData.sobremordidaHorizontal) : null,
          sobremordida_vertical: formData.sobremordidaVertical ? parseFloat(formData.sobremordidaVertical) : null,
          diagnostico_pulpar: formData.diagnosticoPulpar,
          diagnostico_periodontal: formData.diagnosticoPeriodontal,
          plan_tratamiento_fases: formData.planTratamientoFases,
          presupuesto_estimado: formData.presupuestoEstimado ? parseFloat(formData.presupuestoEstimado) : null,
          consentimiento_firmado: formData.consentimientoFirmado
        }]);

      if (error) throw error;

      alert('¡Expediente odontológico optimizado y guardado con éxito!');
      if (setEstadoGlobal) setEstadoGlobal('Cambios guardados con éxito.');
    } catch (error) {
      console.error("Error insertando formato_odontologia:", error);
      alert(`Error al guardar: ${error.message}`);
      if (setEstadoGlobal) setEstadoGlobal('Error al guardar.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-2" style={{ backgroundColor: 'var(--white)' }}>
      
      {/* Navegación por Pestañas */}
      <ul className="nav nav-tabs mb-4" style={{ borderBottom: '2px solid #BBDEFB' }}>
        <li className="nav-item">
          <button 
            type="button"
            className={`nav-link ${activeTab === 'atm' ? 'active fw-bold' : 'text-muted'}`} 
            onClick={() => setActiveTab('atm')} 
            style={{ border: 'none', backgroundColor: 'transparent', color: activeTab === 'atm' ? '#1565C0' : 'inherit' }}
          >
            1. ATM y Tejidos
          </button>
        </li>
        <li className="nav-item">
          <button 
            type="button"
            className={`nav-link ${activeTab === 'odontograma' ? 'active fw-bold' : 'text-muted'}`} 
            onClick={() => setActiveTab('odontograma')} 
            style={{ border: 'none', backgroundColor: 'transparent', color: activeTab === 'odontograma' ? '#1565C0' : 'inherit' }}
          >
            2. Odontograma e Índices
          </button>
        </li>
        <li className="nav-item">
          <button 
            type="button"
            className={`nav-link ${activeTab === 'diagnostico' ? 'active fw-bold' : 'text-muted'}`} 
            onClick={() => setActiveTab('diagnostico')} 
            style={{ border: 'none', backgroundColor: 'transparent', color: activeTab === 'diagnostico' ? '#1565C0' : 'inherit' }}
          >
            3. Diagnóstico y Plan
          </button>
        </li>
      </ul>

      <form onSubmit={guardarFormatoOdontologia}>
        {/* PESTAÑA 1: ATM, TEJIDOS BLANDOS Y HÁBITOS */}
        {activeTab === 'atm' && (
          <div className="animacion-entrada">
            <h5 style={{ color: '#1565C0', fontWeight: '600' }}>Articulación Temporomandibular (ATM)</h5>
            <div className="d-flex gap-4 mt-3 mb-4 flex-wrap">
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
            <div className="d-flex gap-4 mt-3 mb-4 flex-wrap">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="habitoBruxismo" checked={formData.habitoBruxismo} onChange={manejarCambio} />
                <label className="form-check-label">Bruxismo</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="habitoDeglucionAtipica" checked={formData.habitoDeglucionAtipica} onChange={manejarCambio} />
                <label className="form-check-label">Deglución Atípica</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="habitoRespiracionBucal" checked={formData.habitoRespiracionBucal} onChange={manejarCambio} />
                <label className="form-check-label">Respiración Bucal</label>
              </div>
            </div>

            <button type="button" className="btn mt-4" style={{ backgroundColor: '#1565C0', color: 'white' }} onClick={() => setActiveTab('odontograma')}>Siguiente: Odontograma</button>
          </div>
        )}

        {/* PESTAÑA 2: ODONTOGRAMA E ÍNDICES */}
        {activeTab === 'odontograma' && (
          <div className="animacion-entrada">
            <h5 style={{ color: '#1565C0', fontWeight: '600' }} className="mb-3">Mapa Dental Interactivo (FDI)</h5>
            
            <OdontogramaInteractivo 
              jsonState={formData.odontogramaJSON} 
              setJsonState={(nuevoJson) => setFormData({...formData, odontogramaJSON: nuevoJson})} 
            />

            <div className="row g-4 mt-2">
              <div className="col-md-6">
                <div className="p-3 rounded" style={{ backgroundColor: '#F5F5F5', border: '1px solid #E0E0E0' }}>
                  <h6 style={{ fontWeight: 'bold' }}>Índice CPO</h6>
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
                    <input type="number" step="0.1" className="form-control" name="indicePlacaOLeary" value={formData.indicePlacaOLeary} onChange={manejarCambio} placeholder="0.0" />
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
              <button type="button" className="btn btn-outline-secondary" onClick={() => setActiveTab('atm')}>Anterior</button>
              <button type="button" className="btn" style={{ backgroundColor: '#1565C0', color: 'white' }} onClick={() => setActiveTab('diagnostico')}>Siguiente: Diagnóstico</button>
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
              <button type="button" className="btn btn-outline-secondary" onClick={() => setActiveTab('odontograma')}>Anterior</button>
              <button 
                type="submit" 
                className="btn" 
                disabled={guardando}
                style={{ backgroundColor: '#1565C0', color: 'white', fontWeight: 'bold' }}
              >
                {guardando ? 'Sincronizando con Supabase...' : '🏷️ Guardar Expediente Odontológico'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default FormatoOdontologia;