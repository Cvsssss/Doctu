import React, { useState, useEffect } from 'react';
import '../styles/style.css';

function ModalExportacion({ isOpen, onClose, recordId }) {
  const [estadoDescarga, setEstadoDescarga] = useState('preparando'); // preparando, listo

  // Simulamos el tiempo de generación del archivo cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setEstadoDescarga('preparando');
      const timer = setTimeout(() => {
        setEstadoDescarga('listo');
      }, 2000); // 2 segundos simulando la creación del XML/PDF
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const manejarDescarga = () => {
    alert(`Descargando archivo estructurado NOM_024_Registro_${recordId}.xml...`);
    onClose(); // Cerramos el modal tras descargar
  };

  return (
    <div style={overlayStyle}>
      <div className="card shadow border-0 p-4 animacion-entrada" style={modalStyle}>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-purple" style={{ fontWeight: 'bold', margin: 0 }}>Exportar Expediente</h4>
          <button className="btn-close" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)' }}>
            &times;
          </button>
        </div>

        <div className="mb-4">
          <span className="badge-pastel mb-2">Certificación NOM-024-SSA3-2012</span>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
            Este documento se exportará en formato estructurado (XML/PDF) garantizando la portabilidad y confidencialidad de tus datos clínicos.
          </p>
        </div>

        <div className="text-center p-4 mb-4 rounded" style={{ backgroundColor: '#F8F5FC', border: '1px dashed var(--purple-accent)' }}>
          {estadoDescarga === 'preparando' ? (
            <div>
              <div className="spinner-border text-purple mb-2" role="status" style={{ width: '2rem', height: '2rem', color: 'var(--purple-accent)' }}></div>
              <p className="mb-0 fw-bold text-purple">Generando estructura cifrada...</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '3rem', color: '#4CAF50' }}>✓</div>
              <p className="mb-0 fw-bold" style={{ color: '#2E7D32' }}>Documento Listo para Descarga</p>
              <p className="small text-muted mt-1">ID de Registro: {recordId}</p>
            </div>
          )}
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button className="btn-pastel-secondary" onClick={onClose}>Cancelar</button>
          <button 
            className="btn-pastel-primary" 
            onClick={manejarDescarga}
            disabled={estadoDescarga === 'preparando'}
            style={{ opacity: estadoDescarga === 'preparando' ? 0.6 : 1 }}
          >
            Descargar Archivo
          </button>
        </div>

      </div>
    </div>
  );
}

// Estilos en línea para el Modal (overlay oscuro de fondo y ventana centrada)
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  backgroundColor: 'var(--white)',
  width: '100%',
  maxWidth: '500px',
  borderRadius: '16px'
};

export default ModalExportacion;