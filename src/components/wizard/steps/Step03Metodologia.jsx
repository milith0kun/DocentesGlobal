'use client';

export default function Step03Metodologia({
  formData,
  setFormData,
  onNext,
  onBack,
  activePrinciple,
  setActivePrinciple,
  viewedPrinciples,
  setViewedPrinciples,
}) {
  const allPrinciplesViewed = viewedPrinciples.every((v) => v);

  const principles = [
    {
      n: '01',
      t: 'Enfoque 100% Práctico y Aplicado',
      d: 'Creemos firmemente en el poder de aprender haciendo. Por ello, transformamos la teoría en experiencia directa: cada nuevo concepto cobra vida al resolver casos reales de la industria en vivo. El software es nuestro gran escenario para que los estudiantes comprueben la aplicación inmediata de su conocimiento.',
      img: '/assets/pilar-01.png',
    },
    {
      n: '02',
      t: 'Inmersión Total en las Herramientas',
      d: 'Evolucionamos la educación dejando atrás la exposición tradicional. Les invitamos a sustituir las extensas presentaciones por una inmersión directa en el entorno de trabajo digital. Queremos que sus sesiones sean espacios dinámicos y de acción pura, donde el estudiante alcance el dominio técnico interactuando con la herramienta desde el primer minuto.',
      img: '/assets/pilar-02.png',
    },
    {
      n: '03',
      t: 'Liderazgo y Fluidez del Aprendizaje',
      d: 'Usted es el guía que marca el ritmo del éxito grupal. Confiamos en su liderazgo para mantener un avance constante y motivador, gestionando con agilidad las consultas o incidencias técnicas individuales. De esta manera, garantizamos que la energía de la clase fluya sin interrupciones y todo el equipo alcance su meta de aprendizaje.',
      img: '/assets/pilar-03.png',
    },
  ];

  const selectedPrinciple = principles[activePrinciple ?? 0];

  return (
    <div className="wz-fade">
      <span className="wz-tag">Doing by Learning</span>
      <h2 className="wz-title">Nuestra Filosofía</h2>
      <p className="wz-sub" style={{ marginBottom: '1.5rem' }}>
        Transformamos carreras mediante habilidades prácticas. Este manual no es solo una guía, es el estándar
        de calidad que nos posiciona en Latinoamérica.
      </p>

      <div className="wz-principles-stage">
        <div className="wz-principles-list">
          {principles.map((p, i) => {
            const isOpen = (activePrinciple ?? 0) === i;
            const isViewed = viewedPrinciples[i];
            return (
              <div
                key={i}
                className={`wz-principle ${isOpen ? 'open' : ''} ${isViewed ? 'viewed' : ''}`}
                onMouseEnter={() => {
                  setActivePrinciple(i);
                  setViewedPrinciples((prev) => {
                    const next = [...prev];
                    next[i] = true;
                    return next;
                  });
                }}
                onClick={() => setActivePrinciple(i)}
                style={{ cursor: 'pointer' }}
              >
                <div className="wz-principle-header" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '1.25rem' }}>
                  <div className="wz-principle-num">{p.n}</div>
                  <div className="wz-principle-text" style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {p.t}
                    </h4>
                  </div>
                  <div className="wz-principle-arrow" style={{ color: isOpen ? 'var(--bc)' : '#94a3b8' }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="wz-principle-detail">
          <span>{selectedPrinciple.n}</span>
          <h3>{selectedPrinciple.t}</h3>
          <p>{selectedPrinciple.d}</p>
        </aside>

        <div className="wz-principle-image-container">
          <img src={selectedPrinciple.img} alt={selectedPrinciple.t} />
        </div>
      </div>

      {!allPrinciplesViewed && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem 1.25rem',
            background: 'rgba(14,165,233,0.08)',
            borderRadius: '12px',
            border: '1px solid rgba(14,165,233,0.15)',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
            <span style={{ color: 'var(--bc)', fontWeight: 'bold', fontSize: '1.2rem' }}>ℹ</span> Por favor,
            visualiza los 3 pilares para poder aceptar la metodología.
          </p>
        </div>
      )}

      <div className="wz-nav" style={{ marginTop: '1.5rem' }}>
        <button onClick={onBack} className="wz-btn-ghost">Atrás</button>
        <button
          onClick={() => {
            setFormData({ ...formData, aceptaMetodologia: true });
            onNext();
          }}
          disabled={!allPrinciplesViewed}
          className="wz-btn-main"
        >
          Aceptar Metodología
        </button>
      </div>
    </div>
  );
}
