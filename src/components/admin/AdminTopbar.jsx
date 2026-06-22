'use client';

const cgbLogo = '/assets/cgb-logo-clean.png';
const ciipLogo = '/assets/ciip-white.png';
const geominaLogo = '/assets/geomina-new.png';
const biomedicLogo = '/assets/biomedic-logo-white.png';

export default function AdminTopbar({ onLogout }) {
  return (
    <header className="adm-topbar">
      <div className="adm-topbar-left">
        <img src={cgbLogo} alt="CGB Academy" className="adm-topbar-cgb-logo" />
        <div className="adm-topbar-sep" />
        <div className="adm-topbar-brand-logos">
          <img src={ciipLogo} alt="CIIP Latam" style={{ height: '28px' }} />
          <div className="adm-topbar-sep" />
          <img src={geominaLogo} alt="Geomina" style={{ height: '20px' }} />
          <div className="adm-topbar-sep" />
          <img src={biomedicLogo} alt="Biomedic" style={{ height: '24px' }} />
        </div>
        <div className="adm-topbar-sep" />
        <div>
          <p className="adm-topbar-title">Panel Administrativo</p>
          <p className="adm-topbar-sub">Gestión de Docentes · CGB Academy</p>
        </div>
      </div>
      <button className="adm-logout-btn" onClick={onLogout}>Cerrar sesión</button>
    </header>
  );
}
