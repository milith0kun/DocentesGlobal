'use client';

export default function Step08TopDocente({ formData, setFormData, onNext, onBack, onShowCertificate }) {
  const kpis = [
    { id: 'ICP', title: 'Calidad Percibida', text: 'Encuestas de satisfacción estudiantil por estrellas del 1 al 5, 5 siendo la mejor puntuación.' },
    { id: 'TAP', title: 'Asistencia y Puntualidad', text: 'Inicio y fin exacto de cada sesión.' },
    { id: 'CMD', title: 'Envío de Materiales', text: 'Diapositivas y lecturas a tiempo (Sáb/Dom 1pm).' },
    { id: 'EOE', title: 'Envío de Exámenes', text: 'Evaluaciones según calendario (Lunes 9am).' },
    { id: 'IIA', title: 'Aporte Institucional', text: 'Materiales exclusivos como patrimonio.' },
    { id: 'TRD', title: 'Retención de Alumnos', text: 'Participantes en las sesiones de aprendizaje que completan el curso.' },
  ];

  const benefits = [
    { strong: 'Capacitación gratuita', rest: ' — Becas y descuentos en programas avanzados.' },
    { strong: 'Networking internacional', rest: ' — Conexiones con expertos y líderes de la industria.' },
    { strong: 'Representación de marca', rest: ' — Ponencias en eventos y conferencias globales.' },
    { strong: 'Presencia en medios', rest: ' — Podcasts, entrevistas y paneles especializados.' },
    { strong: 'Lanzamientos e innovación', rest: ' — Prioridad en nuevos proyectos y consultoría.' },
  ];

  return (
    <div className="wz-fade wz-top-stage">
      <h2 className="wz-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Programa Docente TOP</h2>
      <p className="wz-sub" style={{ textAlign: 'center', maxWidth: '540px', margin: '0 auto 1.5rem auto' }}>
        Buscamos talentos que inspiren. Si cumple los criterios de calidad, asistencia y puntualidad en
        materiales, accederá a la categoría TOP con beneficios exclusivos.
      </p>

      <h3 className="wz-top-section-title">Indicadores de Evaluación</h3>
      <div className="wz-top-kpi-grid">
        {kpis.map((item) => (
          <div className="wz-top-kpi-item" key={item.id}>
            <span className="wz-top-kpi-id">{item.id}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="wz-top-section-title" style={{ marginTop: '1.5rem' }}>Beneficios Categoría TOP</h3>
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
          </button>
          <p className="wz-cert-note">Al cumplir los KPIs con excelencia obtienes el certificado Top Docente.</p>
        </div>
      </div>

      <div
        className={`wz-check-row ${formData.aceptaTop ? 'on' : ''}`}
        onClick={() => setFormData({ ...formData, aceptaTop: !formData.aceptaTop })}
        style={{ marginTop: '1.5rem' }}
      >
        <div className={`wz-checkbox ${formData.aceptaTop ? 'on' : ''}`} />
        <span>He leído las condiciones del Programa Docente TOP y los objetivos de calidad.</span>
      </div>

      <div className="wz-nav">
        <button onClick={onBack} className="wz-btn-ghost">Atrás</button>
        <button onClick={onNext} disabled={!formData.aceptaTop} className="wz-btn-main">Siguiente</button>
      </div>
    </div>
  );
}
