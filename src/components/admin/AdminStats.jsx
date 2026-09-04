export default function AdminStats({ stats }) {
  const items = [
    { key: 'total', label: 'Total Docentes', value: stats.total, badge: 'General' },
    { key: 'ciip', label: 'CIIP Latam', value: stats.ciip, badge: 'Institución' },
    { key: 'geomina', label: 'Geomina', value: stats.geomina, badge: 'Institución' },
    { key: 'biomedic', label: 'Biomedic', value: stats.biomedic, badge: 'Institución' },
    { key: 'conformidad', label: 'Contrato Aceptado', value: stats.conformidad, badge: 'Conformidad' },
  ];

  return (
    <div className="adm-stats-grid">
      {items.map((item) => (
        <div className={`adm-stat-card adm-stat-${item.key}`} key={item.key}>
          <div className="adm-stat-top">
            <span className="adm-stat-label">{item.label}</span>
            <span className="adm-stat-pill">{item.badge}</span>
          </div>
          <span className="adm-stat-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
