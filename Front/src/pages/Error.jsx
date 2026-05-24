import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw, Lock } from 'lucide-react';
import '../styles/style.css';

function PaginaError() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detectamos el código de error basado en la ruta o estado pasado por el router
  const errorData = location.state || { code: 404, message: 'Página no encontrada' };

  const getErrorContent = (code) => {
    switch (code) {
      case 401:
        return {
          icon: <Lock size={64} className="text-purple" />,
          titulo: 'Acceso Restringido',
          desc: 'Lo sentimos, no tienes permisos para acceder a esta sección. Por favor, inicia sesión con las credenciales correctas.'
        };
      case 500:
        return {
          icon: <AlertTriangle size={64} className="text-danger" />,
          titulo: 'Error en el Servidor',
          desc: 'Estamos teniendo problemas técnicos. Por favor, verifica tu conexión o intenta más tarde mientras nuestro equipo de ingeniería lo soluciona.'
        };
      default:
        return {
          icon: <AlertTriangle size={64} className="text-purple" />,
          titulo: 'Página no encontrada',
          desc: 'Perdón por los inconvenientes, la página que buscas no existe o fue movida. Verifica la URL e intenta de nuevo.'
        };
    }
  };

  const content = getErrorContent(errorData.code);

  return (
    <div className="container mt-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <div className="card shadow-sm border-0 p-5 text-center" style={{ maxWidth: '600px', backgroundColor: 'var(--white)' }}>
        <div className="mb-4">{content.icon}</div>
        <h1 className="text-purple" style={{ fontWeight: 'bold' }}>{content.titulo}</h1>
        <p className="text-muted mt-3 mb-4">{content.desc}</p>
        
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn-pastel-primary d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Volver
          </button>
          <button className="btn-pastel-secondary d-flex align-items-center gap-2" onClick={() => navigate('/')}>
            <Home size={18} /> Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaginaError;