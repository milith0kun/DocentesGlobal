'use client';

export default function Step07Asistencia({ formData, setFormData, onNext, onBack }) {
  const cards = [
    {
      number: '01',
      title: 'Permisos con tiempo',
      text: 'Solicítalos con un mínimo de 4 días de anticipación (solo casos excepcionales).',
      bullets: [
        'Nota: No se aceptan solicitudes el mismo día de clase, ni sábados o domingos.',
      ],
    },
    {
      number: '02',
      title: 'Coordinación de Reemplazos',
      badge: 'Autorización previa',
      text: 'En caso de fuerza mayor, propón un docente de igual o mayor nivel académico para su aprobación previa.',
    },
    {
      number: '03',
      title: 'Continuidad Académica',
      text: 'Las ausencias reiteradas o no justificadas afectan tu historial docente; ante faltas frecuentes, la Dirección Académica podrá designar a otro docente para el módulo.',
    },
    {
      number: '04',
      title: 'Destaca y Suma Puntos',
      text: 'Compartir materiales adicionales demuestra tu dedicación y suma puntos extra en tu evaluación docente.',
    },
  ];

  return (
    <div className="wz-fade">
      <h2 className="wz-title">Política de Asistencia y Compromiso Académico</h2>
      <p className="wz-sub">
        Para asegurar una experiencia de aprendizaje de alta calidad y sin interrupciones, nos organizamos bajo estos lineamientos clave:
      </p>

      <div className="wz-attendance-grid">
        {cards.map((item) => (
          <article className={`wz-attendance-card card-${item.number}`} key={item.number}>
            <div className="wz-attendance-card-head">
              <span className="wz-attendance-number">{item.number}</span>
              {item.badge && <span className="wz-attendance-badge">{item.badge}</span>}
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>

            {item.number === '01' && (
              <div className="wz-hero-image-wrap">
                <img src="/assets/nano-emergencia.png" alt="Nano Emergencia" className="wz-hero-image" />
              </div>
            )}

            {item.bullets && (
              <ul className="wz-attendance-bullets">
                {item.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>

      <div
        className={`wz-check-row ${formData.aceptaAsistencia ? 'on' : ''}`}
        onClick={() => setFormData({ ...formData, aceptaAsistencia: !formData.aceptaAsistencia })}
      >
        <div className={`wz-checkbox ${formData.aceptaAsistencia ? 'on' : ''}`} />
        <span>He leído y acepto la Política de Asistencia y Compromiso Académico.</span>
      </div>

      <div className="wz-nav">
        <button onClick={onBack} className="wz-btn-ghost">Atrás</button>
        <button onClick={onNext} disabled={!formData.aceptaAsistencia} className="wz-btn-main">Siguiente</button>
      </div>
    </div>
  );
}
