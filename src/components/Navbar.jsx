'use client';

import { useState, useEffect } from 'react';

const logobiomedic = '/assets/biomedic-logo-white.png';
const geominaWhite = '/assets/geomina-new.png';
const ciipWhite = '/assets/ciip-white.png';
const cgbLogo = '/assets/cgb-logo-clean.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        .premium-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          font-family: var(--font-body);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(135deg, #060e1a 0%, #0a1e35 40%, #0c2844 100%);
          border-bottom: 1px solid rgba(56, 189, 248, 0.08);
          padding: 0.9rem 0;
        }

        .premium-navbar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .nav-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 clamp(0.75rem, 4vw, 1.5rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        /* ── Left: BCG Academy (General Institution) ── */
        .nav-cgb-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.2rem;
          flex-shrink: 0;
        }

        .nav-cgb-logo {
          height: clamp(44px, 5.5vw, 62px);
          width: auto;
          aspect-ratio: 1341 / 473;
          flex-shrink: 0;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.25));
          opacity: 0.97;
          transition: all 0.3s ease;
        }

        .nav-cgb-group:hover .nav-cgb-logo {
          opacity: 1;
          transform: scale(1.02);
          filter: drop-shadow(0 4px 16px rgba(56, 189, 248, 0.25));
        }

        .nav-cgb-tagline {
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: rgba(56, 189, 248, 0.7);
          padding-left: 2px;
          transition: color 0.3s ease;
        }

        .nav-cgb-group:hover .nav-cgb-tagline {
          color: rgba(56, 189, 248, 0.95);
        }

        /* ── Vertical Divider ── */
        .nav-main-sep {
          width: 1px;
          height: 36px;
          background: linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.30), transparent);
          margin: 0 clamp(0.6rem, 2vw, 1.2rem);
          flex-shrink: 0;
        }

        /* ── Right: Sub-brand logos ── */
        .nav-brands-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.2rem;
          flex-shrink: 0;
        }

        .nav-brands-label {
          font-size: 0.52rem;
          font-weight: 600;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: rgba(148, 163, 184, 0.7);
          transition: color 0.3s ease;
        }

        .nav-brands-wrapper:hover .nav-brands-label {
          color: rgba(148, 163, 184, 0.95);
        }

        .nav-logos-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: clamp(0.45rem, 2.2vw, 1rem);
          min-height: 44px;
          flex-shrink: 0;
        }

        .nav-logo-sep {
          width: 1px;
          height: 26px;
          background: linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.18), transparent);
        }

        .nav-partner-logo {
          width: auto;
          max-width: 22vw;
          object-fit: contain;
          opacity: 0.95;
          flex: 0 1 auto;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-partner-logo.logo-biomedic {
          height: 40px;
        }

        .nav-partner-logo.logo-geomina {
          height: 28px;
          margin-top: 3px;
        }

        .nav-partner-logo.logo-ciip {
          height: 44px;
        }

        .nav-partner-logo:hover {
          opacity: 1;
          transform: scale(1.06);
          filter: drop-shadow(0 4px 14px rgba(56, 189, 248, 0.3)) brightness(1.1);
        }

        .nav-partner-logo.logo-biomedic:hover {
          filter: invert(1) hue-rotate(180deg) brightness(1.3) contrast(1.1) url(#remove-black);
          opacity: 1;
          transform: scale(1.06);
        }

        .premium-navbar.scrolled {
          padding: 0.55rem 0;
          background: #060e1a;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          border-bottom-color: rgba(56, 189, 248, 0.15);
        }

        .premium-navbar.scrolled .nav-cgb-logo {
          height: clamp(34px, 4vw, 46px);
        }

        .premium-navbar.scrolled .nav-main-sep {
          height: 28px;
        }

        .premium-navbar.scrolled .logo-biomedic {
          height: 34px;
        }

        .premium-navbar.scrolled .logo-geomina {
          height: 24px;
        }

        .premium-navbar.scrolled .logo-ciip {
          height: 36px;
        }

        /* ── Responsive: Tablet ── */
        @media (max-width: 768px) {
          .premium-navbar { padding: 0.7rem 0; max-width: 100vw; overflow: hidden; }
          .nav-container { width: 100vw; max-width: 100vw; padding: 0 0.75rem; overflow: hidden; }

          .nav-cgb-logo {
            height: 38px;
          }

          .nav-main-sep {
            height: 28px;
            margin: 0 0.5rem;
          }

          .nav-logos-group {
            gap: 0.4rem;
          }

          .nav-logo-sep, .nav-brands-label { display: none; }

          .nav-partner-logo.logo-ciip { height: 34px; }
          .nav-partner-logo.logo-geomina { height: 22px; }
          .nav-partner-logo.logo-biomedic { height: 30px; }

          .nav-cgb-tagline {
            font-size: 0.5rem;
            letter-spacing: 1.6px;
          }
        }

        /* ── Responsive: Mobile ── */
        @media (max-width: 480px) {
          .premium-navbar { padding: 0.6rem 0; }
          .premium-navbar.scrolled { padding: 0.45rem 0; }
          .nav-container { padding: 0 0.4rem; overflow: hidden; }

          .nav-cgb-logo {
            height: 24px;
          }

          .nav-main-sep {
            height: 20px;
            margin: 0 0.3rem;
          }

          .nav-partner-logo.logo-ciip { height: 22px; max-width: 20vw; }
          .nav-partner-logo.logo-geomina { height: 14px; max-width: 18vw; }
          .nav-partner-logo.logo-biomedic { height: 18px; max-width: 20vw; }

          .nav-cgb-tagline {
            font-size: 0.4rem;
            letter-spacing: 0.8px;
          }
          
          .nav-logos-group { gap: 0.25rem; }
        }

        @media (max-width: 380px) {
          .nav-cgb-logo { height: 20px; }
          .nav-partner-logo.logo-ciip { height: 18px; }
          .nav-partner-logo.logo-geomina { height: 12px; }
          .nav-partner-logo.logo-biomedic { height: 15px; }
          .nav-main-sep { margin: 0 0.2rem; }
        }
      `}</style>

      <nav className={`premium-navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Navegación principal">
        <div className="nav-container">
          {/* BCG Academy – Institución General */}
          <div className="nav-cgb-group" role="banner" aria-label="BCG Academy">
            <img src={cgbLogo} alt="BCG Academy" className="nav-cgb-logo" />
            <span className="nav-cgb-tagline">Formando líderes en educación</span>
          </div>

          {/* Separador vertical */}
          <div className="nav-main-sep" aria-hidden="true"></div>

          {/* Sub-marcas */}
          <div className="nav-brands-wrapper">
            <span className="nav-brands-label">Nuestras Instituciones</span>
            <div className="nav-logos-group" aria-label="CIIP, Geomina, Biomedic">
              <img src={ciipWhite} alt="CIIP LATAM" className="nav-partner-logo logo-ciip" width="80" height="24" />
              <div className="nav-logo-sep" aria-hidden="true"></div>
              <img src={geominaWhite} alt="Geomina" className="nav-partner-logo logo-geomina" width="80" height="24" />
              <div className="nav-logo-sep" aria-hidden="true"></div>
              <img src={logobiomedic} alt="Biomedic" className="nav-partner-logo logo-biomedic" width="80" height="24" />
            </div>
          </div>
        </div>
      </nav>

      {/* SVG filter to remove black backgrounds from inverted logos */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="remove-black">
            <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              1 1 1 0 0
            "/>
          </filter>
        </defs>
      </svg>
    </>
  );
}
