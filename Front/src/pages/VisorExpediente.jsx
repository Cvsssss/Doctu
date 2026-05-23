import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import ModalExportacion from '../components/ModalExportacion';

function VisorExpediente() {
  const [timelineData, setTimelineData] = useState([]);

  // 1. Obtener la línea de tiempo completa
  const fetchCompleteTimeline = async (patientId) => {
    console.log(`Buscando historial para el paciente ${patientId}`);
    try {
      const res = await fetch(`http://localhost:3000/api/patients/${patientId}/timeline`);
      const data = await res.json();
      setTimelineData(data);
    } catch (error) {
      console.error("Error cargando el historial:", error);
    }
  };

  // 2. Simulación de desencriptación de datos [cite: 1143]
  const decryptSensitiveData = (encryptedPayload) => {
    console.log("Desencriptando notas clínicas para el frontend...");
    return encryptedPayload; 
  };

  // 3. Exportación XML/PDF para cumplir con la NOM-024 [cite: 1145, 1148]
  const [modalAbierto, setModalAbierto] = useState(false);
  const [registroAExportar, setRegistroAExportar] = useState(null);

  // Modifica tu función abstracta de descarga
  const downloadRecordPDF = async (recordId) => {
    setRegistroAExportar(recordId);
    setModalAbierto(true);
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
      {timelineData.map(record => renderRecordCard(record))}
      
      {/* Nuestro nuevo Modal */}
      <ModalExportacion 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        recordId={registroAExportar} 
      />
    </div>
  );
}

export default VisorExpediente;