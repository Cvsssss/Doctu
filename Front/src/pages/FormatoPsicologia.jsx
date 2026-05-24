import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { FileText, Brain, Users, ClipboardCheck, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import '../styles/style.css';

function FormatoPsicologia({ idExpediente, setEstadoGlobal }) {
  const [activeTab, setActiveTab] = useState('motivo');
  const [guardando, setGuardando] = useState(false);
  const [modo, setModo] = useState('nuevo'); // 'nuevo' o 'editar'
  
  // Estado completo alineado al 100% con la tabla operaciones.formato_psicologia
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
    textConciencia: 'Alerta',
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
    
    // Diagnóstico, Plan y Seguimiento (NOM-004)
    pruebasPsicometricasAplicadas: '',
    impresionDiagnosticaCIE10: '',
    pronostico: '',
    objetivosTerapeuticos: '',
    planTratamiento: '',
    notasEvolucionSesion: '',
    notasEvolucion: '' 
  });

  // Cargar datos previos si existen para evitar violaciones de llave única (Unique Constraint)
  useEffect(() => {
    const verificarYcargarPreexistencia = async () => {
      if (!idExpediente) return;
      if (setEstadoGlobal) setEstadoGlobal('Buscando historial clínico...');

      try {
        const { data, error } = await supabase
          .schema('operaciones')
          .from('formato_psicologia')
          .select('*')
          .eq('id_expediente', idExpediente)
          .maybeSingle(); // Evita tronar si no encuentra nada

        if (error) throw error;

        if (data) {
          // Mapeo inverso de Snake Case (Base de datos) a Camel Case (State de React)
          setFormData({
            estadoCivil: data.estado_civil || '',
            escolaridad: data.escolaridad || '',
            ocupacion: data.ocupacion || '',
            religion: data.religion || '',
            viveCon: data.vive_con || '',
            motivoConsulta: data.motivo_consulta || '',
            sintomatologiaActual: data.sintomatologia_actual || '',
            fechaInicioSintomas: data.fecha_inicio_sintomas || '',
            eventosDesencadenantes: data.eventos_desencadenantes || '',
            antecedentesHeredofamiliares: data.antecedentes_heredofamiliares || '',
            antecedentesPersonalesPatologicos: data.antecedentes_personales_patologicos || '',
            tratamientosPreviosPsicologicos: data.tratamientos_previos_psicologicos || false,
            medicacionPsiquiatricaActual: data.medicacion_psiquiatrica_actual || '',
            consumoSustancias: data.consumo_sustancias || '',
            aparienciaFisicaActitud: data.apariencia_fisica_actitud || '',
            estadoConciencia: data.estado_conciencia || 'Alerta',
            orientacionTEP: data.orientacion_tep || 'Orientado en Tiempo, Espacio y Persona',
            atencionConcentracion: data.atencion_concentracion || '',
            memoriaCortoLargoPlazo: data.memoria_corto_largo_plazo || '',
            pensamientoCursoContenido: data.pensamiento_curso_contenido || '',
            lenguajeComunicacion: data.lenguaje_comunicacion || '',
            afectoEstadoAnimo: data.afecto_estado_animo || '',
            sensopercepcion: data.sensopercepcion || '',
            juicioInsight: data.juicio_insight || '',
            areaFamiliar: data.area_familiar || '',
            areaSocialInterpersonal: data.area_social_interpersonal || '',
            areaLaboralAcademica: data.area_laboral_academica || '',
            areaPsicosexual: data.area_psicosexual || '',
            riesgoAutolitico: data.riesgo_autolitico || false,
            riesgoHeteroagresivo: data.riesgo_heteroagresivo || false,
            pruebasPsicometricasAplicadas: data.pruebas_psicometricas_applied || '',
            impresionDiagnosticaCIE10: data.impresion_diagnostica_cie10 || '',
            pronostico: data.pronostico || '',
            objetivosTerapeuticos: data.objetivos_terapeuticos || '',
            planTratamiento: data.plan_tratamiento || '',
            notasEvolucionSesion: data.notas_evolucion_sesion || '',
            notasEvolucion: data.notas_evolucion || ''
          });
          setModo('editar');
          if (setEstadoGlobal) setEstadoGlobal('Expediente previo detectado. Modo de seguimiento activo.');
        } else {
          setModo('nuevo');
          if (setEstadoGlobal) setEstadoGlobal('Expediente en blanco listo para llenado.');
        }
      } catch (err) {
        console.error("Error consultando preexistencia:", err);
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

  // Guardado Seguro (UPSERT implícito mediante control de flujo local)
  const guardarFormatoPsicologia = async (e) => {
    e.preventDefault();
    setGuardando(true);
    if (setEstadoGlobal) setEstadoGlobal('Sincronizando con Supabase Cloud...');

    // Mapeo limpio a Snake Case estructurado para la base de datos
    const dbPayload = {
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
      text_conciencia: formData.estadoConciencia, // Sincronizado con mapeos heredados
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
      notas_evolucion_sesion: formData.notasEvolucionSesion,
      notas_evolucion: formData.notasEvolucion
    };

    try {
      if (modo === 'editar') {
        // Si ya existe, ejecutamos UPDATE en lugar de INSERT para no violar restricciones de unicidad
        const { error } = await supabase
          .schema('operaciones')
          .from('formato_psicologia')
          .update(dbPayload)
          .eq('id_expediente', idExpediente);

        if (error) throw error;
        alert('¡Historial clínico de psicología actualizado correctamente!');
      } else {
        // Si es nuevo, insertamos y dejamos que el nextval() de la base de datos autoincremente el id_formato_psi
        const { error } = await supabase
          .schema('operaciones')
          .from('formato_psicologia')
          .insert([dbPayload]);

        if (error) throw error;
        alert('¡Nuevo expediente clínico de psicología guardado con éxito!');
        setModo('editar'); // Transicionamos a editar para cambios consecuentes
      }
      if (setEstadoGlobal) setEstadoGlobal('Todos los cambios guardados.');
    } catch (error) {
      console.error("Error en la transacción clínica:", error);
      alert(`Error de persistencia: ${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-3 bg-white">
      
      {/* Navegación por Pestañas Minimalistas con Lucide Icons */}
      <ul className="nav nav-tabs mb-4" style={{ borderBottom: '2px solid var(--purple-pastel)' }}>
        <li className="nav-item">
          <button 
            type="button" 
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'motivo' ? 'active text-purple fw-bold' : 'text-muted'}`} 
            onClick={() => setActiveTab('motivo')}
            style={{ border: 'none', backgroundColor: 'transparent' }}
          >
            <FileText size={16} /> 1. Motivo y Antecedentes
          </button>
        </li>
        <li className="nav-item">
          <button 
            type="button" 
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'examen' ? 'active text-purple fw-bold' : 'text-muted'}`} 
            onClick={() => setActiveTab('examen')}
            style={{ border: 'none', backgroundColor: 'transparent' }}
          >
            <Brain size={16} /> 2. Examen Mental
          </button>
        </li>
        <li className="nav-item">
          <button 
            type="button" 
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'esferas' ? 'active text-purple fw-bold' : 'text-muted'}`} 
            onClick={() => setActiveTab('esferas')}
            style={{ border: 'none', backgroundColor: 'transparent' }}
          >
            <Users size={16} /> 3. Esferas y Riesgos
          </button>
        </li>
        <li className="nav-item">
          <button 
            type="button" 
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'plan' ? 'active text-purple fw-bold' : 'text-muted'}`} 
            onClick={() => setActiveTab('plan')}
            style={{ border: 'none', backgroundColor: 'transparent' }}
          >
            <ClipboardCheck size={16} /> 4. Diagnóstico y Seguimiento
          </button>
        </li>
      </ul>

      <form onSubmit={guardarFormatoPsicologia}>
        <div className="tab-content pt-2">
          
          {/* PESTAÑA 1: MOTIVO Y ANTECEDENTES */}
          {activeTab === 'motivo' && (
            <div className="animacion-entrada">
              <h5 className="text-purple mb-3 fw-bold">Ficha de Identificación Clínica</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <label className="form-label small">Estado Civil</label>
                  <input type="text" className="form-control" name="estadoCivil" value={formData.estadoCivil} onChange={manejarCambio} placeholder="Ej. Soltero" />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Escolaridad</label>
                  <input type="text" className="form-control" name="escolaridad" value={formData.escolaridad} onChange={manejarCambio} placeholder="Ej. Licenciatura" />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Ocupación</label>
                  <input type="text" className="form-control" name="ocupacion" value={formData.ocupacion} onChange={manejarCambio} placeholder="Ej. Empleado" />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Religión</label>
                  <input type="text" className="form-control" name="religion" value={formData.religion} onChange={manejarCambio} placeholder="Ej. Ninguna" />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Vive Con</label>
                  <input type="text" className="form-control" name="viveCon" value={formData.viveCon} onChange={manejarCambio} placeholder="Ej. Padres / Solo" />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Fecha de Inicio de Síntomas</label>
                  <input type="date" className="form-control" name="fechaInicioSintomas" value={formData.fechaInicioSintomas} onChange={manejarCambio} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Eventos Desencadenantes</label>
                  <input type="text" className="form-control" name="eventosDesencadenantes" value={formData.eventosDesencadenantes} onChange={manejarCambio} placeholder="Ej. Pérdida de empleo" />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Motivo de la Consulta</label>
                <textarea className="form-control" name="motivoConsulta" value={formData.motivoConsulta} onChange={manejarCambio} rows="2" required placeholder="Describa textualmente el motivo expresado por el paciente..." />
              </div>
              
              <div className="mb-4">
                <label className="form-label small">Sintomatología Actual</label>
                <textarea className="form-control" name="sintomatologiaActual" value={formData.sintomatologiaActual} onChange={manejarCambio} rows="2" placeholder="Anhedonia, insomnio de quinta fase, etc." />
              </div>

              <h5 className="text-purple mt-4 mb-3 fw-bold">Anamnesis y Antecedentes</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small">Heredofamiliares (AHF)</label>
                  <textarea className="form-control" name="antecedentesHeredofamiliares" value={formData.antecedentesHeredofamiliares} onChange={manejarCambio} rows="2" placeholder="Historial familiar de trastornos del estado de ánimo..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Personales Patológicos (APP)</label>
                  <textarea className="form-control" name="antecedentesPersonalesPatologicos" value={formData.antecedentesPersonalesPatologicos} onChange={manejarCambio} rows="2" placeholder="Diagnósticos médicos previos, hospitalizaciones..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Consumo de Sustancias</label>
                  <textarea className="form-control" name="consumoSustancias" value={formData.consumoSustancias} onChange={manejarCambio} rows="2" placeholder="Alcohol, tabaco u otras sustancias (Frecuencia y cantidad)..." />
                </div>
                <div className="col-md-6 d-flex flex-column justify-content-center bg-light rounded p-3 border">
                  <div className="form-check form-switch mb-2">
                    <input className="form-check-input" type="checkbox" name="tratamientosPreviosPsicologicos" checked={formData.tratamientosPreviosPsicologicos} onChange={manejarCambio} id="previos" />
                    <label className="form-check-label small text-muted" htmlFor="previos">¿Ha tenido procesos psicoterapéuticos previos?</label>
                  </div>
                  <input type="text" className="form-control form-control-sm mt-1" name="medicacionPsiquiatricaActual" value={formData.medicacionPsiquiatricaActual} onChange={manejarCambio} placeholder="Medicación farmacológica actual (Fármaco y dosis)" />
                </div>
              </div>
              
              <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2" style={{ backgroundColor: 'var(--purple-accent)', border: 'none' }} onClick={() => setActiveTab('examen')}>
                <span>Siguiente: Examen Mental</span> <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* PESTAÑA 2: EXAMEN MENTAL */}
          {activeTab === 'examen' && (
            <div className="animacion-entrada">
              <h5 className="text-purple mb-3 fw-bold">Funciones Cognitivas y Funciones Mentales</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small">Estado de Conciencia</label>
                  <select className="form-control form-select" name="estadoConciencia" value={formData.estadoConciencia} onChange={manejarCambio}>
                    <option value="Alerta">Alerta (Vigilia)</option>
                    <option value="Somnolencia">Somnolencia</option>
                    <option value="Estupor">Estupor</option>
                    <option value="Coma">Coma</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Orientación TEP</label>
                  <select className="form-control form-select" name="orientacionTEP" value={formData.orientacionTEP} onChange={manejarCambio}>
                    <option value="Orientado en Tiempo, Espacio y Persona">Orientado Globalmente (TEP)</option>
                    <option value="Desorientado Parcialmente">Desorientado Parcialmente</option>
                    <option value="Desorientado Totalmente">Desorientado Totalmente</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Apariencia Física y Actitud</label>
                  <textarea className="form-control" name="aparienciaFisicaActitud" value={formData.aparienciaFisicaActitud} onChange={manejarCambio} rows="2" placeholder="Aliño, contacto visual, cooperación..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Atención y Concentración</label>
                  <textarea className="form-control" name="atencionConcentracion" value={formData.atencionConcentracion} onChange={manejarCambio} rows="2" placeholder="Normoproxésico, euprosexia, dispersión..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Memoria (Corto y Largo Plazo)</label>
                  <textarea className="form-control" name="memoriaCortoLargoPlazo" value={formData.memoriaCortoLargoPlazo} onChange={manejarCambio} rows="2" placeholder="Preservada, amnesia anterógrada o retrógrada..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Pensamiento (Curso y Contenido)</label>
                  <textarea className="form-control" name="pensamientoCursoContenido" value={formData.pensamientoCursoContenido} onChange={manejarCambio} rows="2" placeholder="Ideas perseverantes, delirantes, velocidad del discurso..." />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Lenguaje y Comunicación</label>
                  <input type="text" className="form-control" name="lenguajeComunicacion" value={formData.lenguajeComunicacion} onChange={manejarCambio} placeholder="Fluido, coherente, bradilalia..." />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Afecto y Estado de Ánimo</label>
                  <input type="text" className="form-control" name="afectoEstadoAnimo" value={formData.afectoEstadoAnimo} onChange={manejarCambio} placeholder="Eutímico, deprimido, aplanado..." />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Sensopercepción</label>
                  <input type="text" className="form-control" name="sensopercepcion" value={formData.sensopercepcion} onChange={manejarCambio} placeholder="Sin alteraciones, alucinaciones..." />
                </div>
                <div className="col-md-12">
                  <label className="form-label small">Juicio e Insight (Capacidad de introspección)</label>
                  <textarea className="form-control" name="juicioInsight" value={formData.juicioInsight} onChange={manejarCambio} rows="2" placeholder="Juicio de realidad preservado, insight pobre/adecuado..." />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2" onClick={() => setActiveTab('motivo')}>
                  <ArrowLeft size={16} /> Anterior
                </button>
                <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2" style={{ backgroundColor: 'var(--purple-accent)', border: 'none' }} onClick={() => setActiveTab('esferas')}>
                  <span>Siguiente: Esferas</span> <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* PESTAÑA 3: ESFERAS Y RIESGOS */}
          {activeTab === 'esferas' && (
            <div className="animacion-entrada">
              <h5 className="text-purple mb-3 fw-bold">Áreas de Ajuste de la Vida del Paciente</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small">Área Familiar</label>
                  <textarea className="form-control" name="areaFamiliar" value={formData.areaFamiliar} onChange={manejarCambio} rows="2" placeholder="Dinámica familiar, redes de apoyo, conflictos..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Área Social e Interpersonal</label>
                  <textarea className="form-control" name="areaSocialInterpersonal" value={formData.areaSocialInterpersonal} onChange={manejarCambio} rows="2" placeholder="Relaciones de amistad, aislamiento, integración..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Área Laboral / Académica</label>
                  <textarea className="form-control" name="areaLaboralAcademica" value={formData.areaLaboralAcademica} onChange={manejarCambio} rows="2" placeholder="Rendimiento, ausentismo, nivel de estrés, metas..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Área Psicosexual</label>
                  <textarea className="form-control" name="areaPsicosexual" value={formData.areaPsicosexual} onChange={manejarCambio} rows="2" placeholder="Vida sexual activa, satisfacción, identidad, disfunciones..." />
                </div>
              </div>

              {/* Protocolo de Contención de Crisis Normativa */}
              <div className="p-3 mb-4 rounded border-start border-4 shadow-sm" style={{ backgroundColor: '#FFF0F0', borderLeftColor: '#FF5252' }}>
                <h6 style={{ color: '#D32F2F', fontWeight: 'bold' }}>Evaluación de Seguridad Clínico-Legal</h6>
                <div className="d-flex gap-4 mt-3 flex-wrap">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" name="riesgoAutolitico" checked={formData.riesgoAutolitico} onChange={manejarCambio} id="autolitico" />
                    <label className="form-check-label fw-bold text-danger small" htmlFor="autolitico">Riesgo de Autolesión o Ideación Suicida Activa</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" name="riesgoHeteroagresivo" checked={formData.riesgoHeteroagresivo} onChange={manejarCambio} id="hetero" />
                    <label className="form-check-label fw-bold text-danger small" htmlFor="hetero">Riesgo Heteroagresivo (Hacia terceros) Activo</label>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2" onClick={() => setActiveTab('examen')}>
                  <ArrowLeft size={16} /> Anterior
                </button>
                <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2" style={{ backgroundColor: 'var(--purple-accent)', border: 'none' }} onClick={() => setActiveTab('plan')}>
                  <span>Siguiente: Diagnóstico</span> <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* PESTAÑA 4: DIAGNÓSTICO Y PLAN */}
          {activeTab === 'plan' && (
            <div className="animacion-entrada">
              <h5 className="text-purple mb-3 fw-bold">Impresión Clínica y Planificación</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-dark">Impresión Diagnóstica Principal (CIE-10)</label>
                  <input type="text" className="form-control" name="impresionDiagnosticaCIE10" value={formData.impresionDiagnosticaCIE10} onChange={manejarCambio} placeholder="Ej. F41.1 Trastorno de ansiedad generalizada" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Pruebas Psicométricas Aplicadas / Reactivos</label>
                  <input type="text" className="form-control" name="pruebasPsicometricasAplicadas" value={formData.pruebasPsicometricasAplicadas} onChange={manejarCambio} placeholder="Ej. MMPI-2, Inventario de Ansiedad de Beck..." />
                </div>
                <div className="col-md-12">
                  <label className="form-label small">Pronóstico Clínico</label>
                  <input type="text" className="form-control" name="pronostico" value={formData.pronostico} onChange={manejarCambio} placeholder="Ej. Favorable para la vida con apego psicoterapéutico..." />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Objetivos Terapéuticos Específicos</label>
                <textarea className="form-control" name="objetivosTerapeuticos" value={formData.objetivosTerapeuticos} onChange={manejarCambio} rows="2" placeholder="Reestructuración cognitiva, desensibilización sistemática..." />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Plan de Tratamiento e Intervención</label>
                <textarea className="form-control" name="planTratamiento" value={formData.planTratamiento} onChange={manejarCambio} rows="2" placeholder="Enfoque cognitivo-conductual, tareas inter-sesión, número de sesiones proyectadas..." />
              </div>

              <div className="mb-4">
                <label className="form-label small text-muted">Notas Clínicas de la Sesión Actual</label>
                <textarea className="form-control" name="notasEvolucionSesion" value={formData.notasEvolucionSesion} onChange={manejarCambio} rows="2" placeholder="Resumen del material abordado en esta sesión específica..." />
              </div>

              {/* CAMPO DE SEGUIMIENTO EVOLUTIVO DE LA NOM-004 */}
              <div className="mb-4 p-3 bg-light rounded border" style={{ borderLeft: '4px solid var(--purple-accent)' }}>
                <label className="form-label fw-bold text-purple" style={{ fontSize: '0.95rem' }}>Notas de Evolución (Historial Dinámico Consecuente)</label>
                <textarea className="form-control bg-white" name="notasEvolucion" value={formData.notasEvolucion} onChange={manejarCambio} rows="3" placeholder="Registre los avances, recaídas, cambios conductuales y nivel de adherencia del paciente comparado con las sesiones previas..." />
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid var(--purple-pastel)' }}>
                <button type="button" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2" onClick={() => setActiveTab('esferas')}>
                  <ArrowLeft size={16} /> Anterior
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary d-inline-flex align-items-center gap-2"
                  style={{ backgroundColor: 'var(--purple-accent)', border: 'none', fontWeight: 'bold' }}
                  disabled={guardando}
                >
                  <Save size={16} />
                  <span>{guardando ? 'Sincronizando...' : 'Guardar Expediente Psicológico'}</span>
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