'use client';

const geominaWhite = '/assets/geomina-new.png';
const biomedicWhite = '/assets/biomedic-white.png';
const logobiomedic = '/assets/logobiomedic.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" style={{
      background: 'linear-gradient(180deg, rgba(6, 14, 26, 0) 0%, #060e1a 100%)',
      color: '#94a3b8',
      padding: '1.05rem 0 0.95rem',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Subtle line separator */}
      <div className="footer-separator" style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.1), transparent)',
        marginBottom: '0.85rem'
      }} />

      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.95rem'
        }} className="footer-bar-content">
          
          {/* Left Side: Copyright */}
          <p className="footer-copy" style={{ 
            fontSize: '0.74rem', 
            fontWeight: 500, 
            margin: 0, 
            color: '#cbd5e1',
            fontFamily: 'var(--font-body)'
          }}>
            © {currentYear} CIIP LATAM · Ecosistema Digital de Capacitación. Todos los derechos reservados.
          </p>

          {/* Right Side: Partner logos */}
          <div className="footer-partners">
            <img 
              src={biomedicWhite} 
              alt="CIIP" 
              className="footer-logo footer-logo-ciip"
            />
            <div className="footer-logo-sep" />
            <img 
              src={geominaWhite} 
              alt="Geomina" 
              className="footer-logo footer-logo-geomina"
            />
            <div className="footer-logo-sep" />
            <img 
              src={logobiomedic} 
              alt="Biomedic" 
              className="footer-logo footer-logo-biomedic"
            />
          </div>

        </div>
      </div>

      <style>{`
        .footer-bar-content {
          min-height: 36px;
        }

        .footer-logo {
          opacity: 0.7;
          object-fit: contain;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .footer-logo:hover {
          opacity: 0.95;
          transform: scale(1.04);
        }
        .footer-logo-ciip {
          height: 44px;
        }
        .footer-logo-geomina {
          height: 29px;
          margin-top: 2px;
        }
        .footer-logo-biomedic {
          height: 40px;
          filter: invert(1) hue-rotate(180deg) brightness(1.15) contrast(1.15) url(#remove-black-footer);
        }
        .footer-logo-sep {
          width: 72%;
          max-width: 146px;
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
        }

        @media (min-width: 1024px) {
          .footer-bar-content {
            flex-wrap: nowrap !important;
          }
          .footer-copy {
            max-width: 58ch;
          }
          .footer-partners {
            display: inline-flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;
            gap: 0.55rem;
            min-width: 210px;
          }
        }

        @media (max-width: 640px) {
          .site-footer {
            padding: 2rem 0 1.35rem !important;
            background: linear-gradient(180deg, rgba(6, 14, 26, 0) 0%, #09192a 28%, #050b14 100%) !important;
          }
          .footer-separator {
            margin-bottom: 1.1rem !important;
          }
          .footer-bar-content {
            flex-direction: column !important;
            text-align: center !important;
            justify-content: center !important;
            gap: 0.95rem !important;
          }
          .footer-partners {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0.9rem !important;
            width: 100%;
            max-width: 22rem;
            flex-wrap: nowrap;
            margin: 0 auto;
          }
          .footer-copy {
            max-width: 17.5rem;
            font-size: 0.76rem !important;
            line-height: 1.45 !important;
            color: #e2e8f0 !important;
          }
          .footer-logo {
            opacity: 0.92 !important;
            flex: 0 1 auto;
            object-fit: contain;
          }
          .footer-logo-ciip {
            height: 32px !important;
            max-width: 90px;
          }
          .footer-logo-geomina {
            height: 20px !important;
            max-width: 90px;
            margin-top: 2px !important;
          }
          .footer-logo-biomedic {
            height: 28px !important;
            max-width: 82px;
            filter: invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.15) url(#remove-black-footer) !important;
          }
          .footer-logo-sep {
            width: 1px !important;
            max-width: none !important;
            height: 16px !important;
            background: rgba(255, 255, 255, 0.16) !important;
          }
        }

        @media (max-width: 380px) {
          .footer-partners {
            gap: 0.7rem !important;
            max-width: 20rem;
          }
          .footer-logo-ciip {
            height: 28px !important;
            max-width: 80px;
          }
          .footer-logo-geomina {
            height: 18px !important;
            max-width: 80px;
            margin-top: 1px !important;
          }
          .footer-logo-biomedic {
            height: 25px !important;
            max-width: 70px;
            filter: invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.15) url(#remove-black-footer) !important;
          }
        }
      `}</style>
      <svg style={{ position:'absolute', width:0, height:0, pointerEvents:'none' }} width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg">
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
