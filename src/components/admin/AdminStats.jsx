'use client';

const ciipLogo = '/assets/ciip-white.png';
const geominaLogo = '/assets/geomina-new.png';
const biomedicLogo = '/assets/biomedic-logo-white.png';

export default function AdminStats({ total, docentes, source }) {
  const totalCiip = docentes.filter((d) => d.marcas?.some((m) => /ciip/i.test(m))).length;
  const totalGeo  = docentes.filter((d) => d.marcas?.some((m) => /geomina/i.test(m))).length;
  const totalBio  = docentes.filter((d) => d.marcas?.some((m) => /biomedic/i.test(m))).length;
  const totalConf = docentes.filter((d) => d.conformidadCompleta).length;

  const byBrand = source === 'sheets';

  return (
    <div className="adm-stats-row">
      <div className="adm-stat-card" style={{ borderTopColor: '#0ea5e9' }}>
        <span className="adm-stat-value">{total}</span>
        <span className="adm-stat-label">Total docentes</span>
      </div>

      <div className="adm-stat-card" style={{ borderTopColor: '#38bdf8' }}>
        <div className="adm-stat-card-inner">
          <img src={ciipLogo} alt="CIIP" style={{ height: '16px' }} className="adm-stat-card-logo" />
          <span className="adm-stat-value">{byBrand ? totalCiip : '—'}</span>
        </div>
        <span className="adm-stat-label">CIIP Latam</span>
      </div>

      <div className="adm-stat-card" style={{ borderTopColor: '#34d399' }}>
        <div className="adm-stat-card-inner">
          <img src={geominaLogo} alt="Geomina" style={{ height: '12px' }} className="adm-stat-card-logo" />
          <span className="adm-stat-value">{byBrand ? totalGeo : '—'}</span>
        </div>
        <span className="adm-stat-label">Geomina</span>
      </div>

      <div className="adm-stat-card" style={{ borderTopColor: '#fbbf24' }}>
        <div className="adm-stat-card-inner">
          <img src={biomedicLogo} alt="Biomedic" style={{ height: '16px' }} className="adm-stat-card-logo" />
          <span className="adm-stat-value">{byBrand ? totalBio : '—'}</span>
        </div>
        <span className="adm-stat-label">Biomedic</span>
      </div>

      <div className="adm-stat-card" style={{ borderTopColor: '#4ade80' }}>
        <span className="adm-stat-value" style={{ color: '#4ade80' }}>{byBrand ? totalConf : '—'}</span>
        <span className="adm-stat-label">Con conformidad</span>
      </div>
    </div>
  );
}
