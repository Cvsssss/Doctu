import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const SERVICIOS = [
  { icon:'🦷', titulo:'Odontología', desc:'Odontograma digital, periodontogramas y seguimiento por fases. Control total del tratamiento dental.' },
  { icon:'🧠', titulo:'Psicología',  desc:'Historial de sesiones, evaluaciones psicométricas, plan terapéutico y notas de evolución.' },
  { icon:'🩺', titulo:'Medicina General', desc:'Historia clínica integral con signos vitales, AHF, diagnóstico CIE-10 y receta digital.' },
  { icon:'🐾', titulo:'Veterinaria', desc:'Gestión de pacientes animales con historial, vacunas y seguimiento de tratamientos.' },
];

const PASOS = [
  { num:'01', titulo:'El profesional te registra', desc:'Tu médico, dentista o psicólogo te invita a Doctu. Tu expediente se crea en la nube con tus datos protegidos.' },
  { num:'02', titulo:'Controlas tu historial',     desc:'Cada vez que alguien accede a tu CURP o datos de contacto, recibes una alerta inmediata por correo.' },
  { num:'03', titulo:'Agenda y paga en un clic',   desc:'Confirma tu cita con pago anticipado desde el portal. Sin llamadas, sin esperas, sin ausentismo.' },
  { num:'04', titulo:'Tu expediente te acompaña',  desc:'Cambias de especialista? Tu historial viaja contigo —con tu autorización— entre médicos de la red.' },
];

export default function Inicio() {

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

  /* Funciones abstractas de la arquitectura */
  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const navigateToLogin = () => { window.location.href = '/login'; };
  const renderServicesList = () => SERVICIOS.map(s => (
    <div key={s.titulo} className="feature-card reveal-on-scroll">
      <div className="feature-card-icon">{s.icon}</div>
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
              🌸 Infraestructura digital del sector salud
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
                🤝 Soy paciente — Comenzar
              </Link>
              <Link to="/login?rol=medico" className="btn-hero-outline" onClick={navigateToLogin}>
                🩺 Soy profesional de salud
              </Link>
            </div>

            {/* Barra de servicios */}
            <div className="hero-services-bar" style={{ marginTop:'48px' }}>
              {SERVICIOS.map(s => (
                <div key={s.titulo} className="service-pill">
                  <span className="service-pill-icon">{s.icon}</span>
                  <span>{s.titulo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background:'var(--purple-dark)', padding:'28px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {[
              { icon:'📋', valor:'NOM-004', label:'Cumplimiento normativo' },
              { icon:'🎯', valor:'< 5%',    label:'Ausentismo objetivo' },
              { icon:'⚡', valor:'50%',     label:'Más rápido que la competencia' },
              { icon:'🔐', valor:'100%',    label:'Tus datos, tu control' },
            ].map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:'1.8rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:700, color:'white', lineHeight:1 }}>{s.valor}</div>
                  <div style={{ fontSize:'0.78rem', color:'var(--purple-mid)', marginTop:3 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className="section-public" id="servicios">
        <div className="container">
          <div className="section-title-center reveal-on-scroll">
            <p className="section-eyebrow">Especialidades</p>
            <h2>Para cada profesional de la salud</h2>
            <p style={{ color:'var(--text-light)', fontSize:'1.02rem' }}>
              Un solo sistema, adaptado a la forma en que cada especialidad trabaja.
            </p>
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

      {/* ── SEGURIDAD ── */}
      <section className="section-public" style={{ background:'var(--white)' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6 reveal-on-scroll">
              <p className="section-eyebrow">Seguridad</p>
              <h2>Blindaje total de tus datos sensibles</h2>
              <p style={{ color:'var(--text-light)', marginBottom:24, lineHeight:1.75 }}>
                Cada acceso a tu CURP, nombre o datos de contacto genera una alerta 
                instantánea a tu correo y un registro auditables en nuestra base de datos.
              </p>
              <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  '✅ Aislamiento de datos PII en bóveda Oracle separada',
                  '✅ Triggers automáticos para notificaciones en tiempo real',
                  '✅ Cumplimiento LFPDPPP México',
                  '✅ Cifrado TLS/SSL en todas las transacciones',
                  '✅ Exportación XML según NOM-024-SSA3-2012',
                ].map((item,i) => (
                  <li key={i} style={{ fontSize:'0.93rem', fontWeight:500, color:'var(--text-main)' }}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="col-md-6 reveal-on-scroll" style={{ animationDelay:'0.15s' }}>
              <div style={{ background:'var(--purple-dark)', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--card-shadow-lg)' }}>
                <div style={{ padding:'14px 18px', background:'rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ width:8,height:8,background:'var(--success)',borderRadius:'50%',boxShadow:'0 0 8px var(--success)',animation:'pulse 2s infinite',display:'inline-block' }} />
                  <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--success)' }}>Monitoreo activo</span>
                </div>
                <div style={{ padding:'18px', display:'flex', flexDirection:'column', gap:12 }}>
                  {[
                    { icon:'🔔', titulo:'Acceso a expediente detectado', sub:'Dr. García accedió a tus datos de contacto', tiempo:'Hace 2 min' },
                    { icon:'📋', titulo:'Expediente actualizado', sub:'Dra. Martínez añadió notas de sesión', tiempo:'Ayer 11:20' },
                    { icon:'💊', titulo:'Nueva receta emitida', sub:'Consulta 14 mayo · Medicina General', tiempo:'14 mayo' },
                  ].map((n,i) => (
                    <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'14px', background:'rgba(255,255,255,0.06)', borderRadius:'var(--radius-md)', border:'1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ fontSize:'1.1rem', width:34,height:34, background:'rgba(255,255,255,0.08)', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{n.icon}</span>
                      <div>
                        <p style={{ fontSize:'0.85rem', fontWeight:600, color:'white', margin:'0 0 2px' }}>{n.titulo}</p>
                        <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.55)', margin:'0 0 3px' }}>{n.sub}</p>
                        <p style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.3)', margin:0 }}>{n.tiempo}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:'12px 18px', textAlign:'center', fontSize:'0.78rem', color:'rgba(255,255,255,0.35)', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                  🔒 Tus datos protegidos en tiempo real
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="cta-section">
        <div className="container text-center reveal-on-scroll">
          <div style={{ fontSize:'2.8rem', marginBottom:16 }}>🌸</div>
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

      <style>{`
        .reveal-on-scroll { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .reveal-on-scroll.revealed { opacity: 1; transform: translateY(0); }
        @media (max-width: 640px) {
          .hero-actions { flex-direction: column; }
          .cta-section .d-flex { flex-direction: column; align-items: center; }
        }
      `}</style>
    </main>
  );
}