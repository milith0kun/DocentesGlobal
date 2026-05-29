'use client';

const mascot = '/assets/ciip-latam.png';

export default function Hero({ onStartWizard }) {
  return (
    <section className="hero-section home-hero clean-hero">
      <div className="hero-clean-bg" aria-hidden="true" />

      <div className="container hero-container">
        <div className="home-hero-grid">
          <div className="hero-copy">
            <span className="hero-badge">2026</span>

            <h1 className="hero-title">
              Manual Digital
              <br />
              <span className="hero-title-accent">Docente de Excelencia</span>
            </h1>

            <p className="hero-subtitle">
              Guía oficial de estándares metodológicos, de imagen y calidad para el ecosistema educativo de CIIP
              Latam, Geomina y Biomedic.
            </p>

            <button type="button" onClick={onStartWizard} className="hero-cta">
              <span>Comenzar Manual</span>
            </button>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual-frame">
              <img src={mascot} alt="Mascota CIIP Latam" className="hero-mascot" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .clean-hero {
          position: relative;
          min-height: 100%;
          display: flex;
          align-items: center;
          overflow: hidden;
          text-align: left;
          padding: clamp(4.8rem, 6vw, 5.9rem) 0 clamp(0.4rem, 1vw, 0.85rem) !important;
        }

        .hero-clean-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(80% 60% at 18% 8%, rgba(56, 189, 248, 0.14) 0%, rgba(56, 189, 248, 0) 58%),
            radial-gradient(54% 44% at 88% 82%, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0) 72%);
        }

        .clean-hero .hero-container {
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .clean-hero .home-hero-grid {
          min-height: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(250px, 0.92fr);
          gap: clamp(1.4rem, 2.8vw, 2.4rem);
          align-items: center;
        }

        .clean-hero .hero-copy {
          max-width: 640px;
        }

        .clean-hero .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding: 0.38rem 0.72rem;
          border-radius: 999px;
          border: 1px solid rgba(15, 47, 82, 0.14);
          background: rgba(255, 255, 255, 0.72);
          color: #0f2f52;
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 1.3px;
          margin-bottom: 0.88rem;
        }

        .clean-hero .hero-title {
          margin: 0 0 0.95rem;
          color: #0f172a;
          font-family: var(--font-heading);
          font-size: clamp(2.45rem, 3.2vw, 3.25rem);
          line-height: 1.04;
          letter-spacing: 0;
          font-weight: 760;
        }

        .clean-hero .hero-title-accent {
          color: #124a74;
        }

        .clean-hero .hero-subtitle {
          margin: 0 0 1.2rem;
          max-width: 560px;
          color: #475569;
          font-size: 1rem;
          line-height: 1.6;
          font-weight: 520;
        }

        .clean-hero .hero-badge,
        .clean-hero .hero-title,
        .clean-hero .hero-subtitle,
        .clean-hero .hero-cta {
          opacity: 0;
          transform: translateY(8px);
          animation: heroFadeUp 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .clean-hero .hero-badge {
          animation-delay: 60ms;
        }

        .clean-hero .hero-title {
          animation-delay: 130ms;
        }

        .clean-hero .hero-subtitle {
          animation-delay: 200ms;
        }

        .clean-hero .hero-cta {
          animation-delay: 270ms;
        }

        .clean-hero .hero-cta {
          min-height: 48px;
          min-width: clamp(210px, 23vw, 250px);
          border: 1px solid #0f3356;
          border-radius: 12px;
          background: #0f2f52;
          color: #f7fbff;
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.1px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.58rem 1.05rem;
          box-shadow: 0 2px 8px rgba(15, 47, 82, 0.16);
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }

        .clean-hero .hero-cta:hover {
          transform: translateY(-1px);
          background: #144068;
          border-color: #16466f;
        }

        .clean-hero .hero-cta:active {
          transform: translateY(0);
          background: #0d2844;
        }

        .clean-hero .hero-cta:focus-visible {
          outline: none;
          box-shadow:
            0 0 0 2px rgba(255, 255, 255, 0.95),
            0 0 0 4px rgba(15, 47, 82, 0.32);
        }

        .clean-hero .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: clamp(220px, 25vw, 310px);
        }

        .clean-hero .hero-visual-frame {
          width: clamp(190px, 24vw, 292px);
          aspect-ratio: 1;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 42%, rgba(14, 165, 233, 0.18) 0%, rgba(14, 165, 233, 0.06) 62%, rgba(14, 165, 233, 0) 100%);
          box-shadow: inset 0 0 0 1px rgba(14, 116, 144, 0.08);
          opacity: 0;
          transform: translateY(10px) scale(0.985);
          animation: heroFadeScale 640ms cubic-bezier(0.16, 1, 0.3, 1) 180ms forwards;
        }

        .clean-hero .hero-mascot {
          width: 100%;
          max-width: clamp(170px, 20vw, 250px);
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 14px 26px rgba(14, 116, 144, 0.18));
          animation: heroBob 6s ease-in-out 900ms infinite;
        }

        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroFadeScale {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes heroBob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .clean-hero .hero-badge,
          .clean-hero .hero-title,
          .clean-hero .hero-subtitle,
          .clean-hero .hero-cta,
          .clean-hero .hero-visual-frame,
          .clean-hero .hero-mascot {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        @media (max-width: 992px) {
          .clean-hero {
            padding: 6.35rem 0 2rem !important;
          }

          .clean-hero .home-hero-grid {
            grid-template-columns: 1fr;
            gap: 1.8rem;
            text-align: center;
          }

          .clean-hero .hero-copy {
            margin: 0 auto;
          }

          .clean-hero .hero-title {
            font-size: clamp(2.3rem, 8.4vw, 2.95rem);
          }

          .clean-hero .hero-subtitle {
            margin: 0 auto 1.2rem;
            max-width: 620px;
          }
        }

        @media (max-width: 640px) {
          .clean-hero {
            padding: 6.15rem 0 1.55rem !important;
            max-width: 100vw;
            overflow-x: clip;
          }

          .clean-hero .hero-container,
          .clean-hero .home-hero-grid,
          .clean-hero .hero-copy {
            max-width: 100%;
            min-width: 0;
          }

          .clean-hero .hero-copy {
            padding: 0 0.1rem;
          }

          .clean-hero .hero-title {
            width: 100%;
            max-width: 20rem;
            margin: 0 auto 0.78rem;
            font-size: clamp(1.85rem, 9.4vw, 2.3rem);
            overflow-wrap: break-word;
          }

          .clean-hero .hero-subtitle {
            max-width: 21rem;
            margin: 0 auto 1.02rem;
            font-size: 0.98rem;
            line-height: 1.55;
            overflow-wrap: break-word;
          }

          .clean-hero .hero-cta {
            width: min(100%, 19rem);
            max-width: 316px;
            min-width: 0;
            margin: 0 auto;
          }

          .clean-hero .hero-visual {
            min-height: 168px;
          }

          .clean-hero .hero-visual-frame {
            width: 186px;
          }

          .clean-hero .hero-mascot {
            max-width: 154px;
          }
        }
      `}</style>
    </section>
  );
}
