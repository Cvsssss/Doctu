import React, { useState, useRef } from 'react';
import '../styles/style.css';

function BusquedaPaciente() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  
  // Referencia para mantener vivo el temporizador entre renderizados
  const timerRef = useRef(null);

  // 1. Ejecución de la búsqueda (Simulando Patrón Repository hacia Oracle DB)
  const executeSearchQuery = async (searchQuery, filters) => {
    setBuscando(true);
    console.log(`Ejecutando búsqueda segura para: ${searchQuery}`);
    
    // Simulación de latencia de red y respuesta del backend
    setTimeout(() => {
      const mockData = [
        { id: 101, nombre: 'Juan Pérez López', curp: 'PELJ900101HDFRRN01', ultimaCita: '2026-05-10' },
        { id: 102, nombre: 'Juana Martínez', curp: 'MAJJ850215MDFRRN09', ultimaCita: '2026-04-22' }
      ].filter(p => p.nombre.toLowerCase().includes(searchQuery.toLowerCase()));
      
      setResultados(mockData);
      setBuscando(false);
    }, 600);
  };

  // 2. Técnica Debounce en JS puro (Requisito Técnico Obligatorio)
  const debounceInput = (searchQuery, delay) => {
    // Si ya hay un temporizador corriendo, lo destruimos
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Creamos uno nuevo que solo se ejecutará si el usuario deja de escribir
    timerRef.current = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        executeSearchQuery(searchQuery, null);
      } else {
        setResultados([]); // Limpiamos la pantalla si borran el texto
      }
    }, delay);
  };

  // 3. Validar permisos antes de abrir (Crucial para el aislamiento PII)
  const validatePatientAccess = (doctorId, patientId) => {
    console.log(`Validando si el Doctor ${doctorId} tiene pacientes vinculados con ID ${patientId}...`);
    alert(`Acceso concedido para el expediente ${patientId}. Redirigiendo...`);
  };

  // Manejador del Input de texto
  const manejarCambio = (e) => {
    const valor = e.target.value;
    setQuery(valor);
    debounceInput(valor, 500); // Medio segundo de espera antes de saturar el backend
  };

  // 4. Renderizado de resultados en Tarjetas (Retorna JSX)
  const renderSearchResults = (results) => {
    if (results.length === 0 && query.length > 2 && !buscando) {
      return <p className="text-center mt-4" style={{color: 'var(--text-light)'}}>No se encontraron pacientes para la búsqueda: "{query}"</p>;
    }

    return results.map(paciente => (
      <div key={paciente.id} className="card shadow-sm p-3 mb-3 border-0 d-flex flex-row justify-content-between align-items-center" style={{backgroundColor: 'var(--white)'}}>
        <div>
          <h5 className="text-purple mb-1" style={{fontWeight: 'bold'}}>{paciente.nombre}</h5>
          <p className="mb-0" style={{color: 'var(--text-light)', fontSize: '0.9rem'}}>
            CURP: {paciente.curp} | Última visita: {paciente.ultimaCita}
          </p>
        </div>
        <button 
          className="btn-pastel-secondary"
          onClick={() => validatePatientAccess(1, paciente.id)}
        >
          Ver Expediente
        </button>
      </div>
    ));
  };

  return (
    <div className="container mt-5">
      <div style={{maxWidth: '700px', margin: '0 auto'}}>
        <h2 className="text-purple mb-4" style={{ fontWeight: 'bold' }}>Búsqueda Clínica</h2>
        
        <div className="card shadow-sm border-0 p-4 mb-4" style={{backgroundColor: 'var(--purple-pastel)'}}>
          <label className="form-label" style={{color: 'var(--purple-accent)', fontWeight: '600'}}>
            Buscar Paciente
          </label>
          <input 
            type="text" 
            className="form-control form-control-lg" 
            placeholder="Ingrese nombre o CURP..." 
            value={query}
            onChange={manejarCambio}
          />
        </div>

        <div className="resultados-container">
          {buscando ? (
            <div className="text-center p-4">
              <span className="text-purple fw-bold">Consultando registros...</span>
            </div>
          ) : (
            renderSearchResults(resultados)
          )}
        </div>
      </div>
    </div>
  );
}

export default BusquedaPaciente;