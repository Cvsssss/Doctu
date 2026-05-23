import React, { useState, useEffect } from 'react';
import '../styles/style.css';

function CalendarioBuzon() {
  const [citas, setCitas] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  // 1. Obtener la agenda del mes
  const fetchMonthlyAgenda = async (doctorId, month) => {
    try {
      const res = await fetch(`http://localhost:3000/api/appointments/doctor/${doctorId}/monthly`);
      const data = await res.json();
      setCitas(data);
    } catch (error) {
      console.error("Error cargando la agenda:", error);
    }
  };

  // 2. Mediador: Abrir detalles de la cita al hacer clic en la cuadrícula
  const openAppointmentDetails = (cita) => {
    setCitaSeleccionada(cita);
  };

  // 3. Actualizar estado de la cita (Cancelaciones o reprogramaciones)
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    console.log(`Actualizando cita ${appointmentId} a ${newStatus}`);
    try {
      const res = await fetch(`http://localhost:3000/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newStatus })
      });
      if (res.ok) {
        setCitas(citas.map(c => c.id === appointmentId ? { ...c, estado: newStatus } : c));
        setCitaSeleccionada(prev => prev && prev.id === appointmentId ? { ...prev, estado: newStatus } : prev);
      }
    } catch (error) {
      console.error("Error actualizando la cita:", error);
    }
  };

  // 4. Simulación de WebSockets / Server-Sent Events para pagos
  const listenForPaymentWebhooks = () => {
    console.log("Escuchando webhooks de Stripe/MercadoPago...");
    // A los 5 segundos simulamos que el paciente 'Juan Pérez' realizó su pago
    setTimeout(() => {
      console.log("¡Webhook de pago recibido!");
      setCitas(prevCitas => 
        prevCitas.map(c => c.id === 1 ? { ...c, pago: true, estado: 'Confirmada' } : c)
      );
      // Actualizar la vista de detalles si Juan Pérez está seleccionado
      setCitaSeleccionada(prev => prev && prev.id === 1 ? { ...prev, pago: true, estado: 'Confirmada' } : prev);
    }, 5000);
  };

  useEffect(() => {
    fetchMonthlyAgenda(1, 'Mayo');
    listenForPaymentWebhooks();
  }, []);

  // Array de 30 días para maquetar la cuadrícula del mes
  const diasMes = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-purple" style={{ fontWeight: 'bold' }}>Agenda Médica</h2>
        <span className="badge-pastel">Mayo 2026</span>
      </div>

      {/* Patrón Mediator: Contenedor Principal */}
      <div className="mediator-layout">
        
        {/* Componente Hijo A: Calendario CSS Grid */}
        <div className="card shadow-sm border-0 p-4">
          <div className="calendario-grid">
            {diasMes.map(dia => {
              const citasDelDia = citas.filter(c => c.dia === dia);
              return (
                <div 
                  key={dia} 
                  className="dia-grid" 
                  onClick={() => citasDelDia.length > 0 && openAppointmentDetails(citasDelDia[0])}
                >
                  <span className="numero-dia">{dia}</span>
                  {citasDelDia.map(cita => (
                    <div 
                      key={cita.id} 
                      /* Cambio dinámico de clase dependiendo del estado del pago */
                      className={`cita-indicador ${cita.pago ? 'pagada' : 'pendiente'}`}
                    >
                      {cita.hora}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* Componente Hijo B: Buzón / Detalles (Reacciona al Componente A) */}
        <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: 'var(--bg-color)' }}>
          <h4 className="text-purple mb-4" style={{ fontWeight: '600' }}>Detalles de Cita</h4>
          
          {citaSeleccionada ? (
            <div className="detalles-cita">
              <h5 style={{ fontWeight: 'bold' }}>{citaSeleccionada.paciente}</h5>
              <p className="mb-1"><strong>Fecha:</strong> {citaSeleccionada.dia} de Mayo, 2026</p>
              <p className="mb-3"><strong>Hora:</strong> {citaSeleccionada.hora} hrs</p>
              
              <div className="estado-pago mb-4 p-3" style={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: `1px solid ${citaSeleccionada.pago ? '#4CAF50' : 'var(--purple-pastel)'}` }}>
                <strong>Estado:</strong> 
                <span style={{ color: citaSeleccionada.pago ? '#4CAF50' : 'var(--purple-accent)', marginLeft: '8px', fontWeight: 'bold' }}>
                  {citaSeleccionada.pago ? '✓ Pagado y Confirmado' : '⌛ Pendiente de Pago'}
                </span>
              </div>

              <div className="acciones-cita d-flex flex-column gap-2 mt-auto">
                <button className="btn-pastel-primary w-100">Abrir Expediente (NOM-004)</button>
                <button 
                  className="btn-pastel-secondary w-100" 
                  onClick={() => updateAppointmentStatus(citaSeleccionada.id, 'Cancelada')}
                >
                  Cancelar Cita
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center" style={{ color: 'var(--text-light)', marginTop: '2rem' }}>
              <p>Selecciona un día en el calendario que contenga una cita para ver las opciones y el estado del pago.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CalendarioBuzon;