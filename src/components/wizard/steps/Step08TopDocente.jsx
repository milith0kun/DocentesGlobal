'use client';

export default function Step08TopDocente({ formData, setFormData, onNext, onBack, onShowCertificate }) {
  const kpis = [
    { id: '01', title: 'Opinión del Alumno', text: 'Alta calificación en las encuestas de satisfacción estudiantil (por estrellas del 1 al 5, 5 siendo la mejor puntuación).' },
    { id: '02', title: 'Puntualidad en Clases', text: 'Inicio y cierre de tus sesiones exactamente a la hora programada.' },
    { id: '03', title: 'Entrega de Materiales', text: 'Envío de tus diapositivas y lecturas a tiempo (Sáb/Dom 1:00 PM).' },
    { id: '04', title: 'Envío de Exámenes', text: 'Entrega puntual de tus evaluaciones (Lunes 9:00 AM).' },
    { id: '05', title: 'Aporte de Valor', text: 'Compartir recursos, lecturas y materiales complementarios para los alumnos.' },
    { id: '06', title: 'Fidelización', text: 'Lograr que tus estudiantes se mantengan motivados y completen el curso con éxito.' },
  ];

  const benefits = [
    { strong: 'Capacitación Gratuita', rest: ' — Becas y descuentos en nuestros programas avanzados.' },
    { strong: 'Networking Internacional', rest: ' — Conexión directa con expertos y líderes globales de la industria.' },
    { strong: 'Representación de Marca', rest: ' — Invitaciones especiales para ser ponente en eventos y congresos globales.' },
    { strong: 'Presencia en Medios', rest: ' — Espacios destacados en nuestros podcasts, entrevistas y paneles especializados.' },
    { strong: 'Proyectos de Innovación', rest: ' — Prioridad para participar en nuevos lanzamientos, asesorías y consultorías.' },
  ];

  return (
    <div className="wz-fade wz-top-stage">
      <span className="wz-tag" style={{ background: 'rgba(77, 196, 211, 0.18)', color: 'var(--brand-navy)', display: 'table', margin: '0 auto 0.6rem auto' }}>
        Categoría de Excelencia CGB
      </span>
      <h2 className="wz-title" style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.8rem' }}>Programa Docente TOP</h2>
      <p className="wz-sub" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 1.6rem auto', color: 'rgba(9, 42, 96, 0.9)', fontSize: '0.98rem', fontWeight: '500', lineHeight: '1.6' }}>
        Queremos reconocer tu excelencia. Si destacas en tu desempeño, asistencia y puntualidad, accederás a la Categoría TOP con beneficios exclusivos diseñados para tu crecimiento profesional.
      </p>

      <h3 className="wz-top-section-title">¿Cómo clasificar? (Tus Indicadores de Éxito)</h3>
      <p style={{ margin: '-0.3rem 0 0.8rem', fontSize: '0.86rem', color: 'rgba(9, 42, 96, 0.78)', fontWeight: '600' }}>
        Logra un gran desempeño en estos 6 pilares clave:
      </p>
      <div className="wz-top-kpi-grid">
        {kpis.map((item, i) => (
          <div className="wz-top-kpi-item" key={i}>
            <span className="wz-top-kpi-id">{item.id}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="wz-top-section-title" style={{ marginTop: '1.5rem' }}>Tus Beneficios Exclusivos (Categoría TOP)</h3>
      <p style={{ margin: '-0.3rem 0 0.8rem', fontSize: '0.86rem', color: 'rgba(9, 42, 96, 0.78)', fontWeight: '600' }}>
        Al alcanzar la excelencia, la institución te premia con:
      </p>
      <div className="wz-top-elite-wrap">
        <ul className="wz-top-elite-list">
          {benefits.map((b, i) => (
            <li key={i}>
              <strong>{b.strong}</strong>{b.rest}
            </li>
          ))}
        </ul>
        <div className="wz-top-cert-block" aria-label="Certificado del Programa Docente TOP">
          <button
            type="button"
            className="wz-certificate-preview"
            onClick={onShowCertificate}
            aria-label="Ver certificado ampliado"
          >
            <img
              src="/assets/certificado-docente-top.webp"
              alt="Vista previa del certificado institucional"
            />
            <div className="wz-cert-hover-overlay">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <span>Clic para ampliar certificado</span>
            </div>
          </button>
          <button
            type="button"
            className="wz-cert-badge-hint"
            onClick={onShowCertificate}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Clic para ver certificado
          </button>
          <p className="wz-cert-note" style={{ marginTop: '0.4rem' }}>Al cumplir tus metas con excelencia, recibirás tu certificación oficial como Docente TOP.</p>
        </div>
      </div>

      <div className="wz-nav" style={{ marginTop: '1.8rem' }}>
        <button onClick={onBack} className="wz-btn-ghost">Atrás</button>
        <button onClick={onNext} className="wz-btn-main">Siguiente</button>
      </div>
    </div>
  );
}
