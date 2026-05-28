import React from 'react';
import geominaWhite from '../assets/geomina-new.png';
import biomedicWhite from '../assets/biomedic-white.png';
import logobiomedic from '../assets/logobiomedic.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(180deg, rgba(6, 14, 26, 0) 0%, #060e1a 100%)',
      color: '#94a3b8',
      padding: '3rem 0 2rem',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Subtle line separator */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.1), transparent)',
        marginBottom: '2rem'
      }} />

      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }} className="footer-bar-content">
          
          {/* Left Side: Copyright */}
          <p style={{ 
            fontSize: '0.82rem', 
            fontWeight: 500, 
            margin: 0, 
            color: '#cbd5e1',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            © {currentYear} CIIP LATAM · Ecosistema Digital de Capacitación. Todos los derechos reservados.
          </p>

          {/* Right Side: Partners inline (sutil y sin botones redundantes) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.25rem' 
          }}>
            <img 
              src={biomedicWhite} 
              alt="CIIP" 
              style={{ height: '18px', opacity: 0.65, objectFit: 'contain' }} 
            />
            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.06)' }} />
            <img 
              src={geominaWhite} 
              alt="Geomina" 
              style={{ height: '18px', opacity: 0.65, objectFit: 'contain' }} 
            />
            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.06)' }} />
            <img 
              src={logobiomedic} 
              alt="Biomedic" 
              style={{ 
                height: '14px', 
                opacity: 0.65, 
                objectFit: 'contain',
                filter: 'invert(1) hue-rotate(180deg) brightness(1.15) contrast(1.1) url(#remove-black)'
              }} 
            />
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .footer-bar-content {
            flex-direction: column !important;
            text-align: center !important;
            justify-content: center !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
