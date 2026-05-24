import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';

function PasarelaPagos() {
  const navigate = useNavigate();
  const [metodo, setMetodo] = useState('stripe'); // 'stripe' o 'mercadopago'
  const [procesando, setProcesando] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  
  // Estado para capturar los errores de validación en tiempo real
  const [errores, setErrores] = useState({});

  // Estado del formulario de tarjeta
  const [tarjeta, setTarjeta] = useState({
    nombre: '',
    numero: '',
    expiracion: '',
    cvv: ''
  });

  // Datos simulados de la consulta a pagar (vienen de la Agenda_Citas)
  const [consultaInfo] = useState(() => {
    // Genera un número aleatorio entre 300 y 1200
    const montoAleatorio = Math.floor(Math.random() * (1200 - 300 + 1) + 300);
    
    return {
      idCita: 1024,
      doctor: 'Dr. Arturo (Medicina General)',
      fecha: '20 de Mayo, 2026',
      monto: montoAleatorio // Aquí está el número aleatorio
    };
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    let valorFiltrado = value;

    // 1. Filtrar entrada según el campo activo
    if (name === 'numero' || name === 'cvv') {
      // Solo permitir dígitos numéricos
      valorFiltrado = value.replace(/\D/g, '');
    }

    if (name === 'nombre') {
      // Permitir solo letras y espacios
      valorFiltrado = value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g, '');
    }

    if (name === 'expiracion') {
      // Solo permitir números y una diagonal limpia
      let digitos = value.replace(/\D/g, '');
      
      if (digitos.length > 2) {
        valorFiltrado = `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}`;
      } else {
        valorFiltrado = digitos;
      }
    }

    // 2. Actualizar el estado del formulario
    setTarjeta({
      ...tarjeta,
      [name]: valorFiltrado
    });

    // Limpiar el error del campo que se está editando para mejorar la experiencia de usuario
    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  // Validación completa antes de procesar el pago
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar Nombre: Expresión regular que busca al menos dos palabras de mínimo 2 caracteres cada una
    const nombreTrimmed = tarjeta.nombre.trim();
    const palabras = nombreTrimmed.split(/\s+/);
    if (palabras.length < 2 || palabras.some(p => p.length < 2)) {
      nuevosErrores.nombre = 'Ingresa nombre y apellido completo (mínimo 2 caracteres por palabra).';
    }

    // Validar Número de tarjeta: Estricto 16 dígitos
    if (tarjeta.numero.length !== 16) {
      nuevosErrores.numero = 'El número de tarjeta debe contener exactamente 16 dígitos.';
    }

    // Validar Expiración: Formato MM/AA y consistencia lógica
    if (!/^\d{2}\/\d{2}$/.test(tarjeta.expiracion)) {
      nuevosErrores.expiracion = 'El formato debe ser MM/AA.';
    } else {
      const [mes, anio] = tarjeta.expiracion.split('/').map(Number);
      if (mes < 1 || mes > 12) {
        nuevosErrores.expiracion = 'Mes inválido (debe ser entre 01 y 12).';
      }
    }

    // Validar CVV: Estricto 3 dígitos
    if (tarjeta.cvv.length !== 3) {
      nuevosErrores.cvv = 'El código CVV debe ser de 3 dígitos.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const procesarPagoCita = (e) => {
    e.preventDefault();

    // Si la validación local falla, detenemos el flujo inmediatamente
    if (!validarFormulario()) return;

    setProcesando(true);
    console.log(`[PAGO] Iniciando transacción a través de la pasarela: ${metodo.toUpperCase()}`);
    console.log(`[PAGO] Datos de cita vinculada ID: ${consultaInfo.idCita}, Monto: $${consultaInfo.monto} MXN`);

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
            
            {/* Selector de Pasarela Externa */}
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

            {/* Formulario de Tarjeta */}
            <form onSubmit={procesarPagoCita} noValidate>
              <div className="mb-3">
                <label className="form-label small text-muted">Nombre del Tarjetahabiente</label>
                <input 
                  type="text" 
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`} 
                  name="nombre" 
                  required 
                  value={tarjeta.nombre} 
                  onChange={manejarCambio} 
                  placeholder="COMO APARECE EN LA TARJETA" 
                />
                {errores.nombre && <div className="invalid-feedback" style={{ display: 'block', color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>⚠️ {errores.nombre}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Número de Tarjeta</label>
                <input 
                  type="text" 
                  className={`form-control ${errores.numero ? 'is-invalid' : ''}`} 
                  name="numero" 
                  required 
                  maxLength="16" 
                  value={tarjeta.numero} 
                  onChange={manejarChange => manejarCambio(manejarChange)} 
                  placeholder="4152 •••• •••• ••••" 
                />
                {errores.numero && <div className="invalid-feedback" style={{ display: 'block', color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>⚠️ {errores.numero}</div>}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small text-muted">Expiración</label>
                  <input 
                    type="text" 
                    className={`form-control ${errores.expiracion ? 'is-invalid' : ''}`} 
                    name="expiracion" 
                    required 
                    maxLength="5" 
                    value={tarjeta.expiracion} 
                    onChange={manejarCambio} 
                    placeholder="MM/AA" 
                  />
                  {errores.expiracion && <div className="invalid-feedback" style={{ display: 'block', color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>⚠️ {errores.expiracion}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small text-muted">CVC / CVV</label>
                  <input 
                    type="password" 
                    className={`form-control ${errores.cvv ? 'is-invalid' : ''}`} 
                    name="cvv" 
                    required 
                    maxLength="3" 
                    value={tarjeta.cvv} 
                    onChange={manejarCambio} 
                    placeholder="•••" 
                  />
                  {errores.cvv && <div className="invalid-feedback" style={{ display: 'block', color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>⚠️ {errores.cvv}</div>}
                </div>
              </div>

              <div className="alert alert-secondary p-2 mb-4 text-center" style={{ fontSize: '0.8rem', border: 'none', backgroundColor: '#F0EFF5', color: 'var(--text-light)' }}>
                🔒 Tus datos de pago están encriptados de extremo a extremo.
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