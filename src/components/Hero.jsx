import mascot from '../assets/ciip-latam.png';

export default function Hero({ onStartWizard }) {
  return (
    <section className="hero-section home-hero">
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
        <div className="home-hero-grid">
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
              fontSize: '4.2rem', lineHeight: 1.05, letterSpacing: 0,
              marginBottom: '2rem', fontFamily: 'var(--font-heading)'
            }}>
              Manual Digital{' '}
              <br className="hero-title-break" />
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
                <span className="btn-label-wrap">
                  <span>Comenzar Manual</span>
                  <span className="btn-arrow-pill" aria-hidden="true">
                    <span className="btn-arrow-premium">-&gt;</span>
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Right: Mascot Illustration */}
          <div className="hero-visual">
            {/* Decorative ring behind mascot */}
            <div className="hero-visual-ring" style={{
              position: 'absolute',
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, rgba(14,165,233,0.08), rgba(6,182,212,0.12), rgba(14,165,233,0.04), rgba(6,182,212,0.1), rgba(14,165,233,0.08))',
              animation: 'heroSpin 20s linear infinite'
            }} />
            {/* Glow behind mascot */}
            <div className="hero-visual-glow" style={{
              position: 'absolute',
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
              className="home-hero-mascot"
              style={{
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
        .home-hero {
          text-align: left;
          padding: clamp(5.15rem, 6.8vw, 6.5rem) 0 clamp(0.85rem, 1.8vw, 1.35rem) !important;
        }

        .home-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(250px, 0.9fr);
          gap: clamp(1.5rem, 3vw, 2.6rem);
          align-items: center;
          min-height: calc(100svh - 188px);
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          min-height: clamp(220px, 26vw, 320px);
          overflow: visible;
        }

        .hero-visual-ring {
          width: clamp(190px, 24vw, 285px);
          height: clamp(190px, 24vw, 285px);
        }

        .hero-visual-glow {
          width: clamp(145px, 18vw, 220px);
          height: clamp(145px, 18vw, 220px);
        }

        .home-hero-mascot {
          width: clamp(190px, 23vw, 260px);
        }

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
          min-width: clamp(212px, 24vw, 258px);
          min-height: 52px;
          padding: 0.65rem 0.9rem 0.65rem 1.22rem;
          font-size: 0.95rem;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          color: #fff;
          font-weight: 800;
          letter-spacing: 0;
          background: linear-gradient(135deg, #046993 0%, #0a83bb 55%, #109bcf 100%);
          box-shadow:
            0 8px 20px -8px rgba(2, 132, 199, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.16),
            inset 0 -1px 0 rgba(3, 105, 161, 0.3);
          transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
        }

        .btn-label-wrap {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.66rem;
          white-space: nowrap;
        }

        .btn-arrow-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.45rem;
          height: 1.45rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.26);
          flex-shrink: 0;
        }

        .btn-primary-hero-premium::after {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: 17px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          pointer-events: none;
        }

        .btn-primary-hero-premium:hover {
          transform: translateY(-1px);
          box-shadow:
            0 12px 22px -9px rgba(14, 165, 233, 0.44),
            0 0 0 1px rgba(14, 165, 233, 0.2);
          background: linear-gradient(135deg, #0674a2 0%, #0d90ca 55%, #14a6d9 100%);
        }

        .btn-primary-hero-premium:focus-visible {
          outline: none;
          box-shadow:
            0 0 0 2px rgba(255, 255, 255, 0.92),
            0 0 0 4px rgba(14, 165, 233, 0.38),
            0 10px 22px -10px rgba(2, 132, 199, 0.48);
        }

        .btn-primary-hero-premium:active {
          transform: translateY(0);
          box-shadow:
            0 6px 14px -8px rgba(2, 132, 199, 0.45),
            inset 0 2px 7px rgba(7, 89, 133, 0.2);
        }

        .btn-primary-hero-premium:hover .btn-arrow-premium {
          transform: translateX(2px);
        }

        .btn-arrow-premium {
          display: inline-block;
          font-size: 0.9rem;
          line-height: 1;
          transition: transform 0.2s ease;
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

        @media (min-width: 1024px) {
          .home-hero .hero-badge {
            margin-bottom: 1.1rem !important;
          }
          .home-hero .hero-title {
            font-size: clamp(2.7rem, 3.3vw, 3.45rem) !important;
            line-height: 1.04 !important;
            margin-bottom: 1.05rem !important;
          }
          .home-hero .hero-subtitle {
            font-size: 1.02rem !important;
            line-height: 1.58 !important;
            max-width: 540px !important;
            margin-bottom: 1.2rem !important;
          }
        }

        @media (max-width: 992px) {
          .hero-section {
            padding: 6.45rem 0 2.3rem !important;
          }
          .hero-section .hero-container > div {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 2.1rem !important;
            min-height: auto;
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
            font-size: 2.75rem !important;
            letter-spacing: 0 !important;
          }
          .hero-section .hero-subtitle {
            margin: 0 auto 2rem !important;
            text-align: center;
          }
          .mascot-shadow {
            bottom: 15px;
          }
        }

        @media (max-width: 768px) {
          .home-hero {
            padding-top: 6.6rem !important;
            padding-bottom: 1.6rem !important;
          }
          .hero-section .hero-title {
            font-size: clamp(2.15rem, 12vw, 2.8rem) !important;
            letter-spacing: 0 !important;
            margin-bottom: 0.95rem !important;
          }
          .hero-section .hero-badge {
            display: none !important;
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
          .btn-primary-hero-premium {
            width: 100%;
            justify-content: center;
            text-align: center;
            min-height: 52px;
          }
          .btn-primary-hero-premium {
            min-width: 100%;
            padding: 0.9rem 1.1rem 0.9rem 1.3rem;
            font-size: 0.96rem;
            min-height: 52px;
          }
          .btn-label-wrap {
            gap: 0.7rem;
          }
          .btn-arrow-pill {
            width: 1.55rem;
            height: 1.55rem;
          }
          .hero-title-break {
            display: none;
          }
          .hero-section .hero-badge {
            max-width: 100%;
            white-space: normal;
            line-height: 1.35;
            letter-spacing: 1.5px !important;
          }
          .hero-section .hero-subtitle {
            font-size: 1rem !important;
            line-height: 1.65 !important;
            margin-bottom: 1.75rem !important;
          }
          .hero-visual {
            min-height: 170px;
          }
          .home-hero-mascot {
            width: 180px;
          }
          .hero-visual-ring {
            width: 190px;
            height: 190px;
          }
          .hero-visual-glow {
            width: 150px;
            height: 150px;
          }
          .bg-glow {
            transform: scale(0.65);
          }
        }

        @media (max-width: 480px) {
          .home-hero {
            padding-top: 7.35rem !important;
            padding-bottom: 1.75rem !important;
          }
          .hero-section .hero-container > div {
            gap: 1rem !important;
          }
          .hero-visual {
            display: flex;
            min-height: 135px;
            order: 2;
            margin-top: 0.45rem;
          }
          .home-hero-mascot {
            width: 142px;
          }
          .hero-visual-ring {
            width: 156px;
            height: 156px;
          }
          .hero-visual-glow {
            width: 118px;
            height: 118px;
            filter: blur(34px) !important;
          }
          .mascot-shadow {
            width: 92px;
            height: 10px;
            bottom: 1px;
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


