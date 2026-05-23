import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import logoDoctu from '../assets/Logo.png';

/* ─── Links por rol ─── */
const LINKS_MEDICO = [
  { to: '/dashboard-medico',    label: 'Inicio',       icon: '🏠' },
  { to: '/buscar-paciente',     label: 'Pacientes',    icon: '🔍' },
  { to: '/llenado-expediente',  label: 'Expedientes',  icon: '📋' },
  { to: '/calendario',          label: 'Calendario',   icon: '📅' },
];
const LINKS_PACIENTE = [
  { to: '/portal-paciente', label: 'Mi Portal',  icon: '🏥' },
  { to: '/pasarela-pago',   label: 'Mis Pagos',  icon: '💳' },
];

export default function Navbar() {
  const { user, logout }  = useAuth();
  const location          = useLocation();
  const navigate          = useNavigate();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const dropRef = useRef(null);

  const isLanding = location.pathname === '/';
  const links     = user?.rol === 'medico'
    ? LINKS_MEDICO
    : user?.rol === 'paciente'
      ? LINKS_PACIENTE
      : [];

  /* Scroll listener */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* Cerrar todo al cambiar de ruta */
  useEffect(() => {
    setMenuOpen(false);
    setDropOpen(false);
  }, [location.pathname]);

  /* Cerrar dropdown al hacer clic fuera */
  useEffect(() => {
    const fn = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const initials = user?.nombre
    ? user.nombre.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  /* Navbar es transparente solo en landing sin scroll */
  const transparent = isLanding && !scrolled && !user;

  return (
    <>
      <nav className={`navbar-doctu ${transparent ? 'transparent' : ''} ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <img src={logoDoctu} alt="Doctu" className="navbar-logo-img" />
          </Link>

          {/* Links de navegación (desktop) */}
          {links.length > 0 && (
            <ul className="navbar-links-list">
              {links.map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`nav-link-item ${location.pathname === l.to ? 'active' : ''}`}
                  >
                    <span>{l.icon}</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Derecha */}
          <div className="navbar-right">
            {user ? (
              /* Usuario logueado → pill con dropdown */
              <div ref={dropRef} style={{ position:'relative' }}>
                <button
                  className="user-pill"
                  onClick={() => setDropOpen(o => !o)}
                >
                  <div className="avatar-mini">{initials}</div>
                  <span style={{ maxWidth:110, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {user.nombre?.split(' ')[0]}
                  </span>
                  <span style={{ fontSize:'0.7rem', color:'var(--text-light)' }}>▼</span>
                </button>

                {dropOpen && (
                  <div className="dropdown-nav">
                    <div className="dropdown-nav-header">
                      <div className="dropdown-nav-name">{user.nombre}</div>
                      <div className="dropdown-nav-role">
                        {user.rol === 'medico'
                          ? `🩺 Profesional · ${user.especialidad || 'Médico'}`
                          : 'Paciente'}
                      </div>
                    </div>
                    <hr style={{ margin:'4px 0', borderColor:'var(--border-color)' }} />
                    {user.rol === 'medico' && (
                      <Link to="/dashboard-medico" className="dropdown-nav-item">
                        🏠 Mi Dashboard
                      </Link>
                    )}
                    {user.rol === 'paciente' && (
                      <Link to="/portal-paciente" className="dropdown-nav-item">
                        🏥 Mi Portal
                      </Link>
                    )}
                    <button className="dropdown-nav-item" onClick={handleLogout} style={{ width:'100%' }}>
                      🚪 Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Sin usuario → botones de auth */
              <>
                <Link
                  to="/login"
                  style={{
                    padding:'8px 18px', borderRadius:'var(--radius-md)',
                    fontWeight:600, fontSize:'0.9rem',
                    color: transparent ? 'rgba(255,255,255,0.85)' : 'var(--text-light)',
                    textDecoration:'none', transition:'var(--transition)',
                  }}
                >
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="btn-pastel-primary btn-sm-custom">
                  Registrarse
                </Link>
              </>
            )}

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menú"
              style={{
                display:'none',
                flexDirection:'column', gap:5, padding:6,
                background:'none', border:'none', cursor:'pointer',
              }}
              className="hamburger-btn"
            >
              <span style={{ display:'block', width:22, height:2, background: transparent ? 'white' : 'var(--text-main)', borderRadius:2, transition:'all 0.22s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
              <span style={{ display:'block', width:22, height:2, background: transparent ? 'white' : 'var(--text-main)', borderRadius:2, transition:'all 0.22s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display:'block', width:22, height:2, background: transparent ? 'white' : 'var(--text-main)', borderRadius:2, transition:'all 0.22s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position:'fixed', top:'var(--navbar-h)', left:0, right:0,
          background:'white', borderBottom:'1px solid var(--border-color)',
          boxShadow:'var(--card-shadow-lg)', zIndex:1020,
          animation:'slideDown 0.22s both',
          padding:'8px 16px 16px',
        }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              display:'block', padding:'12px 16px', borderRadius:'var(--radius-md)',
              fontWeight:600, fontSize:'0.95rem', color:'var(--text-main)',
              textDecoration:'none', marginBottom:2,
              background: location.pathname === l.to ? 'var(--purple-light)' : 'transparent',
            }}>
              {l.icon} {l.label}
            </Link>
          ))}
          {!user && (
            <>
              <Link to="/login"    style={{ display:'block', padding:'12px 16px', color:'var(--text-main)', fontWeight:600, textDecoration:'none', borderRadius:'var(--radius-md)' }}>Iniciar sesión</Link>
              <Link to="/registro" style={{ display:'block', padding:'12px 16px', color:'var(--text-main)', fontWeight:600, textDecoration:'none', borderRadius:'var(--radius-md)' }}>Registrarse</Link>
            </>
          )}
          {user && (
            <button onClick={handleLogout} style={{ display:'block', width:'100%', textAlign:'left', padding:'12px 16px', background:'none', border:'none', fontWeight:600, color:'var(--danger)', cursor:'pointer', borderRadius:'var(--radius-md)', fontFamily:'var(--font-body)' }}>
              🚪 Cerrar sesión
            </button>
          )}
        </div>
      )}

      <style>{`
        .hamburger-btn { display: none !important; }
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
          .navbar-links-list { display: none !important; }
        }
        .navbar-doctu.transparent .nav-link-item { color: rgba(255,255,255,0.85); }
        .navbar-doctu.transparent .nav-link-item:hover { background: rgba(255,255,255,0.15); color: white; }
        .navbar-doctu.transparent .nav-link-item.active { background: rgba(255,255,255,0.2); color: white; }
        .navbar-doctu.transparent .navbar-logo-img { filter: brightness(0) invert(1); }
      `}</style>
    </>
  );
}