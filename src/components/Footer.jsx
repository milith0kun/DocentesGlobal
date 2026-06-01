'use client';

const ciipLogo = '/assets/biomedic-white.png';
const geominaLogo = '/assets/geomina-new.png';
const biomedicLogo = '/assets/logobiomedic.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="container footer-container">
        <div className="footer-panel">
          <div className="footer-copy-block">
            <span className="footer-kicker">Manual Docente 2026</span>
            <p className="footer-copy">
              © {currentYear} CIIP LATAM · Ecosistema Digital de Capacitación. Todos los derechos reservados.
            </p>
          </div>

          <div className="footer-partners" aria-label="Instituciones aliadas">
            <img src={ciipLogo} alt="CIIP LATAM" className="footer-logo footer-logo-ciip" />
            <span className="footer-logo-sep" aria-hidden="true" />
            <img src={geominaLogo} alt="Geomina" className="footer-logo footer-logo-geomina" />
            <span className="footer-logo-sep" aria-hidden="true" />
            <img src={biomedicLogo} alt="Biomedic" className="footer-logo footer-logo-biomedic" />
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          position: relative;
          z-index: 10;
          overflow: hidden;
          color: #dbeafe;
          background:
            linear-gradient(180deg, rgba(7, 18, 31, 0) 0%, rgba(7, 18, 31, 0.34) 18%, rgba(7, 18, 31, 0.84) 52%, #06101d 100%),
            linear-gradient(135deg, #07121f 0%, #0a213a 58%, #06101d 100%);
          padding: 1.85rem 0 1.25rem;
          border-top: 0;
        }

        .footer-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(90% 42px at 50% 0%, rgba(56, 189, 248, 0.12), rgba(56, 189, 248, 0) 74%),
            linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0.1) 50%, rgba(56, 189, 248, 0) 100%),
            repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 84px);
          opacity: 0.72;
        }

        .footer-container {
          position: relative;
          z-index: 1;
          max-width: 1280px;
        }

        .footer-panel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: clamp(1rem, 3vw, 2.6rem);
          align-items: end;
          min-height: 92px;
        }

        .footer-copy-block {
          display: grid;
          gap: 0.32rem;
        }

        .footer-kicker {
          color: rgba(186, 230, 253, 0.9);
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 1.6px;
          text-transform: uppercase;
        }

        .footer-copy {
          max-width: 58ch;
          margin: 0;
          color: rgba(226, 232, 240, 0.88);
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 560;
          line-height: 1.55;
        }

        .footer-partners {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: clamp(0.82rem, 1.5vw, 1.1rem);
          padding: 0.78rem 0 0.78rem clamp(1rem, 2vw, 1.55rem);
          border-left: 1px solid rgba(186, 230, 253, 0.18);
        }

        .footer-logo {
          display: block;
          width: auto;
          object-fit: contain;
          opacity: 0.82;
          transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
        }

        .footer-logo:hover {
          opacity: 1;
          transform: translateY(-1px);
        }

        .footer-logo-ciip {
          height: 42px;
          filter: drop-shadow(0 8px 18px rgba(56, 189, 248, 0.12));
        }

        .footer-logo-geomina {
          height: 28px;
          margin-top: 2px;
          filter: drop-shadow(0 8px 18px rgba(56, 189, 248, 0.1));
        }

        .footer-logo-biomedic {
          height: 38px;
          filter: invert(1) hue-rotate(180deg) brightness(1.18) contrast(1.12) url(#remove-black-footer);
        }

        .footer-logo-sep {
          width: 1px;
          height: 28px;
          background: linear-gradient(180deg, transparent, rgba(186, 230, 253, 0.25), transparent);
        }

        @media (max-width: 768px) {
          .site-footer {
            padding: 1.45rem 0 1.25rem;
          }

          .footer-panel {
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
            min-height: auto;
            gap: 1rem;
          }

          .footer-copy {
            max-width: 22rem;
          }

          .footer-partners {
            border-left: 0;
            border-top: 1px solid rgba(186, 230, 253, 0.16);
            padding: 1rem 0 0;
            width: min(100%, 24rem);
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer-kicker {
            font-size: 0.62rem;
          }

          .footer-copy {
            font-size: 0.74rem;
          }

          .footer-partners {
            gap: 0.72rem;
          }

          .footer-logo-ciip {
            height: 31px;
            max-width: 88px;
          }

          .footer-logo-geomina {
            height: 19px;
            max-width: 82px;
          }

          .footer-logo-biomedic {
            height: 27px;
            max-width: 78px;
          }

          .footer-logo-sep {
            height: 18px;
          }
        }
      `}</style>

      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="remove-black-footer">
            <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              1.2 1.2 1.2 0 -0.15
            "/>
          </filter>
        </defs>
      </svg>
    </footer>
  );
}
