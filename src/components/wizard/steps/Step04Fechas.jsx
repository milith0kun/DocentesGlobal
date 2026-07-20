'use client';

import { DELIVERY_DEADLINES } from '@/lib/delivery-deadlines';

export default function Step04Fechas({ formData, setFormData, onNext, onBack }) {
  const allAccepted = formData.aceptaSabado && formData.aceptaDomingo && formData.aceptaLunes;

  return (
    <div className="wz-fade">
      <h2 className="wz-title">Compromiso de Entrega y Calidad Académica</h2>
      <p className="wz-sub">
        Como integrante de nuestro selecto equipo docente CGB, tu liderazgo y profesionalismo son el motor
        de nuestro estándar de excelencia. Para asegurar que el equipo de soporte valide tus recursos y nuestros
        estudiantes accedan a sus materiales a tiempo, asumimos juntos el compromiso de cumplir con los siguientes plazos:
      </p>

      <div className="wz-agenda">
        {DELIVERY_DEADLINES.map((item, i) => {
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
                <p className="wz-a-desc">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="wz-nav">
        <button onClick={onBack} className="wz-btn-ghost">Atrás</button>
        <button onClick={onNext} disabled={!allAccepted} className="wz-btn-main">Siguiente</button>
      </div>
    </div>
  );
}
