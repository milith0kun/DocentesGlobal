'use client';

const ciipLogo = '/assets/ciip-white.png';
const geominaLogo = '/assets/geomina-new.png';
const biomedicLogo = '/assets/biomedic-logo-white.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
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
          color: #ffffff;
          background: #092A60;
          padding: 1.6rem 0 1.2rem;
          border-top: 1px solid rgba(77, 196, 211, 0.2);
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
          align-items: center;
          min-height: 70px;
        }

        .footer-copy-block {
          display: grid;
          gap: 0.25rem;
        }

        .footer-kicker {
          color: #4DC4D3;
          font-family: var(--font-heading);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 1.6px;
          text-transform: uppercase;
        }

        .footer-copy {
          max-width: 58ch;
          margin: 0;
          color: rgba(255, 255, 255, 0.88);
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 500;
          line-height: 1.55;
        }

        .footer-partners {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: clamp(0.82rem, 1.5vw, 1.1rem);
          padding: 0.4rem 0 0.4rem clamp(1rem, 2vw, 1.55rem);
          border-left: 1px solid rgba(77, 196, 211, 0.2);
        }

        .footer-logo {
          display: block;
          width: auto;
          object-fit: contain;
          opacity: 0.9;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .footer-logo:hover {
          opacity: 1;
          transform: translateY(-1px);
        }

        .footer-logo-ciip {
          height: 38px;
        }

        .footer-logo-geomina {
          height: 26px;
        }

        .footer-logo-biomedic {
          height: 34px;
        }

        .footer-logo-sep {
          width: 1px;
          height: 24px;
          background: rgba(77, 196, 211, 0.25);
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
            display: none;
          }
        }

        @media (max-width: 480px) {
          .footer-kicker {
            font-size: 0.62rem;
          }

          .footer-copy {
            font-size: 0.74rem;
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
