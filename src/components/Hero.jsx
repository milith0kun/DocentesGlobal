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
                <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Comenzar Manual
                  <span className="btn-arrow-premium">-&gt;</span>
                </span>
                <span className="btn-shine"></span>
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
          padding: clamp(6.25rem, 9vw, 10rem) 0 clamp(3.5rem, 7vw, 7rem) !important;
        }

        .home-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
          min-height: min(520px, calc(100svh - 7rem));
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          min-height: clamp(260px, 38vw, 420px);
          overflow: visible;
        }

        .hero-visual-ring {
          width: clamp(220px, 32vw, 380px);
          height: clamp(220px, 32vw, 380px);
        }

        .hero-visual-glow {
          width: clamp(180px, 24vw, 280px);
          height: clamp(180px, 24vw, 280px);
        }

        .home-hero-mascot {
          width: clamp(220px, 29vw, 340px);
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
          padding: 0.95rem 2.4rem;
          font-size: 0.98rem;
          border-radius: 18px;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          color: #fff;
          font-weight: 850;
          letter-spacing: 0;
          background: linear-gradient(135deg, #075985 0%, #0284c7 46%, #06b6d4 100%);
          box-shadow:
            0 14px 28px -10px rgba(2, 132, 199, 0.68),
            inset 0 1px 0 rgba(255, 255, 255, 0.24),
            inset 0 -2px 0 rgba(3, 105, 161, 0.36);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
          transform: translateY(-3px);
          box-shadow: 
            0 16px 36px -8px rgba(14, 165, 233, 0.5),
            0 0 0 1.5px rgba(14, 165, 233, 0.2) !important;
          background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
        }

        .btn-primary-hero-premium:active {
          transform: translateY(-1px) scale(0.99);
          box-shadow:
            0 9px 20px -10px rgba(2, 132, 199, 0.72),
            inset 0 2px 8px rgba(7, 89, 133, 0.28);
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
            padding: 7rem 0 3.5rem !important;
          }
          .hero-section .hero-container > div {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 2.75rem !important;
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
            font-size: 3rem !important;
            letter-spacing: 0 !important;
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
          .home-hero {
            padding-top: 7rem !important;
            padding-bottom: 2.25rem !important;
          }
          .hero-section .hero-title {
            font-size: clamp(2.15rem, 12vw, 2.8rem) !important;
            letter-spacing: 0 !important;
            margin-bottom: 1.25rem !important;
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
          .btn-primary-hero-premium, .btn-secondary-hero-premium {
            width: 100%;
            justify-content: center;
            text-align: center;
            min-height: 52px;
          }
          .btn-primary-hero-premium {
            padding: 0.98rem 1.35rem;
            font-size: 0.98rem;
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
