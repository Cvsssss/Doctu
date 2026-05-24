import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, FileText, Pill, Lock } from 'lucide-react';
import { FileCheck, Target, Zap, ShieldCheck } from 'lucide-react';
import '../styles/style.css';

// ── ICONOS PROFESIONALES (SVGs Minimalistas) ──
const getIcon = (id) => {
  switch(id) {
    case 'odontologia': // Diente estilizado
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8a4 4 0 0 1 4 4v3a4 4 0 0 1-3 3.87V19a3 3 0 0 1-6 0v-6.13A4 4 0 0 1 4 9V6a4 4 0 0 1 4-4z"/><path d="M12 12v7"/></svg>;
    case 'psicologia': // Cerebro
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
    case 'medicina': // Estetoscopio
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>;
    case 'veterinaria': // Huella (PawPrint)
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>;
    default: return null;
  }
};

const SERVICIOS = [
  { id: 'odontologia', titulo:'Odontología', desc:'Odontograma digital, periodontogramas y seguimiento por fases. Control total del tratamiento dental.' },
  { id: 'psicologia', titulo:'Psicología',  desc:'Historial de sesiones, evaluaciones psicométricas, plan terapéutico y notas de evolución.' },
  { id: 'medicina', titulo:'Medicina General', desc:'Historia clínica integral con signos vitales, AHF, diagnóstico CIE-10 y receta digital.' },
  { id: 'veterinaria', titulo:'Veterinaria', desc:'Gestión de pacientes animales con historial, vacunas y seguimiento de tratamientos.' },
];

const PASOS = [
  { num:'01', titulo:'El profesional te registra', desc:'Tu médico, dentista o psicólogo te invita a Doctu. Tu expediente se crea en la nube con tus datos protegidos.' },
  { num:'02', titulo:'Controlas tu historial',     desc:'Cada vez que alguien accede a tu CURP o datos de contacto, recibes una alerta inmediata por correo.' },
  { num:'03', titulo:'Agenda y paga en un clic',   desc:'Confirma tu cita con pago anticipado desde el portal. Sin llamadas, sin esperas, sin ausentismo.' },
  { num:'04', titulo:'Tu expediente te acompaña',  desc:'Cambias de especialista? Tu historial viaja contigo —con tu autorización— entre médicos de la red.' },
];

export default function Inicio() {
  // Estado para la burbuja de la caja de servicios
  const [hoveredDesc, setHoveredDesc] = useState('');
  
  // Estados para la burbuja flotante que sigue al cursor (Seguridad)
  const [activeSecurityDesc, setActiveSecurityDesc] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* Animaciones de scroll */
  useEffect(() => {
    const els = document.querySelectorAll('.reveal-on-scroll');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const navigateToLogin = () => { window.location.href = '/login'; };
  
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const renderServicesList = () => SERVICIOS.map(s => (
    <div key={s.titulo} className="feature-card reveal-on-scroll">
      <div className="feature-card-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {getIcon(s.id)}
      </div>
      <h4>{s.titulo}</h4>
      <p>{s.desc}</p>
    </div>
  ));

  return (
    <main style={{ paddingTop: 0 }}>

      {/* ── HERO ── */}
      <section className="hero-desktop">
        <div className="hero-bg-overlay" />
        <div className="hero-content-wrapper">
          <div className="hero-text-area animacion-entrada">
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'var(--radius-pill)', padding:'7px 16px', fontSize:'0.82rem', fontWeight:700, color:'rgba(255,255,255,0.9)', letterSpacing:'0.04em', marginBottom:'1.4rem' }}>
              Infraestructura digital del sector salud
            </div>

            <h1 className="hero-title">
              Tu historial clínico,<br />
              <span className="text-highlight">donde tú decides.</span>
            </h1>

            <p className="hero-subtitle">
              Doctu devuelve el control del expediente al paciente y empodera a los 
              profesionales de la salud con interoperabilidad real y seguridad total.
            </p>

            <div className="hero-actions">
              <Link to="/login?rol=paciente" className="btn-hero-white">
                Soy paciente
              </Link>
              <Link to="/login?rol=medico" className="btn-hero-outline" onClick={navigateToLogin}>
                Soy profesional de salud
              </Link>
            </div>

            {/* ── GRID 2x2 DE SERVICIOS (CON FONDOS ANIMADOS) ── */}
            <div className="hero-services-grid" style={{ marginTop:'48px' }}>
              {SERVICIOS.map(s => (
                <div 
                  key={s.titulo} 
                  className={`service-block block-${s.id}`}
                  onMouseEnter={() => setHoveredDesc(s.desc)}
                  onMouseLeave={() => setHoveredDesc('')}
                >
                  <span className="service-block-icon" style={{ display: 'flex', alignItems: 'center' }}>
                    {getIcon(s.id)}
                  </span>
                  <span className="service-block-text">{s.titulo}</span>
                </div>
              ))}
            </div>
            
            {/* Descripción dinámica de la especialidad */}
            <div style={{ minHeight: '40px', marginTop: '10px', color: '#fff', textAlign: 'center', opacity: hoveredDesc ? 1 : 0, transition: 'opacity 0.3s' }}>
                <p style={{ fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>{hoveredDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: 'var(--purple-dark)', padding: '28px 0' }}>
  <div className="container">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
      {[
        { icon: <FileCheck size={32} color="white" />, valor: 'NOM-004', label: 'Cumplimiento normativo' },
        { icon: <Target size={32} color="white" />, valor: '< 5%', label: 'Ausentismo objetivo' },
        { icon: <Zap size={32} color="white" />, valor: '50%', label: 'Más rápido que la competencia' },
        { icon: <ShieldCheck size={32} color="white" />, valor: '100%', label: 'Tus datos, tu control' },
      ].map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Contenedor del icono optimizado para vectores */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {s.icon}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>
              {s.valor}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--purple-mid)', marginTop: 3 }}>
              {s.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* ── SERVICIOS DETALLADOS ── */}
      <section className="section-public" id="servicios">
        <div className="container">
          <div className="section-title-center reveal-on-scroll">
            <p className="section-eyebrow">Especialidades</p>
            <h2>Para cada profesional de la salud</h2>
          </div>
          <div className="row g-4">
            {renderServicesList()}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="section-public section-alt" id="como-funciona">
        <div className="container">
          <div className="section-title-center reveal-on-scroll">
            <p className="section-eyebrow">¿Cómo funciona?</p>
            <h2>Simple para todos, poderoso para los datos</h2>
          </div>
          <div className="row g-4">
            {PASOS.map((paso, i) => (
              <div key={i} className="col-md-3 reveal-on-scroll" style={{ animationDelay:`${i*0.1}s` }}>
                <div style={{ background:'var(--white)', border:'1px solid var(--border-color)', borderRadius:'var(--radius-xl)', padding:'28px 22px', height:'100%', boxShadow:'var(--card-shadow)', transition:'var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow='var(--card-shadow-lg)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow='var(--card-shadow)'}
                >
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem', fontWeight:700, color:'var(--purple-accent)', lineHeight:1, marginBottom:14 }}>{paso.num}</div>
                  <h4 style={{ fontSize:'1rem', marginBottom:10 }}>{paso.titulo}</h4>
                  <p style={{ fontSize:'0.88rem', color:'var(--text-light)', lineHeight:1.65, margin:0 }}>{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEGURIDAD (CON BURBUJA QUE SIGUE EL CURSOR) ── */}
      <section className="section-public" style={{ background:'var(--white)', position: 'relative' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6 reveal-on-scroll">
              <p className="section-eyebrow">Seguridad</p>
              <h2>Blindaje total de tus datos sensibles</h2>
              <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', marginTop: '20px' }}>
                {[
                  { t: 'Tu información está en una caja fuerte', d: 'Tus datos personales y sensibles no están mezclados con el resto del sistema; viven en un espacio aislado y ultra protegido, como una bóveda digital exclusiva.' },
                  { t: 'Avisos inmediatos', d: 'Contamos con un sistema inteligente que te notifica al instante cada vez que alguien consulta tu historial, para que siempre sepas quién entra y qué información está viendo.' },
                  { t: 'Totalmente apegados a la ley', d: 'Cumplimos estrictamente con las leyes mexicanas de protección de datos personales, garantizando que tu información se maneje de forma ética y legal.' },
                  { t: 'Conexiones blindadas', d: 'Toda la información que viaja desde tu computadora o celular hasta nuestra plataforma está cifrada con la misma tecnología de seguridad que utilizan los bancos internacionales.' },
                  { t: 'Formato médico estandarizado', d: 'Tu expediente cumple con las normas oficiales de salud de México, asegurando que si algún día necesitas llevar tus documentos a otro hospital o médico, sean perfectamente entendibles y válidos.' }
                ].map((item,i) => (
                  <li 
                    key={i} 
                    className="security-list-item"
                    onMouseEnter={() => setActiveSecurityDesc(item.d)}
                    onMouseLeave={() => setActiveSecurityDesc('')}
                    onMouseMove={handleMouseMove}
                  >
                    <strong style={{ color:'var(--purple-accent)', display:'block', fontSize: '1.1rem' }}>{item.t}</strong>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* ── COMPONENTE GRÁFICO DE SEGURIDAD ── */}
            <div className="col-md-6 reveal-on-scroll" style={{ animationDelay: '0.15s' }}>
  <div style={{ background: 'var(--purple-dark)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--card-shadow-lg)' }}>
    <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 8, height: 8, background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 8px var(--success)', animation: 'pulse 2s infinite', display: 'inline-block' }} />
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--success)' }}>Monitoreo activo</span>
    </div>
    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[
        { icon: <Bell size={18} color="rgba(255,255,255,0.85)" />, titulo: 'Acceso a expediente detectado', sub: 'Dr. García accedió a tus datos de contacto', tiempo: 'Hace 2 min' },
        { icon: <FileText size={18} color="rgba(255,255,255,0.85)" />, titulo: 'Expediente actualizado', sub: 'Dra. Martínez añadió notas de sesión', tiempo: 'Ayer 11:20' },
        { icon: <Pill size={18} color="rgba(255,255,255,0.85)" />, titulo: 'Nueva receta emitida', sub: 'Consulta 14 mayo · Medicina General', tiempo: '14 mayo' },
      ].map((n, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* El contenedor ahora aloja el componente de Lucide */}
          <span style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {n.icon}
          </span>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', margin: '0 0 2px' }}>{n.titulo}</p>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', margin: '0 0 3px' }}>{n.sub}</p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{n.tiempo}</p>
          </div>
        </div>
      ))}
    </div>
    {/* Se reemplazó el candado de texto por el componente Lock */}
    <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <Lock size={12} color="rgba(255,255,255,0.35)" />
      <span>Tus datos protegidos en tiempo real</span>
    </div>
  </div>
</div>

          </div>
        </div>

        {/* ── BURBUJA FLOTANTE QUE SIGUE AL CURSOR ── */}
        {activeSecurityDesc && (
          <div style={{
            position: 'fixed',
            top: mousePos.y + 15, 
            left: mousePos.x + 15,
            background: 'var(--purple-dark)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            maxWidth: '300px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            pointerEvents: 'none', /* Evita que el ratón "choque" con la burbuja */
            zIndex: 9999,
            fontSize: '0.85rem',
            lineHeight: 1.5,
            animation: 'fadeInTooltip 0.2s ease-out'
          }}>
            {activeSecurityDesc}
          </div>
        )}
      </section>

      {/* ── CTA FINAL ── */}
      <section className="cta-section">
        <div className="container text-center reveal-on-scroll">
          <div style={{ fontSize:'2.8rem', marginBottom:16 }}></div>
          <h2>Tu salud, tu expediente, tu control.</h2>
          <p>Únete a Doctu hoy. Es gratis para pacientes.</p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/registro" className="btn-hero-white" style={{ color:'var(--purple-dark)' }}>
              Registrarme como paciente
            </Link>
            <Link to="/login?rol=medico" className="btn-hero-outline">
              Registrar mi consultorio
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-doctu">
        <div className="footer-inner">
          <span className="footer-brand">DOCTU</span>
          <nav className="footer-links">
            <a href="#servicios" onClick={e => { e.preventDefault(); scrollToSection('servicios'); }}>Servicios</a>
            <a href="#como-funciona" onClick={e => { e.preventDefault(); scrollToSection('como-funciona'); }}>Cómo funciona</a>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/registro">Registrarse</Link>
          </nav>
          <span>© {new Date().getFullYear()} Doctu · UNAM FI</span>
        </div>
      </footer>

      {/* ── ESTILOS CSS INYECTADOS ── */}
      <style>{`
        .reveal-on-scroll { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .reveal-on-scroll.revealed { opacity: 1; transform: translateY(0); }
        
        @media (max-width: 640px) {
          .hero-actions { flex-direction: column; }
          .cta-section .d-flex { flex-direction: column; align-items: center; }
          .hero-services-grid { grid-template-columns: 1fr !important; }
        }

        /* ── BURBUJA Y HOVER DE SEGURIDAD ── */
        .security-list-item {
          padding: 14px 10px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          cursor: crosshair; /* Cursor para indicar zona interactiva */
          transition: background 0.3s ease, padding-left 0.3s ease;
          border-radius: 6px;
        }
        .security-list-item:hover {
          background: rgba(0,0,0,0.02);
          padding-left: 15px;
        }
        @keyframes fadeInTooltip {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── GRID 2x2 DE ESPECIALIDADES ── */
        .hero-services-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(180px, 1fr));
          gap: 12px;
          max-width: 440px;
        }

        .service-block {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 12px 18px;
          border-radius: 12px;
          color: white;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden; 
        }

        /* ILUMINACIÓN DE BORDES AL PASAR EL MOUSE */
        .service-block:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.2);
        }

        /* ── ANIMACIONES DE FONDO PARA CADA BOTÓN ── */
        .service-block:hover {
          background-color: rgba(255, 255, 255, 0.04) !important; 
        }

        /* Estilos base del pseudo-elemento (los iconos ocultos) */
        .service-block::before {
          position: absolute;
          top: 0; left: -50%; width: 200%; height: 100%;
          display: flex; align-items: center; opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
          font-size: 1.5rem; /* Más grande para que sea muy visible */
          text-shadow: 0 0 8px rgba(255,255,255,0.4); /* Resplandor brillante */
          z-index: 0;
        }

        /* Al pasar el mouse, revelamos los símbolos y arrancamos la animación */
        .service-block:hover::before {
          opacity: 0.35; /* Opacidad alta para distinguirse perfectamente */
          animation: slideIcons 5s linear infinite;
        }

        /* Asignación de patrones visuales para cada área */
        .block-odontologia::before { content: '🦷 🦷 🦷 🦷 🦷 🦷 🦷 🦷'; }
        .block-psicologia::before { content: '🧠 🧠 🧠 🧠 🧠 🧠 🧠 🧠'; }
        .block-medicina::before { content: '✚ 🩺 ✚ 🩺 ✚ 🩺 ✚ 🩺'; }
        .block-veterinaria::before { content: '🐾 🐾 🐾 🐾 🐾 🐾 🐾 🐾'; }

        /* Mantenemos el icono SVG principal y el texto encima de la animación */
        .service-block-icon, .service-block-text {
          position: relative;
          z-index: 1;
        }

        /* Animación suave de deslizamiento infinito */
        @keyframes slideIcons {
          0% { transform: translateX(0); }
          100% { transform: translateX(15%); }
        }
      `}</style>
    </main>
  );
}