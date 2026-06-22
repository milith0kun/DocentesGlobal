'use client';

import { marcaConfig } from '../config/wizard-config.js';

export default function StepSuccess({
  formData,
  generatedCode,
  submissionWarning,
  whatsappUrl,
  brandColor,
  onReset,
}) {
  return (
    <div className="wz-fade">
      <div className="wz-success-layout">
        <div className="wz-success-media" aria-hidden="true">
          <video
            src="/videos/hero-docente-alpha.webm"
            className="wz-success-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disableRemotePlayback
          />
        </div>
        <div className="wz-success-copy">
          <h1 className="wz-title" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem' }}>
            ¡Conformidad Registrada!
          </h1>
          <p
            className="wz-sub"
            style={{ textAlign: 'center', marginBottom: '1.2rem', fontSize: '0.95rem' }}
          >
            Tu conformidad ha sido registrada exitosamente. Para finalizar tu proceso, por favor envía el
            mensaje de confirmación a tu coordinador académico a través de WhatsApp.
          </p>
          <div className="wz-success-panel">
            <div className="wz-sum-row">
              <span>Código de Registro</span>
              <strong style={{ color: '#059669', fontSize: '1.1rem' }}>{generatedCode}</strong>
            </div>
            <div className="wz-sum-row">
              <span>Docente</span>
              <strong>{formData.nombre}</strong>
            </div>
            <div className="wz-sum-row" style={{ borderBottom: 'none' }}>
              <span>Institución</span>
              <strong style={{ color: brandColor }}>{marcaConfig[formData.marca]?.nombre}</strong>
            </div>
          </div>
          {submissionWarning && <p className="wz-success-note">{submissionWarning}</p>}
          <div className="wz-success-actions">
            <button
              type="button"
              onClick={() => whatsappUrl && window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
              className="wz-btn-main wz-btn-whatsapp"
              disabled={!whatsappUrl}
              style={{ fontSize: '1rem', padding: '0.85rem' }}
            >
              Enviar confirmación por WhatsApp
            </button>
            <button onClick={onReset} className="wz-btn-ghost">Volver al Inicio</button>
          </div>
        </div>
      </div>
    </div>
  );
}
