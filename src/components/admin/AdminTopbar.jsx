'use client';

const cgbLogo = '/assets/cgb-logo-clean.png';
const ciipLogo = '/assets/logociip.png';
const geominaLogo = '/assets/logogeomina.png';
const biomedicLogo = '/assets/logobiomedic.png';

export default function AdminTopbar({ onLogout }) {
  return (
    <header className="adm-topbar">
      <div className="adm-topbar-left">
        <img src={cgbLogo} alt="CGB Academy" className="adm-topbar-cgb-logo" />
        <div className="adm-topbar-sep" />
        <div className="adm-topbar-brand-logos">
          <img src={ciipLogo} alt="CIIP Latam" style={{ height: '26px' }} />
          <div className="adm-topbar-sep" />
          <img src={geominaLogo} alt="Geomina" style={{ height: '20px' }} />
          <div className="adm-topbar-sep" />
          <img src={biomedicLogo} alt="Biomedic" style={{ height: '22px' }} />
        </div>
        <div className="adm-topbar-sep" />
        <div>
          <p className="adm-topbar-title">Panel Administrativo</p>
          <p className="adm-topbar-sub">Gestión de Docentes · CGB Academy</p>
        </div>
      </div>
      <div className="adm-topbar-actions">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="adm-topbar-link"
        >
          Ver manual docente
        </a>
        <button className="adm-logout-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
