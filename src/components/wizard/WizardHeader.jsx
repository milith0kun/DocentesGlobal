'use client';

import { ciipWhite, geominaWhite, biomedicLogoWhite, cgbLogo } from './config/wizard-config.js';

export default function WizardHeader({ step, formData, onClose }) {
  const mkLogo = (key, src, cls) => {
    const isSelected = formData.marca ? formData.marca.split(',').includes(key) : false;
    const isAmbosMode = formData.marca && formData.marca.split(',').length > 1;
    const opacity = step === 1 ? (!formData.marca ? 0.85 : isSelected ? 1 : 0.2) : 1;
    return (
      <img
        key={key}
        src={src}
        alt={key}
        className={`wz-logo ${cls || ''}`}
        style={{
          opacity,
          transition: 'all 0.4s ease',
          display: isAmbosMode ? 'inline-block' : 'inline-block',
        }}
      />
    );
  };

  const ciip = mkLogo('ciip', ciipWhite, 'lg-ciip');
  const geo = mkLogo('geomina', geominaWhite, 'lg-geo');
  const bio = mkLogo('biomedic', biomedicLogoWhite, 'lg-bio');
  const sep = (k) => <div key={k} className="wz-sep" />;

  const renderCenterLogos = () => {
    if (step > 1) {
      const arr = formData.marca ? formData.marca.split(',') : [];
      if (arr.length > 1) {
        return arr.flatMap((k, idx) => {
          const logo = k === 'ciip' ? ciip : k === 'geomina' ? geo : bio;
          if (idx > 0) return [<div key={`s${idx}`} className="wz-sep" />, logo];
          return [logo];
        });
      }
      return formData.marca === 'ciip' ? ciip : formData.marca === 'geomina' ? geo : bio;
    }
    return [ciip, sep('s1'), geo, sep('s2'), bio];
  };

  return (
    <header className="wz-header">
      <div className="wz-h-left">
        <img
          src={cgbLogo}
          alt="CGB Academy"
          style={{
            height: '46px',
            width: 'auto',
            objectFit: 'contain',
            flexShrink: 0,
            opacity: 0.95,
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
          }}
        />
      </div>
      <div className="wz-h-center">{renderCenterLogos()}</div>
      <div className="wz-h-right">
        <button
          onClick={onClose}
          className="wz-back"
          aria-label="Cerrar"
          style={{ fontSize: '0.9rem', fontWeight: 800 }}
        >
          ✕
        </button>
      </div>
    </header>
  );
}
