'use client';

export default function Step04Fechas({ formData, setFormData, onNext, onBack }) {
  const items = [
    {
      key: 'aceptaSabado',
      day: 'Sábado',
      time: 'Hasta 1:00 PM',
      label: 'Material Sesión 1',
      desc: 'Diapositivas (PPTs), guías (PDFs), datasets y recursos para la clase del sábado.',
      color: '#0ea5e9',
    },
    {
      key: 'aceptaDomingo',
      day: 'Domingo',
      time: 'Hasta 1:00 PM',
      label: 'Material Sesión 2',
      desc: 'Diapositivas, casos prácticos y guías de la clase dominical. Sin excepciones.',
      color: '#0284c7',
    },
    {
      key: 'aceptaLunes',
      day: 'Lunes',
      time: 'Hasta 9:00 AM',
      label: 'Examen Final',
      desc: 'Confirmar entrega de 3 archivos: 10 Preguntas de opción aleatoria, Caso práctico (sin resolver) y Caso práctico resuelto.',
      color: '#7c3aed',
    },
  ];

  const allAccepted = formData.aceptaSabado && formData.aceptaDomingo && formData.aceptaLunes;

  return (
    <div className="wz-fade">
      <h2 className="wz-title">Límites de Entrega Innegociables</h2>
      <p className="wz-sub">
        Estos horarios representan el <strong>límite estricto y máximo</strong> para la entrega de materiales.
        Debes subir tus recursos a la Carpeta Drive asignada por tu directora académica. No esperes
        recordatorios; el incumplimiento de estos plazos afecta directamente la ejecución de la clase.
      </p>

      <div className="wz-agenda">
        {items.map((item, i) => {
          const on = formData[item.key];
          return (
            <div
              key={i}
              className={`wz-agenda-row ${on ? 'on' : ''}`}
              onClick={() => setFormData({ ...formData, [item.key]: !on })}
              style={{ '--tlc': item.color }}
            >
              <div className={`wz-agenda-check ${on ? 'on' : ''}`} />
              <div className="wz-agenda-time">
                <span className="wz-a-day">{item.day}</span>
                <span className="wz-a-hr" style={{ color: item.color }}>{item.time}</span>
              </div>
              <div className="wz-agenda-content">
                <h4 className="wz-a-label">{item.label}</h4>
                <p className="wz-a-desc">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="wz-nav">
        <button onClick={onBack} className="wz-btn-ghost">Atrás</button>
        <button onClick={onNext} disabled={!allAccepted} className="wz-btn-main">Aceptar Plazos</button>
      </div>
    </div>
  );
}
