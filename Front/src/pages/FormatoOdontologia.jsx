import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import '../styles/style.css';
import { CheckCircle, AlertCircle, Shield, MinusCircle, Activity, UploadCloud, FileImage, X, ArrowLeft, ArrowRight, Save } from 'lucide-react';

// --- COMPONENTE INTERNO: Odontograma Clínico Interactivo (FDI) ---
const OdontogramaInteractivo = ({ jsonState, setJsonState }) => {
  const cuadrante1 = [18, 17, 16, 15, 14, 13, 12, 11]; 
  const cuadrante2 = [21, 22, 23, 24, 25, 26, 27, 28]; 
  const cuadrante4 = [48, 47, 46, 45, 44, 43, 42, 41]; 
  const cuadrante3 = [31, 32, 33, 34, 35, 36, 37, 38]; 

  const estadosPosibles = [
    { clave: 'Sano', color: '#4CAF50', icono: <CheckCircle size={16} color="#4CAF50" /> },
    { clave: 'Caries', color: '#F44336', icono: <AlertCircle size={16} color="#F44336" /> },
    { clave: 'Corona', color: '#FF9800', icono: <Shield size={16} color="#FF9800" /> },
    { clave: 'Ausente', color: '#9E9E9E', icono: <MinusCircle size={16} color="#9E9E9E" /> },
    { clave: 'Tratamiento de Conducto', color: '#9C27B0', icono: <Activity size={16} color="#9C27B0" /> }
  ];

  const [dienteSeleccionado, setDienteSeleccionado] = useState(null);

  const cambiarEstadoDiente = (dienteId, estado) => {
    const nuevoEstado = { ...jsonState, [dienteId]: estado };
    setJsonState(nuevoEstado);
    setDienteSeleccionado(null);
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
              backgroundColor: dienteSeleccionado === d ? '#E3F2FD' : 'transparent',
              borderColor: dienteSeleccionado === d ? '#1565C0' : '#E0E0E0',
              minWidth: '65px', 
              transition: 'all 0.2s'
            }}
            onClick={() => setDienteSeleccionado(d)}
          >
            <div className="d-flex justify-content-center align-items-center mb-1">
              {configEstado.icono}
            </div>
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
      
      <div className="mb-3">
        <div className="small text-muted text-center">Arcada Superior (Derecha / Izquierda)</div>
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          {renderFilaDientes(cuadrante1)}
          {renderFilaDientes(cuadrante2)}
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          {renderFilaDientes(cuadrante4)}
          {renderFilaDientes(cuadrante3)}
        </div>
        <div className="small text-muted text-center">Arcada Inferior (Derecha / Izquierda)</div>
      </div>

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

// --- COMPONENTE PRINCIPAL ---
function FormatoOdontologia({ idExpediente, setEstadoGlobal }) {
  const [activeTab, setActiveTab] = useState('antecedentes_atm');
  const [guardando, setGuardando] = useState(false);
  const [modo, setModo] = useState('nuevo'); // Control de persistencia relacional
  const [archivosCargados, setArchivosCargados] = useState([]); 
  
  const [formData, setFormData] = useState({
    antecedentesPatologicos: '',
    antecedentesNoPatologicos: '',
    consumoAlcohol: '',
    consumoCigarro: '',
    consumoDrogas: '',
    atmChasquido: false,
    atmCrepitacion: false,
    atmDesviacionApertura: false,
    atmMomento: '', 
    atmDolor: false,
    alteracionesMaxilofaciales: '',
    musculatura: 'Sin alteraciones',
    labiosCarrillos: 'Sin alteraciones',
    lenguaPisoBoca: 'Sin alteraciones',
    paladarOrofaringe: 'Sin alteraciones',
    enciasPeriodonto: 'Sin alteraciones',
    habitoBricomania: false, 
    habitoOnicofagia: false,
    habitoSuccionDigital: false,
    habitoMorderLabioMejilla: false,
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
    consentimientoFirmado: false,
    notasEvolucion: ''
  });

  // Efecto de carga inicial: Evalúa preexistencia para bifurcar entre INSERT y UPDATE
  useEffect(() => {
    const cargarHistorialOdonto = async () => {
      if (!idExpediente) return;
      if (setEstadoGlobal) setEstadoGlobal('Verificando registros odontológicos preexistentes...');

      try {
        const { data, error } = await supabase
          .schema('operaciones')
          .from('formato_odontologia')
          .select('*')
          .eq('id_expediente', idExpediente)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setFormData({
            antecedentesPatologicos: data.antecedentes_patologicos || '',
            antecedentesNoPatologicos: data.antecedentes_no_patologicos || '',
            consumoAlcohol: data.consumo_alcohol || '',
            consumoCigarro: data.consumo_cigarro || '',
            consumoDrogas: data.consumo_drogas || '',
            atmChasquido: data.atm_chasquido || false,
            atmCrepitacion: data.atm_crepitacion || false,
            atmDesviacionApertura: data.atm_desviacion_apertura || false,
            atmMomento: data.atm_sintoma_momento || '',
            atmDolor: data.atm_dolor || false,
            alteracionesMaxilofaciales: data.alteraciones_maxilofaciales || '',
            musculatura: data.musculatura || 'Sin alteraciones',
            labiosCarrillos: data.labios_carrillos || 'Sin alteraciones',
            lenguaPisoBoca: data.lengua_pisoboca || 'Sin alteraciones',
            paladarOrofaringe: data.paladar_orofaringe || 'Sin alteraciones',
            enciasPeriodonto: data.encias_periodonto || 'Sin alteraciones',
            habitoBricomania: data.habito_bricomania || false,
            habitoOnicofagia: data.habito_onicofagia || false,
            habitoSuccionDigital: data.habito_succion_digital || false,
            habitoMorderLabioMejilla: data.habito_morder_labio_mejilla || false,
            habitoDeglucionAtipica: data.habito_deglucion_atipica || false,
            habitoRespiracionBucal: data.habito_respiracion_bucal || false,
            habitosOtros: data.habitos_otros || '',
            indicePlacaOLeary: data.indice_placa_o_leary || '',
            cepilladoFrecuencia: data.cepillado_frecuencia || '',
            usoHiloDental: data.uso_hilo_dental || false,
            usoEnjuague: data.uso_enjuague || false,
            odontogramaJSON: data.odontograma_json || {},
            dientesCariados: data.dientes_cariados_c || 0,
            dientesPerdidos: data.dientes_perdidos_p || 0,
            dientesObturados: data.dientes_obturados_o || 0,
            indiceCPO: data.indice_cpo || 0,
            clasificacionAngle: data.clasificacion_angle || '',
            sobremordidaHorizontal: data.sobremordida_horizontal || '',
            sobremordidaVertical: data.sobremordida_vertical || '',
            diagnosticoPulpar: data.diagnostico_pulpar || '',
            diagnosticoPeriodontal: data.diagnostico_periodontal || '',
            planTratamientoFases: data.plan_tratamiento_fases || '',
            presupuestoEstimado: data.presupuesto_estimado || '',
            consentimientoFirmado: data.consentimiento_firmado || false,
            notasEvolucion: data.notas_evolucion || ''
          });
          setModo('editar');
          if (setEstadoGlobal) setEstadoGlobal('Historial previo cargado. Modo evolutivo activo.');
        } else {
          setModo('nuevo');
          if (setEstadoGlobal) setEstadoGlobal('Formato en blanco listo para llenado inicial.');
        }
      } catch (err) {
        console.error("Error mapeando la persistencia de odontología:", err);
      }
    };

    cargarHistorialOdonto();
  }, [idExpediente]);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calcularCPO = (c, p, o) => {
    const total = (parseInt(c) || 0) + (parseInt(p) || 0) + (parseInt(o) || 0);
    setFormData(prev => ({ ...prev, indiceCPO: total }));
  };

  const manejarSubidaArchivos = (e) => {
    const files = Array.from(e.target.files);
    const nuevosArchivos = files.map(file => ({
      nombre: file.name,
      tipo: file.type,
      id: Date.now() + Math.random()
    }));
    setArchivosCargados(prev => [...prev, ...nuevosArchivos]);
  };

  const removerArchivo = (id) => {
    setArchivosCargados(prev => prev.filter(a => a.id !== id));
  };

  const guardarFormatoOdontologia = async (e) => {
    e.preventDefault();
    
    if (!idExpediente) {
      alert("Error: No hay un ID de expediente activo asociado a esta consulta.");
      return;
    }

    setGuardando(true);
    if (setEstadoGlobal) setEstadoGlobal('Procesando datos y estructurando mapa dental...');

    const odontogramaFiltrado = {};
    Object.keys(formData.odontogramaJSON).forEach((dienteKey) => {
      const estado = formData.odontogramaJSON[dienteKey];
      if (estado !== 'Sano') {
        odontogramaFiltrado[dienteKey] = estado;
      }
    });

    const dbPayload = {
      id_expediente: idExpediente,
      antecedentes_patologicos: formData.antecedentesPatologicos,
      antecedentes_no_patologicos: formData.antecedentesNoPatologicos,
      consumo_alcohol: formData.consumoAlcohol,
      consumo_cigarro: formData.consumoCigarro,
      consumo_drogas: formData.consumoDrogas,
      atm_chasquido: formData.atmChasquido,
      atm_crepitacion: formData.atmCrepitacion,
      atm_desviacion_apertura: formData.atmDesviacionApertura,
      atm_sintoma_momento: formData.atmMomento,
      atm_dolor: formData.atmDolor,
      alteraciones_maxilofaciales: formData.alteracionesMaxilofaciales,
      musculatura: formData.musculatura,
      labios_carrillos: formData.labiosCarrillos,
      lengua_pisoboca: formData.lenguaPisoBoca,
      paladar_orofaringe: formData.paladarOrofaringe,
      encias_periodonto: formData.enciasPeriodonto,
      habito_bricomania: formData.habitoBricomania,
      habito_onicofagia: formData.habitoOnicofagia,
      habito_succion_digital: formData.habitoSuccionDigital,
      habito_morder_labio_mejilla: formData.habitoMorderLabioMejilla,
      habito_deglucion_atipica: formData.habitoDeglucionAtipica,
      habito_respiracion_bucal: formData.habitoRespiracionBucal,
      habitos_otros: formData.habitosOtros,
      indice_placa_o_leary: formData.indicePlacaOLeary ? parseFloat(formData.indicePlacaOLeary) : null,
      cepillado_frecuencia: formData.cepilladoFrecuencia,
      uso_hilo_dental: formData.usoHiloDental,
      uso_enjuague: formData.usoEnjuague,
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
      consentimiento_firmado: formData.consentimientoFirmado,
      notas_evolucion: formData.notasEvolucion
    };

    try {
      if (modo === 'editar') {
        const { error } = await supabase
          .schema('operaciones')
          .from('formato_odontologia')
          .update(dbPayload)
          .eq('id_expediente', idExpediente);

        if (error) throw error;
        alert('¡Historial clínico odontológico actualizado de forma evolutiva!');
      } else {
        const { error } = await supabase
          .schema('operaciones')
          .from('formato_odontologia')
          .insert([dbPayload]);

        if (error) throw error;
        alert('¡Primer expediente odontológico creado con éxito!');
        setModo('editar'); 
      }
      if (setEstadoGlobal) setEstadoGlobal('Cambios clínicos guardados.');
    } catch (error) {
      console.error("Error de persistencia clínica:", error);
      alert(`Error al guardar: ${error.message}`);
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
            className={`nav-link ${activeTab === 'antecedentes_atm' ? 'active fw-bold' : 'text-muted'}`} 
            onClick={() => setActiveTab('antecedentes_atm')} 
            style={{ border: 'none', backgroundColor: 'transparent', color: activeTab === 'antecedentes_atm' ? '#1565C0' : 'inherit' }}
          >
            1. Antecedentes y Exploración
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
            3. Diagnóstico y Gabinete
          </button>
        </li>
      </ul>

      <form onSubmit={guardarFormatoOdontologia}>
        
        {/* PESTAÑA 1: ANTECEDENTES, ATM, TEJIDOS Y HÁBITOS */}
        {activeTab === 'antecedentes_atm' && (
          <div className="animacion-entrada">
            
            {/* SECCIÓN ANTECEDENTES */}
            <h5 style={{ color: '#1565C0', fontWeight: '600' }}>Antecedentes Personales (NOM-004)</h5>
            <div className="row g-3 mb-4 mt-2">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Patológicos (Enfermedades crónicas, cirugías, allergies)</label>
                <textarea className="form-control" name="antecedentesPatologicos" value={formData.antecedentesPatologicos} onChange={manejarCambio} rows="2" placeholder="Ej. Diabetes tipo 2 controlada, alergia a penicilina..."></textarea>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">No Patológicos (Inmunizaciones, estilo de vida)</label>
                <textarea className="form-control" name="antecedentesNoPatologicos" value={formData.antecedentesNoPatologicos} onChange={manejarCambio} rows="2" placeholder="Esquema de vacunación completo..."></textarea>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label small text-muted">Consumo de Alcohol (Frecuencia)</label>
                <input type="text" className="form-control" name="consumoAlcohol" value={formData.consumoAlcohol} onChange={manejarCambio} placeholder="Ej. No consume / Fines de semana" />
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">Consumo de Cigarro (Frecuencia)</label>
                <input type="text" className="form-control" name="consumoCigarro" value={formData.consumoCigarro} onChange={manejarCambio} placeholder="Ej. No consume / 3 cigarros diarios" />
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">Consumo de Drogas (Tipo y frecuencia)</label>
                <input type="text" className="form-control" name="consumoDrogas" value={formData.consumoDrogas} onChange={manejarCambio} placeholder="Ej. No consume" />
              </div>
            </div>

            <hr className="my-4" style={{ borderColor: '#E3F2FD' }} />

            {/* SECCIÓN ATM */}
            <h5 style={{ color: '#1565C0', fontWeight: '600' }}>Articulación Temporomandibular (ATM)</h5>
            <div className="d-flex gap-4 mt-3 mb-3 flex-wrap">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" name="atmChasquido" checked={formData.atmChasquido} onChange={manejarCambio} />
                <label className="form-check-label">Chasquido</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" name="atmCrepitacion" checked={formData.atmCrepitacion} onChange={manejarCambio} />
                <label className="form-check-label">Crepitación</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" name="atmDesviacionApertura" checked={formData.atmDesviacionApertura} onChange={manejarCambio} />
                <label className="form-check-label">Desviación</label>
              </div>
            </div>
            
            <div className="row g-3 p-3 bg-light rounded border mb-4">
              <div className="col-md-6">
                <label className="form-label small text-muted">¿En qué momento presenta el síntoma?</label>
                <select className="form-control form-select" name="atmMomento" value={formData.atmMomento} onChange={manejarCambio}>
                  <option value="">Seleccione el momento...</option>
                  <option value="Apertura">A la apertura</option>
                  <option value="Cierre">Al cierre</option>
                  <option value="Ambos">En ambos momentos</option>
                </select>
              </div>
              <div className="col-md-6 d-flex align-items-center pt-md-4">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" name="atmDolor" checked={formData.atmDolor} onChange={manejarCambio} />
                  <label className="form-check-label fw-bold text-danger">¿El síntoma se acompaña de dolor?</label>
                </div>
              </div>
            </div>

            {/* SECCIÓN CABEZA Y CUELLO */}
            <h5 style={{ color: '#1565C0', fontWeight: '600' }}>Examen de Cabeza, Cuello y Tejidos Blandos</h5>
            <div className="row g-3 mb-4 mt-2">
              <div className="col-md-4">
                <label className="form-label small">Musculatura (Palpación)</label>
                <input type="text" className="form-control" name="musculatura" value={formData.musculatura} onChange={manejarCambio} />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Labios y Carrillos</label>
                <input type="text" className="form-control" name="labiosCarrillos" value={formData.labiosCarrillos} onChange={manejarCambio} />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Lengua y Piso de Boca</label>
                <input type="text" className="form-control" name="lenguaPisoBoca" value={formData.lenguaPisoBoca} onChange={manejarCambio} />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Paladar y Orofaringe</label>
                <input type="text" className="form-control" name="paladarOrofaringe" value={formData.paladarOrofaringe} onChange={manejarCambio} />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Encías y Periodonto</label>
                <input type="text" className="form-control" name="enciasPeriodonto" value={formData.enciasPeriodonto} onChange={manejarCambio} />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Alteraciones Maxilofaciales</label>
                <input type="text" className="form-control" name="alteracionesMaxilofaciales" value={formData.alteracionesMaxilofaciales} onChange={manejarCambio} />
              </div>
            </div>

            {/* HÁBITOS */}
            <h5 style={{ color: '#1565C0', fontWeight: '600' }}>Hábitos Perniciosos</h5>
            <div className="d-flex gap-4 mt-3 mb-4 flex-wrap">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="habitoBricomania" checked={formData.habitoBricomania} onChange={manejarCambio} />
                <label className="form-check-label">Bricomanía</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="habitoOnicofagia" checked={formData.habitoOnicofagia} onChange={manejarCambio} />
                <label className="form-check-label">Onicofagia</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="habitoSuccionDigital" checked={formData.habitoSuccionDigital} onChange={manejarCambio} />
                <label className="form-check-label">Succión Digital</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="habitoMorderLabioMejilla" checked={formData.habitoMorderLabioMejilla} onChange={manejarCambio} />
                <label className="form-check-label">Morder Labio/Mejillas</label>
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

            <button type="button" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 mt-4" style={{ backgroundColor: '#1565C0', color: 'white', border: 'none' }} onClick={() => setActiveTab('odontograma')}>
              <span>Siguiente: Odontograma</span> <ArrowRight size={16} />
            </button>
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
              <button type="button" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2" onClick={() => setActiveTab('antecedentes_atm')}>
                <ArrowLeft size={16} /> Anterior
              </button>
              <button type="button" className="btn d-inline-flex align-items-center gap-2" style={{ backgroundColor: '#1565C0', color: 'white', border: 'none' }} onClick={() => setActiveTab('diagnostico')}>
                <span>Siguiente: Diagnóstico</span> <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: DIAGNÓSTICO, PLAN DE TRATAMIENTO Y GABINETE */}
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

            <hr className="my-4" style={{ borderColor: '#E3F2FD' }} />

            <h5 style={{ color: '#1565C0', fontWeight: '600' }} className="mb-3">Estudios de Gabinete</h5>
            <div className="p-4 rounded mb-4 text-center" style={{ border: '2px dashed #90CAF9', backgroundColor: '#F8FBFF' }}>
              <UploadCloud size={32} color="#64B5F6" className="mb-2" />
              <p className="small text-muted mb-3">Adjunte Radiografías, Fotografías Clínicas o Estudios de Laboratorio del paciente.</p>
              
              <label className="btn btn-sm btn-outline-primary" style={{ cursor: 'pointer' }}>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*,.pdf"
                  className="d-none" 
                  onChange={manejarSubidaArchivos}
                />
                Explorar Archivos
              </label>

              {archivosCargados.length > 0 && (
                <div className="mt-4 d-flex flex-wrap gap-2 justify-content-center">
                  {archivosCargados.map(archivo => (
                    <div key={archivo.id} className="badge bg-white text-dark border d-flex align-items-center gap-2 p-2 shadow-sm">
                      <FileImage size={14} className="text-primary" />
                      <span className="text-truncate" style={{ maxWidth: '120px' }}>{archivo.nombre}</span>
                      <X size={14} className="text-danger" style={{ cursor: 'pointer' }} onClick={() => removerArchivo(archivo.id)} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="my-4" style={{ borderColor: '#E3F2FD' }} />

            <h5 style={{ color: '#1565C0', fontWeight: '600' }} className="mb-3">Plan de Tratamiento</h5>
            <div className="mb-4">
              <label className="form-label small">Tratamiento por Fases</label>
              <textarea className="form-control" name="planTratamientoFases" value={formData.planTratamientoFases} onChange={manejarCambio} rows="4" placeholder="Fase Higiénica, Fase Quirúrgica, Fase Protésica..." required />
            </div>

            {/* SECCIÓN COMPLEMENTARIA NORMADA: NOTAS DE EVOLUCIÓN HISTÓRICA */}
            <div className="mb-4 p-3 rounded border" style={{ backgroundColor: '#F9FAFB', borderLeft: '4px solid #1565C0' }}>
              <label className="form-label fw-bold text-main" style={{ color: '#1565C0' }}>Notas de Evolución (Historial y Seguimiento Clínico)</label>
              <textarea className="form-control bg-white" name="notasEvolucion" value={formData.notasEvolucion} onChange={manejarCambio} rows="3" placeholder="Describa la evolución sintomática, cicatrización post-quirúrgica, nivel de higiene bucal comparativo y ajustes al tratamiento..." />
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
              <button type="button" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2" onClick={() => setActiveTab('odontograma')}>
                <ArrowLeft size={16} /> Anterior
              </button>
              <button 
                type="submit" 
                className="btn btn-primary d-inline-flex align-items-center gap-2" 
                disabled={guardando}
                style={{ backgroundColor: '#1565C0', border: 'none', fontWeight: 'bold' }}
              >
                <Save size={16} />
                <span>{guardando ? 'Sincronizando...' : 'Guardar Expediente Odontológico'}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default FormatoOdontologia;