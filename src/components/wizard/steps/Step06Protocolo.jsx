'use client';

import { camaraFondoVirtual, identidadVisualPpts, canalesExternosProhibidos } from '../config/wizard-config.js';

export default function Step06Protocolo({ formData, setFormData, onNext, onBack, activeProtocol, setActiveProtocol }) {
  const items = [
    {
      title: 'Cámara y Fondo Virtual',
      desc: 'Cámara encendida toda la sesión con uso exclusivo del fondo institucional proporcionado.',
      req: true,
      imgStr: camaraFondoVirtual,
    },
    {
      title: 'Identidad Visual en PPTs',
      desc: 'Los logos de CIIP, Geomina o Biomedic deben estar presentes de forma obligatoria en cada material entregado.',
      req: true,
      imgStr: identidadVisualPpts,
    },
    {
      title: 'Canales Externos Prohibidos',
      desc: 'Queda estrictamente prohibido crear grupos paralelos de WhatsApp o Telegram con los alumnos.',
      req: false,
      imgStr: canalesExternosProhibidos,
    },
  ];

  const protocolImages = [camaraFondoVirtual, identidadVisualPpts, canalesExternosProhibidos];
  const protocolAlts = ['Cámara y Fondo Virtual', 'Identidad Visual en PPTs', 'Canales Externos Prohibidos'];

  return (
    <div className="wz-fade">
      <h2 className="wz-title">Protocolo de Imagen & Comunicación</h2>
      <p className="wz-sub">Eres el rostro de nuestra marca para toda Latinoamérica. Confiamos en su profesionalismo.</p>

      <div className="wz-protocol-split">
        <div className="wz-protocol-list-container">
          {items.map((item, i) => (
            <div key={i} className="wz-protocol-slide">
              <img src={item.imgStr} alt={item.title} className="wz-mobile-carousel-img" />
              <div
                className={`wz-protocol-item ${activeProtocol === i ? 'active' : ''}`}
                onMouseEnter={() => setActiveProtocol(i)}
                onClick={() => setActiveProtocol(i)}
              >
                <div className="wz-pi-header">
                  <h4 className="wz-pi-title">{item.title}</h4>
                  <span className={`wz-cl-tag ${item.req ? 'req' : 'ban'}`}>
                    {item.req ? 'Obligatorio' : 'Prohibido'}
                  </span>
                </div>
                <p className="wz-pi-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="wz-protocol-image-container">
          <img
            src={protocolImages[activeProtocol]}
            alt={protocolAlts[activeProtocol]}
            className="wz-pi-image fade-in"
          />
        </div>
      </div>

      <div
        className={`wz-check-row ${formData.aceptaProtocolo ? 'on' : ''}`}
        style={{ marginTop: '0.5rem' }}
        onClick={() => setFormData({ ...formData, aceptaProtocolo: !formData.aceptaProtocolo })}
      >
        <div className={`wz-checkbox ${formData.aceptaProtocolo ? 'on' : ''}`} />
        <span>He leído, comprendo y acepto el protocolo de imagen y comunicación.</span>
      </div>

      <div className="wz-nav">
        <button onClick={onBack} className="wz-btn-ghost">Atrás</button>
        <button onClick={onNext} disabled={!formData.aceptaProtocolo} className="wz-btn-main">Aceptar Protocolo</button>
      </div>
    </div>
  );
}
