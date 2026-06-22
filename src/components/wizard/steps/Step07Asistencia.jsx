'use client';

export default function Step07Asistencia({ formData, setFormData, onNext, onBack }) {
  const cards = [
    {
      number: '01',
      title: 'Permiso Justificado',
      badge: 'Mínimo 4 días',
      text: 'El docente debe solicitar este permiso con mínimo de 4 días de anticipación, para evitar inconvenientes en la ejecución de los cursos',
      bullets: [
        'IMPORTANTE: Esto es en caso excepcional, si en caso ocurren los permisos de forma reiterada y sin justificación, se observará en su evaluación docente. Los docentes no pueden solicitar permiso el mismo día, sábado o domingo',
      ],
    },
    {
      number: '02',
      title: 'Gestión de Reemplazos',
      badge: 'Autorización previa',
      text: 'Si por una situación muy particular y excepcional el docente no puede asistir, deberá proponer un reemplazo de igual o mayor nivel profesional, sujeto a la autorización previa de la Dirección Académica.',
    },
    {
      number: '03',
      title: 'Frecuencia y Penalidades',
      badge: 'Según contrato',
      text: 'Esta medida es viable únicamente en casos de extrema urgencia y de forma muy esporádica. Las faltas injustificadas no están permitidas. El incumplimiento de sesiones o las ausencias frecuentes impactarán en el récord docente y se aplicará la penalidad correspondiente según el contrato.',
    },
    {
      number: '04',
      title: 'Aporte de Valor',
      badge: 'Compromiso activo',
      text: 'Compartir materiales adicional para los estudiantes, nos permite ver su dedicación, este punto será considerado para su evaluación docente',
    },
  ];

  return (
    <div className="wz-fade">
      <h2 className="wz-title">Política de Asistencia y Compromiso Académico</h2>
      <p className="wz-sub">
        El contrato firmado representa un compromiso sagrado con la institución y, principalmente, con los
        alumnos que confían en su guía. Para garantizar una experiencia educativa sin interrupciones,
        establecemos los siguientes lineamientos:
      </p>

      <div className="wz-attendance-grid">
        {cards.map((item) => (
          <article className={`wz-attendance-card card-${item.number}`} key={item.number}>
            <div className="wz-attendance-card-head">
              <span className="wz-attendance-number">{item.number}</span>
              <span className="wz-attendance-badge">{item.badge}</span>
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
        <button onClick={onNext} disabled={!formData.aceptaAsistencia} className="wz-btn-main">Aceptar Política</button>
      </div>
    </div>
  );
}
