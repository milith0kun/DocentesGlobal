'use client';

import { useState } from 'react';

export default function Filosofia() {
  const [activeIndex, setActiveIndex] = useState(0);

  const pilares = [
    {
      num: '01',
      title: '100% Práctico',
      desc: 'Prohibido el relleno teórico. Cada concepto debe ser demostrado resolviendo casos reales directamente en software.',
      detail: 'La clase debe sentirse como una experiencia de trabajo real: menos exposición pasiva, más demostración guiada y práctica aplicada.',
      image: '/assets/pilar-01.webp',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      )
    },
    {
      num: '02',
      title: 'Cero Relleno',
      desc: 'Nada de videos extensos ni PPTs saturados de texto. Acción pura sobre las herramientas digitales.',
      detail: 'El estudiante debe percibir avance en cada sesión. Priorizamos ejemplos concretos, ejercicios visibles y recursos claros.',
      image: '/assets/pilar-02.webp',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    },
    {
      num: '03',
      title: 'Control de Ritmo',
      desc: 'El docente domina el tiempo en aula. Los incidentes técnicos individuales no detienen el avance grupal.',
      detail: 'El liderazgo docente mantiene la energía del grupo, ordena las consultas y evita que la sesión pierda foco.',
      image: '/assets/pilar-03.webp',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    }
  ];

  const active = pilares[activeIndex];

  return (
    <section id="filosofia" className="filosofia-section">
      <div className="container">
        <div className="section-header filosofia-header">
          <span className="section-tag filosofia-tag">NUESTRA ESENCIA</span>
          <h2 className="section-title filosofia-title">
            Nuestra Filosofía: <span>Doing by Learning</span>
          </h2>
          <p className="section-desc filosofia-desc">
            Transformamos carreras mediante habilidades prácticas. Este manual establece el estándar de calidad educativa que nos posiciona como referentes en Latinoamérica.
          </p>
        </div>

        <div className="filosofia-layout">
          <div className="filosofia-pilares">
            {pilares.map((pilar, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={pilar.num}
                  type="button"
                  className={`pilar-card-premium ${isActive ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                >
                  <span className="pilar-number-premium">{pilar.num}</span>
                  <span className="pilar-icon-premium">{pilar.icon}</span>
                  <span className="pilar-copy">
                    <strong>{pilar.title}</strong>
                    <small>{pilar.desc}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <aside className="filosofia-preview" aria-live="polite">
            <div className="filosofia-preview-copy">
              <span>{active.num}</span>
              <h3>{active.title}</h3>
              <p>{active.detail}</p>
            </div>
            <img src={active.image} alt={`Vista del pilar ${active.title}`} loading="lazy" />
          </aside>
        </div>
      </div>

      <style>{`
        .filosofia-section {
          padding: 6.5rem 0;
        }
        .filosofia-header {
          margin-bottom: 3.2rem;
        }
        .filosofia-tag {
          background: rgba(14, 165, 233, 0.06);
          border-color: rgba(14, 165, 233, 0.15);
          color: #0ea5e9;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 2.5px;
        }
        .filosofia-title {
          font-size: 2.8rem;
          font-weight: 850;
          letter-spacing: -1.5px;
          margin-top: 1rem;
          font-family: var(--font-heading);
        }
        .filosofia-title span {
          background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .filosofia-desc {
          font-size: 1.15rem;
          color: #64748b;
          max-width: 680px;
          margin: 1.25rem auto 0;
          line-height: 1.7;
        }
        .filosofia-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(360px, 1fr);
          gap: 1.5rem;
          align-items: stretch;
        }
        .filosofia-pilares {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .pilar-card-premium {
          width: 100%;
          min-height: 118px;
          display: grid;
          grid-template-columns: auto auto minmax(0, 1fr);
          align-items: center;
          gap: 1rem;
          border: 1px solid rgba(224, 242, 254, 0.8);
          border-radius: 18px;
          padding: 1.15rem 1.2rem;
          background: rgba(255, 255, 255, 0.82);
          text-align: left;
          cursor: pointer;
          box-shadow: 0 10px 30px -18px rgba(2, 132, 199, 0.16);
          transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
        }
        .pilar-card-premium:hover,
        .pilar-card-premium.active {
          transform: translateX(4px);
          border-color: rgba(14, 165, 233, 0.42);
          background: #ffffff;
          box-shadow: 0 18px 42px -24px rgba(2, 132, 199, 0.34);
        }
        .pilar-number-premium {
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: 1.35rem;
          color: rgba(14, 165, 233, 0.42);
          line-height: 1;
        }
        .pilar-card-premium.active .pilar-number-premium {
          color: #0284c7;
        }
        .pilar-icon-premium {
          width: 3rem;
          height: 3rem;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0ea5e9;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(6, 182, 212, 0.05));
          border: 1px solid rgba(14, 165, 233, 0.12);
          transition: color 0.22s ease, background 0.22s ease, transform 0.22s ease;
        }
        .pilar-card-premium.active .pilar-icon-premium,
        .pilar-card-premium:hover .pilar-icon-premium {
          color: #fff;
          background: linear-gradient(135deg, #0284c7, #0ea5e9);
          transform: scale(1.04);
        }
        .pilar-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.38rem;
        }
        .pilar-copy strong {
          color: #1e293b;
          font-family: var(--font-heading);
          font-size: 1.08rem;
          font-weight: 820;
        }
        .pilar-copy small {
          color: #64748b;
          font-size: 0.88rem;
          font-weight: 500;
          line-height: 1.5;
        }
        .filosofia-preview {
          min-height: 100%;
          display: flex;
          flex-direction: row;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(224, 242, 254, 0.85);
          border-radius: 24px;
          background: #071728;
          box-shadow: 0 24px 54px -34px rgba(15, 23, 42, 0.42);
        }
        .filosofia-preview img {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.02);
        }
        .filosofia-preview-copy {
          width: 50%;
          flex: 0 0 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 1.5rem 1.75rem;
          background: linear-gradient(135deg, #071728 0%, #0d2c4c 100%);
          color: #fff;
        }
        .filosofia-preview-copy span {
          color: #67e8f9;
          font-size: 0.74rem;
          font-weight: 850;
          letter-spacing: 1px;
        }
        .filosofia-preview-copy h3 {
          margin: 0.32rem 0 0.5rem;
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 850;
        }
        .filosofia-preview-copy p {
          margin: 0;
          color: #cbd5e1;
          font-size: 0.92rem;
          line-height: 1.58;
          font-weight: 500;
        }
        @media (max-width: 992px) {
          .filosofia-section {
            padding: 5rem 0;
          }
          .filosofia-layout {
            grid-template-columns: 1fr;
          }
          .filosofia-preview {
            min-height: auto;
            flex-direction: column-reverse;
          }
          .filosofia-preview img {
            position: relative;
            width: 100%;
            height: auto;
            max-height: 280px;
            border-left: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }
          .filosofia-preview-copy {
            width: 100%;
            flex: auto;
          }
        }
        @media (max-width: 640px) {
          .filosofia-title {
            font-size: 2rem;
            letter-spacing: -0.5px;
          }
          .filosofia-desc {
            font-size: 0.98rem;
          }
          .pilar-card-premium {
            min-height: auto;
            grid-template-columns: auto minmax(0, 1fr);
            padding: 1rem;
          }
          .pilar-icon-premium {
            display: none;
          }
          .filosofia-preview {
            border-radius: 18px;
            flex-direction: column-reverse;
          }
          .filosofia-preview img {
            position: relative;
            width: 100%;
            height: auto;
            max-height: 220px;
            border-left: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
