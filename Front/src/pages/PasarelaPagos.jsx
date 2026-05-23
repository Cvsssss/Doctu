import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';

function PasarelaPagos() {
  const navigate = useNavigate();
  const [metodo, setMetodo] = useState('stripe'); // 'stripe' o 'mercadopago'
  const [procesando, setProcesando] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  
  // Estado del formulario de tarjeta
  const [tarjeta, setTarjeta] = useState({
    nombre: '',
    numero: '',
    expiracion: '',
    cvv: ''
  });

  // Datos simulados de la consulta a pagar (vienen de la Agenda_Citas)
  const consultaInfo = {
    idCita: 1024,
    doctor: 'Dr. Arturo (Medicina General)',
    fecha: '20 de Mayo, 2026',
    monto: 450.00
  };

  const manejarCambio = (e) => {
    setTarjeta({
      ...tarjeta,
      [e.target.name]: e.target.value
    });
  };

  // Función abstracta / Simulación del flujo de pago seguro P2P
  const procesarPagoCita = (e) => {
    e.preventDefault();
    setProcesando(true);
    console.log(`[PAGO] Iniciando transacción a través de la pasarela: ${metodo.toUpperCase()}`);
    console.log(`[PAGO] Datos de cita vinculada ID: ${consultaInfo.idCita}, Monto: $${consultaInfo.monto} MXN`);

    // Simulamos la comunicación ultrarrápida con la pasarela para evitar que la sesión expire
    setTimeout(() => {
      setProcesando(false);
      setPagoExitoso(true);
      console.log(`[PAGO] Transacción autorizada con éxito en ${metodo.toUpperCase()}. Inserción lista para Pagos_Transacciones.`);
    }, 2500);
  };

  if (pagoExitoso) {
    return (
      <div className="container mt-5 animacion-entrada">
        <div className="card shadow-sm border-0 p-5 text-center" style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: 'var(--white)' }}>
          <div style={{ fontSize: '4rem', color: '#4CAF50', marginBottom: '1rem' }}>✓</div>
          <h2 className="text-purple" style={{ fontWeight: 'bold' }}>¡Pago Confirmado!</h2>
          <p className="mt-2" style={{ color: 'var(--text-light)' }}>
            Tu anticipo para la consulta con el <strong>{consultaInfo.doctor}</strong> ha sido procesado de manera segura.
          </p>
          <div className="p-3 my-4 rounded" style={{ backgroundColor: '#F4FBF7', border: '1px solid #A5D6A7', fontSize: '0.9rem' }}>
            <strong>ID de Cita:</strong> #{consultaInfo.idCita}<br />
            <strong>Monto abonado:</strong> ${consultaInfo.monto.toFixed(2)} MXN<br />
            <strong>Método:</strong> {metodo.toUpperCase()} 
          </div>
          <button className="btn-pastel-primary w-100" onClick={() => navigate('/portal-paciente')}>
            Volver a Mis Citas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5 animacion-entrada">
      <div className="row g-4 justify-content-center">
        
        {/* COLUMNA IZQUIERDA: Resumen del Cobro */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: 'var(--white)' }}>
            <span className="badge-pastel mb-3">Resumen de Orden</span>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>Detalle de Consulta</h4>
            
            <div className="mb-3">
              <p className="small text-muted mb-0">Especialista</p>
              <p className="fw-bold">{consultaInfo.doctor}</p>
            </div>
            
            <div className="mb-3">
              <p className="small text-muted mb-0">Fecha y Hora asignada</p>
              <p className="fw-bold">{consultaInfo.fecha}</p>
            </div>
            
            <hr style={{ borderTop: '1px solid var(--purple-pastel)', margin: '1.5rem 0' }} />
            
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold text-purple" style={{ fontSize: '1.1rem' }}>Total a pagar:</span>
              <span className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
                ${consultaInfo ? consultaInfo.monto.toFixed(2) : '0.00'} MXN
              </span>
            </div>
            <p className="small text-muted mt-2 mb-0" style={{ fontStyle: 'italic' }}>
              * Al pagar por adelantado aseguras tu lugar y proteges el tiempo del especialista.
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: Formulario de la Pasarela */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: 'var(--white)' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1.5rem' }} className="text-purple">Método de Pago Seguro</h4>
            
            {/* Selector de Pasarela Externa (Stripe vs MercadoPago) */}
            <div className="d-flex gap-3 mb-4">
              <button 
                type="button"
                className={`btn flex-fill p-3 border ${metodo === 'stripe' ? 'border-primary' : ''}`}
                style={{ backgroundColor: metodo === 'stripe' ? '#F4F7FF' : 'var(--white)', borderRadius: '8px', fontWeight: '600' }}
                onClick={() => setMetodo('stripe')}
              >
                💳 Stripe
              </button>
              <button 
                type="button"
                className={`btn flex-fill p-3 border ${metodo === 'mercadopago' ? 'border-primary' : ''}`}
                style={{ backgroundColor: metodo === 'mercadopago' ? '#EBF5FF' : 'var(--white)', borderRadius: '8px', fontWeight: '600' }}
                onClick={() => setMetodo('mercadopago')}
              >
                🤝 MercadoPago
              </button>
            </div>

            {/* Formulario simulado de Tarjeta */}
            <form onSubmit={procesarPagoCita}>
              <div className="mb-3">
                <label className="form-label small text-muted">Nombre del Tarjetahabiente</label>
                <input type="text" className="form-control" name="nombre" required value={tarjeta.nombre} onChange={tarjetaForm => manejarCambio(tarjetaForm)} placeholder="COMO APARECE EN LA TARJETA" />
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Número de Tarjeta</label>
                <input type="text" className="form-control" name="numero" required maxLength="16" value={tarjeta.numero} onChange={tarjetaForm => manejarCambio(tarjetaForm)} placeholder="4152 •••• •••• ••••" />
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label small text-muted">Expiración</label>
                  <input type="text" className="form-control" name="expiracion" required maxLength="5" value={tarjeta.expiracion} onChange={tarjetaForm => manejarCambio(tarjetaForm)} placeholder="MM/AA" />
                </div>
                <div className="col-md-6 mb-4">
                  <label className="form-label small text-muted">CVC / CVV</label>
                  <input type="password" className="form-control" name="cvv" required maxLength="3" value={tarjeta.cvv} onChange={tarjetaForm => manejarCambio(tarjetaForm)} placeholder="•••" />
                </div>
              </div>

              <div className="alert alert-secondary p-2 mb-4 text-center" style={{ fontSize: '0.8rem', border: 'none', backgroundColor: '#F0EFF5', color: 'var(--text-light)' }}>
                
              </div>

              <button 
                type="submit" 
                className="btn-pastel-primary w-100 py-3" 
                disabled={procesando}
                style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                {procesando ? 'Verificando con el banco transaccional...' : `Confirmar Pago Seguro vía ${metodo === 'stripe' ? 'Stripe' : 'MercadoPago'}`}
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}

export default PasarelaPagos;