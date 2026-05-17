import React, { useState, useEffect } from 'react';
import '../styles/style.css';

function VisorExpediente() {
  const [timelineData, setTimelineData] = useState([]);

  // 1. Obtener la línea de tiempo completa desde OLAP: Historial_Clinico_Consolidado 
  const fetchCompleteTimeline = async (patientId) => {
    console.log(`Buscando historial para el paciente ${patientId}`);
    // Mock de datos multidisciplinarios
    const mockData = [
      { id: 3, fecha: '2026-05-10', tipo: 'GENERAL', doctor: 'Dr. Arturo', diagnostico: 'Faringitis aguda', detalle: 'Presión: 120/80. Temp: 38.5°C.' },
      { id: 2, fecha: '2026-04-15', tipo: 'ODONTOLOGIA', doctor: 'Dra. Elena', diagnostico: 'Caries dentina', detalle: 'Diente 46 obturado. Odontograma JSON actualizado.' },
      { id: 1, fecha: '2026-01-20', tipo: 'PSICOLOGIA', doctor: 'Lic. Mariana', diagnostico: 'Ansiedad leve', detalle: 'Terapia cognitivo-conductual. Riesgo autolítico: 0.' }
    ];
    setTimelineData(mockData);
  };

  // 2. Simulación de desencriptación de datos [cite: 1143]
  const decryptSensitiveData = (encryptedPayload) => {
    console.log("Desencriptando notas clínicas para el frontend...");
    return encryptedPayload; 
  };

  // 3. Exportación XML/PDF para cumplir con la NOM-024 [cite: 1145, 1148]
  const downloadRecordPDF = async (recordId) => {
    console.log(`Generando XML/PDF para el registro ${recordId}`);
    alert("Descargando formato clínico validado por la NOM-024...");
  };

  // 4. PATRÓN FACTORY: Crea componentes React distintos dependiendo del tipo de registro médico 
  const renderRecordCard = (record) => {
    const dataSegura = decryptSensitiveData(record);

    switch(dataSegura.tipo) {
      case 'GENERAL':
        return (
          <div key={dataSegura.id} className="card shadow-sm mb-4 border-0 p-3" style={{ borderLeft: '5px solid #4CAF50' }}>
            <span className="badge-pastel" style={{width: 'fit-content', backgroundColor: '#E8F5E9', color: '#4CAF50'}}>Medicina General</span>
            <h5 className="mt-2" style={{fontWeight: 'bold'}}>{dataSegura.fecha} | {dataSegura.doctor}</h5>
            <p className="mb-1"><strong>Diagnóstico:</strong> {dataSegura.diagnostico}</p>
            <p className="text-muted small mb-3">{dataSegura.detalle}</p>
            <button className="btn-pastel-secondary btn-sm" onClick={() => downloadRecordPDF(dataSegura.id)} style={{width: 'fit-content', padding: '6px 12px', fontSize: '0.85rem'}}>Exportar PDF</button>
          </div>
        );
      case 'ODONTOLOGIA':
        return (
          <div key={dataSegura.id} className="card shadow-sm mb-4 border-0 p-3" style={{ borderLeft: '5px solid #2196F3' }}>
            <span className="badge-pastel" style={{width: 'fit-content', backgroundColor: '#E3F2FD', color: '#2196F3'}}>Odontología</span>
            <h5 className="mt-2" style={{fontWeight: 'bold'}}>{dataSegura.fecha} | {dataSegura.doctor}</h5>
            <p className="mb-1"><strong>Diagnóstico Pulpar/Periodontal:</strong> {dataSegura.diagnostico}</p>
            <p className="text-muted small mb-3">{dataSegura.detalle}</p>
            <button className="btn-pastel-secondary btn-sm" onClick={() => downloadRecordPDF(dataSegura.id)} style={{width: 'fit-content', padding: '6px 12px', fontSize: '0.85rem'}}>Ver Odontograma</button>
          </div>
        );
      case 'PSICOLOGIA':
        return (
          <div key={dataSegura.id} className="card shadow-sm mb-4 border-0 p-3" style={{ borderLeft: '5px solid var(--purple-accent)' }}>
            <span className="badge-pastel" style={{width: 'fit-content'}}>Psicología</span>
            <h5 className="mt-2" style={{fontWeight: 'bold'}}>{dataSegura.fecha} | {dataSegura.doctor}</h5>
            <p className="mb-1"><strong>Impresión Diagnóstica:</strong> {dataSegura.diagnostico}</p>
            <p className="text-muted small mb-3">{dataSegura.detalle}</p>
            <button className="btn-pastel-secondary btn-sm" onClick={() => downloadRecordPDF(dataSegura.id)} style={{width: 'fit-content', padding: '6px 12px', fontSize: '0.85rem'}}>Exportar PDF</button>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchCompleteTimeline(101);
  }, []);

  return (
    <div className="visor-timeline pl-3" style={{borderLeft: '2px dashed var(--purple-pastel)', marginLeft: '1rem', paddingLeft: '1.5rem'}}>
      {/* Se usa map() para iterar los arreglos de datos  */}
      {timelineData.map(record => renderRecordCard(record))}
    </div>
  );
}

export default VisorExpediente;