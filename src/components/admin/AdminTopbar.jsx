'use client';

const cgbLogo = '/assets/cgb-logo-clean.png';
const ciipWhite = '/assets/ciip-white.png';
const geominaWhite = '/assets/geomina-new.png';
const biomedicWhite = '/assets/biomedic-logo-white.png';

export default function AdminTopbar({ onLogout }) {
  return (
    <header className="adm-topbar">
      <div className="adm-topbar-left">
        <div className="adm-topbar-cgb-group">
          <img src={cgbLogo} alt="CGB Academy" className="adm-topbar-cgb-logo" />
          <span className="adm-topbar-tagline">ECOSISTEMA ACADÉMICO GLOBAL</span>
        </div>
        <div className="adm-topbar-sep" />
        <div className="adm-topbar-brand-logos">
          <img src={ciipWhite} alt="CIIP Latam" className="adm-topbar-brand-img adm-brand-ciip" />
          <div className="adm-topbar-sep-sub" />
          <img src={geominaWhite} alt="Geomina" className="adm-topbar-brand-img adm-brand-geomina" />
          <div className="adm-topbar-sep-sub" />
          <img src={biomedicWhite} alt="Biomedic" className="adm-topbar-brand-img adm-brand-biomedic" />
        </div>
        <div className="adm-topbar-sep" />
        <div className="adm-topbar-titles">
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

