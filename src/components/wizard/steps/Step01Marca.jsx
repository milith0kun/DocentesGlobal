'use client';

import { ciipWhite, geominaWhite, biomedicLogoWhite, marcaConfig } from '../config/wizard-config.js';

export default function Step01Marca({ formData, setFormData, onNext, onClose }) {
  const toggleMarca = (key) => {
    let selected = formData.marca ? formData.marca.split(',') : [];
    if (selected.includes(key)) {
      selected = selected.filter((k) => k !== key);
    } else {
      if (selected.length < 2) {
        selected.push(key);
      }
    }
    setFormData({ ...formData, marca: selected.join(',') });
  };

  return (
    <div className="wz-fade">
      <h2 className="wz-title" style={{ textAlign: 'center' }}>Selecciona tu Institución</h2>
      <p className="wz-sub" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        Elige la institución a la que perteneces (puedes marcar hasta 2 opciones).
      </p>

      <div className="custom-brand-list" style={{ maxWidth: '100%', margin: '0 auto' }}>
        {[
          { key: 'ciip', logo: ciipWhite },
          { key: 'geomina', logo: geominaWhite },
          { key: 'biomedic', logo: biomedicLogoWhite },
        ].map((b) => {
          const on = formData.marca && formData.marca.split(',').includes(b.key);
          return (
            <div
              key={b.key}
              onClick={() => toggleMarca(b.key)}
              className={`custom-brand-card ${on ? 'on' : ''}`}
              style={{ '--bc': marcaConfig[b.key]?.color }}
            >
              <img src={b.logo} alt={b.key} className={`lg-${b.key}-btn`} style={{ filter: 'none' }} />
            </div>
          );
        })}
      </div>

      <div className="wz-nav">
        <button onClick={onClose} className="wz-btn-ghost">Cancelar</button>
        <button onClick={onNext} disabled={!formData.marca} className="wz-btn-main">Continuar</button>
      </div>
    </div>
  );
}
