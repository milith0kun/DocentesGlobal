import React, { useState, useEffect } from 'react';
import logociip from '../assets/logociip.png';
import logobiomedic from '../assets/logobiomedic.png';
import geominaWhite from '../assets/geomina-new.png';
import biomedicWhite from '../assets/biomedic-white.png';

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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .premium-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(135deg, #060e1a 0%, #0a1e35 40%, #0c2844 100%);
          border-bottom: 1px solid rgba(56, 189, 248, 0.08);
          padding: 1.25rem 0;
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
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center; /* Centrado absoluto de los logos para un diseño simétrico premium */
          position: relative;
          z-index: 1;
        }

        .nav-logos-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          min-height: 44px;
          flex-shrink: 0;
        }

        .nav-logo-sep {
          width: 1px;
          height: 32px;
          background: linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.25), transparent);
        }

        .nav-partner-logo {
          width: auto;
          object-fit: contain;
          opacity: 0.92;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-partner-logo.logo-biomedic {
          height: 50px;
          filter: invert(1) hue-rotate(180deg) brightness(1.15) contrast(1.1) url(#remove-black);
        }

        .nav-partner-logo.logo-geomina {
          height: 35px;
          margin-top: 5px;
        }

        .nav-partner-logo.logo-ciip {
          height: 56px;
        }

        .nav-partner-logo:hover {
          opacity: 1;
          transform: scale(1.06);
          filter: drop-shadow(0 4px 14px rgba(56, 189, 248, 0.3)) brightness(1.1);
        }

        .nav-partner-logo.logo-biomedic:hover {
          filter: invert(1) hue-rotate(180deg) brightness(1.3) contrast(1.1) drop-shadow(0 4px 14px rgba(56, 189, 248, 0.3)) url(#remove-black);
          opacity: 1;
          transform: scale(1.06);
        }

        .premium-navbar.scrolled {
          padding: 0.75rem 0;
          background: #060e1a;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          border-bottom-color: rgba(56, 189, 248, 0.15);
        }

        .premium-navbar.scrolled .logo-biomedic {
          height: 43px;
        }

        .premium-navbar.scrolled .logo-geomina {
          height: 29px;
        }

        .premium-navbar.scrolled .logo-ciip {
          height: 44px;
        }

        @media (max-width: 768px) {
          .nav-partner-logo.logo-biomedic { height: 38px; }
          .nav-partner-logo.logo-geomina { height: 27px; }
          .nav-partner-logo.logo-ciip { height: 42px; }
          .nav-logo-sep { height: 24px; }
        }
      `}</style>

      <nav className={`premium-navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Navegación principal">
        <div className="nav-container">
          <div className="nav-logos-group" role="banner" aria-label="CIIP, Geomina, Biomedic">
            <img src={biomedicWhite} alt="CIIP LATAM" className="nav-partner-logo logo-ciip" width="80" height="24" />
            <div className="nav-logo-sep" aria-hidden="true"></div>
            <img src={geominaWhite} alt="Geomina" className="nav-partner-logo logo-geomina" width="80" height="24" />
            <div className="nav-logo-sep" aria-hidden="true"></div>
            <img src={logobiomedic} alt="Biomedic" className="nav-partner-logo logo-biomedic" width="80" height="24" />
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
