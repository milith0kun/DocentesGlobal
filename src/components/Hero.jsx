import React from 'react';
import mascot from '../assets/ciip-latam.png';

export default function Hero({ onStartWizard }) {
  const handleStart = () => {
    const el = document.getElementById('filosofia');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" style={{ textAlign: 'left', padding: '11rem 0 7rem' }}>
      {/* Animated gradient background with multiple glowing orbs */}
      <div className="hero-background">
        <div className="bg-glow glow-1" style={{
          width: '550px', height: '550px', top: '-15%', left: '5%', opacity: 0.4,
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div className="bg-glow glow-2" style={{
          width: '600px', height: '600px', bottom: '-10%', right: '5%', opacity: 0.3,
          animation: 'float 10s ease-in-out infinite reverse'
        }} />
        {/* Extra ambient orb */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%', width: '350px', height: '350px',
          borderRadius: '50%', filter: 'blur(140px)', opacity: 0.2, pointerEvents: 'none',
          background: 'radial-gradient(circle, hsl(199, 89%, 48%) 0%, rgba(255,255,255,0) 70%)',
          animation: 'float 12s ease-in-out infinite 2s', zIndex: -1
        }} />
        {/* Subtle mesh grid overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(14,165,233,0.03) 1px, transparent 0)',
          backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: -1
        }} />
      </div>

      <div className="container hero-container">
        <div style={{
          display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '4rem',
          alignItems: 'center', minHeight: '480px'
        }}>
          {/* Left: Text Content */}
          <div className="hero-content" style={{ maxWidth: 'none', margin: 0 }}>
            <span className="hero-badge" style={{
              background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(14,165,233,0.2)',
              boxShadow: '0 4px 20px -4px rgba(14,165,233,0.12)',
              fontSize: '0.72rem', letterSpacing: '2.5px', fontWeight: '800'
            }}>
              ✦ ESTÁNDAR OPERATIVO 2026
            </span>
            <h1 className="hero-title" style={{
              fontSize: '4.2rem', lineHeight: 1.05, letterSpacing: '-3px',
              marginBottom: '2rem', fontFamily: 'var(--font-heading)'
            }}>
              Manual Digital{' '}
              <br />
              <span className="animated-gradient-text">
                Docente de Excelencia
              </span>
            </h1>
            <p className="hero-subtitle" style={{
              fontSize: '1.25rem', lineHeight: 1.75, margin: '0 0 2.25rem 0',
              maxWidth: '580px', color: '#475569', fontWeight: '500'
            }}>
              Guía oficial de estándares metodológicos, de imagen y calidad para el ecosistema educativo de{' '}
              <strong className="partner-name-hero" style={{ color: '#0369a1', fontWeight: '750', cursor: 'default', transition: 'color 0.2s' }}>CIIP Latam</strong>,{' '}
              <strong className="partner-name-hero" style={{ color: '#0369a1', fontWeight: '750', cursor: 'default', transition: 'color 0.2s' }}>Geomina</strong> y{' '}
              <strong className="partner-name-hero" style={{ color: '#0369a1', fontWeight: '750', cursor: 'default', transition: 'color 0.2s' }}>Biomedic</strong>.
            </p>

            <div className="hero-actions" style={{ justifyContent: 'flex-start', gap: '1.25rem', marginTop: '0.5rem' }}>
              <button onClick={onStartWizard} className="btn-primary-hero-premium">
                <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Comenzar Manual
                  <span className="btn-arrow-premium">→</span>
                </span>
                <span className="btn-shine"></span>
              </button>
            </div>
          </div>

          {/* Right: Mascot Illustration */}
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            position: 'relative'
          }}>
            {/* Decorative ring behind mascot */}
            <div style={{
              position: 'absolute', width: '380px', height: '380px',
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, rgba(14,165,233,0.08), rgba(6,182,212,0.12), rgba(14,165,233,0.04), rgba(6,182,212,0.1), rgba(14,165,233,0.08))',
              animation: 'heroSpin 20s linear infinite'
            }} />
            {/* Glow behind mascot */}
            <div style={{
              position: 'absolute', width: '280px', height: '280px',
              borderRadius: '50%', filter: 'blur(60px)',
              background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, rgba(6,182,212,0.1) 50%, transparent 70%)'
            }} />
            {/* Floating particles */}
            {[
              { size: 6, top: '15%', left: '20%', delay: '0s', dur: '5s' },
              { size: 4, top: '70%', left: '15%', delay: '1.5s', dur: '6s' },
              { size: 5, top: '25%', right: '12%', delay: '0.8s', dur: '7s' },
              { size: 3, top: '75%', right: '20%', delay: '2s', dur: '5.5s' },
              { size: 7, top: '50%', left: '8%', delay: '3s', dur: '8s' },
            ].map((p, i) => (
              <div key={i} style={{
                position: 'absolute', width: p.size, height: p.size,
                borderRadius: '50%', background: 'rgba(14,165,233,0.35)',
                top: p.top, left: p.left, right: p.right,
                animation: `float ${p.dur} ease-in-out infinite ${p.delay}`,
                boxShadow: '0 0 8px rgba(14,165,233,0.3)'
              }} />
            ))}
            {/* The Mascot */}
            <div className="mascot-shadow" />
            <img
              src={mascot}
              alt="Mascota CIIP Latam"
              style={{
                width: '340px',
                height: 'auto',
                position: 'relative',
                zIndex: 2,
                animation: 'heroFloat 5s ease-in-out infinite',
                filter: 'drop-shadow(0 15px 30px rgba(3,105,161,0.18))'
              }}
            />
          </div>
        </div>
      </div>

      {/* Styles injected via style tag */}
       <style>{`
        .animated-gradient-text {
          background: linear-gradient(
            135deg, 
            #0369a1 0%, 
            #0ea5e9 30%, 
            #06b6d4 50%, 
            #0ea5e9 70%, 
            #0369a1 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: textShimmer 4.5s linear infinite;
        }

        .btn-primary-hero-premium {
          padding: 0.95rem 2.4rem;
          font-size: 0.98rem;
          border-radius: 15px;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          color: #fff;
          font-weight: 700;
          background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%);
          box-shadow: 0 10px 24px -6px rgba(14,165,233,0.4);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-primary-hero-premium:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 16px 36px -8px rgba(14, 165, 233, 0.5),
            0 0 0 1.5px rgba(14, 165, 233, 0.2) !important;
          background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
        }

        .btn-primary-hero-premium:hover .btn-arrow-premium {
          transform: translateX(4px);
        }

        .btn-arrow-premium {
          display: inline-block;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
          );
          transition: 0.6s;
        }

        .btn-primary-hero-premium:hover .btn-shine {
          left: 100%;
        }

        .btn-secondary-hero-premium:hover {
          background: #ffffff !important;
          border-color: rgba(14, 165, 233, 0.4) !important;
          color: #0284c7 !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -6px rgba(14,165,233,0.12) !important;
        }

        .mascot-shadow {
          position: absolute;
          bottom: 25px;
          width: 200px;
          height: 16px;
          background: rgba(3, 105, 161, 0.16);
          border-radius: 50%;
          filter: blur(8px);
          z-index: 1;
          animation: shadowScale 5s ease-in-out infinite;
        }

        @keyframes shadowScale {
          0%, 100% { transform: scale(1); opacity: 0.65; }
          50% { transform: scale(0.72); opacity: 0.28; filter: blur(12px); }
        }

        @keyframes textShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }

        @keyframes heroSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .hero-section {
            padding: 8rem 0 4rem !important;
          }
          .hero-section .hero-container > div {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 4rem !important;
          }
          .hero-section .hero-content {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-section .hero-actions {
            justify-content: center !important;
          }
          .hero-section .hero-title {
            font-size: 3rem !important;
            letter-spacing: -2px !important;
          }
          .hero-section .hero-subtitle {
            margin: 0 auto 3rem !important;
            text-align: center;
          }
          .mascot-shadow {
            bottom: 15px;
          }
        }

        @media (max-width: 768px) {
          .hero-section .hero-title {
            font-size: 2.5rem !important;
            letter-spacing: -1.5px !important;
          }
          .hero-section img[alt="Mascota CIIP Latam"] {
            width: 260px !important;
          }
          .mascot-shadow {
            width: 140px;
            bottom: 10px;
          }
        }
        
        @media (max-width: 480px) {
          .hero-section .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          .btn-primary-hero-premium, .btn-secondary-hero-premium {
            width: 100%;
            justify-content: center;
            text-align: center;
          }
        }

        .partner-name-hero:hover {
          color: #0ea5e9 !important;
          text-shadow: 0 0 12px rgba(14, 165, 233, 0.25);
        }
      `}</style>
    </section>
  );
}
