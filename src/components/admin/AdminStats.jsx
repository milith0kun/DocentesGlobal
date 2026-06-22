export default function AdminStats({ stats }) {
  const items = [
    ['Total docentes', stats.total],
    ['CIIP Latam', stats.ciip],
    ['Geomina', stats.geomina],
    ['Biomedic', stats.biomedic],
    ['Contrato aceptado', stats.conformidad],
  ];

  return (
    <div className="adm-stats-row">
      {items.map(([label, value], index) => (
        <div className={`adm-stat-card${index === items.length - 1 ? ' adm-stat-card-status' : ''}`} key={label}>
          <span className="adm-stat-label">{label}</span>
          <span className="adm-stat-value">{value}</span>
        </div>
      ))}
    </div>
  );
}
